import type { BadgeState, BadgeStyle } from '@/store/badge-store'
import { INTEGRATIONS, type Integration } from '@/lib/integrations'

export type ImportFormat = 'markdown' | 'html' | 'url' | 'unknown'

/**
 * Detect whether the input is Markdown, HTML, a raw URL, or unknown.
 */
export function detectFormat(input: string): ImportFormat {
    const trimmed = input.trim()

    // Markdown: ![alt](url)
    if (/^!\[.*?\]\(.*?\)$/.test(trimmed)) {
        return 'markdown'
    }

    // HTML: <img ... />  or  <img ...>
    if (/^<img\s[^>]*src\s*=/i.test(trimmed)) {
        return 'html'
    }

    // Raw URL
    if (/^https?:\/\//i.test(trimmed)) {
        return 'url'
    }

    return 'unknown'
}

/**
 * Extract the badge image URL from any supported format.
 */
export function extractBadgeUrl(input: string): string | null {
    const trimmed = input.trim()
    const format = detectFormat(trimmed)

    switch (format) {
        case 'markdown': {
            // ![alt](url)
            const match = trimmed.match(/!\[.*?\]\((.*?)\)/)
            return match?.[1] ?? null
        }
        case 'html': {
            // <img src="url" ... />
            const match = trimmed.match(/src\s*=\s*["'](.*?)["']/i)
            return match?.[1] ?? null
        }
        case 'url':
            return trimmed
        default:
            return null
    }
}

const VALID_STYLES: BadgeStyle[] = ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social']

// ── Integration reverse-matching ─────────────────────

interface IntegrationMatch {
    integration: Integration
    params: Record<string, string>
}

/**
 * Convert a path template like `/github/stars/:user/:repo` into a regex
 * that captures the named parameters.
 * E.g. `/github/stars/:user/:repo` → /^\/github\/stars\/([^/]+)\/([^/]+)$/
 */
function templateToRegex(template: string): { regex: RegExp; paramNames: string[] } {
    // Only use the path part (before any ?)
    const pathPart = template.split('?')[0]
    const paramNames: string[] = []

    const regexStr = pathPart
        .split('/')
        .map((segment) => {
            if (segment.startsWith(':')) {
                paramNames.push(segment.slice(1))
                return '([^/]+)'
            }
            return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        })
        .join('/')

    return { regex: new RegExp(`^${regexStr}$`), paramNames }
}

/**
 * Try to match a URL pathname against all registered integration templates.
 * Returns the best match (most specific = most fixed segments).
 */
function matchIntegration(pathname: string): IntegrationMatch | null {
    let bestMatch: IntegrationMatch | null = null
    let bestFixedSegments = -1

    for (const integration of INTEGRATIONS) {
        const { regex, paramNames } = templateToRegex(integration.pathTemplate)
        const m = pathname.match(regex)
        if (!m) continue

        // Count fixed (non-param) segments — more specific templates win
        const fixedSegments = integration.pathTemplate.split('/').filter((s) => !s.startsWith(':')).length

        if (fixedSegments > bestFixedSegments) {
            const params: Record<string, string> = {}
            paramNames.forEach((name, i) => {
                params[name] = decodeURIComponent(m[i + 1])
            })

            bestMatch = { integration, params }
            bestFixedSegments = fixedSegments
        }
    }

    return bestMatch
}

// ── Main parser ──────────────────────────────────────

/**
 * Parse a shields.io URL into partial badge state fields.
 * Supports static badges: /badge/label-message-color
 * and dynamic badges: other shields.io paths.
 */
export function parseShieldsUrl(url: string): Partial<BadgeState> | null {
    let parsed: URL
    try {
        parsed = new URL(url)
    } catch {
        return null
    }

    if (parsed.hostname !== 'img.shields.io') {
        return null
    }

    const params = parsed.searchParams
    const result: Partial<BadgeState> = {}

    // --- Parse query params common to all badge types ---

    const style = params.get('style')
    if (style && VALID_STYLES.includes(style as BadgeStyle)) {
        result.style = style as BadgeStyle
    }

    const labelColor = params.get('labelColor')
    if (labelColor) result.labelColor = labelColor

    const logo = params.get('logo')
    if (logo) {
        if (logo.startsWith('data:')) {
            // Custom base64 logo
            result.logoSource = 'custom'
            result.logoBase64 = logo.replace(/^data:image\/\w+;base64,/, '')
        } else {
            result.logoSource = 'library'
            result.logoSlug = logo
        }
    }

    const logoColor = params.get('logoColor')
    if (logoColor) result.logoColor = logoColor

    const logoWidth = params.get('logoWidth')
    if (logoWidth) result.logoWidth = parseInt(logoWidth, 10) || 0

    const link = params.get('link')
    if (link) result.linkUrl = link

    const cacheSeconds = params.get('cacheSeconds')
    if (cacheSeconds) result.cacheSeconds = cacheSeconds

    // --- Determine badge mode ---

    const pathname = parsed.pathname // e.g. /badge/build-passing-4c1

    if (pathname.startsWith('/badge/')) {
        // Check if it's a "dynamic" badge type like /badge/dynamic/json
        const dynamicMatch = matchIntegration(pathname)
        if (dynamicMatch) {
            // It's a dynamic badge (e.g. /badge/dynamic/json)
            result.badgeMode = 'dynamic'
            result.integration = dynamicMatch.integration.id
            const integrationParams: Record<string, string> = { ...dynamicMatch.params }

            // Also extract query params that belong to this integration
            for (const p of dynamicMatch.integration.params) {
                const qVal = params.get(p.key)
                if (qVal && !integrationParams[p.key]) {
                    integrationParams[p.key] = qVal
                }
            }
            result.integrationParams = integrationParams

            const qColor = params.get('color')
            if (qColor) result.color = qColor

            const qLabel = params.get('label')
            if (qLabel) result.label = qLabel
        } else {
            // Static badge
            result.badgeMode = 'static'

            const raw = pathname.slice('/badge/'.length) // "build-passing-4c1"
            const decoded = decodeURIComponent(raw)

            const parts = splitStaticPath(decoded)

            if (parts.length >= 3) {
                result.label = unescapeSegment(parts.slice(0, -2).join('-'))
                result.message = unescapeSegment(parts[parts.length - 2])
                result.color = parts[parts.length - 1]
            } else if (parts.length === 2) {
                result.message = unescapeSegment(parts[0])
                result.color = parts[1]
            }

            // If color is from query params, override
            const qColor = params.get('color')
            if (qColor) result.color = qColor
        }
    } else {
        // Dynamic badge — try to match against integration templates
        result.badgeMode = 'dynamic'

        const integrationMatch = matchIntegration(pathname)
        if (integrationMatch) {
            result.integration = integrationMatch.integration.id
            const integrationParams: Record<string, string> = { ...integrationMatch.params }

            // Also extract query params that belong to this integration
            for (const p of integrationMatch.integration.params) {
                const qVal = params.get(p.key)
                if (qVal && !integrationParams[p.key]) {
                    integrationParams[p.key] = qVal
                }
            }
            result.integrationParams = integrationParams
        }

        const qColor = params.get('color')
        if (qColor) result.color = qColor

        const qLabel = params.get('label')
        if (qLabel) result.label = qLabel
    }

    return result
}

/**
 * Split static badge path into segments.
 * Handles shields.io escaping where -- means a literal dash.
 * Returns semantic segments split by unescaped single dashes.
 */
function splitStaticPath(path: string): string[] {
    // Replace -- with a placeholder, split by -, then restore
    const placeholder = '\x00'
    const escaped = path.replace(/--/g, placeholder)
    const parts = escaped.split('-').filter(Boolean)
    return parts.map((p) => p.replace(new RegExp(placeholder, 'g'), '-'))
}

/**
 * Reverse shields.io segment encoding:
 * __ → _    (literal underscore)
 * _  → ' '  (space)
 */
function unescapeSegment(segment: string): string {
    // Replace __ with placeholder, then _ with space, then restore __
    const placeholder = '\x01'
    return segment
        .replace(/__/g, placeholder)
        .replace(/_/g, ' ')
        .replace(new RegExp(placeholder, 'g'), '_')
}

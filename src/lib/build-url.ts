import type { BadgeState } from '@/store/badge-store'
import { getIntegrationById, buildIntegrationPath } from '@/lib/integrations'

export function buildBadgeUrl(state: BadgeState): string {
    if (state.badgeMode === 'dynamic') {
        return buildDynamicUrl(state)
    }
    return buildStaticUrl(state)
}

function buildStaticUrl(state: BadgeState): string {
    const { label, message, color } = state

    const encLabel = encodeSegment(label || '_')
    const encMessage = encodeSegment(message || '_')
    const badgeColor = color || '4c1'

    const base = `https://img.shields.io/badge/${encLabel}-${encMessage}-${badgeColor}`
    const params = buildSharedParams(state)

    const queryString = params.toString()
    return queryString ? `${base}?${queryString}` : base
}

function buildDynamicUrl(state: BadgeState): string {
    const { integration, integrationParams } = state

    if (!integration) {
        return 'https://img.shields.io/badge/select-integration-lightgrey'
    }

    const def = getIntegrationById(integration)
    if (!def) {
        return 'https://img.shields.io/badge/unknown-integration-red'
    }

    // Only check required params are filled
    const requiredFilled = def.params
        .filter((p) => p.required !== false)
        .every((p) => integrationParams[p.key]?.trim())
    if (!requiredFilled) {
        return 'https://img.shields.io/badge/fill_in-parameters-lightgrey'
    }

    // Build params only including those that have values
    const filledParams: Record<string, string> = {}
    for (const p of def.params) {
        const val = integrationParams[p.key]?.trim()
        if (val) {
            filledParams[p.key] = val
        }
    }

    // Also add any params that aren't in the path template as query params
    const integrationPath = buildIntegrationPath(def.pathTemplate, filledParams)
    const sharedParams = buildSharedParams(state)

    // If the integration path already has query params (from template), merge them
    const [basePath, integrationQs] = integrationPath.split('?')
    const base = `https://img.shields.io${basePath}`

    // Merge all query params
    const finalParams = new URLSearchParams()

    if (integrationQs) {
        const integrationSearchParams = new URLSearchParams(integrationQs)
        for (const [k, v] of integrationSearchParams.entries()) {
            finalParams.set(k, v)
        }
    }

    // Add query-only params (those not in the path template at all)
    for (const p of def.params) {
        const val = filledParams[p.key]
        if (val && !def.pathTemplate.includes(`:${p.key}`)) {
            finalParams.set(p.key, val)
        }
    }

    // Merge shared params
    for (const [k, v] of sharedParams.entries()) {
        finalParams.set(k, v)
    }

    const queryString = finalParams.toString()
    return queryString ? `${base}?${queryString}` : base
}

function buildSharedParams(state: BadgeState): URLSearchParams {
    const { style, labelColor, logoSource, logoSlug, logoBase64, logoColor, logoWidth, linkUrl, cacheSeconds, color, badgeMode, label } = state
    const params = new URLSearchParams()

    if (style && style !== 'flat') {
        params.set('style', style)
    }

    // In dynamic mode, color and label are overrides — only add if user explicitly set them
    if (badgeMode === 'dynamic') {
        if (color) params.set('color', color)
        if (label) params.set('label', label)
    }

    if (logoSource === 'library' && logoSlug) {
        params.set('logo', logoSlug)
    } else if (logoSource === 'custom' && logoBase64) {
        params.set('logo', `data:image/png;base64,${logoBase64}`)
    }

    if (logoColor) params.set('logoColor', logoColor)
    if (logoWidth && logoWidth > 0) params.set('logoWidth', String(logoWidth))
    if (labelColor) params.set('labelColor', labelColor)
    if (cacheSeconds) params.set('cacheSeconds', cacheSeconds)
    if (linkUrl) params.set('link', linkUrl)

    return params
}

/**
 * Encode a path segment for shields.io static badges.
 */
function encodeSegment(text: string): string {
    return text
        .replace(/-/g, '--')
        .replace(/_/g, '__')
        .replace(/ /g, '_')
}

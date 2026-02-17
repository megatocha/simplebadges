import { create } from 'zustand'

export type BadgeStyle = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social'
export type LogoSource = 'library' | 'custom'
export type ExportFormat = 'url' | 'markdown' | 'html'
export type Theme = 'dark' | 'light'
export type BadgeMode = 'static' | 'dynamic'

export interface BadgeState {
    // Mode
    badgeMode: BadgeMode

    // Main tab (static)
    label: string
    message: string
    style: BadgeStyle
    color: string
    labelColor: string

    // Dynamic integration
    integration: string
    integrationParams: Record<string, string>

    // Logo tab
    logoSource: LogoSource
    logoSlug: string
    logoBase64: string
    logoColor: string
    logoWidth: number

    // Extra tab
    linkUrl: string
    cacheSeconds: string

    // UI state
    exportFormat: ExportFormat
    theme: Theme
}

interface BadgeActions {
    setField: <K extends keyof BadgeState>(key: K, value: BadgeState[K]) => void
    setIntegrationParam: (key: string, value: string) => void
    resetBadge: () => void
    toggleTheme: () => void
}

const staticDefaults = {
    label: 'build',
    message: 'passing',
    color: '4c1',
}

const dynamicDefaults = {
    label: '',
    message: '',
    color: '',
}

const defaultBadgeState: BadgeState = {
    badgeMode: 'static',
    ...staticDefaults,
    style: 'flat',
    labelColor: '',
    integration: '',
    integrationParams: {},
    logoSource: 'library',
    logoSlug: '',
    logoBase64: '',
    logoColor: '',
    logoWidth: 0,
    linkUrl: '',
    cacheSeconds: '',
    exportFormat: 'url',
    theme: 'dark',
}

export const useBadgeStore = create<BadgeState & BadgeActions>()((set) => ({
    ...defaultBadgeState,

    setField: (key, value) =>
        set((state) => {
            // When switching modes, reset label/message/color to mode-appropriate defaults
            if (key === 'badgeMode') {
                const modeDefaults = value === 'dynamic' ? dynamicDefaults : staticDefaults
                return {
                    [key]: value,
                    ...modeDefaults,
                    integration: value === 'static' ? '' : state.integration,
                    integrationParams: value === 'static' ? {} : state.integrationParams,
                }
            }
            return { [key]: value }
        }),

    setIntegrationParam: (key, value) =>
        set((state) => ({
            integrationParams: { ...state.integrationParams, [key]: value },
        })),

    resetBadge: () =>
        set((state) => {
            const modeDefaults = state.badgeMode === 'dynamic' ? dynamicDefaults : staticDefaults
            return {
                ...defaultBadgeState,
                ...modeDefaults,
                badgeMode: state.badgeMode,
                theme: state.theme,
                exportFormat: state.exportFormat,
            }
        }),

    toggleTheme: () =>
        set((state) => {
            const newTheme = state.theme === 'dark' ? 'light' : 'dark'
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
            return { theme: newTheme }
        }),
}))

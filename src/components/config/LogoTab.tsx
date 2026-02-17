import { useState, useMemo, useCallback, useRef } from 'react'
import { useBadgeStore } from '@/store/badge-store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ColorPickerField } from '@/components/ColorPickerField'
import { Search, Upload, AlertTriangle, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import * as simpleIcons from 'simple-icons'
import type { LogoSource } from '@/store/badge-store'

// Build searchable icon list from simple-icons
interface IconEntry {
    title: string
    slug: string
    hex: string
    svg: string
}

const ALL_ICONS: IconEntry[] = Object.values(simpleIcons)
    .filter((icon): icon is { title: string; slug: string; hex: string; svg: string; path: string; source: string } =>
        typeof icon === 'object' && icon !== null && 'slug' in icon && 'title' in icon
    )
    .map((icon) => ({
        title: icon.title,
        slug: icon.slug,
        hex: icon.hex,
        svg: icon.svg,
    }))

const ICONS_PER_PAGE = 80

export function LogoTab() {
    const logoSource = useBadgeStore((s) => s.logoSource)
    const logoSlug = useBadgeStore((s) => s.logoSlug)
    const logoBase64 = useBadgeStore((s) => s.logoBase64)
    const logoColor = useBadgeStore((s) => s.logoColor)
    const logoWidth = useBadgeStore((s) => s.logoWidth)
    const setField = useBadgeStore((s) => s.setField)

    const [search, setSearch] = useState('')
    const [visibleCount, setVisibleCount] = useState(ICONS_PER_PAGE)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const allFilteredIcons = useMemo(() => {
        if (!search.trim()) return ALL_ICONS
        const q = search.toLowerCase()
        return ALL_ICONS.filter(
            (icon) =>
                icon.title.toLowerCase().includes(q) ||
                icon.slug.toLowerCase().includes(q)
        )
    }, [search])

    // Reset visible count when search changes
    const prevSearchRef = useRef(search)
    if (prevSearchRef.current !== search) {
        prevSearchRef.current = search
        if (visibleCount !== ICONS_PER_PAGE) {
            setVisibleCount(ICONS_PER_PAGE)
        }
    }

    const filteredIcons = useMemo(() => {
        return allFilteredIcons.slice(0, visibleCount)
    }, [allFilteredIcons, visibleCount])

    const hasMore = visibleCount < allFilteredIcons.length

    // Intersection observer for infinite scroll
    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelCallbackRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) observerRef.current.disconnect()
            if (!node) return

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore) {
                        setVisibleCount((prev) => prev + ICONS_PER_PAGE)
                    }
                },
                {
                    root: scrollContainerRef.current,
                    rootMargin: '100px',
                    threshold: 0,
                }
            )
            observerRef.current.observe(node)
        },
        [hasMore]
    )

    const selectedIcon = useMemo(() => {
        if (!logoSlug) return null
        return ALL_ICONS.find((i) => i.slug === logoSlug) ?? null
    }, [logoSlug])

    const handleFileUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return

            const reader = new FileReader()
            reader.onload = () => {
                const result = reader.result as string
                const base64 = result.split(',')[1] || ''
                setField('logoBase64', base64)
                setField('logoSource', 'custom')
            }
            reader.readAsDataURL(file)
        },
        [setField]
    )

    const base64Warning = logoBase64.length > 2048

    return (
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Logo</h3>
                <p className="text-xs text-muted-foreground">
                    Choose a logo from the Simple Icons library, or upload your own.
                </p>
            </div>

            {/* Source toggle */}
            <RadioGroup
                value={logoSource}
                onValueChange={(v) => setField('logoSource', v as LogoSource)}
                className="flex gap-4"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="library" id="logo-library" className="cursor-pointer" />
                    <Label htmlFor="logo-library" className="text-sm cursor-pointer">
                        Icon Library
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="logo-custom" className="cursor-pointer" />
                    <Label htmlFor="logo-custom" className="text-sm cursor-pointer">
                        Custom Upload
                    </Label>
                </div>
            </RadioGroup>

            <AnimatePresence mode="wait">
                {logoSource === 'library' ? (
                    <motion.div
                        key="library"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3"
                    >
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search icons (e.g. telegram, python, docker)..."
                                className="pl-9 bg-background/50"
                            />
                        </div>

                        {/* Selected icon display */}
                        {selectedIcon && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/20"
                            >
                                <div
                                    className="w-5 h-5 shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                                    dangerouslySetInnerHTML={{ __html: selectedIcon.svg }}
                                    style={{ color: `#${selectedIcon.hex}` }}
                                />
                                <span className="text-sm font-medium text-foreground">
                                    {selectedIcon.title}
                                </span>
                                <span className="text-xs text-muted-foreground font-mono ml-auto">
                                    {selectedIcon.slug}
                                </span>
                                <Check className="w-4 h-4 text-primary shrink-0" />
                                <button
                                    onClick={() => setField('logoSlug', '')}
                                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors cursor-pointer shrink-0"
                                    title="Remove logo"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        )}

                        {/* Icon grid */}
                        <div
                            ref={scrollContainerRef}
                            className="max-h-[118px] overflow-y-auto rounded-lg border border-border/30 bg-background/30 p-2"
                        >
                            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-14 gap-1">
                                {filteredIcons.map((icon) => (
                                    <button
                                        key={icon.slug}
                                        onClick={() => setField('logoSlug', icon.slug)}
                                        title={icon.title}
                                        className={`
                                            flex items-center justify-center p-2 rounded-lg transition-all cursor-pointer
                                            hover:bg-accent hover:scale-105
                                            ${logoSlug === icon.slug ? 'bg-primary/15 ring-1 ring-primary/40' : ''}
                                        `}
                                    >
                                        <div
                                            className="w-5 h-5 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                                            dangerouslySetInnerHTML={{ __html: icon.svg }}
                                            style={{ color: `#${icon.hex}` }}
                                        />
                                    </button>
                                ))}
                            </div>
                            {/* Sentinel for infinite scroll */}
                            {hasMore && (
                                <div
                                    ref={sentinelCallbackRef}
                                    className="flex items-center justify-center py-3 text-xs text-muted-foreground/50"
                                >
                                    Loading more icons...
                                </div>
                            )}
                            {filteredIcons.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-8">
                                    No icons found for &quot;{search}&quot;
                                </p>
                            )}
                        </div>
                        <p className="text-[11px] text-muted-foreground/60 text-center">
                            Showing {filteredIcons.length} of {allFilteredIcons.length} icons
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="custom"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3"
                    >
                        {/* File upload */}
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".png,.svg,.jpg,.jpeg,.webp"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border bg-background/30 hover:bg-accent/50 hover:border-primary/30 transition-colors cursor-pointer w-full justify-center text-sm text-muted-foreground"
                            >
                                <Upload className="w-4 h-4" />
                                Upload Image (.png, .svg)
                            </button>
                        </div>

                        {/* Base64 textarea */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Or paste Base64 string
                            </Label>
                            <textarea
                                value={logoBase64}
                                onChange={(e) => setField('logoBase64', e.target.value)}
                                placeholder="Paste base64-encoded image data..."
                                rows={3}
                                className="w-full px-3 py-2 text-xs font-mono bg-background/50 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                            />
                        </div>

                        {/* Base64 preview */}
                        {logoBase64 && (
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/5 border border-border/30">
                                <span className="text-xs text-muted-foreground">
                                    {logoBase64.length} characters
                                </span>
                                <button
                                    onClick={() => setField('logoBase64', '')}
                                    className="ml-auto text-xs text-destructive/70 hover:text-destructive cursor-pointer flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" />
                                    Clear
                                </button>
                            </div>
                        )}

                        {/* Base64 length warning */}
                        {base64Warning && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                Base64 string is very long ({logoBase64.length} chars). This may cause URL
                                issues.
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logo parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/30">
                <ColorPickerField
                    label="Logo Color"
                    value={logoColor}
                    onChange={(v) => setField('logoColor', v)}
                    optional
                />
                <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                        Logo Width{' '}
                        <span className="text-muted-foreground/50">
                            ({logoWidth || 'auto'})
                        </span>
                    </Label>
                    <Slider
                        value={[logoWidth]}
                        onValueChange={([v]) => setField('logoWidth', v)}
                        min={0}
                        max={100}
                        step={1}
                        className="py-2"
                    />
                </div>
            </div>
        </div>
    )
}

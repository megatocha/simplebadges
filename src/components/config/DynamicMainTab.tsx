import { useState, useMemo } from 'react'
import { useBadgeStore } from '@/store/badge-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ColorPickerField } from '@/components/ColorPickerField'
import { CATEGORIES, INTEGRATIONS, getIntegrationById } from '@/lib/integrations'
import { Search, Zap, ChevronRight } from 'lucide-react'
import type { BadgeStyle } from '@/store/badge-store'

const STYLES: { value: BadgeStyle; label: string }[] = [
    { value: 'flat', label: 'Flat' },
    { value: 'flat-square', label: 'Flat Square' },
    { value: 'plastic', label: 'Plastic' },
    { value: 'for-the-badge', label: 'For the Badge' },
    { value: 'social', label: 'Social' },
]

export function DynamicMainTab() {
    const integration = useBadgeStore((s) => s.integration)
    const integrationParams = useBadgeStore((s) => s.integrationParams)
    const style = useBadgeStore((s) => s.style)
    const color = useBadgeStore((s) => s.color)
    const labelColor = useBadgeStore((s) => s.labelColor)
    const label = useBadgeStore((s) => s.label)
    const setField = useBadgeStore((s) => s.setField)
    const setIntegrationParam = useBadgeStore((s) => s.setIntegrationParam)

    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [search, setSearch] = useState('')

    const filteredIntegrations = useMemo(() => {
        let list = selectedCategory === 'All'
            ? INTEGRATIONS
            : INTEGRATIONS.filter((i) => i.category === selectedCategory)
        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(
                (i) =>
                    i.name.toLowerCase().includes(q) ||
                    i.description.toLowerCase().includes(q) ||
                    i.category.toLowerCase().includes(q) ||
                    i.id.toLowerCase().includes(q)
            )
        }
        return list
    }, [selectedCategory, search])

    const selectedDef = useMemo(
        () => (integration ? getIntegrationById(integration) : null),
        [integration]
    )

    const handleSelectIntegration = (id: string) => {
        setField('integration', id)
        // Reset integration params when switching
        setField('integrationParams', {})
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
            {/* Integration Picker */}
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Select Integration
                </h3>
                <p className="text-xs text-muted-foreground">
                    Choose a service and endpoint to create a dynamic badge.
                </p>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setSelectedCategory(cat)
                            setSearch('')
                        }}
                        className={`
                            px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer
                            ${selectedCategory === cat
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search within category */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Search ${selectedCategory === 'All' ? 'all' : selectedCategory} integrations...`}
                    className="pl-9 bg-background/50"
                />
            </div>

            {/* Integration list */}
            <div className="max-h-[200px] overflow-y-auto rounded-lg border border-border/30 bg-background/30">
                {filteredIntegrations.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-6">
                        No integrations found
                    </p>
                ) : (
                    <div className="divide-y divide-border/20">
                        {filteredIntegrations.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelectIntegration(item.id)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all cursor-pointer
                                    hover:bg-accent/50
                                    ${integration === item.id
                                        ? 'bg-primary/10 border-l-2 border-l-primary'
                                        : 'border-l-2 border-l-transparent'
                                    }
                                `}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-foreground">
                                            {item.name}
                                        </span>
                                        {selectedCategory === 'All' && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/80 text-muted-foreground">
                                                {item.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground truncate">
                                        {item.description}
                                    </div>
                                </div>
                                <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${integration === item.id ? 'text-primary' : 'text-muted-foreground/30'}`} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Dynamic params */}
            {selectedDef && (
                <div className="space-y-4 pt-1">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-primary/5 border border-primary/15">
                        <Zap className="w-4 h-4 text-primary shrink-0" />
                        <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground">
                                {selectedDef.category} → {selectedDef.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono truncate">
                                {selectedDef.pathTemplate}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedDef.params.map((param) => (
                            <div key={param.key} className="space-y-1.5">
                                <Label className="text-xs font-medium text-muted-foreground">
                                    {param.label}
                                    {param.required === false && (
                                        <span className="text-muted-foreground/50 ml-1">(optional)</span>
                                    )}
                                </Label>
                                <Input
                                    value={integrationParams[param.key] || ''}
                                    onChange={(e) =>
                                        setIntegrationParam(param.key, e.target.value)
                                    }
                                    placeholder={param.placeholder}
                                    className={`bg-background/50 ${param.required === false ? 'border-dashed' : ''}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Shared styling overrides */}
            <div className="space-y-4 pt-2 border-t border-border/30">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Style Overrides
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Style */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">
                            Badge Style
                        </Label>
                        <Select
                            value={style}
                            onValueChange={(v) =>
                                setField('style', v as BadgeStyle)
                            }
                        >
                            <SelectTrigger className="bg-background/50 cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STYLES.map((s) => (
                                    <SelectItem key={s.value} value={s.value} className="cursor-pointer">
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Label Override */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">
                            Label Override <span className="text-muted-foreground/50">(optional)</span>
                        </Label>
                        <Input
                            value={label}
                            onChange={(e) => setField('label', e.target.value)}
                            placeholder="auto"
                            className="bg-background/50"
                        />
                    </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorPickerField
                        label="Badge Color"
                        value={color}
                        onChange={(v) => setField('color', v)}
                        optional
                    />
                    <ColorPickerField
                        label="Label Color"
                        value={labelColor}
                        onChange={(v) => setField('labelColor', v)}
                        optional
                    />
                </div>
            </div>
        </div>
    )
}

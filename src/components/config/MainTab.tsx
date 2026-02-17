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
import type { BadgeStyle } from '@/store/badge-store'

const STYLES: { value: BadgeStyle; label: string }[] = [
    { value: 'flat', label: 'Flat' },
    { value: 'flat-square', label: 'Flat Square' },
    { value: 'plastic', label: 'Plastic' },
    { value: 'for-the-badge', label: 'For the Badge' },
    { value: 'social', label: 'Social' },
]

export function MainTab() {
    const label = useBadgeStore((s) => s.label)
    const message = useBadgeStore((s) => s.message)
    const style = useBadgeStore((s) => s.style)
    const color = useBadgeStore((s) => s.color)
    const labelColor = useBadgeStore((s) => s.labelColor)
    const setField = useBadgeStore((s) => s.setField)

    return (
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Text & Style</h3>
                <p className="text-xs text-muted-foreground">Configure the badge text, style, and colors.</p>
            </div>

            {/* Text inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="label" className="text-xs font-medium text-muted-foreground">
                        Label (Left)
                    </Label>
                    <Input
                        id="label"
                        value={label}
                        onChange={(e) => setField('label', e.target.value)}
                        placeholder="e.g. build"
                        className="bg-background/50"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-medium text-muted-foreground">
                        Message (Right)
                    </Label>
                    <Input
                        id="message"
                        value={message}
                        onChange={(e) => setField('message', e.target.value)}
                        placeholder="e.g. passing"
                        className="bg-background/50"
                    />
                </div>
            </div>

            {/* Style select */}
            <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                    Style
                </Label>
                <Select value={style} onValueChange={(v) => setField('style', v as BadgeStyle)}>
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

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPickerField
                    label="Message Color (Right)"
                    value={color}
                    onChange={(v) => setField('color', v)}
                />
                <ColorPickerField
                    label="Label Color (Left)"
                    value={labelColor}
                    onChange={(v) => setField('labelColor', v)}
                    optional
                />
            </div>
        </div>
    )
}

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HexColorPicker } from 'react-colorful'

const PRESETS = [
    { label: 'Green', value: '4c1' },
    { label: 'Bright Green', value: '44cc11' },
    { label: 'Yellow Green', value: '97ca00' },
    { label: 'Yellow', value: 'dfb317' },
    { label: 'Orange', value: 'fe7d37' },
    { label: 'Red', value: 'e05d44' },
    { label: 'Blue', value: '007ec6' },
    { label: 'Light Grey', value: '9f9f9f' },
    { label: 'Blue Violet', value: '884EA0' },
    { label: 'Success', value: '2ecc71' },
    { label: 'Important', value: 'e74c3c' },
    { label: 'Info', value: '3498db' },
]

interface ColorPickerFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    optional?: boolean
}

export function ColorPickerField({ label, value, onChange, optional }: ColorPickerFieldProps) {
    const [open, setOpen] = useState(false)
    const displayColor = value ? `#${value.replace('#', '')}` : '#555555'

    return (
        <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
                {label}
                {optional && <span className="text-muted-foreground/50 ml-1">(optional)</span>}
            </Label>
            <div className="flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button
                            className="w-10 h-10 rounded-lg border border-border/50 cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0"
                            style={{ backgroundColor: displayColor }}
                            aria-label={`Pick ${label}`}
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3 space-y-3" align="start">
                        <HexColorPicker
                            color={displayColor}
                            onChange={(c) => onChange(c.replace('#', ''))}
                        />
                        <div className="grid grid-cols-6 gap-1.5">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.value}
                                    className="w-full aspect-square rounded-md border border-border/30 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                                    style={{ backgroundColor: `#${preset.value}` }}
                                    title={preset.label}
                                    onClick={() => {
                                        onChange(preset.value)
                                    }}
                                />
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value.replace('#', ''))}
                    placeholder={optional ? 'auto' : 'hex color'}
                    className="bg-background/50 font-mono text-sm"
                />
            </div>
        </div>
    )
}

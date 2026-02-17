import { useBadgeStore } from '@/store/badge-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link2, Clock } from 'lucide-react'

export function ExtraTab() {
    const linkUrl = useBadgeStore((s) => s.linkUrl)
    const cacheSeconds = useBadgeStore((s) => s.cacheSeconds)
    const setField = useBadgeStore((s) => s.setField)

    return (
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Extra Settings</h3>
                <p className="text-xs text-muted-foreground">Configure link behavior and caching.</p>
            </div>

            {/* Link URL */}
            <div className="space-y-2">
                <Label htmlFor="link-url" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    Link URL
                </Label>
                <Input
                    id="link-url"
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setField('linkUrl', e.target.value)}
                    placeholder="https://example.com"
                    className="bg-background/50"
                />
                <p className="text-[11px] text-muted-foreground/70">
                    Makes the badge clickable when used in Markdown.
                </p>
            </div>

            {/* Cache Seconds */}
            <div className="space-y-2">
                <Label htmlFor="cache-seconds" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Cache Seconds
                </Label>
                <Input
                    id="cache-seconds"
                    type="number"
                    min={0}
                    value={cacheSeconds}
                    onChange={(e) => setField('cacheSeconds', e.target.value)}
                    placeholder="3600"
                    className="bg-background/50 max-w-48"
                />
                <p className="text-[11px] text-muted-foreground/70">
                    HTTP cache lifetime in seconds. Minimum is 300 for Shields.io.
                </p>
            </div>
        </div>
    )
}

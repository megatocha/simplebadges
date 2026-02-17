import { useState, useMemo, useCallback } from 'react'
import { useBadgeStore } from '@/store/badge-store'
import { buildBadgeUrl } from '@/lib/build-url'
import { formatAsUrl, formatAsMarkdown, formatAsHtml } from '@/lib/format-export'
import { useDebounce } from '@/hooks/use-debounce'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Check, Link, Code, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import type { ExportFormat } from '@/store/badge-store'
import { getIntegrationById } from '@/lib/integrations'

export function PreviewArea() {
    const state = useBadgeStore()
    const debouncedState = useDebounce(state, 400)
    const exportFormat = useBadgeStore((s) => s.exportFormat)
    const setField = useBadgeStore((s) => s.setField)
    const [copied, setCopied] = useState(false)

    const badgeUrl = useMemo(
        () => buildBadgeUrl(debouncedState),
        [debouncedState]
    )

    // For export alt text, use integration name or label/message
    const altLabel = useMemo(() => {
        if (debouncedState.badgeMode === 'dynamic' && debouncedState.integration) {
            const def = getIntegrationById(debouncedState.integration)
            return def ? `${def.category} ${def.name}` : 'Badge'
        }
        return debouncedState.label
    }, [debouncedState.badgeMode, debouncedState.integration, debouncedState.label])

    const altMessage = useMemo(() => {
        if (debouncedState.badgeMode === 'dynamic') return ''
        return debouncedState.message
    }, [debouncedState.badgeMode, debouncedState.message])

    const exportText = useMemo(() => {
        switch (exportFormat) {
            case 'url':
                return formatAsUrl(badgeUrl)
            case 'markdown':
                return formatAsMarkdown(badgeUrl, altLabel, altMessage)
            case 'html':
                return formatAsHtml(badgeUrl, altLabel, altMessage)
            default:
                return badgeUrl
        }
    }, [exportFormat, badgeUrl, altLabel, altMessage])

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(exportText)
            setCopied(true)
            toast.success('Copied to clipboard!')
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error('Failed to copy')
        }
    }, [exportText])

    return (
        <div className="sticky top-[73px] z-40 border-b border-border/50 backdrop-blur-xl bg-background/80">
            <div className="mx-auto max-w-5xl px-6 py-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Badge Preview */}
                    <div className="flex-1 flex items-center justify-center min-h-[80px] rounded-xl bg-card border border-border/50 p-6">
                        <motion.img
                            key={badgeUrl}
                            src={badgeUrl}
                            alt="Badge preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-full h-auto"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                            }}
                        />
                    </div>

                    {/* Export Block */}
                    <div className="w-full md:w-[380px] space-y-3">
                        {/* Format tabs */}
                        <Tabs
                            value={exportFormat}
                            onValueChange={(v) => setField('exportFormat', v as ExportFormat)}
                        >
                            <TabsList className="w-full bg-secondary/50">
                                <TabsTrigger value="url" className="gap-1.5 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">
                                    <Link className="w-3.5 h-3.5" />
                                    URL
                                </TabsTrigger>
                                <TabsTrigger value="markdown" className="gap-1.5 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">
                                    <FileText className="w-3.5 h-3.5" />
                                    Markdown
                                </TabsTrigger>
                                <TabsTrigger value="html" className="gap-1.5 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">
                                    <Code className="w-3.5 h-3.5" />
                                    HTML
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Output + copy */}
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    readOnly
                                    value={exportText}
                                    className="w-full px-3 py-2.5 text-xs font-mono bg-card border border-border/50 rounded-lg text-foreground/80 truncate pr-2"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCopy}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {copied ? (
                                        <motion.div
                                            key="check"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Check className="w-4 h-4" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="copy"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

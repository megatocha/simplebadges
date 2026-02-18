import { useState, useMemo } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog'
import { useBadgeStore } from '@/store/badge-store'
import { detectFormat, extractBadgeUrl, parseShieldsUrl } from '@/lib/parse-import'
import type { ImportFormat } from '@/lib/parse-import'
import { getIntegrationById } from '@/lib/integrations'
import { Import, FileText, Code, Link, HelpCircle, Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const FORMAT_META: Record<ImportFormat, { label: string; icon: React.ReactNode; color: string }> = {
    markdown: { label: 'Markdown', icon: <FileText className="w-3.5 h-3.5" />, color: 'text-blue-400' },
    html: { label: 'HTML', icon: <Code className="w-3.5 h-3.5" />, color: 'text-green-400' },
    url: { label: 'URL', icon: <Link className="w-3.5 h-3.5" />, color: 'text-orange-400' },
    unknown: { label: 'Unknown', icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'text-muted-foreground' },
}

interface ImportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
    const importBadge = useBadgeStore((s) => s.importBadge)
    const [input, setInput] = useState('')

    const format = useMemo(() => detectFormat(input), [input])
    const badgeUrl = useMemo(() => extractBadgeUrl(input), [input])
    const parsedFields = useMemo(() => (badgeUrl ? parseShieldsUrl(badgeUrl) : null), [badgeUrl])

    const canImport = !!parsedFields

    const dynamicHint = useMemo(() => {
        if (!parsedFields || parsedFields.badgeMode !== 'dynamic') return ''
        if (parsedFields.integration) {
            const def = getIntegrationById(parsedFields.integration)
            if (def) {
                const paramValues = Object.values(parsedFields.integrationParams || {}).filter(Boolean)
                return `Dynamic: ${def.category} › ${def.name}${paramValues.length ? ` (${paramValues.join(', ')})` : ''}`
            }
        }
        return 'Dynamic badge (unknown integration)'
    }, [parsedFields])

    const handleImport = () => {
        if (!parsedFields) return
        importBadge(parsedFields)
        toast.success('Badge imported!')
        setInput('')
        onOpenChange(false)
    }

    const handleClose = () => {
        setInput('')
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else onOpenChange(v) }}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Import className="w-5 h-5 text-primary" />
                        Import Badge
                    </DialogTitle>
                    <DialogDescription>
                        Paste a badge as Markdown, HTML, or a raw URL — we'll detect the format and fill in the fields.
                    </DialogDescription>
                </DialogHeader>

                {/* Input area */}
                <div className="space-y-3">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="![badge](https://img.shields.io/badge/build-passing-4c1)"
                        className="w-full h-28 px-3 py-2.5 text-sm font-mono bg-secondary/30 border border-border/50 rounded-xl text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50 transition-all"
                        autoFocus
                    />

                    {/* Format indicator */}
                    <AnimatePresence mode="wait">
                        {input.trim() && (
                            <motion.div
                                key={format}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                className="flex items-center gap-2"
                            >
                                <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-secondary/50 ${FORMAT_META[format].color}`}>
                                    {FORMAT_META[format].icon}
                                    {FORMAT_META[format].label}
                                </span>
                                {badgeUrl && (
                                    <span className="text-xs text-muted-foreground truncate flex-1">
                                        {badgeUrl.length > 60 ? badgeUrl.slice(0, 60) + '…' : badgeUrl}
                                    </span>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Preview */}
                    <AnimatePresence>
                        {badgeUrl && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex items-center justify-center p-4 rounded-xl bg-secondary/20 border border-border/30">
                                    <img
                                        src={badgeUrl}
                                        alt="Badge preview"
                                        className="max-w-full h-auto"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none'
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Parsed info hint */}
                    <AnimatePresence>
                        {parsedFields && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground"
                            >
                                <Sparkles className="w-3 h-3 text-primary shrink-0" />
                                {parsedFields.badgeMode === 'static'
                                    ? `Static badge: "${parsedFields.label || ''}" / "${parsedFields.message || ''}" / ${parsedFields.color || 'default'}`
                                    : dynamicHint
                                }
                                {parsedFields.style && parsedFields.style !== 'flat' ? ` · ${parsedFields.style}` : ''}
                                {parsedFields.logoSlug ? ` · logo: ${parsedFields.logoSlug}` : ''}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <button
                            onClick={handleClose}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                        </button>
                    </DialogClose>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleImport}
                        disabled={!canImport}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Import className="w-3.5 h-3.5" />
                        Import
                    </motion.button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

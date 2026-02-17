import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MainTab } from '@/components/config/MainTab'
import { DynamicMainTab } from '@/components/config/DynamicMainTab'
import { ExtraTab } from '@/components/config/ExtraTab'
import { Settings, Image, Sliders, RotateCcw, Zap, Type, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, lazy, Suspense } from 'react'

const LogoTab = lazy(() => import('@/components/config/LogoTab').then(m => ({ default: m.LogoTab })))
import { useBadgeStore } from '@/store/badge-store'
import type { BadgeMode } from '@/store/badge-store'

export function ConfigArea() {
    const [activeTab, setActiveTab] = useState('main')
    const badgeMode = useBadgeStore((s) => s.badgeMode)
    const setField = useBadgeStore((s) => s.setField)
    const resetBadge = useBadgeStore((s) => s.resetBadge)

    return (
        <div className="mx-auto max-w-5xl px-6 py-8 space-y-5">
            {/* Mode Toggle */}
            <div className="flex items-center justify-center">
                <div className="inline-flex items-center bg-secondary/40 rounded-full p-1 gap-0.5">
                    <button
                        onClick={() => setField('badgeMode', 'static' as BadgeMode)}
                        className={`
                            flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer
                            ${badgeMode === 'static'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }
                        `}
                    >
                        <Type className="w-4 h-4" />
                        Static
                    </button>
                    <button
                        onClick={() => setField('badgeMode', 'dynamic' as BadgeMode)}
                        className={`
                            flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer
                            ${badgeMode === 'dynamic'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }
                        `}
                    >
                        <Zap className="w-4 h-4" />
                        Dynamic
                    </button>
                </div>
            </div>

            {/* Config Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex items-center gap-3">
                    <TabsList className="w-full max-w-md mx-auto bg-secondary/50 h-11">
                        <TabsTrigger
                            value="main"
                            className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
                        >
                            {badgeMode === 'static' ? <Settings className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                            {badgeMode === 'static' ? 'Main' : 'Integration'}
                        </TabsTrigger>
                        <TabsTrigger
                            value="logo"
                            className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
                        >
                            <Image className="w-4 h-4" />
                            Logo
                        </TabsTrigger>
                        <TabsTrigger
                            value="extra"
                            className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
                        >
                            <Sliders className="w-4 h-4" />
                            Extra
                        </TabsTrigger>
                    </TabsList>

                    {/* Reset Button */}
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: -15 }}
                        whileTap={{ scale: 0.9, rotate: -90 }}
                        onClick={resetBadge}
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/50 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors cursor-pointer shrink-0"
                        title="Reset to defaults"
                        aria-label="Reset badge settings"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </motion.button>
                </div>

                <TabsContent value="main" className="mt-0 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                    {badgeMode === 'static' ? <MainTab /> : <DynamicMainTab />}
                </TabsContent>
                <TabsContent value="logo" className="mt-0 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                    <Suspense fallback={
                        <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Loading icons...</span>
                        </div>
                    }>
                        <LogoTab />
                    </Suspense>
                </TabsContent>
                <TabsContent value="extra" className="mt-0 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                    <ExtraTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}

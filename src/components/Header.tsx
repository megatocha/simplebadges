import { useBadgeStore } from '@/store/badge-store'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'

export function Header() {
    const theme = useBadgeStore((s) => s.theme)
    const toggleTheme = useBadgeStore((s) => s.toggleTheme)

    return (
        <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
            <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img src="/logo.svg" alt="Logo" className="w-9 h-9" />
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-foreground">
                            Simple Badges
                        </h1>
                        <p className="text-xs text-muted-foreground -mt-0.5">
                            Shields.io Badge Maker
                        </p>
                    </div>
                </div>

                {/* Theme toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary hover:bg-accent transition-colors cursor-pointer"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <Sun className="w-5 h-5 text-primary" />
                    ) : (
                        <Moon className="w-5 h-5 text-primary" />
                    )}
                </motion.button>
            </div>
        </header>
    )
}

import { useBadgeStore } from '@/store/badge-store'
import { Sun, Moon, Import } from 'lucide-react'
import { motion } from 'framer-motion'

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
)

interface HeaderProps {
    onImportClick?: () => void
}

export function Header({ onImportClick }: HeaderProps) {
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

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onImportClick}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-secondary hover:bg-accent transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Import badge"
                    >
                        <Import className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">Import</span>
                    </motion.button>
                    <a
                        href="https://github.com/megatocha/simplebadges"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                        aria-label="View on GitHub"
                    >
                        <GitHubIcon />
                    </a>
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
            </div>
        </header>
    )
}

import { Heart } from 'lucide-react'

export function Footer() {
    return (
        <footer className="mt-auto border-t border-border/30 py-6">
            <div className="mx-auto max-w-5xl px-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                        Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> using
                        <a
                            href="https://shields.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Shields.io
                        </a>
                    </p>
                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com/badges/shields"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                        >
                            Shields.io GitHub
                        </a>
                        <span className="text-border">•</span>
                        <a
                            href="https://simpleicons.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                        >
                            Simple Icons
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

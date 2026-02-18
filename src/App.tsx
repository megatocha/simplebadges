import { Header } from '@/components/Header'
import { PreviewArea } from '@/components/PreviewArea'
import { ConfigArea } from '@/components/config/ConfigArea'
import { Footer } from '@/components/Footer'
import { ImportDialog } from '@/components/ImportDialog'
import { Toaster } from '@/components/ui/sonner'
import { useState, useEffect } from 'react'
import { useBadgeStore } from '@/store/badge-store'

export default function App() {
  const theme = useBadgeStore((s) => s.theme)
  const [importOpen, setImportOpen] = useState(false)

  // Initialize dark mode on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header onImportClick={() => setImportOpen(true)} />
      <PreviewArea />
      <ConfigArea />
      <Footer />
      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'bg-card border-border text-foreground',
        }}
      />
    </div>
  )
}

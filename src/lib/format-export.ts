export function formatAsUrl(url: string): string {
    return url
}

export function formatAsMarkdown(url: string, label: string, message: string): string {
    const alt = [label, message].filter(Boolean).join(' - ') || 'badge'
    return `![${alt}](${url})`
}

export function formatAsHtml(url: string, label: string, message: string): string {
    const alt = [label, message].filter(Boolean).join(' - ') || 'badge'
    return `<img src="${url}" alt="${alt}" />`
}

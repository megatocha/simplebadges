export interface IntegrationParam {
    key: string
    label: string
    placeholder: string
    /** Defaults to true. Set to false for optional path/query params. */
    required?: boolean
}

export interface Integration {
    id: string
    name: string
    category: string
    description: string
    pathTemplate: string
    params: IntegrationParam[]
}

export const CATEGORIES = [
    'All',
    'GitHub',
    'GitLab',
    'NPM',
    'PyPI',
    'Crates.io',
    'Packagist',
    'Docker',
    'Mozilla Add-on',
    'Chrome Web Store',
    'Visual Studio Marketplace',
    'Homebrew',
    'Pub',
    'Codecov',
    'Social',
    'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

// ── Helpers ──────────────────────────────────────────

const ghParams: IntegrationParam[] = [
    { key: 'user', label: 'User / Org', placeholder: 'e.g. facebook' },
    { key: 'repo', label: 'Repository', placeholder: 'e.g. react' },
]

const gh = (
    id: string,
    name: string,
    description: string,
    pathTemplate: string,
    extraParams: IntegrationParam[] = []
): Integration => ({
    id,
    name,
    category: 'GitHub',
    description,
    pathTemplate,
    params: [...ghParams, ...extraParams],
})

const npmPkg: IntegrationParam[] = [
    { key: 'packageName', label: 'Package', placeholder: 'e.g. react' },
]

const npmScoped: IntegrationParam[] = [
    { key: 'packageName', label: 'Package', placeholder: 'e.g. react' },
    { key: 'scope', label: 'Scope', placeholder: 'e.g. @babel', required: false },
]

const npmI = (
    id: string,
    name: string,
    description: string,
    pathTemplate: string,
    params: IntegrationParam[] = npmPkg,
): Integration => ({
    id, name, category: 'NPM', description, pathTemplate, params,
})

const pypiPkg: IntegrationParam[] = [
    { key: 'packageName', label: 'Package', placeholder: 'e.g. django' },
]

const pypiI = (
    id: string,
    name: string,
    description: string,
    pathTemplate: string
): Integration => ({
    id, name, category: 'PyPI', description, pathTemplate, params: pypiPkg,
})

const dockerParams: IntegrationParam[] = [
    { key: 'user', label: 'User / Org', placeholder: 'e.g. library' },
    { key: 'repo', label: 'Image', placeholder: 'e.g. nginx' },
]

const dockerI = (
    id: string,
    name: string,
    description: string,
    pathTemplate: string,
    extraParams: IntegrationParam[] = []
): Integration => ({
    id, name, category: 'Docker', description, pathTemplate, params: [...dockerParams, ...extraParams],
})

const amoParams: IntegrationParam[] = [
    { key: 'addonId', label: 'Add-on Slug', placeholder: 'e.g. ublock-origin' },
]

const amoI = (
    id: string,
    name: string,
    description: string,
    pathTemplate: string
): Integration => ({
    id, name, category: 'Mozilla Add-on', description, pathTemplate, params: amoParams,
})

const vsceParams: IntegrationParam[] = [
    { key: 'extensionId', label: 'Extension ID', placeholder: 'e.g. esbenp.prettier-vscode' },
]

const vsceI = (
    id: string,
    name: string,
    description: string,
    pathTemplate: string
): Integration => ({
    id, name, category: 'Visual Studio Marketplace', description, pathTemplate, params: vsceParams,
})

const chromeParams: IntegrationParam[] = [
    { key: 'extensionId', label: 'Extension ID', placeholder: 'e.g. cjpalhdlnbpafiamejdnhcphjbkeiagm' },
]

const chromeI = (
    id: string,
    name: string,
    description: string,
    pathTemplate: string
): Integration => ({
    id, name, category: 'Chrome Web Store', description, pathTemplate, params: chromeParams,
})

const cratesParams: IntegrationParam[] = [
    { key: 'crate', label: 'Crate', placeholder: 'e.g. serde' },
]

const cratesI = (
    id: string,
    name: string,
    description: string,
    pathTemplate: string,
    extraParams: IntegrationParam[] = []
): Integration => ({
    id, name, category: 'Crates.io', description, pathTemplate, params: [...cratesParams, ...extraParams],
})

const packagistParams: IntegrationParam[] = [
    { key: 'vendor', label: 'Vendor', placeholder: 'e.g. laravel' },
    { key: 'project', label: 'Project', placeholder: 'e.g. framework' },
]

const packagistI = (
    id: string,
    name: string,
    description: string,
    pathTemplate: string
): Integration => ({
    id, name, category: 'Packagist', description, pathTemplate, params: packagistParams,
})

const brewParams: IntegrationParam[] = [
    { key: 'formula', label: 'Formula / Cask', placeholder: 'e.g. git' },
]

const brewI = (
    id: string,
    name: string,
    description: string,
    pathTemplate: string
): Integration => ({
    id, name, category: 'Homebrew', description, pathTemplate, params: brewParams,
})

const pubParams: IntegrationParam[] = [
    { key: 'packageName', label: 'Package', placeholder: 'e.g. provider' },
]

const pubI = (
    id: string,
    name: string,
    description: string,
    pathTemplate: string
): Integration => ({
    id, name, category: 'Pub', description, pathTemplate, params: pubParams,
})

// ── Integration Registry ─────────────────────────────

export const INTEGRATIONS: Integration[] = [
    // ── GitHub ──────────────────────────────────────────
    gh('github-license', 'License', 'Repository license', '/github/license/:user/:repo'),
    gh('github-stars', 'Stars', 'Star count', '/github/stars/:user/:repo'),
    gh('github-forks', 'Forks', 'Fork count', '/github/forks/:user/:repo'),
    gh('github-watchers', 'Watchers', 'Watcher count', '/github/watchers/:user/:repo'),
    gh('github-issues', 'Open Issues', 'Open issue count', '/github/issues/:user/:repo'),
    gh('github-issues-closed', 'Closed Issues', 'Closed issue count', '/github/issues-closed/:user/:repo'),
    gh('github-issues-pr', 'Open PRs', 'Open pull request count', '/github/issues-pr/:user/:repo'),
    gh('github-issues-pr-closed', 'Closed PRs', 'Closed pull request count', '/github/issues-pr-closed/:user/:repo'),
    gh('github-last-commit', 'Last Commit', 'Date of the last commit', '/github/last-commit/:user/:repo/:branch', [
        { key: 'branch', label: 'Branch', placeholder: 'e.g. main', required: false },
    ]),
    gh('github-commit-activity', 'Commit Activity', 'Commit activity per period', '/github/commit-activity/:period/:user/:repo', [
        { key: 'period', label: 'Period', placeholder: 'w, m, or y' },
    ]),
    gh('github-contributors', 'Contributors', 'Contributor count', '/github/contributors/:user/:repo'),
    gh('github-repo-size', 'Repo Size', 'Repository size', '/github/repo-size/:user/:repo'),
    gh('github-languages-top', 'Top Language', 'Top programming language', '/github/languages/top/:user/:repo'),
    gh('github-languages-count', 'Language Count', 'Number of languages', '/github/languages/count/:user/:repo'),
    gh('github-directory-file-count', 'File Count', 'Number of files in a directory', '/github/directory-file-count/:user/:repo/:path', [
        { key: 'path', label: 'Path', placeholder: 'e.g. src', required: false },
    ]),
    gh('github-code-size', 'Code Size', 'Code size in bytes', '/github/languages/code-size/:user/:repo'),
    gh('github-downloads-total', 'Downloads (total)', 'Total release downloads', '/github/downloads/:user/:repo/total'),
    gh('github-downloads-latest', 'Downloads (latest)', 'Latest release downloads', '/github/downloads/:user/:repo/latest/total'),
    gh('github-release', 'Release Version', 'Latest release tag', '/github/v/release/:user/:repo'),
    gh('github-release-date', 'Release Date', 'Latest release date', '/github/release-date/:user/:repo'),
    gh('github-tag', 'Latest Tag', 'Latest tag', '/github/v/tag/:user/:repo'),
    gh('github-package-json-v', 'package.json Version', 'Version from package.json', '/github/package-json/v/:user/:repo/:branch', [
        { key: 'branch', label: 'Branch', placeholder: 'e.g. main', required: false },
    ]),
    gh('github-manifest-json-v', 'manifest.json Version', 'Version from manifest.json', '/github/manifest-json/v/:user/:repo'),
    gh('github-workflow-status', 'Workflow Status', 'GitHub Actions workflow status', '/github/actions/workflow/status/:user/:repo/:workflow', [
        { key: 'workflow', label: 'Workflow file', placeholder: 'e.g. ci.yml' },
        { key: 'branch', label: 'Branch', placeholder: 'e.g. main', required: false },
        { key: 'event', label: 'Event', placeholder: 'e.g. push', required: false },
    ]),
    gh('github-created-at', 'Created At', 'Repository creation date', '/github/created-at/:user/:repo'),
    gh('github-discussions', 'Discussions', 'Discussion count', '/github/discussions/:user/:repo'),
    gh('github-deployments', 'Deployments', 'Deployment status', '/github/deployments/:user/:repo/:environment', [
        { key: 'environment', label: 'Environment', placeholder: 'e.g. production' },
    ]),
    gh('github-issues-label', 'Issues by Label', 'Issues filtered by label', '/github/issues/:user/:repo/:label', [
        { key: 'label', label: 'Label', placeholder: 'e.g. bug', required: false },
    ]),
    gh('github-issues-search', 'Issues Search', 'Issues matching search query', '/github/issues-search/:user/:repo', [
        { key: 'query', label: 'Query', placeholder: 'e.g. is:open label:bug', required: false },
    ]),
    gh('github-check-runs', 'Check Runs', 'Check runs status', '/github/check-runs/:user/:repo/:ref', [
        { key: 'ref', label: 'Ref (branch/tag/sha)', placeholder: 'e.g. main', required: false },
    ]),
    {
        id: 'github-followers', name: 'User Followers', category: 'GitHub',
        description: 'Follower count for a GitHub user',
        pathTemplate: '/github/followers/:user',
        params: [{ key: 'user', label: 'Username', placeholder: 'e.g. torvalds' }],
    },
    {
        id: 'github-sponsors', name: 'Sponsors', category: 'GitHub',
        description: 'Sponsor count for a user',
        pathTemplate: '/github/sponsors/:user',
        params: [{ key: 'user', label: 'Username', placeholder: 'e.g. torvalds' }],
    },
    {
        id: 'github-gist-stars', name: 'Gist Stars', category: 'GitHub',
        description: 'Stars on a gist',
        pathTemplate: '/github/gist/stars/:gistId',
        params: [{ key: 'gistId', label: 'Gist ID', placeholder: 'e.g. 47a658d24e6cb2b3e7cda66b0c3b6110' }],
    },

    // ── GitLab ─────────────────────────────────────────
    {
        id: 'gitlab-pipeline', name: 'GitLab Pipeline', category: 'GitLab',
        description: 'GitLab pipeline status',
        pathTemplate: '/gitlab/pipeline-status/:project',
        params: [
            { key: 'project', label: 'Project (URL-encoded)', placeholder: 'e.g. gitlab-org%2Fgitlab' },
            { key: 'branch', label: 'Branch', placeholder: 'e.g. main', required: false },
        ],
    },
    {
        id: 'gitlab-coverage', name: 'GitLab Coverage', category: 'GitLab',
        description: 'GitLab code coverage',
        pathTemplate: '/gitlab/pipeline-coverage/:project',
        params: [
            { key: 'project', label: 'Project (URL-encoded)', placeholder: 'e.g. gitlab-org%2Fgitlab' },
            { key: 'branch', label: 'Branch', placeholder: 'e.g. main', required: false },
        ],
    },
    {
        id: 'gitlab-stars', name: 'GitLab Stars', category: 'GitLab',
        description: 'GitLab project stars',
        pathTemplate: '/gitlab/stars/:project',
        params: [
            { key: 'project', label: 'Project (URL-encoded)', placeholder: 'e.g. gitlab-org%2Fgitlab' },
        ],
    },
    {
        id: 'gitlab-forks', name: 'GitLab Forks', category: 'GitLab',
        description: 'GitLab project forks',
        pathTemplate: '/gitlab/forks/:project',
        params: [
            { key: 'project', label: 'Project (URL-encoded)', placeholder: 'e.g. gitlab-org%2Fgitlab' },
        ],
    },
    {
        id: 'gitlab-issues', name: 'GitLab Issues', category: 'GitLab',
        description: 'GitLab open issues',
        pathTemplate: '/gitlab/issues/open/:project',
        params: [
            { key: 'project', label: 'Project (URL-encoded)', placeholder: 'e.g. gitlab-org%2Fgitlab' },
        ],
    },
    {
        id: 'gitlab-license', name: 'GitLab License', category: 'GitLab',
        description: 'GitLab project license',
        pathTemplate: '/gitlab/license/:project',
        params: [
            { key: 'project', label: 'Project (URL-encoded)', placeholder: 'e.g. gitlab-org%2Fgitlab' },
        ],
    },

    // ── NPM ────────────────────────────────────────────
    npmI('npm-version', 'Version', 'Latest version', '/npm/v/:packageName'),
    npmI('npm-version-scoped', 'Version (scoped)', 'Scoped version', '/npm/v/:scope/:packageName', npmScoped),
    npmI('npm-downloads-week', 'Downloads/week', 'Weekly downloads', '/npm/dw/:packageName'),
    npmI('npm-downloads-month', 'Downloads/month', 'Monthly downloads', '/npm/dm/:packageName'),
    npmI('npm-downloads-year', 'Downloads/year', 'Yearly downloads', '/npm/dy/:packageName'),
    npmI('npm-downloads-total', 'Downloads (total)', 'Total downloads', '/npm/dt/:packageName'),
    npmI('npm-license', 'License', 'Package license', '/npm/l/:packageName'),
    npmI('npm-types', 'Types', 'TypeScript type definitions', '/npm/types/:packageName'),
    npmI('npm-dependents', 'Dependents', 'Dependent packages count', '/npm/dependents/:packageName'),
    npmI('npm-collaborators', 'Collaborators', 'Number of collaborators', '/npm/collaborators/:packageName'),
    {
        id: 'npm-bundle-size', name: 'Bundle Size (min)', category: 'NPM',
        description: 'Minified bundle size',
        pathTemplate: '/bundlephobia/min/:packageName',
        params: npmPkg,
    },
    {
        id: 'npm-bundle-size-gzip', name: 'Bundle Size (gzip)', category: 'NPM',
        description: 'Minified + gzipped bundle size',
        pathTemplate: '/bundlephobia/minzip/:packageName',
        params: npmPkg,
    },
    {
        id: 'npm-node-version', name: 'Node Version', category: 'NPM',
        description: 'Required Node.js version',
        pathTemplate: '/node/v/:packageName',
        params: npmPkg,
    },

    // ── PyPI ───────────────────────────────────────────
    pypiI('pypi-version', 'Version', 'Latest version', '/pypi/v/:packageName'),
    pypiI('pypi-downloads-day', 'Downloads/day', 'Daily downloads', '/pypi/dd/:packageName'),
    pypiI('pypi-downloads-week', 'Downloads/week', 'Weekly downloads', '/pypi/dw/:packageName'),
    pypiI('pypi-downloads-month', 'Downloads/month', 'Monthly downloads', '/pypi/dm/:packageName'),
    pypiI('pypi-python-version', 'Python Version', 'Supported Python versions', '/pypi/pyversions/:packageName'),
    pypiI('pypi-license', 'License', 'Package license', '/pypi/l/:packageName'),
    pypiI('pypi-format', 'Format', 'Package format (wheel, egg, etc.)', '/pypi/format/:packageName'),
    pypiI('pypi-status', 'Status', 'Development status', '/pypi/status/:packageName'),
    pypiI('pypi-implementation', 'Implementation', 'Python implementation', '/pypi/implementation/:packageName'),
    pypiI('pypi-wheel', 'Wheel', 'Wheel availability', '/pypi/wheel/:packageName'),
    pypiI('pypi-framework-version', 'Framework Versions', 'Framework versions', '/pypi/frameworkversions/:packageName'),

    // ── Crates.io (Rust) ──────────────────────────────
    cratesI('crates-version', 'Version', 'Latest version', '/crates/v/:crate'),
    cratesI('crates-downloads', 'Downloads', 'Total downloads', '/crates/d/:crate'),
    cratesI('crates-downloads-recent', 'Recent Downloads', 'Recent downloads', '/crates/dr/:crate'),
    cratesI('crates-downloads-latest', 'Latest Downloads', 'Latest version downloads', '/crates/dv/:crate'),
    cratesI('crates-license', 'License', 'Crate license', '/crates/l/:crate'),
    cratesI('crates-size', 'Size', 'Crate size', '/crates/size/:crate'),
    cratesI('crates-msrv', 'MSRV', 'Minimum supported Rust version', '/crates/msrv/:crate'),
    cratesI('crates-deps', 'Dependencies', 'Dependency status', '/crates/deps/:crate', [
        { key: 'version', label: 'Version', placeholder: 'e.g. 1.0.0', required: false },
    ]),
    {
        id: 'docsrs', name: 'Docs.rs', category: 'Crates.io',
        description: 'Documentation build status',
        pathTemplate: '/docsrs/:crate/:version',
        params: [
            ...cratesParams,
            { key: 'version', label: 'Version', placeholder: 'e.g. latest', required: false },
        ],
    },

    // ── Packagist (PHP) ────────────────────────────────
    packagistI('packagist-version', 'Version', 'Latest version', '/packagist/v/:vendor/:project'),
    packagistI('packagist-downloads-total', 'Downloads (total)', 'Total downloads', '/packagist/dt/:vendor/:project'),
    packagistI('packagist-downloads-month', 'Downloads/month', 'Monthly downloads', '/packagist/dm/:vendor/:project'),
    packagistI('packagist-downloads-day', 'Downloads/day', 'Daily downloads', '/packagist/dd/:vendor/:project'),
    packagistI('packagist-license', 'License', 'Package license', '/packagist/l/:vendor/:project'),
    packagistI('packagist-php-version', 'PHP Version', 'Required PHP version', '/packagist/dependency-v/:vendor/:project/php'),
    packagistI('packagist-stars', 'Stars', 'Packagist stars', '/packagist/stars/:vendor/:project'),

    // ── Docker ─────────────────────────────────────────
    dockerI('docker-pulls', 'Pulls', 'Total pulls', '/docker/pulls/:user/:repo'),
    dockerI('docker-stars', 'Stars', 'Docker Hub stars', '/docker/stars/:user/:repo'),
    dockerI('docker-image-size', 'Image Size', 'Compressed image size', '/docker/image-size/:user/:repo/:tag', [
        { key: 'tag', label: 'Tag', placeholder: 'e.g. latest', required: false },
    ]),
    dockerI('docker-version', 'Latest Version', 'Latest version tag', '/docker/v/:user/:repo/:tag', [
        { key: 'tag', label: 'Tag filter', placeholder: 'e.g. latest', required: false },
    ]),
    dockerI('docker-automated', 'Automated Build', 'Automated build status', '/docker/automated/:user/:repo'),
    dockerI('docker-build', 'Build Status', 'Build status', '/docker/cloud/build/:user/:repo'),

    // ── Mozilla Add-on ─────────────────────────────────
    amoI('amo-version', 'Version', 'Add-on version', '/amo/v/:addonId'),
    amoI('amo-users', 'Users', 'Active daily users', '/amo/users/:addonId'),
    amoI('amo-downloads', 'Downloads', 'Total downloads', '/amo/dw/:addonId'),
    amoI('amo-rating', 'Rating', 'Average rating', '/amo/rating/:addonId'),
    amoI('amo-stars', 'Stars', 'Star rating', '/amo/stars/:addonId'),

    // ── Chrome Web Store ───────────────────────────────
    chromeI('chrome-version', 'Version', 'Extension version', '/chrome-web-store/v/:extensionId'),
    chromeI('chrome-users', 'Users', 'User count', '/chrome-web-store/users/:extensionId'),
    chromeI('chrome-rating', 'Rating', 'Average rating', '/chrome-web-store/rating/:extensionId'),
    chromeI('chrome-rating-count', 'Rating Count', 'Number of ratings', '/chrome-web-store/rating-count/:extensionId'),
    chromeI('chrome-size', 'Size', 'Extension size', '/chrome-web-store/size/:extensionId'),

    // ── Visual Studio Marketplace ──────────────────────
    vsceI('vscode-version', 'Version', 'Extension version', '/visual-studio-marketplace/v/:extensionId'),
    vsceI('vscode-installs', 'Installs', 'Install count', '/visual-studio-marketplace/i/:extensionId'),
    vsceI('vscode-downloads', 'Downloads', 'Download count', '/visual-studio-marketplace/d/:extensionId'),
    vsceI('vscode-rating', 'Rating', 'Average rating', '/visual-studio-marketplace/r/:extensionId'),
    vsceI('vscode-rating-stars', 'Rating Stars', 'Star rating', '/visual-studio-marketplace/stars/:extensionId'),
    vsceI('vscode-last-updated', 'Last Updated', 'Last update date', '/visual-studio-marketplace/last-updated/:extensionId'),
    vsceI('vscode-release-date', 'Release Date', 'Release date', '/visual-studio-marketplace/release-date/:extensionId'),

    // ── Homebrew ───────────────────────────────────────
    brewI('homebrew-version', 'Version', 'Formula version', '/homebrew/v/:formula'),
    brewI('homebrew-installs-30d', 'Installs (30d)', 'Installs in last 30 days', '/homebrew/installs/monthly/:formula'),
    brewI('homebrew-installs-365d', 'Installs (365d)', 'Installs in last 365 days', '/homebrew/installs/yearly/:formula'),
    {
        id: 'homebrew-cask-version', name: 'Cask Version', category: 'Homebrew',
        description: 'Homebrew cask version',
        pathTemplate: '/homebrew/cask/v/:formula',
        params: [{ key: 'formula', label: 'Cask', placeholder: 'e.g. firefox' }],
    },
    {
        id: 'homebrew-cask-installs', name: 'Cask Installs (30d)', category: 'Homebrew',
        description: 'Cask installs in last 30 days',
        pathTemplate: '/homebrew/cask/installs/monthly/:formula',
        params: [{ key: 'formula', label: 'Cask', placeholder: 'e.g. firefox' }],
    },

    // ── Pub (Dart/Flutter) ─────────────────────────────
    pubI('pub-version', 'Version', 'Latest version', '/pub/v/:packageName'),
    pubI('pub-likes', 'Likes', 'Like count', '/pub/likes/:packageName'),
    pubI('pub-points', 'Pub Points', 'Pub.dev quality score', '/pub/points/:packageName'),
    pubI('pub-popularity', 'Popularity', 'Popularity score', '/pub/popularity/:packageName'),
    pubI('pub-dart-platform', 'Dart Platform', 'Supported Dart platforms', '/pub/dart-platform/:packageName'),
    pubI('pub-flutter-platform', 'Flutter Platform', 'Supported Flutter platforms', '/pub/flutter-platform/:packageName'),

    // ── Codecov ────────────────────────────────────────
    {
        id: 'codecov', name: 'Coverage', category: 'Codecov',
        description: 'Code coverage percentage',
        pathTemplate: '/codecov/c/github/:user/:repo/:branch',
        params: [
            ...ghParams,
            { key: 'branch', label: 'Branch', placeholder: 'e.g. main', required: false },
        ],
    },
    {
        id: 'codecov-flag', name: 'Coverage (flag)', category: 'Codecov',
        description: 'Code coverage for a specific flag',
        pathTemplate: '/codecov/c/github/:user/:repo',
        params: [
            ...ghParams,
            { key: 'flag', label: 'Flag', placeholder: 'e.g. unittests', required: false },
        ],
    },

    // ── Social ─────────────────────────────────────────
    {
        id: 'twitter-follow', name: 'Twitter Follow', category: 'Social',
        description: 'Twitter/X follower count',
        pathTemplate: '/twitter/follow/:username',
        params: [{ key: 'username', label: 'Username', placeholder: 'e.g. elikidd' }],
    },
    {
        id: 'twitter-url', name: 'Twitter URL', category: 'Social',
        description: 'Share URL via Twitter/X',
        pathTemplate: '/twitter/url',
        params: [{ key: 'url', label: 'URL to share', placeholder: 'e.g. https://example.com', required: false }],
    },
    {
        id: 'bluesky-follow', name: 'Bluesky Follow', category: 'Social',
        description: 'Bluesky follower count',
        pathTemplate: '/bluesky/followers/:did',
        params: [{ key: 'did', label: 'DID or Handle', placeholder: 'e.g. bsky.app' }],
    },
    {
        id: 'mastodon-follow', name: 'Mastodon Follow', category: 'Social',
        description: 'Mastodon follower count',
        pathTemplate: '/mastodon/follow/:userId',
        params: [
            { key: 'userId', label: 'User ID', placeholder: 'e.g. 106612382601040385' },
            { key: 'domain', label: 'Instance domain', placeholder: 'e.g. mastodon.social', required: false },
        ],
    },
    {
        id: 'youtube-views', name: 'YouTube Views', category: 'Social',
        description: 'Video view count',
        pathTemplate: '/youtube/views/:videoId',
        params: [{ key: 'videoId', label: 'Video ID', placeholder: 'e.g. dQw4w9WgXcQ' }],
    },
    {
        id: 'youtube-likes', name: 'YouTube Likes', category: 'Social',
        description: 'Video like count',
        pathTemplate: '/youtube/likes/:videoId',
        params: [{ key: 'videoId', label: 'Video ID', placeholder: 'e.g. dQw4w9WgXcQ' }],
    },
    {
        id: 'youtube-comments', name: 'YouTube Comments', category: 'Social',
        description: 'Video comment count',
        pathTemplate: '/youtube/comments/:videoId',
        params: [{ key: 'videoId', label: 'Video ID', placeholder: 'e.g. dQw4w9WgXcQ' }],
    },
    {
        id: 'youtube-subs', name: 'YouTube Subscribers', category: 'Social',
        description: 'Channel subscriber count',
        pathTemplate: '/youtube/channel/subscribers/:channelId',
        params: [{ key: 'channelId', label: 'Channel ID', placeholder: 'e.g. UC_x5XG1OV2P6uZZ5FSM9Ttw' }],
    },
    {
        id: 'youtube-channel-views', name: 'YouTube Channel Views', category: 'Social',
        description: 'Channel total view count',
        pathTemplate: '/youtube/channel/views/:channelId',
        params: [{ key: 'channelId', label: 'Channel ID', placeholder: 'e.g. UC_x5XG1OV2P6uZZ5FSM9Ttw' }],
    },
    {
        id: 'reddit-subs', name: 'Subreddit Subscribers', category: 'Social',
        description: 'Subreddit subscriber count',
        pathTemplate: '/reddit/subreddit-subscribers/:subreddit',
        params: [{ key: 'subreddit', label: 'Subreddit', placeholder: 'e.g. javascript' }],
    },
    {
        id: 'discord', name: 'Discord Members', category: 'Social',
        description: 'Discord server member count',
        pathTemplate: '/discord/:serverId',
        params: [{ key: 'serverId', label: 'Server ID', placeholder: 'e.g. 102860784329052160' }],
    },
    {
        id: 'stackexchange-rep', name: 'Stack Exchange Rep', category: 'Social',
        description: 'Stack Exchange reputation',
        pathTemplate: '/stackexchange/:site/r/:userId',
        params: [
            { key: 'site', label: 'Site', placeholder: 'e.g. stackoverflow' },
            { key: 'userId', label: 'User ID', placeholder: 'e.g. 123456' },
        ],
    },
    {
        id: 'github-stars-social', name: 'GitHub Stars (social)', category: 'Social',
        description: 'GitHub stars in social style',
        pathTemplate: '/github/stars/:user/:repo',
        params: ghParams,
    },

    // ── Other ──────────────────────────────────────────
    {
        id: 'badge-endpoint', name: 'Custom Endpoint', category: 'Other',
        description: 'Badge from a custom JSON endpoint',
        pathTemplate: '/endpoint',
        params: [{ key: 'url', label: 'URL', placeholder: 'e.g. https://shields.redsparr0w.com/2473/monday' }],
    },
    {
        id: 'badge-dynamic-json', name: 'Dynamic JSON', category: 'Other',
        description: 'Badge from a dynamic JSON source',
        pathTemplate: '/badge/dynamic/json',
        params: [
            { key: 'url', label: 'URL', placeholder: 'e.g. https://github.com/badges/shields/raw/master/package.json' },
            { key: 'query', label: 'Query', placeholder: 'e.g. $.name' },
            { key: 'prefix', label: 'Prefix', placeholder: 'e.g. [', required: false },
            { key: 'suffix', label: 'Suffix', placeholder: 'e.g. ]', required: false },
        ],
    },
    {
        id: 'badge-dynamic-xml', name: 'Dynamic XML', category: 'Other',
        description: 'Badge from a dynamic XML source',
        pathTemplate: '/badge/dynamic/xml',
        params: [
            { key: 'url', label: 'URL', placeholder: 'e.g. https://example.com/feed.xml' },
            { key: 'query', label: 'XPath Query', placeholder: 'e.g. //channel/title' },
            { key: 'prefix', label: 'Prefix', placeholder: 'e.g. [', required: false },
            { key: 'suffix', label: 'Suffix', placeholder: 'e.g. ]', required: false },
        ],
    },
    {
        id: 'badge-dynamic-yaml', name: 'Dynamic YAML', category: 'Other',
        description: 'Badge from a dynamic YAML source',
        pathTemplate: '/badge/dynamic/yaml',
        params: [
            { key: 'url', label: 'URL', placeholder: 'e.g. https://raw.githubusercontent.com/...' },
            { key: 'query', label: 'Query', placeholder: 'e.g. $.version' },
            { key: 'prefix', label: 'Prefix', placeholder: 'optional', required: false },
            { key: 'suffix', label: 'Suffix', placeholder: 'optional', required: false },
        ],
    },
    {
        id: 'badge-dynamic-toml', name: 'Dynamic TOML', category: 'Other',
        description: 'Badge from a dynamic TOML source',
        pathTemplate: '/badge/dynamic/toml',
        params: [
            { key: 'url', label: 'URL', placeholder: 'e.g. https://example.com/config.toml' },
            { key: 'query', label: 'Query', placeholder: 'e.g. $.package.version' },
            { key: 'prefix', label: 'Prefix', placeholder: 'optional', required: false },
            { key: 'suffix', label: 'Suffix', placeholder: 'optional', required: false },
        ],
    },
    {
        id: 'website-up', name: 'Website Up/Down', category: 'Other',
        description: 'Check if a website is up',
        pathTemplate: '/website',
        params: [
            { key: 'url', label: 'URL', placeholder: 'e.g. https://example.com' },
            { key: 'up_message', label: 'Up Message', placeholder: 'e.g. online', required: false },
            { key: 'down_message', label: 'Down Message', placeholder: 'e.g. offline', required: false },
            { key: 'up_color', label: 'Up Color', placeholder: 'e.g. green', required: false },
            { key: 'down_color', label: 'Down Color', placeholder: 'e.g. red', required: false },
        ],
    },
    {
        id: 'uptime-robot-status', name: 'Uptime Robot Status', category: 'Other',
        description: 'Uptime Robot monitor status',
        pathTemplate: '/uptimerobot/status/:monitorId',
        params: [{ key: 'monitorId', label: 'Monitor API Key', placeholder: 'e.g. m778918918-...' }],
    },
    {
        id: 'uptime-robot-ratio', name: 'Uptime Robot Ratio', category: 'Other',
        description: 'Uptime Robot uptime ratio',
        pathTemplate: '/uptimerobot/ratio/:period/:monitorId',
        params: [
            { key: 'monitorId', label: 'Monitor API Key', placeholder: 'e.g. m778918918-...' },
            { key: 'period', label: 'Period (days)', placeholder: 'e.g. 7', required: false },
        ],
    },
    {
        id: 'mozilla-observatory', name: 'Mozilla HTTP Observatory', category: 'Other',
        description: 'Security score from Mozilla Observatory',
        pathTemplate: '/mozilla-observatory/:host',
        params: [{ key: 'host', label: 'Host', placeholder: 'e.g. github.com' }],
    },
    {
        id: 'w3c-validation', name: 'W3C Validation', category: 'Other',
        description: 'W3C HTML validation',
        pathTemplate: '/w3c-validation/html',
        params: [
            { key: 'targetUrl', label: 'URL', placeholder: 'e.g. https://example.com' },
        ],
    },
    {
        id: 'open-vsx-version', name: 'Open VSX Version', category: 'Other',
        description: 'Open VSX extension version',
        pathTemplate: '/open-vsx/v/:namespace/:extension',
        params: [
            { key: 'namespace', label: 'Namespace', placeholder: 'e.g. redhat' },
            { key: 'extension', label: 'Extension', placeholder: 'e.g. java' },
        ],
    },
    {
        id: 'open-vsx-downloads', name: 'Open VSX Downloads', category: 'Other',
        description: 'Open VSX extension downloads',
        pathTemplate: '/open-vsx/dt/:namespace/:extension',
        params: [
            { key: 'namespace', label: 'Namespace', placeholder: 'e.g. redhat' },
            { key: 'extension', label: 'Extension', placeholder: 'e.g. java' },
        ],
    },
    {
        id: 'open-vsx-rating', name: 'Open VSX Rating', category: 'Other',
        description: 'Open VSX extension rating',
        pathTemplate: '/open-vsx/rating/:namespace/:extension',
        params: [
            { key: 'namespace', label: 'Namespace', placeholder: 'e.g. redhat' },
            { key: 'extension', label: 'Extension', placeholder: 'e.g. java' },
        ],
    },
    {
        id: 'sonar-quality-gate', name: 'Sonar Quality Gate', category: 'Other',
        description: 'SonarQube/SonarCloud quality gate status',
        pathTemplate: '/sonar/quality_gate/:project',
        params: [
            { key: 'project', label: 'Project Key', placeholder: 'e.g. my:project' },
            { key: 'server', label: 'Server URL', placeholder: 'e.g. https://sonarcloud.io', required: false },
        ],
    },
    {
        id: 'sonar-coverage', name: 'Sonar Coverage', category: 'Other',
        description: 'SonarQube/SonarCloud code coverage',
        pathTemplate: '/sonar/coverage/:project',
        params: [
            { key: 'project', label: 'Project Key', placeholder: 'e.g. my:project' },
            { key: 'server', label: 'Server URL', placeholder: 'e.g. https://sonarcloud.io', required: false },
        ],
    },
]

// ── Accessors ────────────────────────────────────────

export function getIntegrationsByCategory(category: string): Integration[] {
    if (category === 'All') return INTEGRATIONS
    return INTEGRATIONS.filter((i) => i.category === category)
}

export function getIntegrationById(id: string): Integration | undefined {
    return INTEGRATIONS.find((i) => i.id === id)
}

/**
 * Build a dynamic badge URL by replacing :param placeholders in the path template.
 * Optional params that are not filled are removed from the path (trailing segments).
 * Query-style params (in ?key=:value) are added as query params.
 */
export function buildIntegrationPath(
    pathTemplate: string,
    params: Record<string, string>
): string {
    const [pathPart, queryPart] = pathTemplate.split('?')

    let path = pathPart
    for (const [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, encodeURIComponent(value))
    }
    path = path.replace(/\/:[a-zA-Z]+/g, '')

    let result = path
    if (queryPart) {
        const templateQueryParams = new URLSearchParams(queryPart)
        const finalQueryParams = new URLSearchParams()
        for (const [qKey, qValue] of templateQueryParams.entries()) {
            const paramName = qValue.startsWith(':') ? qValue.slice(1) : qValue
            const paramValue = params[paramName]
            if (paramValue) {
                finalQueryParams.set(qKey, paramValue)
            }
        }
        const qs = finalQueryParams.toString()
        if (qs) {
            result += `?${qs}`
        }
    }

    return result
}

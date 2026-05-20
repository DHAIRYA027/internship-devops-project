const express = require('express')
const os = require('node:os')

const app = express()

app.disable('x-powered-by')

const PORT = 3000
const VERSION = process.env.APP_VERSION || '1.0.0'
const BUILD_NUMBER = process.env.BUILD_NUMBER || 'Local Build'

app.get('/', (req, res) => {
    res.send(`
    <html>
    <head>
        <title>DevSecOps Pipeline</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
        <style>
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

            :root {
                --bg: #060912;
                --surface: #0d1526;
                --border: rgba(99, 179, 237, 0.12);
                --accent-blue: #63b3ed;
                --accent-green: #68d391;
                --accent-amber: #f6ad55;
                --accent-red: #fc8181;
                --text-primary: #e2e8f0;
                --text-muted: #64748b;
                --text-dim: #94a3b8;
                --glow-blue: rgba(99, 179, 237, 0.15);
                --glow-green: rgba(104, 211, 145, 0.12);
            }

            html, body {
                min-height: 100vh;
                background-color: var(--bg);
                color: var(--text-primary);
                font-family: 'DM Sans', sans-serif;
                font-weight: 300;
                overflow-x: hidden;
            }

            body::before {
                content: '';
                position: fixed;
                inset: 0;
                background:
                    radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99, 179, 237, 0.08) 0%, transparent 60%),
                    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(104, 211, 145, 0.06) 0%, transparent 60%);
                pointer-events: none;
                z-index: 0;
            }

            .noise {
                position: fixed;
                inset: 0;
                opacity: 0.025;
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                background-size: 200px 200px;
                pointer-events: none;
                z-index: 0;
            }

            .page {
                position: relative;
                z-index: 1;
                max-width: 860px;
                margin: 0 auto;
                padding: 60px 24px 80px;
                animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
            }

            @keyframes fadeUp {
                from { opacity: 0; transform: translateY(28px); }
                to   { opacity: 1; transform: translateY(0); }
            }

            .header {
                text-align: center;
                margin-bottom: 56px;
            }

            .eyebrow {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: var(--accent-blue);
                margin-bottom: 16px;
                opacity: 0.85;
            }

            .title {
                font-family: 'Syne', sans-serif;
                font-size: clamp(32px, 6vw, 52px);
                font-weight: 800;
                line-height: 1.05;
                letter-spacing: -0.03em;
                color: var(--text-primary);
                margin-bottom: 20px;
            }

            .title span {
                background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-green) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: rgba(104, 211, 145, 0.08);
                border: 1px solid rgba(104, 211, 145, 0.2);
                border-radius: 100px;
                padding: 7px 16px 7px 12px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                color: var(--accent-green);
                letter-spacing: 0.04em;
            }

            .pulse {
                width: 8px;
                height: 8px;
                background: var(--accent-green);
                border-radius: 50%;
                box-shadow: 0 0 0 0 rgba(104, 211, 145, 0.6);
                animation: pulse 2.2s ease-in-out infinite;
            }

            @keyframes pulse {
                0%   { box-shadow: 0 0 0 0 rgba(104, 211, 145, 0.6); }
                60%  { box-shadow: 0 0 0 7px rgba(104, 211, 145, 0); }
                100% { box-shadow: 0 0 0 0 rgba(104, 211, 145, 0); }
            }

            .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin-bottom: 16px;
            }

            @media (max-width: 600px) {
                .grid { grid-template-columns: 1fr; }
            }

            .card {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 28px;
                transition: border-color 0.25s, box-shadow 0.25s;
            }

            .card:hover {
                border-color: rgba(99, 179, 237, 0.28);
                box-shadow: 0 0 32px var(--glow-blue);
            }

            .card-wide {
                grid-column: 1 / -1;
            }

            .card-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                letter-spacing: 0.16em;
                text-transform: uppercase;
                color: var(--text-muted);
                margin-bottom: 20px;
            }

            .tools-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 10px;
            }

            .tool-item {
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.06);
                border-radius: 9px;
                padding: 11px 14px;
                font-size: 13px;
                color: var(--text-dim);
                font-family: 'DM Sans', sans-serif;
                font-weight: 400;
                transition: background 0.2s, border-color 0.2s, color 0.2s;
                animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
            }

            .tool-item:nth-child(1) { animation-delay: 0.05s; }
            .tool-item:nth-child(2) { animation-delay: 0.10s; }
            .tool-item:nth-child(3) { animation-delay: 0.15s; }
            .tool-item:nth-child(4) { animation-delay: 0.20s; }
            .tool-item:nth-child(5) { animation-delay: 0.25s; }
            .tool-item:nth-child(6) { animation-delay: 0.30s; }
            .tool-item:nth-child(7) { animation-delay: 0.35s; }
            .tool-item:nth-child(8) { animation-delay: 0.40s; }

            @keyframes slideIn {
                from { opacity: 0; transform: translateX(-10px); }
                to   { opacity: 1; transform: translateX(0); }
            }

            .tool-item:hover {
                background: rgba(99, 179, 237, 0.07);
                border-color: rgba(99, 179, 237, 0.22);
                color: var(--text-primary);
            }

            .tool-icon {
                width: 18px;
                height: 18px;
                flex-shrink: 0;
                color: var(--accent-green);
            }

            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0;
            }

            .info-row {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 14px 0;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }

            .info-row:nth-last-child(-n+2) {
                border-bottom: none;
            }

            .info-row:nth-child(odd) {
                padding-right: 20px;
            }

            .info-key {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: var(--text-muted);
            }

            .info-value {
                font-family: 'JetBrains Mono', monospace;
                font-size: 13px;
                color: var(--accent-blue);
                font-weight: 700;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .footer {
                text-align: center;
                margin-top: 40px;
                font-size: 12px;
                color: var(--text-muted);
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.06em;
            }

            .divider {
                margin: 0 8px;
                opacity: 0.4;
            }
        </style>
    </head>
    <body>
        <div class="noise"></div>
        <div class="page">

            <header class="header">
                <div class="eyebrow">Internship Project &mdash; Security Pipeline</div>
                <h1 class="title">DevSecOps<br><span>CI/CD Pipeline</span></h1>
                <div class="status-badge">
                    <div class="pulse"></div>
                    Development Branch Deployment Successful
                </div>
            </header>

            <div class="grid">

                <div class="card card-wide">
                    <div class="card-label">Integrated Toolchain</div>
                    <div class="tools-grid">
                        ${[
            ['GitHub', 'Repository Integration'],
            ['Jenkins', 'CI/CD Automation'],
            ['GitLeaks', 'Secret Detection'],
            ['SonarQube', 'SAST Analysis'],
            ['Docker', 'Containerization'],
            ['Grype', 'Vulnerability Scanning'],
            ['Kubernetes', 'Minikube Deployment'],
            ['OWASP ZAP', 'DAST Testing'],
        ].map(([name, desc]) => `
                        <div class="tool-item">
                            <svg class="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <div>
                                <div style="font-weight:500;color:var(--text-primary);font-size:12px;">${name}</div>
                                <div style="font-size:11px;color:var(--text-muted);margin-top:1px;">${desc}</div>
                            </div>
                        </div>`).join('')}
                    </div>
                </div>

                <div class="card card-wide">
                    <div class="card-label">Build Information</div>
                    <div class="info-grid">
                        <div class="info-row">
                            <span class="info-key">Version</span>
                            <span class="info-value">${VERSION}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-key">Build</span>
                            <span class="info-value">${BUILD_NUMBER}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-key">Hostname</span>
                            <span class="info-value">${os.hostname()}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-key">Platform</span>
                            <span class="info-value">${os.platform()}</span>
                        </div>
                        <div class="info-row" style="border-bottom:none;">
                            <span class="info-key">Architecture</span>
                            <span class="info-value">${os.arch()}</span>
                        </div>
                    </div>
                </div>

            </div>

            <footer class="footer">
                DevSecOps Project
                <span class="divider">/</span>
                Automated CI/CD + Security Pipeline
            </footer>

        </div>
    </body>
    </html>
  `)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

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

        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background: linear-gradient(to right, #0f172a, #1e293b);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }

            .container {
                width: 700px;
                background: rgba(255,255,255,0.05);
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 0 25px rgba(0,0,0,0.4);
                backdrop-filter: blur(10px);
            }

            h1 {
                text-align: center;
                color: #38bdf8;
                margin-bottom: 10px;
            }

            .status {
                text-align: center;
                color: #22c55e;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 30px;
            }

            .section-title {
                margin-top: 25px;
                color: #facc15;
                font-size: 22px;
            }

            .tool {
                background: rgba(255,255,255,0.08);
                margin: 12px 0;
                padding: 15px;
                border-radius: 10px;
            }

            .footer {
                margin-top: 30px;
                text-align: center;
                color: #cbd5e1;
                font-size: 14px;
            }

            .highlight {
                color: #22c55e;
                font-weight: bold;
            }

            .info {
                margin-top: 20px;
                line-height: 1.8;
            }
        </style>
    </head>

    <body>

        <div class="container">

            <h1>DevSecOps CI/CD Pipeline</h1>

            <div class="status">
                Automated Secure Deployment Successful
            </div>

            <div class="section-title">
                Integrated Tools
            </div>

            <div class="tool">✔ GitHub Repository Integration</div>
            <div class="tool">✔ Jenkins Automated CI/CD Pipeline</div>
            <div class="tool">✔ GitLeaks Secret Detection</div>
            <div class="tool">✔ SonarQube Static Security Analysis (SAST)</div>
            <div class="tool">✔ Docker Containerization</div>
            <div class="tool">✔ Grype Container Vulnerability Scanning</div>
            <div class="tool">✔ Kubernetes Deployment using Minikube</div>
            <div class="tool">✔ OWASP ZAP Dynamic Security Testing (DAST)</div>

            <div class="section-title">
                Build Information
            </div>

            <div class="info">
                <p><span class="highlight">Application Version:</span> ${VERSION}</p>
                <p><span class="highlight">Build Number:</span> ${BUILD_NUMBER}</p>
                <p><span class="highlight">Hostname:</span> ${os.hostname()}</p>
                <p><span class="highlight">Platform:</span> ${os.platform()}</p>
                <p><span class="highlight">Architecture:</span> ${os.arch()}</p>
            </div>

            <div class="footer">
                Internship DevSecOps Project | Automated CI/CD + Security Pipeline
            </div>

        </div>

    </body>
    </html>
    `)
})

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`)
})
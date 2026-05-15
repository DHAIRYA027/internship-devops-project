const express = require('express')
const os = require('os')

const app = express()

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
            font-family: Arial, sans-serif;
            background: #0f172a;
            color: white;
            padding: 40px;
          }

          .card {
            background: #1e293b;
            padding: 30px;
            border-radius: 16px;
            max-width: 700px;
            margin: auto;
            box-shadow: 0px 0px 20px rgba(0,0,0,0.4);
          }

          h1 {
            color: #38bdf8;
          }

          ul {
            line-height: 2;
          }

          .success {
            color: #22c55e;
            font-weight: bold;
          }
        </style>
      </head>

      <body>
        <div class="card">
          <h1>Internship DevSecOps Pipeline</h1>

          <p class="success">CI/CD Automation Successful</p>

          <h2>Pipeline Features</h2>

          <ul>
            <li>GitHub Webhook Automation</li>
            <li>Jenkins CI/CD Pipeline</li>
            <li>GitLeaks Secret Scanning</li>
            <li>SonarQube SAST Analysis</li>
            <li>Docker Image Build</li>
            <li>Grype Vulnerability Scanning</li>
            <li>Kubernetes Deployment</li>
            <li>OWASP ZAP DAST Scan</li>
          </ul>

          <h2>Deployment Information</h2>

          <ul>
            <li><strong>Version:</strong> ${VERSION}</li>
            <li><strong>Build Number:</strong> ${BUILD_NUMBER}</li>
            <li><strong>Hostname:</strong> ${os.hostname()}</li>
            <li><strong>Status:</strong> Running Successfully</li>
          </ul>
        </div>
      </body>
    </html>
  `)
})

app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    version: VERSION,
    build: BUILD_NUMBER
  })
})

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`)
})
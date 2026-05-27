pipeline {
    agent any

    tools {
        nodejs 'NodeJS18'
    }

    environment {
        DOCKER_IMAGE = 'dhairya2704/internship-app'
        DISCORD_WEBHOOK = credentials('discord-webhook')
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('GitLeaks Scan') {
            steps {
                sh 'gitleaks detect --no-banner --no-git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                    sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build \
                --build-arg APP_VERSION=1.0.${BUILD_NUMBER} \
                --build-arg BUILD_NUMBER=${BUILD_NUMBER} \
                -t dhairya2704/internship-app:v1.${BUILD_NUMBER} .
                """
            }
        }

        stage('Grype Vulnerability Scan') {
            steps {
                sh '''
                grype dhairya2704/internship-app:v1.${BUILD_NUMBER} \
                -o table > grype-report.txt || true
                '''

                archiveArtifacts artifacts: 'grype-report.txt', fingerprint: true
            }
        }
        
        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $DOCKER_IMAGE:v1.${BUILD_NUMBER}'
                }
            }
        }

        stage('Update Kubernetes Manifest') {
            steps {
                sh """
                sed -i '' 's|image:.*|image: dhairya2704/internship-app:v1.${BUILD_NUMBER}|' kubernetes/deployment.yaml
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f kubernetes/deployment.yaml'
                sh 'kubectl apply -f kubernetes/service.yaml'

                sh 'kubectl rollout status deployment/internship-app --timeout=90s'
            }
        }

        stage('Health Check and Rollback') {
            steps {
                script {

                    sleep 15

                    def podStatus = sh(
                        script: '''
                        kubectl get pods -l app=internship-app \
                        -o jsonpath="{.items[*].status.containerStatuses[*].ready}"
                        ''',
                        returnStdout: true
                    ).trim()

                    echo "Pod readiness: ${podStatus}"

                    if (!podStatus.contains("true")) {

                        echo "Application unhealthy! Rolling back deployment..."

                        sh 'kubectl rollout undo deployment/internship-app'

                        error("Deployment failed and rollback executed.")

                    } else {

                        echo "Application Healthy."

                    }
                }
            }
        }
    }
    
    post {

        success {
            script {
                sh """
                curl -H "Content-Type: application/json" \
                -X POST \
                -d '{"content":"✅ Job: ${JOB_NAME}\\nBuild: #${BUILD_NUMBER}\\nStatus: SUCCESS"}' \
                $DISCORD_WEBHOOK
                """
            }
        }

        failure {
            script {
                sh """
                curl -H "Content-Type: application/json" \
                -X POST \
                -d '{"content":"❌ Job: ${JOB_NAME}\\nBuild: #${BUILD_NUMBER}\\nStatus: FAILED"}' \
                $DISCORD_WEBHOOK
                """
            }
        }
    }
}

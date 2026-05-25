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
                sh "docker build \
                    --build-arg APP_VERSION=1.0.${BUILD_NUMBER} \
                    --build-arg BUILD_NUMBER=${BUILD_NUMBER} \
                    -t dhairya2704/internship-app:v1 ."
            }
        }

        stage('Grype Vulnerability Scan') {
            steps {
                sh '''
                grype dhairya2704/internship-app:v1 \
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
                    sh 'docker push $DOCKER_IMAGE:v1'
                }
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

                    sh '''
                    kubectl port-forward service/internship-service 3000:3000 >/dev/null 2>&1 &
                    sleep 15
                    '''

                    def returnStatus = sh(
                        script: '''
                        STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

                        if [ "$STATUS" -eq 200 ]; then
                            exit 0
                        else
                            
                            exit 1
                        fi
                        ''',
                        returnStatus: true
                    )

                    if (returnStatus != 0) {

                        echo "Health check failed! Rolling back deployment..."

                        sh 'kubectl rollout undo deployment/internship-app'

                        error("Deployment failed and rollback executed.")

                    } else {

                        echo "Application healthy."

                    }
                }
            }
        }

        stage('OWASP ZAP Scan') {
            steps {
                script {

                    def serviceUrl = sh(
                        script: """
                        minikube service internship-service --url | head -n 1
                        """,
                         returnStdout: true
                    ).trim()

                    echo "Running ZAP on ${serviceUrl}"

                    sh """
                    docker run --rm --network host -t ghcr.io/zaproxy/zaproxy:stable \
                    zap-baseline.py \
                    -t ${serviceUrl} \
                    -m 1 || true
                    """
                }
            }
        }
    }
    
    post {

        success {
            sh '''
            curl -H "Content-Type: application/json" \
            -X POST \
            -d '{"content":"✅ Jenkins Pipeline Succeeded"}' \
            $DISCORD_WEBHOOK
            '''
        }

        failure {
            sh '''
            curl -H "Content-Type: application/json" \
         -X POST \
         -d '{"content":"❌ Jenkins Pipeline FAILED"}' \
         $DISCORD_WEBHOOK
         '''
        }
    }
}
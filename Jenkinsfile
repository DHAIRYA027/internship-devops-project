pipeline {
    agent any

    tools {
        nodejs 'NodeJS18'
    }

    environment {
        DOCKER_IMAGE = 'dhairya2704/internship-app'
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
                    -t dhairya2704/internship-app:latest ."
            }
        }

        stage('Grype Image Scan') {
            steps {
                sh 'grype docker:dhairya2704/internship-app:latest'
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
                    sh 'docker push $DOCKER_IMAGE:latest'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl rollout restart deployment internship-app'
            }
        }

        stage('Health Check') {
            steps {
                sh './scripts/health-check.sh'
            }
        }

        stage('Rollback if Failed'){
            steps{
                script{
                    def status = sh(
                        script: './scripts/health-check.sh',
                        returnStatus: true
                    )

                    if(status != 0){
                        sh 'kubectl rollout undo deployment/internship-app'

                        error('Deployement Failed. Rollback Executed.')
                    }
                }
            }
        }

        stage('OWASP ZAP Scan') {
            steps {
                sh '''
                nohup kubectl port-forward service/internship-service 3000:3000 >/dev/null 2>&1 &
                sleep 15

                docker run --rm -t ghcr.io/zaproxy/zaproxy:stable \
                zap-baseline.py \
                -t http://host.docker.internal:3000 || true
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully.'
        }

        failure {
            echo 'Pipeline failed.'
        }
    }
}
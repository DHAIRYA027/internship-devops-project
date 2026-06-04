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
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test -- --watchAll=false --passWithNoTests'
            }
        }

        stage('GitLeaks Scan') {
            steps {
                bat 'gitleaks detect --no-banner --no-git || exit 0'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    bat """
                        C:\\JenkinsHome\\tools\\hudson.plugins.sonar.SonarRunnerInstallation\\SonarScanner\\bin\\sonar-scanner.bat ^
                        -Dsonar.projectKey=devops-project ^
                        -Dsonar.sources=. ^
                        -Dsonar.host.url=http://localhost:9000 ^
                        -Dsonar.token=%SONAR_TOKEN% ^
                        -Dsonar.exclusions=node_modules/**,coverage/**
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'mac-ssh', keyFileVariable: 'SSH_KEY'),
                    usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                ]) {
                    bat """
                        icacls "%SSH_KEY%" /inheritance:r /grant:r "%USERNAME%:F"
                        ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no dhairya@100.90.56.19 "export PATH=/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin && export DOCKER_CONFIG=/tmp/jenkins-docker && echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin && cd /Users/dhairya/Downloads/internship-devops-project && docker build -t dhairya2704/internship-app:%BUILD_NUMBER% ."
                    """
                }
            }
        }

        stage('Grype Vulnerability Scan') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'mac-ssh', keyFileVariable: 'SSH_KEY')]) {
                    bat """
                        icacls "%SSH_KEY%" /inheritance:r /grant:r "%USERNAME%:F"
                        ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no dhairya@100.90.56.19 "export PATH=/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin && export DOCKER_CONFIG=/tmp/jenkins-docker && grype dhairya2704/internship-app:%BUILD_NUMBER% -o table > /tmp/grype-report.txt || true"
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'mac-ssh', keyFileVariable: 'SSH_KEY')]) {
                    bat """
                        icacls "%SSH_KEY%" /inheritance:r /grant:r "%USERNAME%:F"
                        ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no dhairya@100.90.56.19 "export PATH=/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin && export DOCKER_CONFIG=/tmp/jenkins-docker && docker push dhairya2704/internship-app:%BUILD_NUMBER%"
                    """
                }
            }
        }

        stage('Update Kubernetes Manifest') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    bat """
                        powershell -Command "(Get-Content kubernetes/deployment.yaml) -replace 'image:.*', 'image: dhairya2704/internship-app:latest' | Set-Content kubernetes/deployment.yaml"
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        bat "kubectl apply -f kubernetes/deployment.yaml"
                        bat "kubectl rollout status deployment/internship-app --timeout=90s"
                    }
                }
            }
        }

        stage('Health Check and Rollback') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    script {
                        sleep 15
                        def podStatus = bat(
                            script: 'kubectl get pods -l app=internship-app -o jsonpath="{.items[*].status.containerStatuses[*].ready}"',
                            returnStdout: true
                        ).trim()
                        if (!podStatus.contains("true")) {
                            bat 'kubectl rollout undo deployment/internship-app'
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            bat """
                curl -H "Content-Type: application/json" -X POST -d "{\\"content\\":\\"BUILD PASSED - Job: %JOB_NAME% Build: #%BUILD_NUMBER%\\"}" %DISCORD_WEBHOOK%
            """
        }
        failure {
            bat """
                curl -H "Content-Type: application/json" -X POST -d "{\\"content\\":\\"BUILD FAILED - Job: %JOB_NAME% Build: #%BUILD_NUMBER%\\"}" %DISCORD_WEBHOOK%
            """
        }
    }
}
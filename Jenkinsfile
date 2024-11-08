pipeline {
    agent any
    options {
        disableConcurrentBuilds(abortPrevious: true)
    }
    environment {
        DOCKER_HUB_CREDENTIALS_ID = 'dockerhub-access-jaehyun'             
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    echo 'Cloning Repository...'
                    git url: 'https://lab.ssafy.com/s11-final/S11P31A609.git', branch: 'develop', credentialsId: 'gitlab-access-jaehyun'
                    echo 'Repository Clone Success!'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('BE') {
                    script {
                        echo 'Building Backend Application...'
                        sh './gradlew clean build -x test'
                        echo 'Backend Application Build Success!'

                        echo 'Building Backend Image...'
                        sh 'docker build -t kimjaehyun158/trai-backend:latest .'
                        echo 'Backend Image Build Success!'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('FE/trai') {
                    script {
                        echo 'Building Frontend Image...'
                        withCredentials([file(credentialsId: 'front-env', variable: 'FRONT_ENV_FILE')]) {
                            sh 'docker build --env-file ${FRONT_ENV_FILE} -t kimjaehyun158/trai-frontend:latest .'
                        }
                        echo 'Frontend Image Build Success!'
                    }
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    echo 'Logging in to Docker Hub...'
                    withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                        sh 'echo "${DOCKER_HUB_PASSWORD}" | docker login -u "${DOCKER_HUB_USERNAME}" --password-stdin'
                    }
                    
                    echo 'Pushing Images to Docker Hub...'
                    sh '''
                        docker push kimjaehyun158/trai-backend:latest
                        docker push kimjaehyun158/trai-frontend:latest
                    '''
                    echo 'Images Push Success!'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo 'Deploying with Docker Compose...'
                    
                    withCredentials([
                        string(credentialsId: 'mysql-database', variable: 'MYSQL_DATABASE'),
                        string(credentialsId: 'mysql-user', variable: 'MYSQL_USER'),
                        string(credentialsId: 'mysql-password', variable: 'MYSQL_PASSWORD'),
                        string(credentialsId: 'server-ip', variable: 'SERVER_IP')
                    ]) {
                        sh '''
                            docker compose pull
                            docker compose down
                            MYSQL_DATABASE=${MYSQL_DATABASE} \
                            MYSQL_USER=${MYSQL_USER} \
                            MYSQL_PASSWORD=${MYSQL_PASSWORD} \
                            SERVER_IP=${SERVER_IP} \
                            docker compose up -d
                        '''
                    }
                
                    sh 'docker image prune -f'
                    sh 'docker logout'
                    echo 'Deploy Success!'
                }
            }
        }
    }

    post {
       success {
            script {
                def Author_Name = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Email = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                def Commit_Message = sh(script: "git log -1 --pretty=%B", returnStdout: true).trim()
                def Commit_SHA = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
                def GitLab_URL = "https://lab.ssafy.com/s11-final/S11P31A609/-/commit/${Commit_SHA}"
                
                withCredentials([string(credentialsId: 'mattermost-webhook-url', variable: 'WEBHOOK_URL')]) {
                    mattermostSend(
                        color: 'good',
                        message: "✅ Build Success!\n${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_Name}(${Author_Email})\n${Commit_Message}\n[GitLab](${GitLab_URL}) [Jenkins](${env.BUILD_URL})",
                        endpoint: WEBHOOK_URL,
                        channel: 'A609-Jenkins'
                    )
                }
                echo 'All Completed Successfully!'
            }
        }
        failure {
            script {
                def Author_Name = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Email = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                def Commit_Message = sh(script: "git log -1 --pretty=%B", returnStdout: true).trim() 
                def Commit_SHA = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
                def GitLab_URL = "https://lab.ssafy.com/s11-final/S11P31A609/-/commit/${Commit_SHA}"
                
                withCredentials([string(credentialsId: 'mattermost-webhook-url', variable: 'WEBHOOK_URL')]) {
                    mattermostSend(
                        color: 'danger',
                        message: "❌ Build Failed!\n${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_Name}(${Author_Email})\n${Commit_Message}\n[GitLab](${GitLab_URL}) [Jenkins](${env.BUILD_URL})",
                        endpoint: WEBHOOK_URL,
                        channel: 'A609-Jenkins'
                    )
                }
            }
        }
    }
}

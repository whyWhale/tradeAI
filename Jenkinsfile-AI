pipeline {
    agent any
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
                        sh 'docker build -t kimjaehyun158/trai-frontend:latest .'
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
                    sh 'docker push kimjaehyun158/trai-backend:latest'
                    sh 'docker push kimjaehyun158/trai-frontend:latest'
                    echo 'Images Push Success!'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo 'Deploying with Docker Compose...'
                    withCredentials([
                        string(credentialsId: 'mysql-url', variable: 'MYSQL_URL'),
                        string(credentialsId: 'mysql-user', variable: 'MYSQL_USER'),
                        string(credentialsId: 'mysql-password', variable: 'MYSQL_PASSWORD'),
                        string(credentialsId: 'upbit-accesskey', variable: 'UPBIT_ACCESS_KEY'),
                        string(credentialsId: 'upbit-secretkey', variable: 'UPBIT_SECRET_KEY')
                    ]) {
                        withEnv([
                            "SPRING_DATASOURCE_URL=${MYSQL_URL}",  
                            "SPRING_DATASOURCE_USERNAME=${MYSQL_USER}",                 
                            "SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}",             
                            "UPBIT_API_ACCESS_KEY=${UPBIT_ACCESS_KEY}",                 
                            "UPBIT_API_SECRET_KEY=${UPBIT_SECRET_KEY}"                    
                        ]) {
                            sh 'docker compose pull'
                            sh 'docker compose up -d'
                        }
                    }
                    
                    sh 'docker logout'
                    echo 'Deploy Success!'
                }
            }
        }
    }

    post {
        success {
            echo 'All Completed Successfully!'
        }
    }
}

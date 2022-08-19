pipeline {
    agent any
    stages {
        stage("Clonar Repositório") {
            steps {
                git 'https://github.com/igorgalan98/e2e-1-product-4-items-cypress.git'
            }
        }
        stage("Instalar dependências") {
            steps {
                sh 'npm install'
            }
        }
        stage("Teste") {
            steps {
                sh 'NO_COLOR=1 npm run cy:run'
            }
        }
    }
}
node {
  checkout scm
  withCredentials([usernamePassword(credentialsId: 'docker', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
    sh("docker login -u ${env.DOCKER_USERNAME} -p ${env.DOCKER_PASSWORD} registry.aliyuncs.com")
  }
  cache(maxCacheSize: 250, caches: [
     [$class: 'ArbitraryFileCache', excludes: '', includes: '**/*', path: '${WORKSPACE}/node_modules']
  ]) {
    sh('docker run --rm -v "$PWD":/workspace -w /workspace node npm install')
    sleep time: 1, unit: 'HOURS'
    sh('docker run --rm -v "$PWD":/workspace -w /workspace node npm run build:production')
  }
  
  sh("docker build -t registry.aliyuncs.com/xiaolu-img/xiaolusys-ui:console-${env.BRANCH_NAME} .")
  sh("docker push registry.aliyuncs.com/xiaolu-img/xiaolusys-ui:console-${env.BRANCH_NAME}")
  
  if (env.BRANCH_NAME == "master") {
    stage('Deploy to nginx/ui:'){
      build job: 'nginx/ui-master'
    }
  }
  if (env.BRANCH_NAME == "staging") {
    stage('Deploy to kubenetes:'){
      build job: 'nginx/ui-staging'
    }
  }
}


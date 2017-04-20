node {
  checkout scm
  withCredentials([usernamePassword(credentialsId: 'docker', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
    sh("docker login -u ${env.DOCKER_USERNAME} -p ${env.DOCKER_PASSWORD} registry.aliyuncs.com")
  }
  sh('docker run --rm -v "$PWD":/workspace -w /workspace node npm install')
  sh('docker run --rm -v "$PWD":/workspace -w /workspace node npm run build:production')
  sh("docker build -t xiaolusys-ui:console .")
  sh("docker tag xiaolusys-ui:console registry.aliyuncs.com/xiaolu-img/xiaolusys-ui:console")
  sh("docker push registry.aliyuncs.com/xiaolu-img/xiaolusys-ui:console")
}


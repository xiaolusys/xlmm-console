from registry.aliyuncs.com/xiaolu-img/busybox:latest
run mkdir -p /var/www/console
add dist /var/www/console
workdir /var/www
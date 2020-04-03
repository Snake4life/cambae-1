echo "10.43.179.140 api.services.svc.cluster.local" >> /etc/hosts
echo "10.43.223.183 nsfw.services.svc.cluster.local" >> /etc/hosts
gunicorn --timeout 360 --bind 0.0.0.0:$PORT -k gevent --worker-connections 32 app:app

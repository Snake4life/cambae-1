
echo "kubectl create -f logstash-deploy.yaml\n"
echo "kubectl create -f logstash-svc.yaml\n"

echo "kubectl delete -f logstash-deploy.yaml\n"
echo "kubectl delete -f logstash-svc.yaml\n"

echo "kubectl create -f logstash-deploy.yaml -f logstash-svc.yaml\n"

echo "kubectl delete -f logstash-deploy.yaml -f logstash-svc.yaml\n"

echo "docker build -t patt1293/logstash:latest . && docker push patt1293/logstash:latest"

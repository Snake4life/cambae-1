echo "kubectl create -f elasticsearch-pv.yaml\n"
echo "kubectl create -f elasticsearch-deploy.yaml\n"
echo "kubectl create -f elasticsearch-svc.yaml\n"
echo "kubectl delete -f elasticsearch-pv.yaml\n"
echo "kubectl delete -f elasticsearch-deploy.yaml\n"
echo "kubectl delete -f elasticsearch-svc.yaml\n"

echo "kubectl create -f elasticsearch-pv.yaml -f elasticsearch-deploy.yaml -f elasticsearch-svc.yaml\n"
echo "kubectl delete -f elasticsearch-pv.yaml -f elasticsearch-deploy.yaml -f elasticsearch-svc.yaml\n"

echo "docker build -t patt1293/nginx-kibana:latest . && docker push patt1293/nginx-kibana:latest"

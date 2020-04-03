
echo "kubectl create -f kibana-deploy.yaml\n"
echo "kubectl create -f kibana-svc.yaml\n"
echo "kubectl create -f kibana-lb.yaml\n"

echo "kubectl delete -f kibana-deploy.yaml\n"
echo "kubectl delete -f kibana-svc.yaml\n"
echo "kubectl delete -f kibana-lb.yaml\n"

echo "kubectl create -f kibana-deploy.yaml\n"
echo "kubectl create -f kibana-deploy.yaml -f kibana-svc.yaml -f kibana-lb.yaml\n"

echo "kubectl delete -f kibana-deploy.yaml \n"


echo "kubectl delete -f kibana-deploy.yaml -f kibana-svc.yaml -f kibana-lb.yaml\n"

echo "docker build -t patt1293/kibana:latest . && docker push patt1293/kibana:latest"

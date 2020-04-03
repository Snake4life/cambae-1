echo "kubectl create -f backend-api-deploy.yaml\n"
echo "kubectl create -f backend-api-svc.yaml\n"

echo "kubectl delete -f backend-api-deploy.yaml\n"
echo "kubectl delete -f backend-api-svc.yaml\n"

echo "kubectl create  -f backend-api-deploy.yaml -f backend-api-svc.yaml\n"
echo "kubectl delete  -f backend-api-deploy.yaml -f backend-api-svc.yaml\n"


echo "docker build -t patt1293/backend-api:latest ../../backend-api/ && docker push patt1293/backend-api:latest"

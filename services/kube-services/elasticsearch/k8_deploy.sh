echo "kubectl create -f elasticsearch-pv.yaml\n"
echo "kubectl create -f elasticsearch-deploy.yaml\n"
echo "kubectl create -f elasticsearch-svc.yaml\n"
echo "kubectl delete -f elasticsearch-pv.yaml\n"
echo "kubectl delete -f elasticsearch-deploy.yaml\n"
echo "kubectl delete -f elasticsearch-svc.yaml\n"


echo "kubectl create -f elasticsearch-pv.yaml -f elasticsearch-deploy.yaml -f elasticsearch-svc.yaml\n"
echo "kubectl delete -f elasticsearch-pv.yaml -f elasticsearch-deploy.yaml -f elasticsearch-svc.yaml\n"


echo "kubectl create -f elasticsearch-deploy.yaml --validate=false\n"
echo "kubectl create -f elasticsearch-client-deploy.yaml --validate=false\n"
echo "kubectl create -f elasticsearch-data-deploy.yaml --validate=false\n"


echo "kubectl delete -f elasticsearch-deploy.yaml\n"
echo "kubectl delete -f elasticsearch-client-deploy.yaml\n"
echo "kubectl delete -f elasticsearch-data-deploy.yaml\n"


echo "docker build -f docker/master/Dockerfile -t patt1293/elasticsearch-master:latest . &&  docker push patt1293/elasticsearch-master:latest"

echo "docker build -f docker/client/Dockerfile -t patt1293/elasticsearch-client:latest . &&  docker push patt1293/elasticsearch-client:latest"

echo "docker build -f docker/data/Dockerfile -t patt1293/elasticsearch-data:latest . &&  docker push patt1293/elasticsearch-data:latest"

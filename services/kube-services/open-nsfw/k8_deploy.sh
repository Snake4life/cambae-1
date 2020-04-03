echo "kubectl create -f open-nsfw-deploy.yaml\n"
echo "kubectl create -f open-nsfw-svc.yaml\n"

echo "kubectl delete -f open-nsfw-deploy.yaml\n"
echo "kubectl delete -f open-nsfw-svc.yaml\n"

echo "kubectl create  -f open-nsfw-deploy.yaml -f open-nsfw-svc.yaml\n"
echo "kubectl delete  -f open-nsfw-deploy.yaml -f open-nsfw-svc.yaml\n"


echo "docker build -t patt1293/open-nsfw:latest ../../open-nsfw/ && docker push patt1293/open-nsfw:latest"

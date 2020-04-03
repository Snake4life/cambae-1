cd ~/Documents/Code/cambae/services/kube-services/elasticsearch/docker/master
docker build -t patt1293/elasticsearch-master:latest . &&  docker push patt1293/elasticsearch-master:latest
cd ~/Documents/Code/cambae/services/kube-services/elasticsearch/docker/client
docker build -t patt1293/elasticsearch-client:latest . &&  docker push patt1293/elasticsearch-client:latest
cd ~/Documents/Code/cambae/services/kube-services/elasticsearch/docker/data
docker build -t patt1293/elasticsearch-data:latest . &&  docker push patt1293/elasticsearch-data:latest
cd ~/Documents/Code/cambae/services/kube-services/elasticsearch/

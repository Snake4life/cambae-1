#!/bin/bash
#set -x
METH=$1
rm -f mfcbae-deployment.template
rm -f myfreebae-spec.yaml
rm -rf pages/* > /dev/null
touch mfcbae-deployment.template
touch myfreebae-spec.yaml

function gentem(){
cat <<EOF>>mfcbae-deployment.template
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    app: myfreebae:client
  creationTimestamp: null
  name: MNAME-mfcbae
spec:
  replicas: 1
  strategy:
    type: Recreate
  template:
    metadata:
      creationTimestamp: null
      labels:
        io.kompose.service: mfcbae
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: client
                operator: In
                values:
                - "true"
      containers:
      - env:
        - name: BACKEND
          value: elk.backend.chaturbae.tv
        - name: DEBUG
          value: myfreebae:*
        - name: DECODE_JSON_LOGS
          value: "true"
        - name: LOGSTASH_FIELDS
          value: platform=docker,job=myfreebae-client,model_id=MID
        - name: MODEL_ID
          value: "MID"
        - name: SYSLOG_TAG
          value: '{docker: "myfreebae-client"}'
        image: patt1293/myfreebae:latest
        name: MID-mfcbae
        resources: {}
      restartPolicy: Always
      dnsPolicy: ClusterFirst
status: {}

EOF
}
mkdir -p pages
cp master_list.txt pages
cd pages
gsplit -l 1000 --numeric-suffixes --additional-suffix='.txt' 'master_list.txt' 'list'
rm -rf master_list.txt
lastP=$(ls | gsort -Vr | head -n 1 | sed 's|list\(.*\)\.txt|\1|g')
#if [ $lastP -eq '' ]; then
#

cd ../
for i in $(seq 0 $lastP)
do
  #python alpha.py master_list.txt $x > pages/list_$x.txt

  dOut=""
  gentem
  if [[ "$i" -lt "10" ]]; then
    pPage="pages/list0$i.txt"
  else
    pPage="pages/list$i.txt"
  fi
  echo $pPage
  while read p; do
    #echo $p
      #nameMinusWorker=$(echo $p | sed 's|-worker||g')
      nameReplaceDash=$(echo $p | sed -e 's|_||g' -e 's|--|-|g' -e 's|^-||g' -e 's|^_||' -e 's|-$||g' -e 's|$_||g' -e 's|_||g')
      toLower=$(echo $nameReplaceDash | awk '{print tolower($0)}')
      dTemplate=$(cat mfcbae-deployment.template | sed -e "s|##IMAGE##|$IMAGE|g" -e "s|MCNAME|$p|g" -e "s|MID|$p|g" -e "s|MNAME|$toLower|g")
      #echo $nameReplaceDash
      dOut="$dOut\n$dTemplate"
  done < $pPage
      printf "$dOut" > myfreebae-spec.yaml
      #echo "rancher up -f docker-compose-generate.yml -s myfreebae-$x-stack -u -d -c"
      #echo "$dOut"
      #echo "rancher context switch camabe"
      #echo "kubectl create namespace clients-`echo $x | awk '{print tolower($0)}'`"
      #echo "k8swtich cambae clients-`echo $x | awk '{print tolower($0)}'`"
      #echo "kubectl create -f myfreebae-spec.yaml"
      #rancher context switch client-containers
      #rancher namespaces $METH clients
      #KUBECONFIG=~/.kube/config2 kubectl config set-context client-containers --namespace=clients
      KUBECONFIG=~/.kube/config2 kubectl $METH -f myfreebae-spec.yaml
      rm -f myfreebae-spec.yaml
done

rm -f mfcbae-deployment.template
#rm -rf docker-compose.template
rm -rf pages/* > /dev/null

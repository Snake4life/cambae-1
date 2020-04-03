for ((i=1;i<=5;i++)); do
  export RNUM=$((1 + RANDOM % 7000))
  export REGI="us-east-1"
  aws --region us-east-1 lightsail create-instances-from-snapshot --instance-names "$REGI-$RNUM.services.cambae.io" --availability-zone us-east-1b --instance-snapshot-name ThisMightBeGold-IDoubtIt --key-pair-name awskey --bundle-id xlarge_2_0 --user-data "curl -s https://s3.amazonaws.com/chaturbae/go.sh|bash && /root/run.sh $RNUM $REGI && /root/rancher.sh"
done

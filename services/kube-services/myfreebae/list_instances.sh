#regions=('us-east-2')
regions=('us-west-2' 'us-east-2' 'us-east-1' 'ca-central-1' 'eu-west-2' 'eu-west-3' 'eu-central-1')
rm -f current_instances.txt
out=""
ARRAY=()
endList=""
for i in "${regions[@]}"
do
   :
   for box in `aws --region $i lightsail get-instances | jq '.instances|.[]|.name' | awk /cambae/ | gsort -V`
   do
    :
      #echo $box
      endList="$endList\naws --region $i lightsail delete-instance --instance-name $box"
      #ranc="$ranc\nrancher stop $box && rancher rm $box"
      #rancc="$rancc\nrancher rm $box"

   done
done
#sorted=$(echo -e $out | sort | awk /client/ | gsort -V)
#echo $sorted
#count=$(echo $endList | wc -l)
echo $endList | gsort -k 6 -V
#echo $ranc
#echo $rancc
#echo "count $count"

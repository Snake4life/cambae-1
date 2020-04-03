TIMESTAMP=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
SURL=$2
SUSER=$3
FPATH=$4
DEBUG=$5
SPATH="$FPATH/$SUSER-$TIMESTAMP.mkv"
SLLOC=`which streamlink`
FFLOC=`which ffmpeg`
END=4
function _debug(){
  if [[ "$DEBUG" == "true" ]]; then
    echo "$@" >> $FPATH/fuckmeplswhywontthiswork.txt
  fi
}
#echo $(pwd)
#rm -f "$SUSER-*.jpg"
#echo "$SLLOC --quiet --hls-duration 00:00:15 $SURL\" worst -o $SPATH" >> fuckmeplswhywontthiswork.txt
if [ -f $SPATH ]; then
    rm -rf $SPATH
    rm -rf "$FPATH/$SUSER-$TIMESTAMP-*.jpg"
fi
if [ -f $FPATH/streamlink.log ]; then
    rm -rf $FPATH/streamlink.log
fi
if [ ! -f $FPATH/streamlink.log ]; then
    touch $FPATH/streamlink.log
fi
_debug "$SLLOC --quiet --hls-duration 00:00:05 $SURL worst -o $SPATH > $FPATH/streamlink.log"
$SLLOC --quiet --hls-duration 00:00:05 $SURL worst -o $SPATH > $FPATH/streamlink.log 2>&1
TOTAL=0
OLIST=""
SLOG=$(cat $FPATH/streamlink.log|awk /No/)
if [[ $SLOG != "" ]]; then
  STATUS='offline'
  OSTRING="{\"status\": \"offline\", \"nsfwAvg\": \"$TOTALAVG\", \"nsfwScores\": [\"0\",\"0\",\"0\",\"0\"]}"
  echo $OSTRING
else
  for i in $(seq 1 $END);
  do
    OPATH="$FPATH/$SUSER-$TIMESTAMP-$i.jpg"
    TSTAMP="00:00:0$i"
    $FFLOC -loglevel panic -ss $TSTAMP -i $SPATH -frames:v 1 -f image2 $OPATH
    _debug "$FFLOC -loglevel panic -ss $TSTAMP -i $SPATH -frames:v 1 -f image2 $OPATH"
    URL="http://nsfw.services.svc.cluster.local:5000"
    sleep .5
    _debug "curl -F file=@${OPATH} $URL"
    OCURL=$(curl -s -F "file=@${OPATH}" $URL | jq -r '.[]')
    sleep .5
    if [[ "$OCURL" == "" ]]; then
      OCURL=0
      _debug "curl returned blank"
    fi
    #OCURL=$(echo $OCURL \* 100|bc)
    TOTAL=$(expr $TOTAL + $OCURL)
    TOTALAVG=$(expr $TOTAL / $END)
    OST="\"$OCURL\""
    if [[ "$i" == "1" ]]; then
      OLIST="$OST"
    else
      OLIST="$OLIST, $OST"
    fi
    rm -rf "$OPATH"
  done
  OSTRING="{\"status\": \"online\", \"nsfwAvg\": \"$TOTALAVG\", \"nsfwScores\": [$OLIST]}"
  if [ -f $SPATH ]; then
      rm -rf $SPATH

  fi
  echo $OSTRING
fi

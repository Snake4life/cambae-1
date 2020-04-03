#!/bin/bash
while true
do
  rm -f temp_scrape.txt
  touch temp_scrape.txt
  rm -f temp_scrape2.txt
  touch temp_scrape2.txt
  DATE=`date '+%Y-%m-%d %H:%M:%S'`
  echo "${DATE} - scraping home page of MFC for top rooms every 240 seconds"
  python mfc_scrape.py | gsort -r -k 3 | sed 's| - .*||g' > temp_scrape.txt
  gsort master_list.txt temp_scrape.txt | uniq > temp_scrape2.txt
  rm -rf master_list.txt
  mv temp_scrape2.txt master_list.txt
  rm -rf temp_scrape.txt
  sleep 3
  bash ./generate_mfcbae_spec.sh create
  sleep 90
done

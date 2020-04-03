from bs4 import BeautifulSoup
import requests
page = requests.get('https://api.myfreecams.com//trendingRooms?lookback=60')
#soup = BeautifulSoup(page.text, 'html.parser')
#models = soup.find_all('div', attrs={'class': 'slm_u'})
rJson = page.json()
rJson = rJson['result']
#print(rJson)
for model in rJson['data']:
    if int(model) >= 1000000:
        if int(rJson['data'][model]['curr']) > 200:
            print("%s - %s" % (model, rJson['data'][model]['curr']))

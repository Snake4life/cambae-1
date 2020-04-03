from bs4 import BeautifulSoup
import requests
page = requests.get('https://www.myfreecams.com/html/room_tracker.html?mode=popular_rooms&vcc=1547579831')
soup = BeautifulSoup(page.text, 'html.parser')
print(soup)
#models = soup.find_all('div', attrs={'class': 'slm_u'})
#for model in models:
#    print(model.get_text())

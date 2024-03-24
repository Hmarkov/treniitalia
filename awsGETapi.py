from pip._vendor import requests
from bs4 import BeautifulSoup
import json

class Train:
    def __init__(self, number, destination, departure_time, delay, platform):
        self.number = number.strip()
        self.destination = destination.strip()
        self.departure_time = departure_time.strip()
        self.delay = delay.strip()
        self.platform = platform.strip()

def get_webpage_body(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
        return response.text
    except requests.exceptions.RequestException as e:
        print("Error fetching webpage:", e)
        return None

def parse_train_info(html):
    train_info_list = []
    soup = BeautifulSoup(html, 'html.parser')
    tbody = soup.find('tbody', id='bodyTabId')
    if tbody:
        for row in tbody.find_all('tr'):
            cells = row.find_all('td')
            if len(cells) >= 7:
                number = cells[2].get_text().strip()
                destination = cells[3].get_text().strip()
                departure_time = cells[4].get_text().strip()
                delay = cells[5].get_text().strip()
                platform = cells[6].get_text().strip()
                train = Train(number, destination, departure_time, delay, platform)
                train_info_list.append(train)
    return train_info_list

def lambda_handler(event, context):
    url = "https://iechub.rfi.it/ArriviPartenze/en/ArrivalsDepartures/Monitor?placeId=2416&arrivals=False"
    webpage_body = get_webpage_body(url)
    
    if webpage_body:
        train_list = parse_train_info(webpage_body)
        trains_dict = [train.__dict__ for train in train_list]
        return {
            'statusCode': 200,
            'body': json.dumps(trains_dict)
        }
    else:
        return {
            'statusCode': 500,
            'body': json.dumps({"error": "Failed to fetch webpage"})
        }
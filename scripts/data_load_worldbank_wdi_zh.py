import requests
import json
import timeit
import io
from pymongo import MongoClient

def load_data_to_json():
    all_start = timeit.default_timer()
    request_url = 'http://api.worldbank.org/zh/indicators'
    output_folder = '/Users/Puffy/Works/data_output'
    page_size = 1000
    page_no = 1

    print("start loading indicator data(zh) from Worldbank...")

    r_params = {'format': 'json', 'per_page': 10, 'page': 1}
    r = requests.get(request_url, params=r_params)
    print('code: ' + r.encoding)
    return_obj = json.loads(r.text)
    page_info = return_obj[0]
    total_size = page_info['total']
    print('total records: ' + str(total_size))
    print('page size: ' + str(page_size))

    indicator_array = []
    while page_no <= round(total_size/page_size, 0):
        print('loading page ' + str(page_no) + '...')
        r_params = {'format': 'json', 'per_page': page_size, 'page': page_no}
        r = requests.get(request_url, params=r_params)
        return_obj = json.loads(r.text)

        results = return_obj[1]
        for res in results:
            ## print('id: ' + res['id'])
            ## print('name: ' + res['name'])
            if len(res['name']) > 0:
                indicator_array.append(res)
        page_no += 1
        
    print(str(len(indicator_array)) + ' indicators are loaded.')

    f = io.open(output_folder + '/worldbank_wdi_zh_indicators.json', 'w', encoding='utf8')
    ## json.dump(indicator_array, f, ensure_ascii=False)
    f.close()

    print(indicator_array[0])

    print("loading job is complete.")
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

def load_json_to_mongo():
    client = MongoClient()
    db = client['datanium']
    print(db.collection_names())
    indicator_col = db['indicator']
    print(indicator_col.find_one())

## load_data_to_json()
load_json_to_mongo()

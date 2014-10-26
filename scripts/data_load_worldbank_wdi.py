import requests
import json
import timeit
import io
from pymongo import MongoClient

class Static:
    request_url_country_zh = 'http://api.worldbank.org/zh/countries'
    request_url_indicator_zh = 'http://api.worldbank.org/zh/indicators'
    request_url_rowdata_zh = 'http://api.worldbank.org/zh/countries/all/indicators/'
    output_folder = '/Users/Puffy/Works/data_output'

def load_countries_to_json_zh():
    print("start loading country data(zh) from Worldbank to JSON file...")
    all_start = timeit.default_timer()
    static = Static()

    r_params = {'format': 'json', 'per_page': 1000, 'page': 1}
    r = requests.get(static.request_url_country_zh, params=r_params)
    return_obj = json.loads(r.text)

    results = return_obj[1]
    country_dict = {}
    for res in results:
        if len(res['name']) > 0:
            print(res['name'])
            country_rec = {'id': res['id'], 'iso2Code': res['iso2Code'], 'name': res['name'], 'region': res['region']['value']}
            country_dict[res['iso2Code']] = country_rec

    f = io.open(static.output_folder + '/worldbank_wdi_countries_zh.json', 'w', encoding='utf8')
    json.dump(country_dict, f, ensure_ascii=False)
    f.close()

    print("job is complete.")
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

def load_indicators_to_json_zh():
    print("start loading indicator data(zh) from Worldbank to JSON file...")
    all_start = timeit.default_timer()
    page_size = 1000
    page_no = 1
    static = Static()

    r_params = {'format': 'json', 'per_page': 10, 'page': 1}
    r = requests.get(static.request_url_indicator_zh, params=r_params)
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
        r = requests.get(static.request_url_indicator_zh, params=r_params)
        return_obj = json.loads(r.text)

        results = return_obj[1]
        for res in results:
            if len(res['name']) > 0:
                indicator_array.append(res)
        page_no += 1
    
    print(str(len(indicator_array)) + ' indicators are loaded.')

    f = io.open(static.output_folder + '/worldbank_wdi_indicators_zh.json', 'w', encoding='utf8')
    json.dump(indicator_array, f, ensure_ascii=False)
    f.close()

    print("job is complete.")
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

def load_rowdata_to_mongo_zh(is_incremental):
    print("start loading row data(zh) from Worldbank to JSON file...")
    all_start = timeit.default_timer()
    static = Static()

    f = io.open(static.output_folder + '/worldbank_wdi_indicators_zh.json', 'r', encoding='utf8')
    json_str = f.readline()
    indicator_array = json.loads(json_str)
    f = io.open(static.output_folder + '/worldbank_wdi_countries_zh.json', 'r', encoding='utf8')
    json_str = f.readline()
    country_dict = json.loads(json_str)
    f.close()
    client = MongoClient()
    db = client['datanium']
    dataset_col = db['dataset']
    if not is_incremental:
        dataset_col.drop()

    dataset_array = []
    for ind in indicator_array:
        page_size = 1000
        page_no = 1
        r_params = {'format': 'json', 'per_page': 10, 'page': 1}
        r = requests.get(static.request_url_rowdata_zh + ind['id'], params=r_params)
        indicator_key = ind['id'].replace('.', '_') + '_ZH'
        print('code: ' + r.encoding)
        return_obj = json.loads(r.text)
        page_info = return_obj[0]
        total_size = page_info['total']
        print(ind['name'] + ' total records: ' + str(total_size))
        print('page size: ' + str(page_size))

        while page_no <= round(total_size/page_size, 0):
            print('loading page ' + str(page_no) + '...')
            r_params = {'format': 'json', 'per_page': page_size, 'page': page_no}
            r = requests.get(static.request_url_rowdata_zh + ind['id'], params=r_params)
            return_obj = json.loads(r.text)

            results = return_obj[1]
            for res in results:
                value = res['value']
                if res['country']['id'] in country_dict:
                    region = country_dict[res['country']['id']]['region']
                    if value is not None:
                        value = float(res['value'])
                    dataset_rec = {'country': res['country']['value'], 'region': region, 'year': res['date'], indicator_key : value}
                    dataset_array.append(dataset_rec)
                    pk = dataset_col.insert(dataset_rec)
            page_no += 1

    f = io.open(static.output_folder + '/worldbank_wdi_dataset_zh.json', 'w', encoding='utf8')
    json.dump(dataset_array, f, ensure_ascii=False)
    f.close()
    
    print("job is complete.")
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

def load_indicators_to_mongo_zh(is_incremental):
    print("start loading indicator data(zh) from JSON file to MongoDB...")
    all_start = timeit.default_timer()
    static = Static()
    f = io.open(static.output_folder + '/worldbank_wdi_zh_indicators.json', 'r', encoding='utf8')
    json_str = f.readline()
    indicator_array = json.loads(json_str)
    f.close()
    client = MongoClient()
    db = client['datanium']
    ## print(db.collection_names())
    indicator_col = db['indicator']
    if not is_incremental:
        indicator_col.drop()
    for ind in indicator_array:
        indicator_key = ind['id'].replace('.', '_') + '_ZH'
        data_type = 'number'
        if(ind['name'].find('百分比') > -1):
            data_type = 'percentage'
        topics = []
        for topic in ind['topics']:
            topics.append(topic['value'])
        indicator_rec = {'indicator_key': indicator_key, 'original_id': ind['id'], 'indicator_text': ind['name'], 'data_type': data_type, 'sourceOrganization': ind['sourceOrganization'], 'sourceNote': ind['sourceNote'], 'topics': topics, 'data_source': '世界发展指标', 'dimension': [{'dimension_key': 'year', 'dimension_text': '年'}, {'dimension_key': 'region', 'dimension_text': '洲'}, {'dimension_key': 'country', 'dimension_text': '国家'}]}
        pk = indicator_col.insert(indicator_rec)
        print(indicator_key + ' ' + ind['name'] + ' inserted.')
    print("job is complete.")
    print("total records: " + str(indicator_col.count()))
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

load_indicators_to_json_zh()
load_countries_to_json_zh()
load_indicators_to_mongo_zh(True)
load_rowdata_to_mongo_zh(True)

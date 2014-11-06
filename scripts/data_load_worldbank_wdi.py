import requests
import json
import timeit
import time
import io
import os
import itertools
from pymongo import MongoClient
from multiprocessing.dummy import Pool as ThreadPool
from functools import partial

class Static:
    request_url_country_zh = 'http://api.worldbank.org/zh/countries'
    request_url_indicator_zh = 'http://api.worldbank.org/zh/indicators'
    request_url_rowdata_zh = 'http://api.worldbank.org/zh/countries/all/indicators/'
    output_folder = '/Users/Puffy/Works/data_output'
    dataset_folder = '/20141106'
    database_name = 'datanium'
    indicator_col_name = 'indicator_new'
    dataset_col_name = 'dataset_new'
    mongo_url = 'localhost'
    mongo_port = 27017

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
    page_size = 2000
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
    
def load_indicators_to_mongo_zh(is_incremental):
    print("start loading indicator data(zh) from JSON file to MongoDB...")
    all_start = timeit.default_timer()
    static = Static()
    f = io.open(static.output_folder + '/worldbank_wdi_indicators_zh.json', 'r', encoding='utf8')
    json_str = f.readline()
    indicator_array = json.loads(json_str)
    f.close()
    client = MongoClient(static.mongo_url, static.mongo_port)
    db = client[static.database_name]
    ## print(db.collection_names())
    indicator_col = db[static.indicator_col_name]
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

def load_rowdata_to_json_zh():
    print("start loading row data(zh) to JSON file...")
    all_start = timeit.default_timer()
    static = Static()
    
    f = io.open(static.output_folder + '/worldbank_wdi_indicators_zh.json', 'r', encoding='utf8')
    json_str = f.readline()
    indicator_array = json.loads(json_str)
    f = io.open(static.output_folder + '/worldbank_wdi_countries_zh.json', 'r', encoding='utf8')
    json_str = f.readline()
    country_dict = json.loads(json_str)
    f.close()

    counter = []
    mapfunc = partial(load_data_by_indicator, counter=counter, country_dict=country_dict, all_start=all_start)
    pool = ThreadPool(20)
    pool.map(mapfunc, indicator_array)
    pool.close() 
    pool.join()
    
    print("All the threads are completed. Total number is " + str(len(counter)) + "\n")
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

def load_data_by_indicator(indicator, counter, country_dict, all_start):
    static = Static()
    dataset_by_indicator = []
    page_size = 20000
    page_no = 1
    r_params = {'date': '1960:2013', 'format': 'json', 'per_page': 10, 'page': 1}
    r = requests.get(static.request_url_rowdata_zh + indicator['id'], params=r_params)
    indicator_key = indicator['id'].replace('.', '_') + '_ZH'
    return_obj = json.loads(r.text)
    page_info = return_obj[0]
    total_size = page_info['total']
    print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime()) + " >>> " + indicator['name'] + " total " + str(total_size) + "\n")
    ## print('page size: ' + str(page_size))

    while page_no <= round(total_size/page_size, 0):
        ## print('loading page ' + str(page_no) + '...')
        r_params = {'date': '1960:2013', 'format': 'json', 'per_page': page_size, 'page': page_no}
        r = requests.get(static.request_url_rowdata_zh + indicator['id'], params=r_params)
        if r.text is not None:
            return_obj = json.loads(r.text)
            results = return_obj[1]
            for res in results:
                value = res['value']
                if res['country']['id'] in country_dict:
                    region = country_dict[res['country']['id']]['region']
                    if value is not None:
                        value = float(res['value'])
                    dataset_rec = {'country': res['country']['value'], 'region': region, 'year': int(res['date']), indicator_key: value, 'load_key': 'WDI_ZH' + str(time.strftime("%Y%m%d"))}
                    dataset_by_indicator.append(dataset_rec)
                    counter.append(1)
                    ## pk = dataset_col.insert(dataset_rec)
        page_no += 1

    if len(dataset_by_indicator) > 0:
        directory = static.output_folder + '/' + str(time.strftime("%Y%m%d"))
        if not os.path.exists(directory):
            os.makedirs(directory)
        f = io.open(directory + '/WDI_' + indicator_key + '.json', 'w', encoding='utf8')
        json.dump(dataset_by_indicator, f, ensure_ascii=False)
        f.close()
    
    print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime()) + " >>> " + indicator['id'] + '/' + indicator['name'] + " time cost: " + str(round(timeit.default_timer() - all_start)) + "s. " + "total record number: " + str(len(counter)) + "\n")

def load_rowdata_to_mongo_zh(is_incremental):
    print("start loading row data(zh) from JSON file to MongoDB...")
    all_start = timeit.default_timer()
    static = Static()
    
    client = MongoClient(static.mongo_url, static.mongo_port)
    db = client[static.database_name]
    dataset_col = db[static.dataset_col_name]
    if not is_incremental:
        dataset_col.drop()
    
    f = io.open(static.output_folder + '/worldbank_wdi_indicators_zh.json', 'r', encoding='utf8')
    json_str = f.readline()
    indicator_array = json.loads(json_str)
    f.close()

    ## dataset_array = []
    counter = []
    mapfunc = partial(insert_by_indicator, counter=counter, dataset_col=dataset_col, all_start=all_start)
    pool = ThreadPool(10)
    pool.map(mapfunc, indicator_array)
    pool.close() 
    pool.join()
    
    print("All the threads are completed. Total number is " + str(len(counter)) + "\n")
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

def insert_by_indicator(indicator, counter, dataset_col, all_start):
    static = Static()
    print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime()) + " >>> " + indicator['name'] + "\n")
    
    indicator_key = indicator['id'].replace('.', '_') + '_ZH'
    json_str = None
    try:
        f = io.open(static.output_folder + static.dataset_folder + '/WDI_' + indicator_key + '.json', 'r', encoding='utf8')
        json_str = f.readline()
    except FileNotFoundError:
        print(indicator['name'] + ' has no data.')
    if json_str is not None:
        dataset_array = json.loads(json_str)
        for dataset_rec in dataset_array:
            doc = dataset_col.find_one({"year": dataset_rec['year'], "region": dataset_rec['region'], "country": dataset_rec['country']})
            if doc is not None:
                dataset_col.update({'_id': doc['_id']}, {'$set':{indicator_key: dataset_rec[indicator_key]}})
            else:
                pk = dataset_col.insert(dataset_rec)                
            counter.append(1)
    
    print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime()) + " >>> " + indicator['id'] + '/' + indicator['name'] + " time cost: " + str(round(timeit.default_timer() - all_start)) + "s. " + "total record number: " + str(len(counter)) + "\n")

if __name__ == '__main__':
    ## load_countries_to_json_zh()
    ## load_indicators_to_json_zh()
    ## load_indicators_to_mongo_zh(False)
    ## load_rowdata_to_json_zh()
    load_rowdata_to_mongo_zh(False)
    

# -*- coding: utf-8 -*-
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
    # output_folder = '/Users/Puffy/Works/data_output/WDI/ZH'
    output_folder = 'D:/tmp/data_output/WDI/ZH'
    dataset_folder = '/20170711'
    dataset_bydim_folder = '/by_dim'
    database_name = 'datanium'
    indicator_col_name = 'indicator_new'
    country_col_name = 'country'
    dataset_col_name = 'dataset_new'
    date_range = '1960:2017'
    mongo_url = 'localhost'
    # mongo_url = 'www.dtnium.com'
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
            country_dict[res['name']] = country_rec

    f = io.open(static.output_folder + '/worldbank_wdi_countries_zh.json', 'w', encoding='utf8', errors='ignore')
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

    f = io.open(static.output_folder + '/worldbank_wdi_indicators_zh.json', 'w', encoding='utf8', errors='ignore')
    json.dump(indicator_array, f, ensure_ascii=False)
    f.close()

    print("job is complete.")
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')
    
def load_indicators_to_mongo_zh(is_incremental):
    print("start loading indicator data(zh) from JSON file to MongoDB...")
    all_start = timeit.default_timer()
    static = Static()
    f = io.open(static.output_folder + '/worldbank_wdi_indicators_zh.json', 'r', encoding='utf8', errors='ignore')
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
        indicator_rec = {'indicator_key': indicator_key, 'original_id': ind['id'], 'indicator_text': ind['name'], 'data_type': data_type, 'sourceOrganization': ind['sourceOrganization'], 'sourceNote': ind['sourceNote'], 'topics': topics, 'data_source': '世界发展指标', 'dimension': [{'dimension_key': 'year', 'dimension_text': '年'}, {'dimension_key': 'region', 'dimension_text': '区域'}, {'dimension_key': 'country', 'dimension_text': '国家'}]}
        pk = indicator_col.insert(indicator_rec)
        print(indicator_key + ' ' + ind['name'] + ' inserted.')
    print("job is complete.")
    print("total records: " + str(indicator_col.count()))
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

def load_rowdata_to_json_zh():
    print("start loading row data(zh) to JSON file...")
    all_start = timeit.default_timer()
    static = Static()
    
    f = io.open(static.output_folder + '/worldbank_wdi_indicators_zh.json', 'r', encoding='utf8', errors='ignore')
    json_str = f.readline()
    indicator_array = json.loads(json_str)
    f = io.open(static.output_folder + '/worldbank_wdi_countries_zh.json', 'r', encoding='utf8', errors='ignore')
    json_str = f.readline()
    country_dict = json.loads(json_str)
    f.close()

    counter = []
    mapfunc = partial(load_data_by_indicator, counter=counter, country_dict=country_dict, all_start=all_start)
    pool = ThreadPool(12)
    pool.map(mapfunc, indicator_array)
    pool.close() 
    pool.join()
    
    print("All the threads are completed. Total number is " + str(len(counter)) + "\n")
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

def load_data_by_indicator(indicator, counter, country_dict, all_start):
    static = Static()
    dataset_by_indicator = []
    page_size = 10000
    page_no = 1
    r_params = {'date': static.date_range, 'format': 'json', 'per_page': 10, 'page': 1}
    indicator_key = indicator['id'].replace('.', '_') + '_ZH'
    try:
        return_obj = requests.get(static.request_url_rowdata_zh + indicator['id'], params=r_params).json()
        page_info = return_obj[0]
    except:
        print("Error: " + indicator_key + " / " + indicator['name'])
        return
    total_size = page_info['total']
    print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime()) + " >>> " + indicator['name'] + " total " + str(total_size) + "\n")
    ## print('page size: ' + str(page_size))

    while page_no <= round(total_size/page_size, 0):
        # print('loading page ' + str(page_no) + '...')
        r_params = {'date': static.date_range, 'format': 'json', 'per_page': page_size, 'page': page_no}
        try:
            return_obj = requests.get(static.request_url_rowdata_zh + indicator['id'], params=r_params).json()
            results = return_obj[1]
            for res in results:
                value = res['value']
                if res['country']['value'] in country_dict:
                    region = country_dict[res['country']['value']]['region']
                    if value is not None:
                        value = float(res['value'])
                    dataset_rec = {'country': res['country']['value'], 'region': region, 'year': int(res['date']), indicator_key: value, 'load_key': 'WDI_ZH' + str(time.strftime("%Y%m%d"))}
                    dataset_by_indicator.append(dataset_rec)
                    counter.append(1)
                    ## pk = dataset_col.insert(dataset_rec)
        except KeyError:
            print("Key Error: " + indicator_key + " / " + indicator['name'])
            print(return_obj)
        except ValueError:
            print("Value Error: " + indicator_key + " / " + indicator['name'])
        page_no += 1

    if len(dataset_by_indicator) > 0:
        directory = static.output_folder + '/' + str(time.strftime("%Y%m%d"))
        if not os.path.exists(directory):
            os.makedirs(directory)
        f = io.open(directory + '/WDI_' + indicator_key + '.json', 'w', encoding='utf8', errors='ignore')
        json.dump(dataset_by_indicator, f, ensure_ascii=False)
        f.close()
    
    print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime()) + " >>> " + indicator_key + '/' + indicator['name'] + " time cost: " + str(round(timeit.default_timer() - all_start)) + "s. " + "total record number: " + str(len(counter)) + "\n")

def convert_rowdata_to_dim_lvl():
    print("start converting row data(zh) from to Dimension level...")
    all_start = timeit.default_timer()
    static = Static()
    bydim_dir = static.output_folder + static.dataset_bydim_folder
    dataset_dir = static.output_folder + static.dataset_folder
    ## clean up folder
    for file in os.listdir(bydim_dir):
        file_path = os.path.join(bydim_dir, file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(e)

    ## load data by indicator
    for idx, file in enumerate(os.listdir(dataset_dir)):
        file_path = os.path.join(dataset_dir, file)
        print("loading " + str(file_path) + ".\n")
        if os.path.isfile(file_path):
            f = io.open(file_path, 'r', encoding='utf8', errors='ignore')
            json_str = f.readline()
            dataset_array = json.loads(json_str)
            f.close()
            for rec in dataset_array:
                indicator_key = os.path.splitext(file)[0][4:]
                ## print(indicator_key)
                if rec[indicator_key] is not None:
                    year = str(rec['year'])
                    region = rec['region'] if rec['region'] is not None and rec['region'] != '' else 'noregion'
                    country = rec['country']
                    data_key = year + '_' + region + '_' + country
                    data_bydim_path = bydim_dir + '/' + data_key + '.json'
                    if os.path.isfile(data_bydim_path):
                        f = io.open(data_bydim_path, 'r+', encoding='utf8', errors='ignore')
                        json_data = json.load(f)
                        json_data[indicator_key] = rec[indicator_key]
                        f.seek(0)
                        f.write(json.dumps(json_data, ensure_ascii=False))
                        f.truncate()
                    else:
                        f = io.open(data_bydim_path, 'w', encoding='utf8', errors='ignore')
                        json.dump(rec, f, ensure_ascii=False)
                    f.close()
        print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime()) + " >>> " + str(idx) + '.' + str(file_path) + " time cost: " + str(round(timeit.default_timer() - all_start)) + "s.\n")
    
    ## print("All the threads are completed. Total number is " + str(len(counter)) + "\n")
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

def load_rowdata_to_mongo_zh(is_incremental):
    print("start loading row data(zh) from JSON file to MongoDB...")
    all_start = timeit.default_timer()
    static = Static()
    bydim_dir = static.output_folder + static.dataset_bydim_folder
    
    client = MongoClient(static.mongo_url, static.mongo_port)
    db = client[static.database_name]
    dataset_col = db[static.dataset_col_name]
    if not is_incremental:
        dataset_col.drop()

    file_path_array = []
    for idx, file in enumerate(os.listdir(bydim_dir)):
        file_path = os.path.join(bydim_dir, file)
        if os.path.isfile(file_path):
            file_path_array.append(file_path)
    print(str(len(file_path_array)) + " files are loaded")

    counter = []
    mapfunc = partial(insert_by_dim, counter=counter, dataset_col=dataset_col, all_start=all_start)
    pool = ThreadPool(12)
    pool.map(mapfunc, file_path_array)
    pool.close() 
    pool.join()
    
    print("All the threads are completed. Total number is " + str(len(counter)) + "\n")
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

def insert_by_dim(file_path, counter, dataset_col, all_start):
    static = Static()
    print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime()) + " >>> " + file_path + "\n")
    
    try:
        f = io.open(file_path, 'r', encoding='utf8', errors='ignore')
        json_data = json.load(f)
    except FileNotFoundError:
        print(file_path + ' file not found.')
    if json_data is not None:
        try:
            counter.append(1)
            pk = dataset_col.insert(json_data)
        except ValueError:
            print("Value Error: " + indicator_key + " / " + indicator['name'])
    
    print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime()) + " >>> " + file_path + " time cost: " + str(round(timeit.default_timer() - all_start)) + "s. " + "total record number: " + str(len(counter)) + "\n")

def load_countries_to_mongo_zh(is_incremental):
    print("start loading country data(zh) from JSON file to MongoDB...")
    all_start = timeit.default_timer()
    static = Static()
    f = io.open(static.output_folder + '/worldbank_wdi_countries_zh.json', 'r', encoding='utf8', errors='ignore')
    json_str = f.readline()
    country_array = json.loads(json_str)
    f.close()
    client = MongoClient(static.mongo_url, static.mongo_port)
    db = client[static.database_name]
    ## print(db.collection_names())
    country_col = db[static.country_col_name]
    indicator_col = db[static.indicator_col_name]
    dataset_col = db[static.dataset_col_name]
    if not is_incremental:
        country_col.drop()

    index = 0
    for co in country_array:
        if country_array[co]['region'] == '':
            continue
        index += 1
        country_name = co
        country_rec = {'country_name': country_name, 'indicators': []}
        
        pipeline = [{'$match':{'country': country_name}}, {'$group': {'_id': '$country'}}]
        
        for doc in indicator_col.find(None, ['indicator_key','indicator_text','data_source']):
            pipeline[1]['$group'][doc['indicator_key']] = {'$sum': '$' + doc['indicator_key']}
        ##print(pipeline)
        res = dataset_col.aggregate(pipeline)
        if len(res['result']) > 0:
            for doc in indicator_col.find(None, ['indicator_key','indicator_text','data_source']):
                if doc['indicator_key'] in res['result'][0]:
                    if res['result'][0][doc['indicator_key']] > 0:
                        country_rec['indicators'].append(doc)
            pk = country_col.insert(country_rec)
            print(str(index) + '. ' + country_name + '(' + str(len(country_rec['indicators'])) + ') inserted.')
    print("job is complete.")
    print("total records: " + str(country_col.count()))
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

if __name__ == '__main__':
    # load_countries_to_json_zh()
    # load_indicators_to_json_zh()
    # load_indicators_to_mongo_zh(False)
    # load_rowdata_to_json_zh()
    convert_rowdata_to_dim_lvl()
    ## load_rowdata_to_mongo_zh(False)
    # load_countries_to_mongo_zh(False)
    

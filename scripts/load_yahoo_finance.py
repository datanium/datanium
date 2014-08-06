import csv
import urllib.request
import timeit

all_start = timeit.default_timer()
start = timeit.default_timer()
print("start generating indicator script file...")

newlines = []
newlines.append('d_year={"dimension_key":"year", "dimension_text":"Year"};')
newlines.append('d_month={"dimension_key":"month", "dimension_text":"Year/Month"};')
##newlines.append('d_day={"dimension_key":"day", "dimension_text":"Day"};')
newlines.append('d_stock_symbol={"dimension_key":"stock_symbol", "dimension_text":"Symbol (Stock)"};')
newlines.append('d_stock_name={"dimension_key":"stock_name", "dimension_text":"Name (Stock)"};')
newlines.append('d_stock_ipoyear={"dimension_key":"stock_ipoyear", "dimension_text":"IPO Year (Stock)"};')
newlines.append('d_stock_sector={"dimension_key":"stock_sector", "dimension_text":"Sector (Stock)"};')
newlines.append('d_stock_industry={"dimension_key":"stock_industry", "dimension_text":"Industry (Stock)"};')

newlines.append('db.indicator.insert({"indicator_key":"stock_open", "indicator_text":"Open (Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')
newlines.append('db.indicator.insert({"indicator_key":"stock_close", "indicator_text":"Close (Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')
##newlines.append('db.indicator.insert({"indicator_key":"stock_adj_close", "indicator_text":"Adjust Close (Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')
newlines.append('db.indicator.insert({"indicator_key":"stock_high", "indicator_text":"High (Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')
newlines.append('db.indicator.insert({"indicator_key":"stock_low", "indicator_text":"Low (Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')
newlines.append('db.indicator.insert({"indicator_key":"stock_volume", "indicator_text":"Volume (Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')

with open('control_stock.js','w') as f:
    f.write("\n".join(newlines))
f.close()

print("generating indicator script file is complete.")
print("block/all cost: " + str(round(timeit.default_timer() - start)) + 's /' + str(round(timeit.default_timer() - all_start)) + 's')
start = timeit.default_timer()
print("start loading NYSE company info...")

stock_dim = ['stock_symbol','stock_name','LastSale','MarketCap','ADR TSO','stock_ipoyear','stock_sector','stock_industry','Summary Quote']
stock_list = []

with open('companylist_nyse.csv', 'rt') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
##            if idx > 100:
##                break
            stock = {stock_dim[0]: row[0],
                     stock_dim[1]: row[1],
                     stock_dim[5]: row[5],
                     stock_dim[6]: row[6],
                     stock_dim[7]: row[7]}
            stock_list.append(stock)
##    print(stock_list)

print("loading Nasdaq company info is complete.")
print("block/all cost: " + str(round(timeit.default_timer() - start)) + 's /' + str(round(timeit.default_timer() - all_start)) + 's')
start = timeit.default_timer()

newlines = []
newlines.append('year,month,stock_symbol,stock_name,stock_ipoyear,stock_sector,stock_industry,stock_open,stock_close,stock_high,stock_low,stock_volume')

for idx, stock in enumerate(stock_list):
    print("block/all cost: " + str(round(timeit.default_timer() - start)) + 's /' + str(round(timeit.default_timer() - all_start)) + 's')
    start = timeit.default_timer()
    print("start loading " + stock['stock_name'])
    stock_url = 'http://ichart.finance.yahoo.com/table.csv?s=' + stock['stock_symbol'] + '&a=01&b=1&c=1990&d=12&e=31&f=2014&g=m'
    print(stock_url)
    try: 
        response = urllib.request.urlopen(stock_url)
    except Exception as err: 
        print(stock['stock_name'] + "is skipped.")
        continue
    inputstream = response.read()
    csvstr = str(inputstream).strip("b'")
    lines = csvstr.split("\\n")
    for i, line in enumerate(lines):
        if i > 0 and len(line) > 0:
            line_array = line.split(',')
##            print(line_array)
            if len(line_array[0].strip()) > 0:
                date_array = line_array[0].split('-')
            newline = date_array[0] + ',' + date_array[0] + '-' + date_array[1] + ',' + stock['stock_symbol'] + ',' + stock['stock_name'] + ',' + stock['stock_ipoyear'] + ',' + stock['stock_sector'] + ',' + stock['stock_industry'] + ',' + line_array[1] + ',' + line_array[4] + ',' + line_array[2] + ',' + line_array[3] + ',' + line_array[5]
            newlines.append(newline)
    print("output size: " + str(len(newlines)))

print("loading NYSE company info is complete.")
print("block/all cost: " + str(round(timeit.default_timer() - start)) + 's /' + str(round(timeit.default_timer() - all_start)) + 's')
start = timeit.default_timer()
print("start writing output csv...")

with open('dataset_stock.csv','w') as output_file:
    output_file.write("\n".join(newlines))
output_file.close()

print("writing output csv is complete.")
print("block/all cost: " + str(round(timeit.default_timer() - start)) + 's /' + str(round(timeit.default_timer() - all_start)) + 's')
print("total stocks: " + str(len(stock_list)))
print("total records: " + str(len(newlines)))

import csv

print("start generating indicator script file...")

newlines = []
newlines.append('d_year={"dimension_key":"year", "dimension_text":"Year"};')
newlines.append('d_month={"dimension_key":"month", "dimension_text":"Month"};')
newlines.append('d_day={"dimension_key":"day", "dimension_text":"Day"};')
newlines.append('d_stock_symbol={"dimension_key":"stock_symbol", "dimension_text":"Symbol(Stock)"};')
newlines.append('d_stock_name={"dimension_key":"stock_name", "dimension_text":"Name(Stock)"};')
newlines.append('d_stock_ipoyear={"dimension_key":"stock_ipoyear", "dimension_text":"IPO Year(Stock)"};')
newlines.append('d_stock_sector={"dimension_key":"stock_sector", "dimension_text":"Sector(Stock)"};')
newlines.append('d_stock_industry={"dimension_key":"stock_industry", "dimension_text":"Industry(Stock)"};')

newlines.append('db.indicator.insert({"indicator_key":"stock_open", "indicator_text":"Open(Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_day, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')
newlines.append('db.indicator.insert({"indicator_key":"stock_close", "indicator_text":"Close(Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_day, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')
newlines.append('db.indicator.insert({"indicator_key":"stock_adj_close", "indicator_text":"Adjust Close(Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_day, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')
newlines.append('db.indicator.insert({"indicator_key":"stock_max", "indicator_text":"Maximum(Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_day, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')
newlines.append('db.indicator.insert({"indicator_key":"stock_min", "indicator_text":"Minimum(Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_day, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')
newlines.append('db.indicator.insert({"indicator_key":"stock_volume", "indicator_text":"Volume(Stock)", "data_source":"Yahoo Finance", "data_type":"number", "dimension":[d_year, d_month, d_day, d_stock_symbol, d_stock_name, d_stock_ipoyear, d_stock_sector, d_stock_industry]});')

with open('stock_indicators.txt','w') as f:
    f.write("\n".join(newlines))

print("generating indicator script file is complete...")

print("start loading Nasdaq company info...")

stock_dim = ['stock_symbol','stock_name','LastSale','MarketCap','ADR TSO','stock_ipoyear','stock_sector','stock_industry','Summary Quote']
stock_list = []

with open('companylist_nyse.csv', 'rt') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
            stock = {stock_dim[0]: row[0],
                     stock_dim[1]: row[1],
                     stock_dim[5]: row[5],
                     stock_dim[6]: row[6],
                     stock_dim[7]: row[7]}
            print(idx)
            stock_list.append(stock)
            if idx > 10:
                break
    print(stock_list)

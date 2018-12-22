import quandl
import pandas as pd
import json
from sqlalchemy import create_engine,inspect
import pymysql
pymysql.install_as_MySQLdb()
# Import and establish Base for which classes will be constructed 
from sqlalchemy.ext.declarative import declarative_base
# Import modules to declare columns and column data types
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import Session
import json
from config import apikey
import datetime
quandl.ApiConfig.api_key = apikey
Base = declarative_base()
engine = create_engine("sqlite:///stocks.sqlite")


class tickers(Base):
    __tablename__ = 'stockdata'
    id = Column(Integer, primary_key=True)
    ticker = Column(String(255))
    date = Column(String(255))
    open = Column(Integer)
    high = Column(Integer)
    low = Column(Integer)
    close = Column(Integer)
    volume = Column(Integer)
    ex_dividend = Column(Integer)
    split_ration = Column(Integer)
    adj_open = Column(Integer)
    adj_high = Column(Integer)
    adj_low = Column(Integer)
    adj_close = Column(Integer)
    adj_volume = Column(Integer)


def stockgetter(stockticker):
    #session = Session(bind=engine)
    tickerprep = "WIKI/" + stockticker  
    mydata = quandl.get(tickerprep)
    #,start_date="2018-01-1"
    #, end_date="2018-11-30"
    df = pd.DataFrame(mydata)
    df =df.reset_index()
    df['ticker'] = stockticker
    df.to_sql(stockticker, con=engine, if_exists='replace')
    data_df = pd.read_sql_query(f'SELECT * FROM {stockticker}',con =engine,index_col = "Date")
    data_df = data_df.reset_index()
    data_dict = data_df.to_dict()

    dates_fixed = list(data_dict['Date'].values())
    ticker_fixed = list(data_dict['ticker'].values())
    open_fixed = list(data_dict['Open'].values())
    high_fixed = list(data_dict['High'].values())
    low_fixed = list(data_dict['Low'].values())
    close_fixed = list(data_dict['Close'].values())
    volume_fixed = list(data_dict['Volume'].values())

    stock_dict = {"date":dates_fixed,
                "ticker":ticker_fixed,
                 "open":open_fixed,
                 "high":high_fixed,
                 "low":low_fixed,
                 "close":close_fixed,
                 "volume":volume_fixed}
    
    result_dict = []
    for i in range(0,len(dates_fixed)):
        dict = []
        date = datetime.datetime(int(dates_fixed[i][0:4]), int(dates_fixed[i][5:7]), int(dates_fixed[i][8:10]), 0, 0).timestamp()
        dict.append(int(date)*1000)
        dict.append(open_fixed[i])
        dict.append(high_fixed[i])
        dict.append(low_fixed[i])
        dict.append(close_fixed[i])
        dict.append(volume_fixed[i])
        result_dict.append(dict)

    return result_dict
   

def getticker(ticker):
    ticker_checker = ticker
    try :
        dbchecker= engine.execute(f'SELECT ticker FROM {ticker}  LIMIT 1').fetchall()
        tickchecker =dbchecker[0][0]
    except :
        tickchecker = "broken"
    if ticker_checker == tickchecker :
    
        data_df = pd.read_sql_query(f'SELECT * FROM {ticker}',con =engine,index_col = "Date")
        data_df = data_df.reset_index()
        data_dict = data_df.to_dict()
        dates_fixed = list(data_dict['Date'].values())
        ticker_fixed = list(data_dict['ticker'].values())
        open_fixed = list(data_dict['Open'].values())
        high_fixed = list(data_dict['High'].values())
        low_fixed = list(data_dict['Low'].values())
        close_fixed = list(data_dict['Close'].values())
        volume_fixed = list(data_dict['Volume'].values())
        stock_dict = {"date":dates_fixed,
                    "ticker":ticker_fixed,
                     "open":open_fixed,
                     "high":high_fixed,
                     "low":low_fixed,
                     "close":close_fixed,
                     "volume":volume_fixed}

        result_dict = []
        for i in range(0,len(dates_fixed)):
            dict = []
            date = datetime.datetime(int(dates_fixed[i][0:4]), int(dates_fixed[i][5:7]), int(dates_fixed[i][8:10]), 0, 0).timestamp()
            dict.append(int(date)*1000)
            dict.append(open_fixed[i])
            dict.append(high_fixed[i])
            dict.append(low_fixed[i])
            dict.append(close_fixed[i])
            dict.append(volume_fixed[i])
            result_dict.append(dict)

        return result_dict

    
    else :
        return stockgetter(ticker_checker)
        
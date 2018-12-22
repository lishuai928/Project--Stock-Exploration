from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import stock
import requests
import quandl
import pandas as pd
import json
from sqlalchemy import create_engine,inspect
import pymysql
pymysql.install_as_MySQLdb()
# Import and establish Base for which classes will be constructed 
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
Base = declarative_base()
engine = create_engine("sqlite:///stocks.sqlite")

app = Flask(__name__)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")
    

@app.route("/<ticker>")
def tickers(ticker):
    stock_data = stock.stockgetter(ticker)
    return jsonify(stock_data)

@app.route("/earnings/<ticker>")
def earning(ticker):
    link = f'https://api.iextrading.com/1.0/stock/{ticker}/earnings'
    f = requests.get(link)
    stuff = f.json()
    return jsonify(stuff)


@app.route("/interest/rates")
def usInterest():
    interest_df = pd.read_csv("data/history.csv")
    interest = interest_df.to_dict()
    return jsonify(interest)


if __name__ == "__main__":
    app.run()

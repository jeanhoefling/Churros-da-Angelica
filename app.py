import os
import sqlite3
from flask import Flask, flash, redirect, render_template, request

app = Flask(__name__)

# Database
conn = sqlite3.connect("churros.db", check_same_thread=False)
db = conn.cursor()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/vendas")
def vendas():
    return render_template("vendas.html")
    
@app.route("/pedidos", methods=["GET", "POST"])
def pedidos():
    if request.method == "POST":
        return render_template("pedidos.html")
    else:
        return render_template("pedidos.html")
    
if __name__ == "__main__":
    app.run(debug=True)
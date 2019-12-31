import pickle
import sys
from builtins import dict

import pandas as pd
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder='./aqi-frontend/build/static',
            template_folder='./aqi-frontend/build')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def predict_aqi(data: dict, filename: str) -> float:
    df = pd.DataFrame([data])
    model = pickle.load(open(filename, 'rb'))
    return model.predict(df)[0]


@app.route('/')
@cross_origin()
def index() -> str:
    # Just verify if server is up
    return "Hello World"


@app.route('/aqi-frontend')
@cross_origin()
def render_frontend():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
@cross_origin()
def predict() -> dict:
    try:
        formData = request.json
        print(formData)
        result = str(predict_aqi(formData, 'xgb.pkl'))
    except:
        print(sys.exc_info())
        result = 'Server error'
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)

import pickle
import sys
from builtins import dict

import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)


def predict_aqi(data: dict, filename: str) -> float:
    df = pd.DataFrame([data])
    model = pickle.load(open(filename, 'rb'))
    return model.predict(df)[0]


@app.route('/')
def index() -> str:
    # Just verify if server is up
    return "Hello World"


@app.route('/predict', methods=['GET'])
def predict() -> dict:
    try:
        cols = ['T', 'TM', 'Tm', 'H', 'PP', 'VV', 'V', 'VM']
        input_dict = {}
        for col in cols:
            input_dict[col] = float(request.args[col])
        if None not in input_dict.items():
            result = str(predict_aqi(input_dict, 'xgb.pkl'))
        else:
            result = {
                'success': False,
                'message': 'Invalid inputs'
            }
    except:
        print(sys.exc_info())
        result = {
            'success': False,
            'message': 'Server error'
        }
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)

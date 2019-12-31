import os

import numpy as np
import pandas as pd


class AqiPreprocessing:
    def preprocess(self, filenames: list) -> dict:
        yearly_dict = {}
        for name in filenames:
            print(f"Preprocessing {name}")
            day_average_list = []
            for rows in pd.read_csv(name, chunksize=24):
                day_total = 0
                day_data = []
                df = pd.DataFrame(data=rows)
                for index, row in df.iterrows():
                    day_data.append(row['PM2.5'])
                hour_count = 0
                for val in day_data:
                    if type(val) is float or type(val) is int:
                        day_total = day_total + val
                        hour_count = hour_count + 1
                    elif type(val) is str:
                        val = val.strip()
                        if val != 'NoData' and val != 'PwrFail' and val != '---' and val != 'InVld':
                            temp = float(val)
                            day_total = day_total + temp
                            hour_count = hour_count + 1
                day_avg = (day_total / hour_count) if (day_total > 0) else 0
                day_average_list.append(day_avg)
                yearly_dict[name] = day_average_list
        return yearly_dict

    def clean_combined_data(self, combined_data: pd.DataFrame) -> pd.DataFrame:
        combined_data = combined_data.replace('', np.nan)
        combined_data.dropna(how='any', inplace=True)
        return combined_data

    def save_combined_data(self, combined_data: pd.DataFrame, folder_name: str, file_name: str) -> None:
        if not os.path.exists(folder_name):
            os.makedirs(folder_name)
        combined_data.to_csv(f'{folder_name}/{file_name}', index=None)

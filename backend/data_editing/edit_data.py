import pandas as pd

"""This file was used to fix a small bug in aircraft types."""
def edit_aircraft_data():
    df = pd.read_csv("other_data/plane_data.csv")

    for i, row in df.iterrows():
        if type(row['model']) is str:
            if "&nbsp" in row['model']:
                df.at[i, 'model'] = row['model'].split("&nbsp")[0]
        else:
            df.drop(i, inplace=True)

    df.to_csv('other_data/plane-data.csv', header=True, index=False)


edit_aircraft_data()

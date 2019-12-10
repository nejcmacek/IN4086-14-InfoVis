import pandas as pd

airports = pd.read_csv('other_data/airport_data.csv', index_col='airport')
flights = pd.read_csv('flight_data/flights-2018-05.csv')

del airports['notes']

for name, airport_row in airports.iterrows():
    print(name)
    for i, flight_row in flights.iterrows():
        if flight_row['ORIGIN'] == name:
            airports.at[name, 'airport_name'] = flight_row['ORIGIN_CITY_NAME']
            break

print(airports)
airports.to_csv('other_data/airport-data.csv', header=True, index=True)

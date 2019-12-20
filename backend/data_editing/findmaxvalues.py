import pandas as pd
import glob

airports = pd.read_csv('other_data/airport_delay.csv', index_col='airport')
print(airports.median(axis=1).sort_values().to_string())

#all_files = glob.glob(r'flight_data' + '/*.csv')
#flights = pd.concat((pd.read_csv(f) for f in all_files))

#print(flights[flights['ORIGIN'] == 'OTH'].to_string())
#print(flights[flights['DEST'] == 'OTH'].to_string())
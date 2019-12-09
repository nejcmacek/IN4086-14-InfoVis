import pandas as pd
import glob

class DataHandler():
    """Loads all data upon starting the server"""
    def __init__(self):
        all_files = glob.glob(r'flight_data' + '/*.csv')
        self.flights = pd.concat((pd.read_csv(f) for f in all_files))
        self.flights = self.flights.sort_values(by = ['FL_DATE', 'DEP_TIME'])
        self.planes = pd.read_csv('other_data/plane_data.csv', index_col='tail_number')
        self.airports = pd.read_csv('other_data/airport_data.csv')

    """Finds a random tail number and returns the first amount flights of that plane plus some additional information"""
    def randomFlightHistory(self, amount):
        flight = self.flights.sample(n=1)
        tail_number = flight['TAIL_NUM'].values[0]
        carrier = flight['OP_CARRIER'].values[0]

        selected_flights = self.flights[self.flights["TAIL_NUM"] == tail_number]
        selected_flights = selected_flights[0:amount].filter(items=['FL_DATE', 'ORIGIN', 'DEST', 'DEP_TIME', 'ARR_TIME'])

        plane_info = self.planes.loc[tail_number,:]

        return {**{'tail_num': tail_number, 'op_carrier': carrier}, **selected_flights.to_dict('list'), **plane_info.to_dict()}

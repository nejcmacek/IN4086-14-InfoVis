import math
import glob
import pandas as pd

airports = pd.read_csv('other_data/airport_data.csv', index_col='airport')

all_files = glob.glob(r'flight_data' + '/*.csv')

months = ['may', 'june', 'juli', 'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march', 'april']

for ap, _ in airports.iterrows():
    print(ap)
    month = 0

    year_total = 0
    year_divide_by = 0.0001

    for f in all_files:
        current_month = months[month]
        month += 1
        flights = pd.read_csv(f)
        flights = flights.sort_values(by=['FL_DATE'])
        airport_flights = pd.concat([flights[flights['ORIGIN'] == ap], flights[flights['DEST'] == ap]])

        month_total = 0
        month_divide_by = 0.0001

        days = airport_flights.FL_DATE.unique()

        for day in days:
            day_total = 0
            day_divide_by = 0.0001

            day_flights = airport_flights[airport_flights['FL_DATE'] == day]

            for i, row in day_flights.iterrows():
                if row['ORIGIN'] == ap:
                    if not math.isnan(row['DEP_DELAY']):
                        if row['DEP_DELAY'] > 0:
                            day_total = day_total + row['DEP_DELAY']
                            month_total = month_total + row['DEP_DELAY']
                            year_total = year_total + row['DEP_DELAY']

                        day_divide_by, month_divide_by, year_divide_by = day_divide_by+1, month_divide_by+1, year_divide_by+1
                else:
                    if not math.isnan(row['ARR_DELAY']):
                        if row['ARR_DELAY'] > 0:
                            day_total = day_total + row['ARR_DELAY']
                            month_total = month_total + row['ARR_DELAY']
                            year_total = year_total + row['ARR_DELAY']

                        day_divide_by, month_divide_by, year_divide_by = day_divide_by + 1, month_divide_by + 1, year_divide_by + 1

            airports.at[ap, day] = day_total/day_divide_by

        airports.at[ap, current_month] = month_total / month_divide_by

    airports.at[ap, 'year'] = year_total / year_divide_by
    print(airports)

airports = airports.fillna(0.0)
airports.to_csv('other_data/airport_delay.csv', header=True, index=True)

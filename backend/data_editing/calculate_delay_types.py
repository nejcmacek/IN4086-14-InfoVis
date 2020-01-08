import math
import glob
import pandas as pd

"""
This file was used to calculate the average delay for each airport over all days, months and year.
This is done for all types of delay.
The code is very messy: this was not fixed since this script was only used once to create the new files.
The result is saved in different delay files.
"""
airports = pd.read_csv('other_data/airport_data.csv', index_col='airport')
arrival = airports.copy()
departure = airports.copy()
carrier = airports.copy()
weather = airports.copy()
nas = airports.copy()
security = airports.copy()
late_aircraft = airports.copy()

all_files = glob.glob(r'flight_data' + '/*.csv')

months = ['may', 'june', 'juli', 'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march', 'april']

for ap, _ in airports.iterrows():
    print(ap)
    month = 0

    year_total_arrival, year_total_departure, year_total_carrier, year_total_weather, year_total_nas, year_total_security, year_total_late = 0, 0, 0, 0, 0, 0, 0
    year_divide_by = 0
    year_divide_by_ar = 0
    year_divide_by_dep = 0

    for f in all_files:
        current_month = months[month]
        month += 1
        flights = pd.read_csv(f)
        flights = flights.sort_values(by=['FL_DATE'])
        airport_flights = pd.concat([flights[flights['ORIGIN'] == ap], flights[flights['DEST'] == ap]])

        month_total_arrival, month_total_departure, month_total_carrier, month_total_weather, month_total_nas, month_total_security, month_total_late = 0, 0, 0, 0, 0, 0, 0
        month_divide_by = 0
        month_divide_by_ar = 0
        month_divide_by_dep = 0

        days = airport_flights.FL_DATE.unique()

        for day in days:
            day_total_arrival, day_total_departure, day_total_carrier, day_total_weather, day_total_nas, day_total_security, day_total_late = 0, 0, 0, 0, 0, 0, 0
            day_divide_by = 0
            day_divide_by_ar = 0
            day_divide_by_dep = 0

            day_flights = airport_flights[airport_flights['FL_DATE'] == day]

            for i, row in day_flights.iterrows():
                if row['ORIGIN'] == ap:
                    if not math.isnan(row['DEP_DELAY']):
                        if row['DEP_DELAY'] > 0:
                            day_total_departure = day_total_departure + row['DEP_DELAY']
                            month_total_departure = month_total_departure + row['DEP_DELAY']
                            year_total_departure = year_total_departure + row['DEP_DELAY']

                            if not math.isnan(row['CARRIER_DELAY']):
                                day_total_carrier = day_total_carrier + row['CARRIER_DELAY']
                                month_total_carrier = month_total_carrier + row['CARRIER_DELAY']
                                year_total_carrier = year_total_carrier + row['CARRIER_DELAY']

                            if not math.isnan(row['WEATHER_DELAY']):
                                day_total_weather = day_total_weather + row['WEATHER_DELAY']
                                month_total_weather = month_total_weather + row['WEATHER_DELAY']
                                year_total_weather = year_total_weather + row['WEATHER_DELAY']

                            if not math.isnan(row['NAS_DELAY']):
                                day_total_nas = day_total_nas + row['NAS_DELAY']
                                month_total_nas = month_total_nas + row['NAS_DELAY']
                                year_total_nas = year_total_nas + row['NAS_DELAY']

                            if not math.isnan(row['SECURITY_DELAY']):
                                day_total_security = day_total_security + row['SECURITY_DELAY']
                                month_total_security = month_total_security + row['SECURITY_DELAY']
                                year_total_security = year_total_security + row['SECURITY_DELAY']

                            if not math.isnan(row['LATE_AIRCRAFT_DELAY']):
                                day_total_late = day_total_late + row['LATE_AIRCRAFT_DELAY']
                                month_total_late = month_total_late + row['LATE_AIRCRAFT_DELAY']
                                year_total_late = year_total_late + row['LATE_AIRCRAFT_DELAY']

                        day_divide_by, month_divide_by, year_divide_by = day_divide_by + 1, month_divide_by + 1, year_divide_by + 1
                        day_divide_by_dep, month_divide_by_dep, year_divide_by_dep = day_divide_by_dep+1, month_divide_by_dep+1, year_divide_by_dep+1

                else:
                    if not math.isnan(row['ARR_DELAY']):
                        if row['ARR_DELAY'] > 0:
                            day_total_arrival = day_total_arrival + row['ARR_DELAY']
                            month_total_arrival = month_total_arrival + row['ARR_DELAY']
                            year_total_arrival = year_total_arrival + row['ARR_DELAY']

                            if not math.isnan(row['CARRIER_DELAY']):
                                day_total_carrier = day_total_carrier + row['CARRIER_DELAY']
                                month_total_carrier = month_total_carrier + row['CARRIER_DELAY']
                                year_total_carrier = year_total_carrier + row['CARRIER_DELAY']

                            if not math.isnan(row['WEATHER_DELAY']):
                                day_total_weather = day_total_weather + row['WEATHER_DELAY']
                                month_total_weather = month_total_weather + row['WEATHER_DELAY']
                                year_total_weather = year_total_weather + row['WEATHER_DELAY']

                            if not math.isnan(row['NAS_DELAY']):
                                day_total_nas = day_total_nas + row['NAS_DELAY']
                                month_total_nas = month_total_nas + row['NAS_DELAY']
                                year_total_nas = year_total_nas + row['NAS_DELAY']

                            if not math.isnan(row['SECURITY_DELAY']):
                                day_total_security = day_total_security + row['SECURITY_DELAY']
                                month_total_security = month_total_security + row['SECURITY_DELAY']
                                year_total_security = year_total_security + row['SECURITY_DELAY']

                            if not math.isnan(row['LATE_AIRCRAFT_DELAY']):
                                day_total_late = day_total_late + row['LATE_AIRCRAFT_DELAY']
                                month_total_late = month_total_late + row['LATE_AIRCRAFT_DELAY']
                                year_total_late = year_total_late + row['LATE_AIRCRAFT_DELAY']

                        day_divide_by, month_divide_by, year_divide_by = day_divide_by + 1, month_divide_by + 1, year_divide_by + 1
                        day_divide_by_ar, month_divide_by_ar, year_divide_by_ar = day_divide_by_ar+1, month_divide_by_ar+1, year_divide_by_ar+1

            if day_divide_by > 0:
                if day_divide_by_ar > 0:
                    arrival.at[ap, day] = day_total_arrival/day_divide_by_ar
                if day_divide_by_dep > 0:
                    departure.at[ap, day] = day_total_departure/day_divide_by_dep
                carrier.at[ap, day] = day_total_carrier/day_divide_by
                weather.at[ap, day] = day_total_weather/day_divide_by
                nas.at[ap, day] = day_total_nas/day_divide_by
                security.at[ap, day] = day_total_security/day_divide_by
                late_aircraft.at[ap, day] = day_total_late/day_divide_by

        if month_divide_by > 0:
            if month_divide_by_ar > 0:
                arrival.at[ap, current_month] = month_total_arrival / month_divide_by_ar
            if month_divide_by_dep > 0:
                departure.at[ap, current_month] = month_total_departure / month_divide_by_dep
            carrier.at[ap, current_month] = month_total_carrier / month_divide_by
            weather.at[ap, current_month] = month_total_weather / month_divide_by
            nas.at[ap, current_month] = month_total_nas / month_divide_by
            security.at[ap, current_month] = month_total_security / month_divide_by
            late_aircraft.at[ap, current_month] = month_total_late / month_divide_by

    if year_divide_by > 0:
        if year_divide_by_ar > 0:
            arrival.at[ap, 'year'] = year_total_arrival / year_divide_by_ar
        if year_divide_by_dep > 0:
            departure.at[ap, 'year'] = year_total_departure / year_divide_by_dep
        carrier.at[ap, 'year'] = year_total_carrier / year_divide_by
        weather.at[ap, 'year'] = year_total_weather / year_divide_by
        nas.at[ap, 'year'] = year_total_nas / year_divide_by
        security.at[ap, 'year'] = year_total_security / year_divide_by
        late_aircraft.at[ap, 'year'] = year_total_late / year_divide_by

    print(arrival)
    print(weather)

arrival, departure, carrier, weather, nas, security, late_aircraft = arrival.fillna(0.0), departure.fillna(0.0), carrier.fillna(0.0), weather.fillna(0.0), nas.fillna(0.0), security.fillna(0.0), late_aircraft.fillna(0.0)
arrival.to_csv('other_data/arrival_delay.csv', header=True, index=True)
departure.to_csv('other_data/departure_delay.csv', header=True, index=True)
carrier.to_csv('other_data/carrier_delay.csv', header=True, index=True)
weather.to_csv('other_data/weather_delay.csv', header=True, index=True)
nas.to_csv('other_data/nas_delay.csv', header=True, index=True)
security.to_csv('other_data/security_delay.csv', header=True, index=True)
late_aircraft.to_csv('other_data/late_aircraft_delay.csv', header=True, index=True)

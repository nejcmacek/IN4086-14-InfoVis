import pandas as pd
import glob
import urllib.request
from urllib.error import URLError, HTTPError

# This file created the aircraft data

def read_html(plane):
    try:
        fp = urllib.request.urlopen("http://www.airport-data.com/aircraft/" + plane + ".html")
        html_bytes = fp.read()
        html = html_bytes.decode("utf8")
        fp.close()

        manufacturer = html.split("<b>Manufacturer:</b>", 1)[1].split(".html\">")[1].split("<")[0]
        model = html.split("<b>Model:</b></td><td>", 1)[1].split(" ", 1)[0]
        yearbuilt = html.split("<b>Year built:</b></td><td>", 1)[1].split("<", 1)[0]
        type = html.split("<b>Aircraft Type:</b></td><td>", 1)[1].split("<", 1)[0]
        seats = html.split("<b>Number of Seats:</b></td><td>", 1)[1].split("<", 1)[0]
        engines = html.split("<b>Number of Engines:</b></td><td>", 1)[1].split("<", 1)[0]
        engine_type = html.split("<b>Engine Type:</b></td><td>", 1)[1].split("<", 1)[0]

        return manufacturer + " " + model, yearbuilt, type, seats, engines, engine_type
    except HTTPError as e:
        print("HTTPError " + plane)
        return "", "", "", "", "", ""
    except IndexError as e:
        print("IndexError " + plane)
        return "", "", "", "", "", ""
    except URLError as e:
        print("URLError " + plane)
        return "", "", "", "", "", ""


all_files = glob.glob(r'data' + '/*.csv')
df = pd.concat((pd.read_csv(f) for f in all_files))

result = {}

for i, row in df.iterrows():
    plane = row['TAIL_NUM']

    if plane not in result and type(plane) is str:
        print(plane)
        result[plane] = read_html(plane)

all_data = pd.DataFrame(result).transpose()
all_data.columns = ["model", "year_built", "type", "passengers", "engines", "engine_type"]
print(all_data)

export_csv = all_data.to_csv('unused_data/plane-data.csv', header=True)


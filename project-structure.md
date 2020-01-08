# InfoVis Project Structure

This document describes the structure of the project.


## General Overview

This project contains multiple modules associated with the projects, most notably:

- frontend part in the `frontend/` directory,
- backend part in the `backend/` directory, and
- miscellaneous scripts that assisted us in the making of the project in separate subdirectories of the `scripts/` directory.


## Backend

The backend is written using Python 3 (our version is 3.7.1).

The backend service is located in the `backend/` directory. It contains:

| Directory or File | Description                                               |
| ----------------- | --------------------------------------------------------- |
| `data_editing/`   | Contains scripts for processing the data                  |
| `flight_data/`    | Contains the raw flight data, contents must be downloaded |
| `other_data/`     | Contains other data relevant to the project               |
| `server.py`       | The main backend entry point, sets up the server          |
| `data_handler.py` | Contains top-level data handling logic                    |

The code is commented for additional insights.


## Frontend

The frontend is designed as a web application, with an additional website that displays plots. It was built using HTML, CSS, and JavaScript. It should be run in an evergreen browser (like Chrome, Firefox, or Opera) since it uses the latest ECMAScript 2019 features. Should the project need to be made compatible with other browsers, the JavaScript source should be transpiled to older versions using an appropriate tool (like Babel or the TypeScript compiler).

The project uses the d3 library only for plotting two charts. Besides that, it has been written from scratch.

The frontend service is located in the `service/` directory. It contains:

| Directory or File       | Description                                                            |
| ----------------------- | ---------------------------------------------------------------------- |
| `media/`                | Contains all images                                                    |
| `plot/ `                | Contains website for display delay plots                               |
| `plot/src/`             | Contains the core logic for the plot website                           |
| `plot/src/lib`          | Contains external, third-party libraries; currently only d3            |
| `plot/style/`           | Contains custom styles for the plot website                            |
| `plot/index.html`       | The entry point for the plot website                                   |
| `src/`                  | Contains the core application logic JavaScript                         |
| `src/data/`             | Contains data-management and retrieval scripts                         |
| `src/display-airports/` | Contains logic for the _Airport Delay_ display                         |
| `src/display-flight/`   | Contains logic for the _Flight Delay_ display                          |
| `src/types/`            | [Unimportant] Contains custom type definitions for TypeScript          |
| `src/ui/`               | Contains global ui-related components and logic                        |
| `src/utils/`            | Contains global utility functions and commonly used components         |
| `src/app.js`            | Main JavaScript entry point to the application                         |
| `src/settings.js`       | The main configuration file for the settings of some frontend features |
| `style/`                | Contains the core CSS definitions                                      |
| `index.html`            | The entry point to the main application                                |
| `jsconfig.json`         | [Unimportant] Configuration file for TypeScript                        |

Files not required by the project are marked as _Unimportant_. These are only there to help coding with TypeScript type definitions and project configuration.

The code is commented for additional insights.


## Scripts

There are miscellaneous scripts included in the project, which have been used to pre-process some of the data. Most are written in JavaScript (to run with the latest version of Node.js), while one is also written in C# (to be run with .NET Core 2.1 or higher).

These scripts are located in the `scripts/` directory. It contains:

| Directory or File             | Description                                                                |
| ----------------------------- | -------------------------------------------------------------------------- |
| `airports/`                   | Contains scripts related to pre-processing the list of airports            |
| `airports/airport-codes/`     | A script to extract airport codes                                          |
| `airports/airport-locations/` | A script to allow edits in longitude/latitude for perspective shifts       |
| `airports/airport-misc/`      | A script that allows us to do miscellaneous operations on the airport data |
| `airports/airport-runways/`   | A script that allows us to add the number of runways to the data           |
| `airports/airports.json`      | Contains final airport information                                         |
| `flight-merging/`             | Contains a deprecated and unused C# script used to merged raw flight data  |

Each of the project directories in the `airports` directory contains their own `readme.md` file for some additional information.


## Points of Interest

Since the codebase is quite big (6698 lines of code within 68 files), we list some points of interest, mostly in frontend since it is the bigger part.

| File                                               | Description                                                                      |
| -------------------------------------------------- | -------------------------------------------------------------------------------- |
| `backend/server.py`                                | The entry point of the backend project                                           |
| `frontend/src/display-airport/display-airports.js` | Contains a script managing the airports on the map in the _Airport Delay_ screen |
| `frontend/src/display-flight/renderer.js`          | Takes care of rendering flight paths onto the map in the _Flight Delay_ screen   |
| `frontend/src/ui/trackbar.js`                      | This is the trackbar component used several times throughout the application     |
| `frontend/plot/src/line-plot.js`                   | Renders the _Delay Type_ line plot (chart) using d3 library                      |
| `frontend/plot/src/stack-plot.js`                  | Renders the _Delay Cause_ stack plot (chart) using d3 library                    |

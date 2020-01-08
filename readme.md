# InfoVis Project

This is the InfoVis project for the IN4086-14 course Data Visualization at TU Delft.


## Project Members

- Shane, Alpert
- Nejc, Maček
- Job, Zoon


## Project Structure

This project contains multiple modules associated with the projects, most notably:

- frontend part in the `frontend/` directory,
- backend part in the `backend/` directory, and
- miscellaneous scripts that assisted us in the making of the project in separate subdirectories of the `scripts/` directory.

More details about the project structure and some points of interest can be found [here](./project-structure.md).


## Running the Project

Please follow the listed steps in order to run the project.

1. This project requires flight data. Make sure to download the `Flights.zip` file from [here](https://drive.google.com/open?id=1K83JEqc4NDyP7nkPz0KM2yULhgUVRHx4).
2. Extract the content of the downloaded file into the the `backend/flight_data/` directory (if the directory does not exist, create it.).
3. Run the backend server. (See below for more details.)
   1. Install Python dependencies (packets `flask`, `flask-restful`, and `pandas`).
   2. Open console and navigate to `backend/` directory.
   3. Run `python server.py`.
4. Run the frontend. (See below for more details.)
   1. Start a HTTP server serving from the `frontend/` directory.
   2. Open `index.html` located in the root of the hosted server.

The following two subsections describe how to run the backend and the frontend. If you already succeeded with this, feel free to skip these.


### Running the Backend

The backend is written in Python 3 (our version is 3.7.1). There's several Python dependencies that need to be installed in order to run the backend server:

- `flask`,
- `flask-restful`, and
- `pandas`.

If you have pip installed (check this by running `pip --version`), you can run `pip install flask flask-restful pandas` to install these packages.

Once the python dependencies are installed, please make sure to download flight data as stated above and place it in the `backend/flight_data/` directory (create it if it does not exist). The directory should then contain twelve `.csv` files (plus an optional `legend.csv` file).

Once all the data is ready, run the backend server as follows:

1. Open console and navigate to the `backend/` directory.
2. Run the `server.py` file using Python.
3. The server is running on [localhost:5002](http://localhost:5002). You can make `GET` requests like this: http://localhost:5002/randomflighthistory?amount=3.


### Running the Frontend

To run the frontend server, one only needs to start a HTTP server from the `frontend/` directory. Any tool can be used to do so. Here, we describe two options. The first with Python, the second with [Node.js](https://nodejs.org/en/). Make sure to have the tools installed before proceeding.

To run the frontend server using Python:

1. Open console and navigate to `frontend/` directory.
2. Run `python -m http.server --cgi 8080`.
3. Open the browser at http://localhost:8080/.   
	 
To run the frontend server using Node.js:

1. Make sure to have [Node.js](https://nodejs.org/en/) installed. (Check this by running `node --version`).
2. Globally install the `http-server` npm package by running `npm install -g http-server`
3. Open console and navigate to `frontend/` directory.
4. Run the command `http-server`.
5. Open the browser at http://localhost:8080/.

The port of the frontend server can be changed freely.

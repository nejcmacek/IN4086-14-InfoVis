# InfoVis Project

This is the InfoVis project for the IN4086-14 course Data Visualization at TU Delft.

## Project Members

- Shane, Alpert
- Nejc, Maček
- Job, Zoon

## Project Structure

This project contains multiple modules associated with the projects, most notably:

- frontend part in the `frontend` directory
- backend part in the `backend` directory
- miscellaneous scripts that assisted us in the making of the project in separate subdirectories of the `scripts` directory

## Running the Project

Please follow the following steps in order to run the project.

1. This project requires flight data. Make sure to download these `.csv` files from [here](https://drive.google.com/open?id=1VAv1Cx1Npu_4pg8fVQhV7CG8Wn5NsMXw).
2. Copy the downloaded files to the `backend/flight_data/` directory (if the directory does not exist, create it.).
3. Run the backend server.
   1. Open console and navigate to `backend/` directory.
   2. Run `python server.py`.
4. Run the frontend.
   1. Start a HTTP server serving from the `frontend/` directory. Several options exist, see below.
   2. Open `index.html` in the hosted server.

### Running the Frontend

Described here are two options. The first with Python, the second with [Node.js](https://nodejs.org/en/). Make sure to have the tools installed before proceeding.

#### Running the Frontend With Python

1. Open console and navigate to `frontend/` directory.
2. Run `python -m http.server --cgi 8080`.
3. Open the browser at http://localhost:8080/.
   
	 
#### Running the Frontend with Node.js

1. Install the `http-server` npm package by running `npm install -g http-server`
2. Open console and navigate to `frontend/` directory.
3. Run `http-server`.
3. Open the browser at http://localhost:8080/.

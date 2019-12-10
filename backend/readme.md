# Backend

## Prerequisites

There's several python dependencies that need to be installed in order to run the backend server:

- `flask`
- `flask-restful`

## Setup

1. Create directory `backend/flight_data`
2. Copy flight data into the said directory
3. Run `server.py`
4. The server is running on [localhost:5002](http://localhost:5002). You can make `GET` requests like this: http://localhost:5002/randomflighthistory?amount=3

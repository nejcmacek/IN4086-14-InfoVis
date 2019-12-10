from flask import Flask
from flask import request
from flask_restful import Resource, Api
from data_handler import *

app = Flask(__name__)
api = Api(app)
dh = DataHandler()

"""Get flight history of length amount for a random plane"""
class random_flight_history(Resource):
    def get(self):
        return dh.random_flight_history(int(request.args["amount"]))

class flight_history(Resource):
    def get(self):
        return dh.flight_history(request.args["tail_num"])


class airport_list(Resource):
    def get(self):
        return dh.airport_list()

class plane_list(Resource):
    def get(self):
        return dh.plane_list()

api.add_resource(random_flight_history, '/randomflighthistory')
api.add_resource(flight_history, '/flighthistory')
api.add_resource(airport_list, '/airportlist')
api.add_resource(plane_list, '/planelist')


if __name__ == '__main__':
    app.run(port='5002')

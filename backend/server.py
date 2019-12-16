from flask import Flask
from flask import request
from flask import make_response
from flask import jsonify
from flask_restful import Resource, Api
from data_handler import *

app = Flask(__name__)
api = Api(app)
dh = DataHandler()

"""Get flight history of length amount for a random plane"""
class random_flight_history(Resource):
    def get(self):
        response = make_response(jsonify(dh.random_flight_history(int(request.args["amount"]))))
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response

class flight_history(Resource):
    def get(self):
        response = make_response(jsonify(dh.flight_history(request.args["tail_num"])))
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response

class airport_list(Resource):
    def get(self):
        response = make_response(jsonify(dh.airport_list()))
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response

class plane_list(Resource):
    def get(self):
        response = make_response(jsonify(dh.plane_list()))
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response

class airport_delay(Resource):
    def get(self):
        response = make_response(jsonify(dh.airport_delay_year(request.args["time"])))
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response


api.add_resource(random_flight_history, '/randomflighthistory')
api.add_resource(flight_history, '/flighthistory')
api.add_resource(airport_list, '/airportlist')
api.add_resource(plane_list, '/planelist')
api.add_resource(airport_delay, '/airportdelay')



if __name__ == '__main__':
    app.run(port='5002')

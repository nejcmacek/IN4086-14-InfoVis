from flask import Flask
from flask import request
from flask import make_response
from flask import jsonify
from flask_restful import Resource, Api
from data_handler import *
from time import sleep
from threading import Thread

app = Flask(__name__)
api = Api(app)
dh = None
inited = False

def respond(data):
    response = make_response(jsonify(data))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

"""Get flight history of length amount for a random plane"""
class random_flight_history(Resource):
    def get(self):
        return respond(dh.random_flight_history(int(request.args["amount"])))

class flight_history(Resource):
    def get(self):
        return respond(dh.flight_history(request.args["tail_num"]))

class airport_list(Resource):
    def get(self):
        return respond(dh.airport_list())

class plane_list(Resource):
    def get(self):
        return respond(dh.plane_list())

class airport_delay(Resource):
    def get(self):
        response = make_response(jsonify(dh.get_airport_delay(request.args["time"])))
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response

class airport_delay_types(Resource):
    def get(self):
        response = make_response(jsonify(dh.airport_delay_types(request.args["airport"], request.args["time"])))
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response

class loading_wait(Resource):
    def get(self):
        global inited
        while not inited:
            sleep(0.2)
        return respond(True)


def load_data():
    global inited, dh
    print("Loading data...")
    dh = DataHandler()
    print("Data is loaded.")
    inited = True


if __name__ == '__main__':
    api.add_resource(random_flight_history, '/randomflighthistory')
    api.add_resource(flight_history, '/flighthistory')
    api.add_resource(airport_list, '/airportlist')
    api.add_resource(plane_list, '/planelist')
    api.add_resource(airport_delay, '/airportdelay')
    api.add_resource(airport_delay_types, '/airportdelaytypes')
    
    api.add_resource(loading_wait, '/loadingwait')
    thread = Thread(target=load_data)
    thread.start()
    
    app.run(port='5002')
    thread.join()

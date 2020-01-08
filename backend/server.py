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

"""This method gives the right access rights to the response"""
def respond(data):
    response = make_response(jsonify(data))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


"""Get flight history of length amount for a random plane"""
class random_flight_history(Resource):
    def get(self):
        return respond(dh.random_flight_history(int(request.args["amount"])))


"""Get full flight history for the plane with tail number tail_num"""
class flight_history(Resource):
    def get(self):
        return respond(dh.flight_history(request.args["tail_num"]))


""""Get a list of all airports"""
class airport_list(Resource):
    def get(self):
        return respond(dh.airport_list())


"""Get a list of all aircraft"""
class plane_list(Resource):
    def get(self):
        return respond(dh.plane_list())


"""Responds with the average delay for all airports over time"""
class airport_delay(Resource):
    def get(self):
        return respond(dh.get_airport_delay(request.args["time"]))


"""Responds with the types of delay for airport over time"""
class airport_delay_types(Resource):
    def get(self):
        return respond(dh.airport_delay_types(request.args["airport"], request.args["time"]))


"""Responds True if the data is loaded"""
class loading_wait(Resource):
    def get(self):
        global inited
        while not inited:
            sleep(0.2)
        return respond(True)


"""Loads the data by initializing the DataHandler class"""
def load_data():
    global inited, dh
    print("Loading data...")
    dh = DataHandler()
    print("Data is loaded.")
    inited = True


"""All resources are added to the API, the data is loaded and the application started"""
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

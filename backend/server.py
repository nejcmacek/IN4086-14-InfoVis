from flask import Flask
from flask import request
from flask_restful import Resource, Api
from data_handler import *

app = Flask(__name__)
api = Api(app)
dh = DataHandler()


"""Get flight history of length amount for a random plane"""
class RandomFlightHistory(Resource):
    def get(self):
        return dh.randomFlightHistory(int(request.args["amount"]))


api.add_resource(RandomFlightHistory, '/randomflighthistory')

if __name__ == '__main__':
    app.run(port='5002')

import time

import paho.mqtt.client as mqtt
import json
from pymongo import MongoClient


def on_connect(client, userdata, flags, rc):
    print("Connection sucessfully established")


def on_message(client, userdata, message):
    decodedData: dict = json.loads(str(message.payload, encoding='utf-8'))
    print(type(decodedData))
    print(decodedData)

    try:
        collection.insert_one(decodedData)
    except:
        print("Connection to the database is unsuccessful")

# MQTT Client for IES Gateway
if __name__ == '__main__':
    mc = MongoClient(host="localhost", port=27017)
    collection = mc["IESGateway"]["SensorData"]

    client = mqtt.Client(client_id="IES_MQTT_SINK", clean_session=True, userdata=None, protocol=mqtt.MQTTv311,
                         transport="tcp")
    client.max_inflight_messages_set(50)
    client.max_queued_messages_set(50)

    client.on_connect = on_connect
    client.on_message = on_message


    client.disable_logger()
    # Add a Try Block

    try:
        client.connect("localhost", 1883)
    except:
        print("Something gone wrong with connection to Broker!")
        quit()

    client.loop(timeout=1.0)

    client.subscribe("Sensor/IoTData", qos=1)

    # client.loop_start()

    client.loop_forever(retry_first_connection=True)

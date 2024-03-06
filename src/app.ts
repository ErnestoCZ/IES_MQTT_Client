//const mqtt = require('mqtt');
import mqtt from 'mqtt';
import axios from 'axios';
const host: string = 'localhost';
const port: number = 3000;
const path: string = 'IESGateway/';
const APIUrl: string = 'http://localhost:3000/IESGateway/';

//Config
const mqttConfig: mqtt.IClientOptions = {
  clientId: 'IES_Gateway_Mqtt_client',
  clean: true,
  reconnectPeriod: 5,
};

//Clients
const MQTTClient = mqtt.connect('mqtt://localhost', mqttConfig); //connects to the local Broker

const topic: string[] = ['test', 'test1', 'SensorDataToGateway'];

MQTTClient.on('connect', () => {
  console.log('Connected to Broker!!');
  MQTTClient.subscribe(topic, (err) => {});
});

MQTTClient.on('close', () => {
  console.log('disconnected');
});
MQTTClient.on('error', () => {
  MQTTClient.end();
});

MQTTClient.on('reconnect', () => {
  console.log('reconnecting to the broker ....');
});

MQTTClient.on('message', (topic, message, packet) => {
  if (topic.toString() != 'test') {
    const messageJSON = JSON.parse(message.toString('utf-8'));
    //! TODO : Store data direct to a Buffer => forward later the whole Buffer!
    console.log(messageJSON);

    axios
      .post(APIUrl, messageJSON)
      .then((res) => {
        console.log('success');
      })
      .catch((reason) => {
        console.error('error!');
        console.log(reason.response.data);
      });
  }
});

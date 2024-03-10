//const mqtt = require('mqtt');
import mqtt from 'mqtt';
import axios from 'axios';
const host: string = 'localhost';
const path: string = 'IESGateway/';
const port: number = 3000;
const reconnectAfterMS = 10000;
const APIUrl: string = 'http://localhost:3000/IESGateway/';

//Config
const mqttConfig: mqtt.IClientOptions = {
  clientId: 'IES_Gateway_Mqtt_client',
  clean: true,
  reconnectPeriod: reconnectAfterMS,
};

//Clients
const MQTTClient = mqtt.connect('mqtt://localhost', mqttConfig); //connects to the local Broker

const topic: string[] = ['test', 'test1', 'SensorDataToGateway'];

MQTTClient.on('connect', () => {
  console.log('Connected to local MQTT-Broker');
  MQTTClient.subscribe(topic, (err) => {});
});

MQTTClient.on('close', () => {
  console.log('Connection to Broker lost');
});
MQTTClient.on('error', (error) => {
  console.log(error);
  MQTTClient.end();
});
MQTTClient.on('offline', () => {
  console.log(`Client is offline`);
});

MQTTClient.on('reconnect', () => {
  console.log('reconnecting to the broker ....');
});

MQTTClient.on('message', (topic, message, packet) => {
  if (topic.toString() != 'test') {
    const messageJSON = JSON.parse(message.toString('utf-8'));
    //TODO build a local buffer
    console.log(messageJSON);

    axios
      .post(APIUrl, messageJSON)
      .then((res) => {
        console.log('success');
      })
      .catch((reason) => {
        console.error('error!');
        console.log(reason.response?.data);
      });
  }
});

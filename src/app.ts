//const mqtt = require('mqtt');
import mqtt from 'mqtt';
import http2 from 'http2';
import { json } from 'stream/consumers';
const backendAPI_URL = 'http://localhost:3000';

//config for instances
const mqttConfig: mqtt.IClientOptions = {
  clientId: 'IES_Gateway_Mqtt_client',
  clean: true,
};

const MQTTClient = mqtt.connect('mqtt://localhost', mqttConfig);

const topic: string[] = ['test', 'test1'];

MQTTClient.on('connect', () => {
  MQTTClient.subscribe(topic, (err) => {
    MQTTClient.on('message', (topic, message, packet) => {
      //TODO send data to API
      console.log(message.toString());
    });
  });
});

MQTTClient.on('close', () => {
  console.log('disconnected');
});

MQTTClient.on('connect', () => {
  console.log('connected to Broker!');
});

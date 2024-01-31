//const mqtt = require('mqtt');
import mqtt, { MqttClient } from 'mqtt';

const backendAPI_URL = 'localhost:3000/IESGateway/';

const mqttConfig: mqtt.IClientOptions = {
  clientId: 'IES_Gateway_Mqtt_client',
};

const client = mqtt.connect('localhost', mqttConfig);

const topic: string = 'test';

client.on('connect', () => {
  client.subscribe(topic, (err) => {
    client.on('message', (topic, message, packet) => {
      //TODO send data to API
    });
  });
});

client.on('close', () => {
  console.log('disconnected');
});

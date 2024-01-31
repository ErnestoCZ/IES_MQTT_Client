//const mqtt = require('mqtt');
import mqtt, { MqttClient } from 'mqtt';

const client = mqtt.connect('mqtt://192.168.1.82', {
  clientId: 'IES_Gateway_Mqtt_Client',
});

const topic: string = 'test';

client.on('connect', () => {
  client.subscribe(topic, (err) => {
    if (err) {
      console.log('connection failed!' + err.message.toString());
      return;
    }

    client.on('message', (topic: any, message: any) => {
      console.log(message.toString());
    });
  });
});

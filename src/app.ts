//const mqtt = require('mqtt');
import mqtt from "mqtt";
import axios from "axios";
const host: string = "192.168.1.105";
const path: string = "IESGateway/";
const reconnectAfterMS = 10000;
const backendAddr: string = "localhost";
const backendPort: number = 3002;
const APIUrl: string = `http://${backendAddr}:${backendPort}/`;

//Config
const mqttConfig: mqtt.IClientOptions = {
  clientId: "IES_Gateway_MQTT_Client",
  clean: false,
  reconnectPeriod: reconnectAfterMS,
};

//Clients
const MQTTClient = mqtt.connect(`mqtt://${host}`, mqttConfig); //connects to the local Broker

//TODO FETCH AVAILABLE TOPICS via HTTP Request
const topic: string[] = [
  "application/82bcd164-9c50-4ff1-8dda-50b66c528472/device/5bd2ffa00648c0b2/event/up",
  "application/82bcd164-9c50-4ff1-8dda-50b66c528472/device/5bd2ffa00648c0b5/event/up",
  "application/82bcd164-9c50-4ff1-8dda-50b66c528472/device/5bd2ffa00648c0b3/event/up",
];

MQTTClient.on("connect", () => {
  console.log("Connected to local MQTT-Broker");
  MQTTClient.subscribe(topic, (err) => {});
});

MQTTClient.on("close", () => {
  console.log("Connection to Broker lost");
});
MQTTClient.on("error", (error) => {
  console.log(error);
  MQTTClient.end();
});
MQTTClient.on("offline", () => {
  console.log(`Client is offline`);
});

MQTTClient.on("reconnect", () => {
  console.log("reconnecting to the broker ....");
});

MQTTClient.on("message", (topic, message, packet) => {
  if (topic.toString() != "test") {
    const messageJSON = JSON.parse(message.toString("utf-8"));
    //TODO build a local buffer
    console.log(messageJSON);

    axios
      .post(APIUrl, messageJSON)
      .then((res) => {
        console.log("success");
      })
      .catch((reason) => {
        console.error("error!");
        console.log(reason.response?.data);
      });
  }
});

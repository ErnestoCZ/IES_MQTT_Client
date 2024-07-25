import mqtt from "mqtt";
import axios from "axios";
import * as dotenv from "dotenv";
import { fetchDataForTopicToSubscribe, topic } from "./requests";

dotenv.config({ path: "../.env" });

const host: string = process.env.HOST_IP ?? `localhost`;
const reconnectAfterMS = Number(process.env.RECONNECT_MS);
const backendAddr: string = "localhost";
const backendPort: number = Number(process.env.CLIENT_PORT) ?? 3000;
const APIUrl: string = `http://${backendAddr}:${backendPort}/`;

//Config
const mqttConfig: mqtt.IClientOptions = {
  clientId: process.env.CLIENT_NAME ?? "IES_MQTT",
  clean: false,
  reconnectPeriod: reconnectAfterMS,
};

export const MQTTClient = mqtt.connect(`mqtt://${host}`, mqttConfig); //connects to the local Broker
//Clients

MQTTClient.on("connect", () => {
  console.log("Connected to local MQTT-Broker");
  fetchDataForTopicToSubscribe();
  // MQTTClient.subscribe(topic, (err) => {});
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

import axios from "axios";
import { z } from "zod";
import { MQTTClient } from "./app";

//ZOD Schemas

const ZTenantsSchema = z.object({
  id: z.string(),
});

const ZApplicationSchema = z.object({
  id: z.string(),
});
const ZDeviceSchema = z.object({
  devEui: z.string(),
});
const ZResponse = z.object({
  totalCount: z.number(),
  result: z.array(ZTenantsSchema),
});

const ZResponseDevice = z.object({
  totalCount: z.number(),
  result: z.array(ZDeviceSchema),
});

//Types
type Tenant = z.infer<typeof ZTenantsSchema>;
type Application = z.infer<typeof ZApplicationSchema>;
type Device = z.infer<typeof ZDeviceSchema>;
type Response = z.infer<typeof ZResponse>;
type ResponseDevice = z.infer<typeof ZResponseDevice>;

export const topic: string[] = [
  // "application/82bcd164-9c50-4ff1-8dda-50b66c528472/device/5bd2ffa00648c0b2/event/up",
  // "application/82bcd164-9c50-4ff1-8dda-50b66c528472/device/5bd2ffa00648c0b5/event/up",
  // "application/82bcd164-9c50-4ff1-8dda-50b66c528472/device/5bd2ffa00648c0b3/event/up",
];

const headerConfig = {
  Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjkyYmM0NDAzLTk4NWYtNDI0OS04Y2Y4LWM0NDU4NGIyMGI0MSIsInR5cCI6ImtleSJ9.7yvvPfxyQB7a198rPXI1S3BR6n14LVAc_o0aBDKERik`,
  Accept: "application/json",
};
const Config = {
  data: {},
  headers: headerConfig,
  baseURL: "http://localhost:8090/api",
};

export async function getTentants(limit: string): Promise<any> {
  try {
    const tenants: axios.AxiosResponse<any, any> = await axios.get(
      `/tenants?limit=${limit}`,
      Config
    );
    return ZResponse.parse(tenants.data);
  } catch (error) {
    console.log(error);
  }
}

export async function getApplicationIds(tenantId: string): Promise<any> {
  try {
    const applications = await axios.get(
      `/applications?tenantId=${tenantId}&limit=10`,
      Config
    );
    return ZResponse.parse(applications.data);
  } catch (error) {
    console.log(error);
  }
}

export async function getDevicesByApplication(
  applicationId: string
): Promise<any> {
  try {
    const devices = await axios.get(
      `/devices?applicationId=${applicationId}&limit=10`,
      Config
    );

    return ZResponseDevice.parse(devices.data);
  } catch (error) {
    console.log(error);
  }
}

export async function fetchDataForTopicToSubscribe(): Promise<any> {
  const tenantsResponse: Response = await getTentants("10");
  const tenants: Tenant[] = tenantsResponse.result;
  const topic: string[] = [];
  for (let index = 0; index < tenants.length; index++) {
    const tenantID = tenants[index].id;

    const applicationIdResponse: Response = await getApplicationIds(tenantID);
    const applicationIds: Application[] = applicationIdResponse.result;
    console.log(applicationIds);
    for (let index = 0; index < applicationIds.length; index++) {
      const applicationID = applicationIds[index].id;

      const deviceResponse: ResponseDevice = await getDevicesByApplication(
        applicationID
      );
      const deviceEuiList: Device[] = deviceResponse.result;

      for (let index = 0; index < deviceEuiList.length; index++) {
        const devEui = deviceEuiList[index].devEui;
        const newTopic: string = `application/${applicationID}/device/${devEui}/event/up`;
        topic.push(newTopic);
      }
    }
  }
  console.log(topic);
  MQTTClient.subscribe(topic);
  return Promise.resolve(topic);
  try {
    return null;
  } catch (error) {}
}

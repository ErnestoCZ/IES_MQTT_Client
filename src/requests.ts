import axios from "axios";

const topic: string[] = [
  // 'application/82bcd164-9c50-4ff1-8dda-50b66c528472/device/5bd2ffa00648c0b2/event/up',
  // 'application/82bcd164-9c50-4ff1-8dda-50b66c528472/device/5bd2ffa00648c0b5/event/up',
  // 'application/82bcd164-9c50-4ff1-8dda-50b66c528472/device/5bd2ffa00648c0b3/event/up',
];

const applications: string[] = [];
const devices: string[] = [];

const headerConfig = {
  Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjBmNWU2OGYxLWE0YmEtNDI5NC1hZDVhLTliYWFjYjI1ZDgzYSIsInR5cCI6ImtleSJ9.btEzsGdtG0qPBweRAM3mzN2wPpG1wnnlNAKVjyRrWLo`,
  Accept: "application/json",
};
const Config = {
  data: {},
  headers: headerConfig,
  baseURL: "http://localhost:8090/api",
  method: "GET",
};

export async function getTentants(limit: string) {
  return await axios
    .get(`/tentants?limit=${limit}`, Config)
    .then((res) => {
      console.log("success in fetching tentants");
    })
    .catch((err) => {
      console.log("failed to fetch tentants");
    });
}

export async function getApplicationIds() {
  return await axios
    .get("/applications/cb74048c-dae5-48c0-a765-3a186b7b64b7", Config)
    .then((res) => {
      //   console.log("success");
      const appIDs: Object[] = res.data as Object[];
      console.log(appIDs);
    })
    .catch((err) => {
      console.log(err);
    });
}

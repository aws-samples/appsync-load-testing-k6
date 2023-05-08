import http from "k6/http";
import ws from "k6/ws";
import encoding from 'k6/encoding';
import {
    uuidv4
} from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';


export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      rate: 100, // 100 RPS, since timeUnit is the default 1s
      duration: '60m',
      preAllocatedVUs: 0,
      maxVUs: 30000,
    },
  },
};


const API_URL = "https://wtjknhf6szh3pnnxxcijbsofk4.appsync-api.eu-west-1.amazonaws.com/graphql"
const API_KEY = "xxxxxxxxxxxxxx"
const WSS_URL = API_URL.replace('https','wss').replace('appsync-api','appsync-realtime-api')
const HOST = API_URL.replace('https://','').replace('/graphql','')
const api_header = {
    'host': HOST,
    'x-api-key': API_KEY
}
const header_encode = obj => encoding.b64encode(JSON.stringify(obj));
const url = WSS_URL + '?header=' + header_encode(api_header) + '&payload=' +  header_encode({})


export default function() {
    // See this https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html

    const randomUUID = uuidv4();

    // const url = "wss://wtjknhf6szh3pnnxxcijbsofk4.appsync-realtime-api.eu-west-1.amazonaws.com/graphql?header=eyJob3N0Ijoid3Rqa25oZjZzemgzcG5ueHhjaWpic29mazQuYXBwc3luYy1hcGkuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb20iLCJ4LWFwaS1rZXkiOiJkYTItZGtsb3lvb2h5amRqaG9neHF5bGtmb2tneGkifQ==&payload=e30=" // replace with your url
    const token = null; // replace with your auth token
    const operation = `
  subscription onCreateNote {
    onCreateNote {
      id name completed
    }
  }` // replace with your subscription
        const headers = {
        "Sec-WebSocket-Protocol": "graphql-ws",
        "x-api-key": API_KEY
    };

    ws.connect(
        url, {
            headers,
        },
        (socket) => {
            socket.on('message', (data) => console.log('Message received: ', data));
            socket.on('close', () => console.log('disconnected'));

            socket.on("open", () => {
                console.log('connected')
                socket.send(
                    JSON.stringify({
                        type: "connection_init"
                    })
                );

                const data = JSON.stringify({
                    query: operation,
                    variables: {}
                })

                console.log(data)

                socket.send(
                    JSON.stringify({
                        id: randomUUID,
                        type: "start",
                        payload: {
                            data: data,
                            extensions: {
                                authorization: {
                                    host: HOST,
                                    "x-api-key": API_KEY
                                }
                            }

                        }
                    })
                );

            });

            socket.on('start_ack', (data) => console.log('start_ack: ', data));

            socket.on('connection_ack', (data) => {
                console.log('connection_ack: ', data)
            });

        }
    );
}
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
            rate: 1, // 100 RPS, since timeUnit is the default 1s
            duration: '60m',
            preAllocatedVUs: 0,
            maxVUs: 1,
        },
    },
};

const API_URL = "https://gql.kosningar.ruv.dev/graphql"
const WSS_URL = API_URL.replace('https', 'wss')
const HOST = API_URL.replace('https://', '').replace('/graphql', '')

const url = WSS_URL


export default function() {
    // See this https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html

    const randomUUID = uuidv4();

    const token = null; // replace with your auth token
    const operation = `
    subscription Subscription($viewer: Viewer!) {
      view(Viewer: $viewer)
    }
    ` // replace with your subscription
    const headers = {
        "Sec-WebSocket-Protocol": "graphql-ws"
        //"token": ""
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

                socket.send(
                    JSON.stringify({
                        id: randomUUID,
                        type: "start",
                        payload: {
                            query: operation,
                            variables: {
                                viewer: "NyjarTolur"
                            },

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
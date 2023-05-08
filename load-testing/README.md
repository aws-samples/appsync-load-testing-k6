# graphql-load-testing

Some experiments done for load testing graphql APIs using K6

## Prerequisite

### Install k6
* [Installation](https://k6.io/docs/getting-started/installation/)


### Run large tests

There are some OS fine-tuning required to be able to run large tests, check [this link](https://k6.io/docs/testing-guides/running-large-tests/) for more details

```bash
sudo sysctl -w net.ipv4.ip_local_port_range="1024 65535"
sudo sysctl -w net.ipv4.tcp_tw_reuse=1
sudo sysctl -w net.ipv4.tcp_timestamps=1
sudo ulimit -n 250000
```

### Test GQL queries
```bash
k6 run --vus 10 --duration 30s script-query.js
```

### Test GQL subscriptions with graphql server running in ECS
```bash
k6 run script-sub-ecs.js
```


### Test GQL subscriptions with graphql server running in AppSync
```bash
k6 run script-sub-appsync.js
```

The following link described how to use the real time websocket client:
https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html



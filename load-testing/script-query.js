import http from "k6/http";
import { sleep } from "k6";


let accessToken = "xxx";


export default function() {

  let query =  `
query Election {
  election(electionID: 24) {
    electionID
    name
  }
}
      `;

  let headers = {
    'Authorization': `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };


   console.log("test log");

  let res = http.post("https://gql.kosningar.ruv.dev/graphql/",
    JSON.stringify({ query: query }),
    {headers: headers}
  );

  if (res.status === 200) {
    console.log(JSON.stringify(res.body));

  }
  else{
      console.log(JSON.stringify(res.body));

  }
  sleep(0.3);
}
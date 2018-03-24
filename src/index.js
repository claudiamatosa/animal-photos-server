const express = require("express");
const bodyParser = require("body-parser");
import { apolloUploadExpress } from "apollo-upload-server";
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
import schema from "./schema";

const app = express();

app.use(
  "/graphql",
  bodyParser.json(),
  apolloUploadExpress(),
  graphqlExpress({ schema })
);

app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.listen(3000, () => {
  console.log("server running on http://localhost:3000/graphql");
});

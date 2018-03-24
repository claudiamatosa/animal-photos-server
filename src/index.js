import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { apolloUploadExpress } from "apollo-upload-server";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import schema from "./schema";

const app = express();

app.use(cors());

app.use(
  "/graphql",
  bodyParser.json(),
  apolloUploadExpress(),
  graphqlExpress({ schema })
);

app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.listen(4000, () => {
  console.log("server running on http://localhost:4000/graphql");
});

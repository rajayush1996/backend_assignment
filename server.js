import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./src/schema/typeDef.js";
import { resolvers } from "./src/schema/resolvers.js";
import { verifyToken } from "./src/utils/auth.js";

dotenv.config();
const app = express();
app.use(cors());

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const user = verifyToken(token.replace("Bearer ", ""));
    return { user };
  }
});

await server.start();
server.applyMiddleware({ app });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    httpServer.listen({ port: 4000 }, () => {
      console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    });
  })
  .catch(console.error);

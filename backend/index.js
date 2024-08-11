require("dotenv").config();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { schema, root } = require("./graphql/schema");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const authRoutes = require("./routes/authRoutes");
const {requireAuth } = require("./utils/auth");

app.use(express.json());

// Enable CORS
app.use(cors());

// Authentication routes
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.use("/graphql", requireAuth)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


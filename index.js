const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.mgokm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const collection = client.db("task-manager").collection("todo-list");

    //TODO: get list

    app.get("/todo", async (req, res) => {
      const cursor = await collection.find({}).toArray();
      res.send(cursor);
    });

    // TODO: create list
    app.post("/todo", async (req, res) => {
      const data = req.body;
      const cursor = await collection.insertOne(data);
      res.send(cursor);
    });

    // TODO: update list
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        /* $set: {
          tile: data.title,
          task: data.task,
          date: data.date,
        }, */
        $set: data,
      };
      const cursor = await collection.updateOne(filter, updateDoc, options);
      res.send(cursor);
    });

    // TODO: delete list

    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const result = await collection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    console.log("first");
  } finally {
  }
};
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`server run ${port}`);
});

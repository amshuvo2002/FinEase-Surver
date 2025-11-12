require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;
console.log(process.env);


app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sxesek9.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("MongoDB Server is Running...");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("FinEase_db");
    const transactionsCollection = db.collection("transactions");

    app.post("/transactions", async (req, res) => {
      const newTransaction = req.body;
      const result = await transactionsCollection.insertOne(newTransaction);
      res.send(result);
    });

    app.get("/transactions", async (req, res) => {
      const email = req.query.email;
      const query = email ? { userEmail: email } : {};
      const result = await transactionsCollection.find(query).toArray();
      res.send(result);
    });

   
    app.get("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await transactionsCollection.findOne(query);
      res.send(result);
    });

   
    app.put("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const result = await transactionsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      res.send(result);
    });

   
    app.delete("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const result = await transactionsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

   
    // await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB...!");
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

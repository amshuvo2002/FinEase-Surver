const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection URI
const uri = "mongodb+srv://FinEaseDB:C3tVHQANuLcDTnch@cluster0.sxesek9.mongodb.net/?appName=Cluster0";

// ✅ Create client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("MongoDB Server is Running ✅");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("FinEase_db");
    const transactionsCollection = db.collection("transactions");

    // ✅ Create (POST) — Add transaction
    app.post("/transactions", async (req, res) => {
      const newTransaction = req.body;
      const result = await transactionsCollection.insertOne(newTransaction);
      res.send(result);
    });

    // ✅ Read (GET) — Fetch transactions based on user email
    app.get("/transactions", async (req, res) => {
      const email = req.query.email;

      const query = email ? { userEmail: email } : {};
      const result = await transactionsCollection.find(query).toArray();
      res.send(result);
    });

    // ✅ DELETE — delete transaction
    app.delete("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const result = await transactionsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // ✅ Single Transaction Details
    app.get("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const result = await transactionsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // ✅ Update transaction (PUT)
    app.put("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const result = await transactionsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      res.send(result);
    });

    // ✅ Test connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

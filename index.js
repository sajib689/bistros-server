const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json());
const uri = `mongodb+srv://${process.env.Db_User}:${process.env.Db_Pass}@cluster0.2m0rny5.mongodb.net/?retryWrites=true&w=majority`;

// server main configuration


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const menuCollection = client.db('bistroDb').collection('menu');
    app.get('/menu', async (req, res) => {
        const result = await menuCollection.find().toArray();
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('wow server is running now')
})
app.listen(port, () => {
    console.log(`listing on port ${port}`);
});
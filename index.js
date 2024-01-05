const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    const usersCollection = client.db('bistroDb').collection('users');
    const menuCollection = client.db('bistroDb').collection('menu');
    const reviewCollection = client.db('bistroDb').collection('reviews');
    const cartCollection = client.db('bistroDb').collection('carts');
    // users create api
    app.post('/users', async (req, res) => {
      const user = req.body
      const query = {email: user.email}
      const existingUser = await usersCollection.findOne(query)
      if(existingUser) {
        return res.send({message: 'User already exists'})
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })
    // get all users from the database
  app.get('/users', async (req, res) => {
    const result = await usersCollection.find().toArray();
    res.send(result);
  })
    // get menu collection from the database
    app.get('/menu', async (req, res) => {
        const result = await menuCollection.find().toArray();
        res.send(result)
    })
    // get all reviews from the database
    app.get('/reviews', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result)
    })
    // bistro collection api
    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      if(!email) {
        res.send([])
      } 
      const query = {email: email}
      const result = await cartCollection.find(query).toArray();
      res.send(result)
    })
    // cart collection
    app.post('/carts', async (req, res) => {
      const item = req.body
      const result = await cartCollection.insertOne(item)
      res.send(result)
    })
    // get cart collection
    app.get('/carts', async (req, res) => {
      const result = await cartCollection.find().toArray()
      res.send(result)
    });
    // delete from carts
    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    });
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
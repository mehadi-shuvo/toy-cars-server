const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

//midle wire ;
app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ih5yxul.mongodb.net/?retryWrites=true&w=majority`;

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

    const shopCategoryCollection = client.db('toyCars').collection('shopCategory');

    app.get('/toys', async (req, res) => { 
      const quantity = parseInt(req.query.limit)  || 22;
      const limit = parseInt(req.query.limit);
      if (quantity<=3) {
        const cursor = shopCategoryCollection.find().limit(limit);
        const result = await cursor.toArray()
        res.send(result)
      }
      else{
        const cursor = shopCategoryCollection.find();
        const result = await cursor.toArray()
        console.log(result)
        res.send(result)
      }

    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await shopCategoryCollection.findOne(query);
      res.send(result)

    })

    app.get('/my-toys', async(req, res)=>{
      console.log(req.query.email);
      const query = { seller_email: req.query.email}
      const cursor = shopCategoryCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/toys', async(req, res)=>{
      const newToy = req.body;
      const result = await shopCategoryCollection.insertOne(newToy);
      res.send(result)
  })

  app.put('/update/:id', async(req,res)=>{
      const id = req.params.id;
      const updateToy = req.body;
      console.log(updateToy)
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          price: updateToy.price,
          available_quantity: updateToy.available_quantity,
          details: updateToy.details
        },
      };
      const result = await shopCategoryCollection.updateOne(filter, updateDoc);
      res.send(result)

  })

  app.delete('/toys/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await shopCategoryCollection.deleteOne(query)
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
  res.send('hello developer..!');
})
app.listen(port, () => {
  console.log(`this server is running on ${port} port`);
})
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kd61vsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


app.use(cors({
  origin : [
    'https://blog-site-web-page-project.vercel.app',
    'https://himu-s-lab.web.app',
    'https://himu-s-lab.firebaseapp.com'
  ]
}));
app.use(express.json());

//himu_labs
//ngO6nS4LWZl6hIMk



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

    const allBlogPost = client.db('HimusLab').collection('allBlogPost');
    const contactInformation = client.db('HimusLab').collection('contactInformation');
    const registerUser = client.db('HimusLab').collection('registerUser');


    app.get('/allblog', async (req, res) => {
      const cursor = allBlogPost.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/contactInformation', async (req, res) => {
      const cursor = contactInformation.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/registerUser', async (req, res) => {
      const cursor = registerUser.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.post('/addBlogPost', async (req, res) => {
      const user = req.body;
      const result = await allBlogPost.insertOne(user);
      res.send(result);
    })
    app.post('/registerUser', async (req, res) => {
      const user = req.body;
      const result = await registerUser.insertOne(user);
      res.send(result);
    })

    app.post('/contactInformation', async (req, res) => {
      const user = req.body;
      const result = await contactInformation.insertOne(user);
      res.send(result);
    })

    app.get('/getSomeFeatures/:category', async (req, res) => {
      const category = req.params.category;
      const query = { category: category };
      const cursor = allBlogPost.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })





    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', async (req, res) => {
  res.send('himu lab is running');
})

app.listen(port, () => {
  console.log(`this server is running : ${port}`)
})
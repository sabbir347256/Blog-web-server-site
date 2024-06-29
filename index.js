const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere' });

app.use(cors());
app.use(express.json());

//himu_labs
//ngO6nS4LWZl6hIMk



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kd61vsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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


    app.get('/allblog', async (req, res) => {
      const cursor = allBlogPost.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.post('/addBlogPost', async (req, res) => {
      const user = req.body;
      const result = await allBlogPost.insertOne(user);
      res.send(result);
    })

    app.post('/contactInformation', async (req, res) => {
      const user = req.body;
      const result = await contactInformation.insertOne(user);

      mg.messages.create(process.env.MAIL_SENDING_DOMAIN, {
        from: "Excited User <mailgun@sandboxc615646f360149cc935e13ff19483c84.mailgun.org>",
        to: ["bewyaris@gmail.com"],
        subject: "Hello",
        text: "Testing some Mailgun awesomeness!",
        html: "<h1>Testing some Mailgun awesomeness!</h1>"
      })
        .then(msg => console.log(msg)) // logs response data
        .catch(err => console.log(err)); // logs any error

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
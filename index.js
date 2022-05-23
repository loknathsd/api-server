const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId

const port = 5000


const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


const uri = "mongodb+srv://radioUser:radioUser1234@cluster0.vfsjf.mongodb.net/?retryWrites=true&w=majority";

app.get('/', (req, res) => {
  res.send('Hello World!')
})





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("userStore").collection("users"); 
  const stationCollection = client.db("userStore").collection("stations"); 
 
  app.post('/register', (req, res) => {
    const newUser = req.body;
    collection.insertOne(newUser)
      .then(result => {

        res.send(result);
      })


  })
  app.post('/signin', (req, res) => {
    
    const {email,password} = req.body;
    collection.find({email:email})
    .toArray((err,documents)=>{
      res.send(documents[0])
      
      
    })
    
  })

  app.post('/addStation',(req,res)=>{
    console.log(req.body)
    const station = req.body
    stationCollection.insertOne(station)
    .then(result=>{
      res.send(result)
    })
  })

  app.get('/stations',(req,res)=>{
    stationCollection.find({})
    .toArray((err,documents)=>{
      
      res.send(documents)
    })
  })


  app.delete('/delete/:id',(req,res)=>{
     const id = req.params.id;
     console.log(id)
     stationCollection.deleteOne({_id:ObjectId(id)})
     .then(result=>{
       res.json(result)
       console.log(result)
     })
  })

  

});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
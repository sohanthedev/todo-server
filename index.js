const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://thesohan:thesohan@cluster0.jft2kca.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const userCollection = client.db('todo-data').collection('todo-collection')


        app.get('/addmytask', async(req,res)=>{
            const query = {};
            const cursor = userCollection.find(query);
            const user = await cursor.toArray();
            const body = req.query.email
           const todos = user.filter(p=>p.email==body)
            res.send(todos)
        })


        app.post('/addtodo',async(req,res)=>{
            const user = req.body;

            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        app.delete('/addmytask/:id', async(req,res)=>{
            const id = req.params.id;
          console.log(id)
            const query= {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query)
            res.send(result)

        })
        app.put('/complete/:id', async(req,res)=>{
            const id = req.params.id;
          console.log(id)
            const query= {_id: ObjectId(id)};
            const option = {
                upsert:true
            }
            const newData = {
                $set: {
                    completed: true

                  }
            }
            const result = userCollection.updateOne(query,newData,option)
            res.send(result)

        })
        app.put('/updated/:id', async(req,res)=>{
            const id = req.params.id;
            const text = req.body.todo
          console.log(id)
            const query= {_id: ObjectId(id)};
            const option = {
                upsert:true
            }
            const newData = {
                $set: {
                    todo: text
                  }
            }
            const result = userCollection.updateOne(query,newData,option)
            res.send(result)

        })


    }
    finally{

    }
}
run().catch(err=>console.log(err))

app.get('/',(req,res)=>{
    res.send('running');
})
app.listen(port, ()=>{
    console.log(`Running on port ${port}`)
})
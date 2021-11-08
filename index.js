const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.laff6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('my_tour');
        const serviceCollection = database.collection('services');
        const bookingRequestCollection = database.collection('bookingRequests')


        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id);
            const cursor = await serviceCollection.findOne({_id:ObjectId(id)});
            console.log(cursor);
            res.send(cursor);

        })
        // GET services API 
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        });
        //POST service api
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result)
        });
        // Booking Request POST API 
        app.post('/bookingRequests', async (req, res) => {
            const bookingRequest = req.body;
            const result = await bookingRequestCollection.insertOne(bookingRequest);
            res.json(result)
        });
        // Booking Request GET API 
        app.get('/bookingRequests', async (req, res) => {
            const cursor = bookingRequestCollection.find({});
            const bookingRequests = await cursor.toArray();
            res.send(bookingRequests);
        });


        // update status API
        app.put('/status/:id', async (req, res) => {
            const id = req.params.id;
            const a = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const update = {
                $set: { ServiceId: a.status }

            }
            const result = await bookingRequestCollection.updateOne(filter, update, option);
            res.json(result);
        })


        //Booking DELETE API
        app.delete('/bookingRequests/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingRequestCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('My Tour server is running')
})
app.listen(port, () => {
    console.log('sever running  port is', port);
})








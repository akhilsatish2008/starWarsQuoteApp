const express = require('express');
//const res = require('express/lib/response');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const PORT = 3000;
const connectionString = 'mongodb+srv://asatish:llvEl7cDbqaOuCtN@cluster0.st336py.mongodb.net/?retryWrites=true&w=majority';

//old way using callbacks
/*MongoClient.connect(connectionString,(err, client)=>{    
    if (err) return console.error(err)
    console.log('connected to database')
})*/
MongoClient.connect(connectionString, { useUnifiedTopology: true }) // new syntax using promises
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');

    app.set('veiw engine', 'ejs')


    app.use(bodyParser.urlencoded({extended: true})) //middle ware to help tidy up request object (old way )
    app.use(express.static('public'))
    app.use(bodyParser.json())


    app.get('/', (req, res) => {
        quotesCollection.find().toArray()
          .then(results=>{
            res.render('index.ejs', {quotes: results})
          })
          .catch(error => console.error(error))
        
      })
        
           
    
    app.post('/quotes', (req, res)=>{
        quotesCollection.insertOne(req.body)
            .then(result =>{
                res.redirect('/');
            })
            .catch(error =>console.error(error))
    })
    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
            {name: 'Yoda'},
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert: true
            }
        )
        .then(result=>{
            res.json('Success')
        })
        .catch(error => console.error(error))
      })

      app.delete('/quotes', (req, res) => {
        // Handle delete event here
        quotesCollection.deleteOne(
            { name: req.body.name }
          )
            .then(result => {
              res.json(`Deleted Darth Vadar's quote`)
            })
            .catch(error => console.error(error))
        })
    
  
    app.listen(PORT,function(){ // callback (old way of doing it)
        console.log('listening on port 3000')
    })
  })
  .catch(error => console.error(error))







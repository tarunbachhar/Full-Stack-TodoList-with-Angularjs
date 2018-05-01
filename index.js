

const express = require('express')
const path =  require('path')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session =require('express-session')

var url = "mongodb://localhost:27017";

var dbName= "todolist";



var app = express();
app.set('view engine','pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use(session({secret:'secretkey',saveUninitialized:true}))

app.get('/',function(req,res){
    res.status(200)
    res.render('index')
})

app.get('/additem',function(req,res){
    res.render('addTodo')
})

app.post('/addtolist',function(req,res){
    // var taskn = req.body.taskn;
    // var taskd = req.body.taskd;
    console.log(req.body)
    MongoClient.connect(url,function(err,client){
        console.log("connected to mongodb");
        const db = client.db(dbName)
    
        // client.close();    
        insert(db,function(){
            
        })
    })

    const insert = function(db,callback){
        const collection = db.collection('list')

        collection.insert(req.body,function(err,result){
            callback(result)
        })
    }
    res.status(200)
    res.redirect('/')
})

app.get('/datat',function(req,res){
    MongoClient.connect(url,function(err,client){
        const db = client.db(dbName)
        find(db,function(){
        })
    })

    const find = function(db,callback){
        const collection = db.collection('list')
        collection.find({}).toArray(function(err,result){
            res.send(JSON.stringify(result))
            callback(result)
        })
    }
})

app.get('/delete/:todoId',function(req,res){
   
   MongoClient.connect(url,function(err,client){
       const db = client.db(dbName)

       Inserto(db,function(){

       })
   })

   const Inserto = function(db,callback){
       const collection = db.collection('list')

       collection.deleteOne({"taskn":req.params['todoId']},function(err,result){
           console.log(JSON.stringify(req.params['todoId']))
           res.status(200)
           res.redirect('/')
       })
   }
})

app.get('/edit/:taskn',function(req,res){
    MongoClient.connect(url,function(err,client){
        const db = client.db(dbName)

        retreive(db,function(){

        })
    })
    // console.log(req.params['taskn'])

    const retreive = function(db,callback){
        const collection = db.collection('list')
        
        collection.find({'taskn':req.params['taskn']}).toArray(function(err,result){
            console.log(result[0].taskn)
            res.render('editTodo',{
                Taskn:result[0].taskn,
                Taskd:result[0].taskd
            })
        })
    }
})

app.post('/edit/saveTodo',function(req,res){
    let task = req.body.taskn
    let det = req.body.taskd

    MongoClient.connect(url,function(err,client){
        const db = client.db(dbName)

        updato(db,function(){

        })
    })

    const updato = function(db,callback){
        const collection = db.collection('list')

        console.log(`${task} ${det}`)

        collection.update({"taskn":task},{$set:{"taskd":det}},function(err,result){
            console.log(JSON.stringify(result))
            res.status(200)
            res.redirect('/')
        })    
    }

})

app.listen(3000,function(){
    console.log("on 3000")
})
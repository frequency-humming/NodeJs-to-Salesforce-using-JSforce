const express = require('express')
const jsforce = require('jsforce')
require('dotenv').config()
var bodyParser = require('body-parser')
const app = express()
require('./config/mongoose.js')
const mongoose = require('mongoose')
const { Cursor } = require('mongodb')
Log = mongoose.model('Log')
const PORT = 3001
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env
const conn = new jsforce.Connection({
    loginUrl: SF_LOGIN_URL
})

app.locals.message = 'String of Purses';

conn.login(SF_USERNAME, SF_PASSWORD+SF_TOKEN, (err, userInfo) => {
    if(err){
        console.error(err)
    } else {
        conn.streaming.topic('/event/Account_News__e').subscribe(function(message){
            console.log(message);
        })
        console.log('User ID: '+userInfo.id)
        console.log('Org ID: '+userInfo.organizationId) 
    }
})
app.get('/', (req, res) => {
    conn.query("SELECT Id, Name, Industry, Type, Rating FROM Account", (err, result) => {
        if(err){
            res.send(err)
        } else {
            console.log("Total records"+ result.totalSize)
            let data = new Array()
            for(x in result.records){
                data.push(
                    {
                        account:x,
                        name:result.records[x].Name,
                        industry:result.records[x].Industry,
                        type: result.records[x].Type,
                        rating: result.records[x].Rating
                    }
                )
            }
            console.log(JSON.stringify(data))
            res.render("home", {data:data}) 
        }
    })
})

app.get('/create', (req, res) => {
    conn.sobject("Account").create({ Name: 'Template Account for creation 1', Industry: 'Banking', Type: 'Prospect' }, (err, result) => {
            if(err || !result.success){
                res.send(err)
            } else {
                //console.log('Success:', result)
                console.log(`Success: ${result}`)
                res.send(result.id)
            }
    })
})
let data = new Array();
app.get('/logs',(req,res)=>{
    conn.query("SELECT Id, LogUserId, StartTime, LogUser.Name, LogLength, Operation, Request,\
    Application, Status, Location FROM ApexLog", (err, result) => {
        if(err){
            console.log('error',err)
            res.json(err)
        }else{
            //let data = new Array();
            for(x in result.records){
                data.push(
                    {
                        id:result.records[x].Id,
                        user:result.records[x].LogUserId,
                        event:result.records[x].Operation,
                        body: ''
                    }
                )
            }
            let count = data.length;
            for(var i = 0; i < count; i++){
                find(data[i],"event")
            }
            res.render('logs',{data:data});
        }
    })
})
async function find(data,string){
    try{
        await Log.find({_id:data.id}, function(err,res){
            if(err){
                console.log(err)
            } else{ 
                console.log(res.length)
                if(res.length === 0 && string == "event"){
                    new Log({_id:data.id,user:data.user,event:data.event,body:'0'}).save();
                    console.log('created');
                } else if(res.length === 1 && string == "body"){
                    Log.updateOne({_id:data.id},{body:data.body}, function(err,res){
                        if(err){
                            console.log('error: ',err)
                        }else{
                            console.log('response from update:',res)
                        }
                    });
                }
            }
        })
    }
    catch(e){
        console.log('error find function: ',e)
        throw e;
    }
}

app.get('/logs/:Id/body', (req,res) => {
    var requestURL = {
        url: '/services/data/v50.0/tooling/sobjects/ApexLog/'+req.params.Id+'/Body',
        method: 'get',
        body: '',
        headers : {
                "Content-Type" : "application/json"
            }
    };
    conn.request(requestURL, function(err,resp){ 
        if(err){
            console.log(err);
            res.json(err);
        }
        findBody(resp,req.params.Id);
        res.json(resp);
    })
})
function findBody(Bodydata,logId){
    try{
        let logBody = Bodydata;
        const index = data.findIndex((e) => e.id === logId)
        if(index < 0){
            return 'Must go to the /logs and pick an ID from the List';
        }
        data[index].body = logBody
        console.log(data[index])
        find(data[index],"body")
    }
    catch(e){
        console.log('error',e)
        throw new Error('call the logs page first')
    }
    
}  

app.listen(PORT, () => {
   console.log(`Server is running at http://localhost:${PORT}`)
})
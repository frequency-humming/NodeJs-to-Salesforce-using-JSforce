const express = require('express')
const jsforce = require('jsforce')
require('dotenv').config()
const app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
const PORT = 3001
const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env
const conn = new jsforce.Connection({
    loginUrl: SF_LOGIN_URL
})

conn.login(SF_USERNAME, SF_PASSWORD+SF_TOKEN, (err, userInfo) => {
    if(err){
        console.error(err)
    } else {
        conn.streaming.topic("/event/Account_News__e").subscribe(function(message){
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

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
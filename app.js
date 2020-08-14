const express = require('express')
const app = express()
const axios = require('axios');
const port = 3000
require('dotenv').config();

app.use((req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next()
});

app.get('/on', (req, res) => {
    let brightness = 254;
    let color = 49999;
    let sat = 40;
    let num = 1;

    if(typeof req.query.bright !== 'undefined' && req.query.bright != 'undefined' && req.query.bright) brightness = parseInt(req.query.bright);

    if(typeof req.query.color !== 'undefined' && req.query.color != 'undefined' && req.query.color) {
        switch(req.query.color.toUpperCase()){
            case 'PURPLE' : {
                color = 53311;
                sat = 254;
                break;
            }
            case 'WHITE' : {
                color = 40655;
                sat = 40;
                break;
            }
            case 'BLUE' : {
                color = 47104;
                sat = 254;
                break;
            }
            case 'RED' : {
                color = 0;
                sat = 254;
                break;
            }
            case 'YELLOW' : {
                color = 11350;
                sat = 254;
                break;
            }
            case 'GREEN' : {
                color = 11350;
                sat = 254;
                break;
            }
            default :{
                color = parseInt(req.query.color);
                if(typeof req.query.sat !== 'undefined' && req.query.sat != 'undefined' && req.query.sat){
                    color = parseInt(req.query.color);
                    sat =  parseInt(req.query.sat)
                }
            }        
        }
    }

    if(typeof req.query.num !== 'undefined' && req.query.num != 'undefined' && req.query.num) num = parseInt(req.query.num);

    axios.put(process.env.lightsIP + num +'/state', 
    {
        "on":true,
        "bri": brightness,
        "hue":color,
        "sat" : sat
    })
    .then(function (response) {
    console.log(response.data);
    })
    .catch(function (error) {
    console.log(error);
    })
    .then(function () {
    // always executed
    }); 
    res.send('Hello Light!')
});

app.get('/off', (req, res) => {

    let num = 1;
    if(typeof req.query.num !== 'undefined' && req.query.num != 'undefined' && req.query.num) num = parseInt(req.query.num);

    console.log(num)

    axios.put(process.env.lightsIP + num +'/state', 
    {
        "on":false
    })
    .then(function (response) {
        //console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {
        // always executed
    }); 
    res.send('GoodBye Light!')
});

app.get('/offAll', async (req, res) => {

    let lights = await axios.get(process.env.lightsIP)
    .then(x => Object.getOwnPropertyNames(x.data));
    console.log(lights)
    
    for(let i = 0; i < lights.length; i++){
        axios.put(process.env.lightsIP + lights[i] +'/state', 
        {
            "on":false
        })
        .then(function (response) {
            //console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        }); 
    }
    res.send('GoodBye Light!')
});

app.get('/onAll', async (req, res) => {
    let brightness = 254;
    let color = 49999;
    let sat = 40;

    let lights = await axios.get(process.env.lightsIP)
    .then(x => Object.getOwnPropertyNames(x.data));

    console.log(lights)

    for(let i = 0; i < lights.length; i++){
        axios.put(process.env.lightsIP + lights[i] +'/state', 
        {
            "on":true,
            "bri": brightness,
            "hue":color,
            "sat" : sat
        })
        .then(function (response) {
        console.log(response.data);
        })
        .catch(function (error) {
        console.log(error);
        })
        .then(function () {
        // always executed
        }); 
    }
    res.send('Hello Light!')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
require('dotenv').config()
let bodyParser = require('body-parser')
let express = require('express');
let app = express();
console.log('Hello World')


app.use(bodyParser.urlencoded({entended: false}))

app.post('/name', function(req, res) {
    const data = req.body
    res.json({name: data.first + ' '+ data.last})
})
app.get('/name', function(req, res) {
    const data = req.query
    res.json({name: data.first + ' '+ data.last})
})

app.get('/:word/echo', function(req, res) {
    const word = req.params.word
    res.send({echo: word})
})
app.get('/now', function(req, res, next) {
    req.time = new Date().toString()
    next()
}, function(req, res) {
    res.send({time: req.time})
})
app.get('/',function(req, res) {
    //res.send('Hello Express')
    res.sendFile(__dirname + '/views/index.html')
})
app.use('/', function(req,res,next) {
    console.log(req.method +' '+  req.path +' - '+  req.ip)

    next();
})
app.use('/public',express.static(__dirname + '/public'))

app.get('/json', function(req, res) {
    if (process.env.MESSAGE_STYLE === 'uppercase') {
        res.json({"message": 'HELLO JSON'})
    }
    res.json({"message": 'Hello json'})
    
})































 module.exports = app;

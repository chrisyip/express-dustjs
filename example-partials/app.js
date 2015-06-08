var express = require('express')
var app = express()
var path = require('path')

var dust = require('../index')

dust._.optimizers.format = function (ctx, node) {
    return node
}

app.engine('dust', dust.engine())
app.set('view engine', 'dust')
app.set('views', [
    path.resolve(__dirname, './views'),
    path.resolve(__dirname, './views/layouts'),
    path.resolve(__dirname, './views/partials')
])

app
    .get('/', function (req, res) {
        res.render('index', {
            title: 'Login'
        })
    })
    .post('/', function(req, res) {
        res.redirect('/home')
    })
    .get('/home', function(req, res) {
        res.render('home', {
            title: 'Home',
            name: 'Joe',
            sentence: 'the quick brown fox jumps over the lazy dog',
            number: req.query.number || 0
        })
    })

app.get('/error', function (req, res) {
    res.render('error')
})

app.listen(3001)
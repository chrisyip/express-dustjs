var express = require('express')
var app = express()
var path = require('path')

var dust = require('../index')

dust._.optimizers.format = function (ctx, node) {
    return node
}

app.set('view engine', 'dust')
app.set('views', [
    path.resolve(__dirname, './views'),
    path.resolve(__dirname, './views/partials')
])

app.get('/partial-example', function (req, res) {
    res.render('partial-example', {
        title: 'Hello world',
        name: 'Joe',
        sentence: 'The quick brown fox jumps over the lazy dog',
        number: req.query.number || 0
    })
})

app.get('/error', function (req, res) {
    res.render('error')
})

app.listen(3001)
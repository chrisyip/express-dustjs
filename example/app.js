var express = require('express')
var app = express()
var path = require('path')

var dust = require('../')

require('./helpers/upper.js')

dust._.optimizers.format = function (ctx, node) {
  return node
}

app.engine('dust', dust.engine({
  useHelpers: true
}))
app.set('view engine', 'dust')
app.set('views', [path.resolve(__dirname, './views'), path.resolve(__dirname, './other-views')])

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Hello world',
    name: 'Joe',
    sentence: 'The quick brown fox jumps over the lazy dog',
    number: req.query.number || 0
  })
})

dust._.helpers.error = function () {
  throw Error('Runtime error')
}

app.get('/error', function (req, res) {
  res.render('error')
})

app.get('/foo', function (req, res) {
  res.render('foo', {
    name: req.query.name
  })
})

app.get('/partial-not-found', function (req, res) {
  res.render('partial-not-found')
})

app.listen(3000)

module.exports = app

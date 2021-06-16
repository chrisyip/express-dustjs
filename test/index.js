var assert = require('assert')

var request = require('supertest')

var path = require('path')

var app = require('../example/app.js')

var req = request(app)


function includes (a, b) {
  if (typeof a === "string") {
    return a.indexOf(b) > -1
  }

  return false
}


function contains (substr) {
  return function (res) {
    if (!includes(res.text, substr)) {
      throw new Error('Can not found "' + substr + '"')
    }
  }
}

function notContains (substr) {
  return function (res) {
    if (includes(res.text, substr)) {
      throw new Error('"' + substr + '" should not exist')
    }
  }
}

describe('dust', function () {
  it('should work', function (done) {
    req.get('/')
      .expect(contains('Hello world'))
      .end(done)
  })

  it('should support variables', function (done) {
    req.get('/')
      .expect(contains('Joe'))
      .end(done)
  })

  it('should throw error when partial not found', function (done) {
    req.get('/partial-not-found')
      .expect(function (res) {
        if (res.statusCode !== 500) {
          throw new Error('Status code should be 500, saw', res.statusCode)
        }

        if (!(includes(res.text, 'ENOENT') && includes(res.text, 'layout-not-exist'))) {
          throw new Error('Should throw file not found error, but saw\n' + res.text)
        }
      })
      .expect(500, done)
  })

  it('should support binding other Dustjs instance', function (done) {
    require('../')(require('dustjs-linkedin'))

    var app = require('express')()
    app.set('view engine', 'dust')
    app.set('views', path.resolve(__dirname, '../example/views'))
    app.get('/', function () { this.render('index') })

    req.get('/').expect(contains('Hello world')).expect(200, done)
  })

  it('should throw exception', function (done) {
    req.get('/error').expect(500).expect(contains('Runtime error')).end(done)
  })

  it('should support array for view paths', function (done) {
    req.get('/foo?name=John').expect(200).expect(contains('Hello, John')).end(done)
  })
})

describe('dust.bind', function () {
  it('should support binding other Dustjs instance', function (done) {
    require('../').bind(require('dustjs-linkedin'))
    req.get('/').expect(200).end(done)
  })

  it('should do nothing with passing non-object value', function () {
    var dust = require('../')
    var bak = dust._
    dust.bind(null)

    assert.equal(bak, dust._)
  })
})

describe('dust.helpers', function () {
  it('should support custom helpers', function (done) {
    req.get('/').expect(200)
      .expect(contains('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG'))
      .end(done)
  })

  it('should support dustjs-helpers', function (done) {
    req.get('/?number=6')
      .expect(200)
      .expect(contains('foo'))
      .expect(notContains('bar'))
      .end(done)
  })
})

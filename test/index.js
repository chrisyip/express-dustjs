/* global describe: false, it: false */

var assert = require('assert')

var request = require('request')

/* jshint -W079 */
var Promise = require('bluebird')
/* jshint +W079 */

require('../example/app.js')
require('../example-partials/app.js')

function req (url, cb) {
  return request.get('http://localhost:3000/' + url, cb)
}

describe('dust', function () {
  it('should work', function (done) {
    req('', function (err, response, body) {
      assert.equal(response.statusCode, 200)
      assert.equal(body.indexOf('Hello world') > -1, true)
      done()
    })
  })

  it('should work when views is set to an array', function(done) {
    request.get('http://localhost:3001/partial-example', function(err, response, body) {
      assert.equal(response.statusCode, 200)
      assert.equal(body.indexOf('Hello world') > -1, true)
      done()
    })
  })

  it('should support variables', function (done) {
    req('', function (err, response, body) {
      assert.equal(response.statusCode, 200)
      assert.equal(body.indexOf('Joe') > -1, true)
      done()
    })
  })

  it('should support binding other Dustjs instance', function (done) {
    require('../')(require('dustjs-linkedin'))

    req('', function (err, response) {
      assert.equal(response.statusCode, 200)
      done()
    })
  })

  it('should throw exception', function (done) {
    req('error', function (err, response, body) {
      assert.equal(response.statusCode, 500)
      assert.equal(body.indexOf('Runtime error') > -1, true)
      done()
    })
  })
})

describe('dust.bind', function () {
  it('should support binding other Dustjs instance', function (done) {
    require('../').bind(require('dustjs-linkedin'))

    req('', function (err, response) {
      assert.equal(response.statusCode, 200)
      done()
    })
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
    req('', function (err, response, body) {
      assert.equal(response.statusCode, 200)
      assert.equal(body.indexOf('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG') > -1, true)
      done()
    })
  })

  it('should support dustjs-helpers', function (done) {
    Promise.all([
      new Promise(function (res) {
        req('', function (err, response, body) {
          assert.equal(response.statusCode, 200)
          assert.equal(body.indexOf('bar') > -1, true)
          assert.equal(body.indexOf('foo') === -1, true)
          res()
        })
      }),

      new Promise(function (res) {
        req('?number=6', function (err, response, body) {
          assert.equal(response.statusCode, 200)
          assert.equal(body.indexOf('foo') > -1, true)
          assert.equal(body.indexOf('bar') === -1, true)
          res()
        })
      })
    ]).then(function () {
      done()
    })
  })
})

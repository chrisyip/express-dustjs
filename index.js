var _ = require('lodash')
var fs = require('fs')
var path = require('path')

var cache = {}

var defaultOptions = {
  cache: true,
  ext: 'dust'
}

module.exports = function (dustjs) {
  var dust

  if (!_.isPlainObject(dustjs)) {
    dust = require('dustjs-linkedin')
  }

  Object.defineProperties(dust, {
    engine: {
      emuerable: true,
      value: function (opts) {
        var dustOptions = _.merge({}, defaultOptions, opts)

        if (dustOptions.useHelpers) {
          require('dustjs-helpers')
        }

        return function (file, options, callback) {
          var compiler

          if (dustOptions.cache) {
            compiler = cache[file]
          }

          var ext = '.' + (options.ext || dustOptions.ext)

          if (!_.isFunction(compiler)) {
            var content = fs.readFileSync(file).toString()
            compiler = dust.compileFn(content)
          }

          dust.onLoad = function (name, callback) {
            var content = fs.readFileSync(path.resolve(options.settings.views, name) + ext).toString()
            callback(null, content)
          }

          var context = dust.makeBase(options)

          compiler(context, function (err, content) {
            if (err) {
              return callback(err)
            }

            callback(null, content)
          })
        }
      }
    }
  })

  return dust
}

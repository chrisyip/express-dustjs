var dust = require('../../')._

dust.helpers.upper = function (chunk, ctx, bodies, params) {
  var sentence = dust.helpers.tap(params.value, chunk, ctx)

  return chunk.w(sentence.toUpperCase())
}

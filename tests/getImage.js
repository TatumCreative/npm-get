var test = require('tape')
var http = require('http')
var url = require('url')
var fs = require('fs')
var { getImage } = require('../index')
var PORT = 9573

test("getImage", function(t) {
  var server = http.createServer((req, res) => {
    switch(req.url) {
      case "/fixture.png":
        res.statusCode = 200
        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(fs.readFileSync(__dirname + '/fixture.png'), 'binary');
        break
      default:
        res.statusCode = 404
        var contents = "Not found"
        res.setHeader('content-type', 'text/plain; charset=UTF-8')
        res.setHeader('content-length', contents.length)
        res.end(contents)
        res.end()
    }
  })

  server.listen(PORT, 'localhost', () => {
    Promise.resolve()

    .then(() => { t.pass("Attempting to load the image.")
      return getImage(`http://localhost:${PORT}/fixture.png`).then(
        (img) => {
          t.equal(img.width, 100, "The image is 100 pixels wide")
          t.equal(img.height, 50, "The image is 50 pixels wide")
          t.equal(img.constructor.name, "HTMLImageElement",
                  "The returned object is an HTMLImageElement")
        },
        error => t.fail("Could not fetch fixture.png.")
      )
    })

    .then(() => { t.pass("Attempting to load a 404.")
      return getImage(`http://localhost:${PORT}/baz.png`).then(
        text => t.fail(),
        error => {
          t.pass("Result should be a rejected promise.")
          t.equal(error.constructor.name, "Event",
                  "The error is the image error Event object.")
        }
      )
    })

    .then(() => {t.end()}, () => t.fail())

    .then(() => server.close())
  })
})

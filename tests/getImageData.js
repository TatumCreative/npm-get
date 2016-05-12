var test = require('tape')
var http = require('http')
var url = require('url')
var fs = require('fs')
var { getImageData } = require('../index')
var PORT = 9573

test("getImageData", function(t) {
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

    .then(() => { t.pass("Attempting to load the image data.")
      return getImageData(`http://localhost:${PORT}/fixture.png`).then(
        ({data, width, height}) => {
          const pixelsInRGBA = 4
          const end = data.length
          t.equal(width, 100, "The image is 100 pixels wide")
          t.equal(height, 50, "The image is 50 pixels wide")
          t.equal(data.length, width * height * pixelsInRGBA,
                  "The data is the proper length.")

          t.deepEqual( [data[0], data[1], data[2], data[3]],
            [0, 4, 255, 255], "Top left pixel is correct")
          t.deepEqual([data[end-4], data[end-3], data[end-2], data[end-1]],
            [252, 3, 0, 75], "Bottom right pixel is correct")
        },
        error => t.fail("Could not fetch fixture.png.")
      )
    })

    .then(() => { t.pass("Attempting to load a 404.")
      return getImageData(`http://localhost:${PORT}/baz.png`).then(
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

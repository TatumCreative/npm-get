global.XMLHttpRequest = require('xhr2')
var test = require('tape')
var http = require('http')
var url = require('url')
var { getText } = require('../index')
var PORT = 9573

test("getText", function(t) {
  var server = http.createServer((req, res) => {
    switch(req.url) {
      case "/foo.txt":
        res.statusCode = 200
        var contents = "bar"
        res.setHeader('content-type', 'text/plain; charset=UTF-8')
        res.setHeader('content-length', contents.length)
        res.end(contents)

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

    .then(() => { t.pass("Attempting to load a text file.")
      return getText(`http://localhost:${PORT}/foo.txt`).then(
        text => t.equal(text, "bar", "foo.txt contains bar"),
        error => t.fail("Could not fetch foo.txt.")
      )
    })

    .then(() => { t.pass("Attempting to load a 404.")
      return getText(`http://localhost:${PORT}/baz.txt`).then(
        text => t.fail(),
        error => {
          t.pass("Result should be a rejected promise.")
          t.equal(error.constructor.name, "XMLHttpRequest",
                  "The error is an XMLHttpRequest object.")
        }
      )
    })

    .then(() => {t.end()}, () => t.fail())

    .then(() => server.close())
  })
})

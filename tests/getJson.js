global.XMLHttpRequest = require('xhr2')
var test = require('tape')
var http = require('http')
var url = require('url')
var { getJSON } = require('../index')
var PORT = 9573

test("getJSON", function(t) {
  var server = http.createServer((req, res) => {
    switch(req.url) {
      case "/foo.json":
        res.statusCode = 200
        var contents = JSON.stringify({bar: "baz"})
        res.setHeader('content-type', 'text/plain; charset=UTF-8')
        res.setHeader('content-length', contents.length)
        res.end(contents)

        break
      case "/bad.json":
        res.statusCode = 200
        var contents = "{'bar': baz"
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

    .then(() => { t.pass("Attempting to load a json file.")
      return getJSON(`http://localhost:${PORT}/foo.json`).then(
        json => t.equal(json.bar, "baz", "foo.json was processed correctly."),
        error => t.fail("Could not fetch foo.json.")
      )
    })

    .then(() => { t.pass("Attempting to load some bad json.")
      return getJSON(`http://localhost:${PORT}/bad.json`).then(
        json => {
          t.fail()
        },
        error => {
          t.pass("Result should be a rejected promise.")
          t.equal(error.constructor.name, "SyntaxError",
                  "The error is an XMLHttpRequest object.")
        }
      )
    })

    .then(() => { t.pass("Attempting to load a 404.")
      return getJSON(`http://localhost:${PORT}/404.json`).then(
        text => t.fail(),
        error => {
          t.pass("Result should be a rejected promise.")
          t.equal(error.constructor.name, "XMLHttpRequest",
                  "The error is an XMLHttpRequest object.")
        }
      )
    })

    .then(() => t.end(), () => t.fail())

    .then(() => server.close())
  })
})

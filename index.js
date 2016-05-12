exports.getText = function(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest()
    req.responseType = "text"
    req.addEventListener("load", function() {
      if(this.status >= 200 && this.status < 300) {
        resolve(this.response)
      } else {
        reject(this)
      }
    })
    req.open("GET", url)
    req.send()
  })
}

exports.getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest()
    req.responseType = "text"
    req.addEventListener("load", function() {
      if(this.status >= 200 && this.status < 300) {
        try {
          // Try parsing this ourselves, instead of using responseType "json".
          // We can't detect the error in JSON if using the built-in.
          resolve(JSON.parse(this.response))
        } catch(error) {
          reject(error)
        }
      } else {
        reject(this)
      }
    })
    req.open("GET", url)
    req.send()
  })
}

exports.getImageData = function(url) {
  return new Promise(function(resolve, reject) {
    var img = new Image()
    img.addEventListener('load', () => {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      resolve(ctx.getImageData(0, 0, canvas.width, canvas.height))
    })
    img.addEventListener('error', reject)
    img.src = url
  })
}

exports.getImage = function(url) {
  return new Promise(function(resolve, reject) {
    var img = new Image()
    img.addEventListener('load', () => {
      resolve(img)
    })
    img.addEventListener('error', reject)
    img.src = url
  })
}

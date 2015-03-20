express = require 'express'
router = require './router'
app = express()
app.set 'port', process.env.PORT or 3000
router.define app

# Set up port
# ========================================================
app.listen app.get('port'), ->
  console.log 'Node app is running at localhost:' + app.get 'port'

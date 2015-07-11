import express = require('express');
var router : express.Router = express.Router();

/* GET users listing. */
router.get('/', function(req: express.Request, res : express.Response, next: Function) {
  res.send('respond with a resource');
});

module.exports = router;

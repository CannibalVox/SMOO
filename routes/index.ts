import express = require('express');
var router : express.Router = express.Router();

var data = [
  {"author": "Pete Hunt", "text": "This is one comment"},
  {"author": "Jordan Walke", "text": "This is *another* comment"}
];

/* GET users listing. */
router.get('/', function(req: express.Request, res : express.Response, next: Function) {
    res.render('index', { title: 'Express' });
});

router.get('/comments', function(req: express.Request, res:express.Response, next: Function) {
    res.send(data);
});

router.post('/comments', function(req: express.Request, res:express.Response, next: Function) {
    data.push(req.body);
    res.send(data);
});

module.exports = router;

/*eslint-disable no-unused-vars*/
// because req param
const express = require('express');

const router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Ambrosus Challenge' });
});

//avoid favicon request errors on node server
router.get('/favicon.ico', function(req, res) {
  res.writeHead(200, {'Content-Type' : 'image/x-icon'});
  res.end();
  return;
});

module.exports = router;

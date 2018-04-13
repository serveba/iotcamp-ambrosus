/*eslint-disable no-unused-vars*/
// because req param
const express = require('express');

const AmbrosusHelper = require('../helpers/ambrosushelper');
const api = new AmbrosusHelper();

const router = express.Router();

router.get('/', async function(req, res) {
  const assetId = '0x09cafe6985329c9c706b186a7f37e3ebbec4963508ae994690cb3de30b0ef26d';
  const result = await api.retrieveEvents(assetId);

  res.render('index', {
    title: 'Ambrosus Challenge',
    result: result
  });
});

//avoid favicon request errors on node server
router.get('/favicon.ico', function(req, res) {
  res.writeHead(200, {'Content-Type' : 'image/x-icon'});
  res.end();
  return;
});

module.exports = router;

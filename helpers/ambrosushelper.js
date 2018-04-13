const logger = require('./loggerhelper');
const settings = require('../config/settings');
const rp = require('request-promise');

module.exports = class AmbrosusHelper {

  async createAsset(sequence) {
    let result = '';
    const options = {
      method: 'POST',
      uri: settings.AMB_URL,
      headers: {
        'Accept': 'application/json',
        'Authorization': settings.AMB_ID_AUTH,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'content': {
          'idData': {
            'createdBy': settings.AMB_PROVIDER_ADDR,
            'timestamp': Math.floor(new Date() / 1000),
            'sequenceNumber': sequence
          }
        }
      })
    };

    try {
      result = await rp(options);
    }catch (err) {
      logger.info('options: ', options);
      logger.error(err);
    }
    return result;
  }

  async createEvent(assetId, entries) {
    // const entries = [
    //   {'type': 'custom', 'message': 'This is the first event'},
    //   ...
    // ];
    let result = '';
    logger.info('createEvent, assetId', assetId);

    const options = {
      method: 'POST',
      uri: settings.AMB_URL + assetId + '/events',
      headers: {
        'Accept': 'application/json',
        'Authorization': settings.AMB_ID_AUTH,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'content': {
          'idData': {
            'assetId': assetId,
            'createdBy': settings.AMB_PROVIDER_ADDR,
            'timestamp': Math.floor(new Date() / 1000),
            'sequenceNumber': 0,
            'accessLevel': 0
          },
          'data': {
            'entries': entries
          }
      }
      })
    };

    try {
      result = await rp(options);
    }catch (err) {
      logger.info('options: ', options);
      logger.error(err);
    }
    return result;
  }

  async retrieveEvents(assetId) {
    const url = settings.AMB_URL + assetId + '/events';
    const options = {uri: url };
    let result = '';
    try {
      result = await rp(options);
    }catch (err) {
      logger.info('options: ', options);
      logger.error(err);
    }
    return result;
  }
};

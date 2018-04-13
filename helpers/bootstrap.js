const logger = require('./loggerhelper');
const settings = require('../config/settings');
const rp = require('request-promise');
const fs = require('fs');

const AmbrosusHelper = require('../helpers/ambrosushelper');
const api = new AmbrosusHelper();

module.exports = class Bootstrap {

  async createItemsOnBlockchain() {
    const FIXTURE_PATH = 'config/bundle_items.json';
    let json = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf-8'));
    let promises = [];
    for(let i=0; i<json.assets.length; i++) {
      let asset = json.assets[i];
      let result = await api.createAsset(i);
      let assetId = JSON.parse(result).assetId;
      logger.info('Created asset: ', result);
      logger.info('assetId: ', assetId);
      let entries = [];
      for(let j=0; j<asset.metadata.length; j++) {
        let attribute = asset.metadata[j];
        let entry = {
          'type': attribute.type,
          'message': attribute.message
        };
        logger.info('entry : ' + j, entry);
        entries.push(entry);
      }
      promises.push(api.createEvent(assetId, entries));
    }
    return Promise.all(promises);
  }
};

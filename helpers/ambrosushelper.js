const logger = require('./loggerhelper');
const settings = require('../config/settings');
const i18n = require('i18n');
const rp = require('request-promise');


module.exports = class AmbrosusHelper {



  async createAsset(asset) {

  }

  async createEvent(event) {

  }

  async retrieveEvents(assetId) {

  }

  /**
   * Receiving a message from FB user
   */
  async receivedMessage(event) {

    const senderId = event.sender.id;
    const locale = await this.getUserLocale(senderId);
    const {message} = event;
    const {mid, text, attachments} = message;

    logger.info('FB receivedMessage mid: ' + mid);
    logger.info('Event data: ', event);
    logger.info('Message data: ', event.message);
    logger.info('FB locale: ' + locale);

    // attachments
    if(attachments) {
      this.sendTextMessage(senderId, i18n.message('Attachments not supported yet', locale));
      return;
    }

    if(text) {
      await this.processReceivedMessage(senderId, text, locale);
    }
  }

  async createStartButton() {
    const options = {
      method: 'POST',
      uri: getMsnProfileUrl(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'get_started':{
          'payload':'GET_STARTED_PAYLOAD'
        }
      })
    };
    try {
      const response = await rp(options);
      logger.info('FB createStartButton Success!', response);
    }catch (err) {
      logger.info('options: ', options);
      logger.error('FB createStartButton error: ', err);
    }
  }

  // delete get_started button -> fields: ['get_started']
  // delete persisten_menu -> fields: ['persistent_menu']
  async deleteFields(fields) {
    const options = {
      method: 'DELETE',
      uri: getMsnProfileUrl(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields : fields
      })
    };
    try {
      const response = await rp(options);
      logger.info(`FB deleteFields: ${fields} Success!`, response);
    }catch (err) {
      logger.info('options: ', options);
      logger.error('FB deleteFields error: ', err);
    }
  }

  /**
   * Send message with options, images, etc...
   * to FB messenger
   */
  async sendGenericMessage(senderId, elements) {
    const options = {
      method: 'POST',
      uri: getMsnMessageUrl(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient : { id: senderId },
        message : {
          attachment: {
            type: 'template',
            payload: { template_type: 'generic', elements: elements }
          }
        }
      })
    };
    try {
      const response = await rp(options);
      logger.info('FB sendGenericMessage Success!', response);
    }catch (err) {
      logger.info('options: ', options);
      logger.error('FB sendGenericMessage error: ', err);
    }
  }

  /**
   * Send plain text message to FB messenger
   */
  async sendTextMessage(target, message) {
    const options = {
      method: 'POST',
      uri: getMsnMessageUrl(),
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'recipient' : {
          id: target
        },
        'message' : { text: message }
      })
    };

    try {
      const response = await rp(options);
      logger.info('FB sendTextMessage Success!', response);
    }catch (err) {
      logger.info('options:', options);
      logger.error('FB sendTextMessage error: ', err);
    }
  }

  async processReceivedMessage(senderId, text, locale) {
    let {state, zaname} = await getState(senderId);
    logger.info('state: ', state);
    try {
      switch (state) {
      case ST_USER_NOT_FOUND:
        zaname = await ZAName.createUser(senderId, null, 'SEARCH_TARGET', locale, 'FB');
        await this.sendWelcomeMessage(senderId, locale);
        await this.createStartButton();
        //await this.createPersistentMenu(senderId, getPersistentMenuItems());
        const replyText = i18n.message('Type text to search your school', locale);
        await this.sendTextMessage(senderId, replyText);
        break;
      case ST_USER_NOT_REGISTERED:
        const tg = await ZATargetGroup.findByText(text.trim());
        logger.info('targetGroups', tg);
        await this.sendTargetMatchesMessage(senderId, tg.targetGroups, locale);
        break;
      case ST_USER_REGISTERED:
        const message = new ZAMessage({
          source : zaname.name,
          target : zaname.target,
          text : text,
          sentFromStaffer : false
        });
        await messageHelper.receiveMessage(message, 'FB');
        break;
      default:
        logger.error('Undefined state: ' + state);
      }
    } catch (e) {
      logger.error('processReceivedMessage error: ', e);
    }
  }

  async sendWelcomeMessage(senderId, locale) {
    // const subtitle = isUserNew ? i18n.message('Type text to search your school', locale)
    //                            : i18n.message('Continue conversation', locale);
    const elements = {
      title: i18n.message('Welcome', locale),
      //subtitle: subtitle,
      image_url: 'http://goo.gl/GJhHXN',
      buttons: [{
        type: 'web_url',
        title: i18n.message('More info', locale),
        url: 'http://zeroacoso.org/'
      }],
    };
    logger.info('locale:', locale);
    logger.info('elements: ', elements);
    await this.sendGenericMessage(senderId, [elements]);
  }

  async sendTicketCloseMessage(senderId) {
    const locale = await this.getUserLocale(senderId);
    const elements = {
      title: i18n.message('Ticket closed', locale),
      subtitle: i18n.message('Ticket closed desc', locale),
      image_url: 'http://goo.gl/GJhHXN',
      buttons: [{
        type: 'web_url',
        title: i18n.message('More info', locale),
        url: 'http://zeroacoso.org/'
      }],
    };
    await this.sendGenericMessage(senderId, [elements]);
  }

  async sendTargetMatchesMessage(senderId, tg, locale) {
    if(tg.length === 0) {
      let replyText = i18n.message('Sorry, no results', locale);
      await this.sendTextMessage(senderId, replyText);
      replyText = i18n.message('Type text to search your school', locale);
      await this.sendTextMessage(senderId, replyText);
      return;
    }
    let elements = [];
    // we present all the targets as options
    for (let i = 0; i < tg.length; i++) {
      let targets = tg[i].targets;
      logger.info('targets', targets);
      for (let k = 0; k < targets.length; k++) {
        const target = targets[k];
        const name = tg[i].targets.length > 1 ? target.name + ' ' + target.type
                                              : target.name;
        let element = {
          title: i18n.message('Please, choose one option:', locale),
          //image_url: 'http://goo.gl/GJhHXN'
          buttons : [{
            type: 'postback',
            title: name.substr(0,20), // limit 20 chars
            payload: target._id // limit 1000 chars
          }]
        };
        elements.push(element);
      }

    }

    // we append the 'Cannot find my school' option
    elements.push({
      title: i18n.message('Please, choose one option:', locale),
      //image_url: 'http://goo.gl/GJhHXN'
      buttons : [{
        type: 'web_url',
        url: 'https://www.zeroacoso.org/formulario-app/',
        title: i18n.message('Cannot find my school', locale).substr(0,20)
      }]
    });

    logger.info('elements: ', elements);
    await this.sendGenericMessage(senderId, elements);
  }

  /**
   * Getting the fb user locale
   */
  async getUserLocale(senderId) {
    const base = settings.FB_GRAPH_BASE_URL + encodeURIComponent(senderId);
    const options = {
      method: 'GET',
      uri: base + '?fields=locale,timezone,gender&access_token=' + settings.FB_ACCESS_TKN,
      headers: { 'Content-Type': 'application/json' }
    };
    logger.info('getUserLocale:', options);
    try{
      const response = await rp(options);
      logger.info(response);
      const locale  = i18n.generateLocale(JSON.parse(response).locale.substring(0,2));
      logger.info(`senderId ${senderId} locale: ${locale} `);
      return locale;
    }catch (err) {
      logger.error('FB getUserLocale error: ', err);
    }
  }
};

const getMsnMessageUrl = function() {
  return settings.FB_MESSENGER_URL + encodeURIComponent(settings.FB_ACCESS_TKN);
};

const getMsnProfileUrl = function() {
  return settings.FB_PROFILE_URL + encodeURIComponent(settings.FB_ACCESS_TKN);
};

async function getState(senderId) {
  try {
    logger.info(`getState: ${senderId}`);
    let zaname = await ZAName.find({source: senderId});
    // user does not exists
    if(zaname.length === 0) {
      return {
        state: ST_USER_NOT_FOUND,
        zaname: zaname
      };
    }
    zaname = zaname[0];
    // user registered in any target
    return (zaname.target) ? { state: ST_USER_REGISTERED, zaname: zaname } :
                             { state: ST_USER_NOT_REGISTERED, zaname: zaname };
  }catch(err) {
    logger.error(err);
  }
}

function getPersistentMenuItems() {
  let actions = [];

  actions.push({
    'title':'Change school',
    'type':'postback',
    'payload':'CHANGE_TARGET'
  });

  actions.push({
    'title':'Close conversation',
    'type':'postback',
    'payload':'CLOSE_TICKET'
  });

  return [{
    locale: 'default',
    composer_input_disabled: false,
    call_to_actions: actions
  }];
}

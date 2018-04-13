'use strict';
var RestTest = {

  //contextPath: 'http://localhost:3000',
  contextPath: '',

  jsonTabSpaces: 4
};

RestTest.init = function() {
  RestTest.initHandlers();
};

RestTest.initHandlers = function() {
  $('#sendsms_form').on('submit', function(e) {
    e.preventDefault();
    var data = $('#sendsms_form :input').serializeArray();
    var idStaffer = data[0].value;
    var idTicket = data[1].value;
    var message = data[2].value;

    RestTest.sendsms(idStaffer, idTicket, message);
  });

  $('#authenticate_form').on('submit', function(e) {
    e.preventDefault();
    var data = $('#authenticate_form :input').serializeArray();
    var login = data[0].value;
    var password = data[1].value;

    RestTest.authenticate(login, password);
  });

  $('#receivesms_form').on('submit', function(e) {
    e.preventDefault();
    var data = $('#receivesms_form :input').serializeArray();
    var from = data[0].value;
    var to = data[1].value;
    var body = data[2].value;

    RestTest.receivesms(from, to, body);
  });

  $('#gettargets_form').on('submit', function(e) {
    e.preventDefault();
    RestTest.getTargets();
  });

  $('#getstaffers_form').on('submit', function(e) {
    e.preventDefault();
    var data = $('#getstaffers_form :input').serializeArray();
    var idTarget = data[0].value;
    RestTest.getStaffers(idTarget);
  });

  $('#gettickets_form').on('submit', function(e) {
    e.preventDefault();
    var data = $('#gettickets_form :input').serializeArray();
    var idTarget = data[0].value;
    RestTest.getTickets(idTarget);
  });

  $('#closeticket_form').on('submit', function(e) {
    e.preventDefault();
    var data = $('#closeticket_form :input').serializeArray();
    var idTicket = data[0].value;
    var idStaffer = data[1].value;
    RestTest.closeTicket(idTicket, idStaffer);
  });

  $('#getmessages_form').on('submit', function(e) {
    e.preventDefault();
    var data = $('#getmessages_form :input').serializeArray();
    var idTicket = data[0].value;
    RestTest.getMessages(idTicket);
  });

   $('#getcharts_form').on('submit', function(e) {
    e.preventDefault();
    var data = $('#getcharts_form :input').serializeArray();
    var id = data[0].value;
    var startDate = data[1].value;
    var endDate = data[2].value;
    var typeOfChart = data[3].value;
    RestTest.getCharts(id,startDate,endDate,typeOfChart);
  });

  $('#getcsv_form').on('submit', function(e) {
    e.preventDefault();
    var data = $('#getcsv_form :input').serializeArray();
    var targetId = data[0].value;
    RestTest.exportMessages(targetId);
  });

  $('#targets_form').on('submit', function(e) {
    e.preventDefault();
    RestTest.getTargets();
  });

  $('#newfakeenv_form').on('submit', function(e) {
    e.preventDefault();
    RestTest.newfakeenv();
  });

  $('#filltestdb_form').on('submit', function(e) {
    e.preventDefault();
    RestTest.filltestdb();
  });

  $('#cleartestdb_form').on('submit', function(e) {
    e.preventDefault();
    RestTest.cleartestdb();
  });


  $('#clear_response').on('click', RestTest.clearResponses);
};

RestTest.printResponse = function(jsonObject) {
  var response = JSON.stringify(jsonObject, null, RestTest.jsonTabSpaces);
  $('#response_textarea').text(response);
};

RestTest.sendsms = function(idStaffer, idTicket, message) {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#sendsms_form').attr('action');
  var params = {
    idStaffer : idStaffer,
    idTicket: idTicket,
    message: message
  };
  var html = '<b>POST: </b><i>' + url + '?' + $.param(params) + '</i>';
  $('#request_text').html(html);
  RestTest.makeRequest(url, 'POST', null, params);
};

RestTest.authenticate = function(login, password) {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#authenticate_form').attr('action');
  var params = {
    login : login,
    password : password
  };
  var html = '<b>POST: </b><i>' + url + '?' + $.param(params) + '</i>';
  $('#request_text').html(html);

  $.post(url, params, function(result) {

    $('#token').val(result.token);
    $('#key').val(result.user.login);
  });

};

RestTest.receivesms = function(from, to, body) {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#receivesms_form').attr('action');
  var params = {
    From: from,
    To: to,
    Body: body
  };
  var html = '<b>POST: </b><i>' + url + '?' + $.param(params) + '</i>';
  $('#request_text').html(html);
  RestTest.makeRequest(url, 'POST', null, params);
};

RestTest.getTargets = function() {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#gettargets_form').attr('action');
  $('#request_text').html('<b>GET: </b><i>' + url + '</i>');
  RestTest.makeRequest(url, 'GET', 'json');
};

RestTest.getStaffers = function(idTarget) {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#getstaffers_form').attr('action');
  url += '/' + idTarget + '/staffers';
  $('#request_text').html('<b>GET: </b><i>' + url + '</i>');
  RestTest.makeRequest(url, 'GET', 'json');
};

RestTest.getTickets = function(idTarget) {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#gettickets_form').attr('action');
  url += '/' + idTarget + '/tickets';
  $('#request_text').html('<b>GET: </b><i>' + url + '</i>');
  RestTest.makeRequest(url, 'GET', 'json');
};

RestTest.closeTicket = function(idTicket, idStaffer) {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#closeticket_form').attr('action');
  var dataParams = {
    id : idTicket,
    idstaffer : idStaffer
  };
  $('#request_text').html('<b>POST: </b><i>' + url + '</i>');
  RestTest.makeRequest(url, 'POST', null, dataParams);
};

RestTest.getMessages = function(idTicket) {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#getmessages_form').attr('action');
  url += '?idTicket=' + encodeURIComponent(idTicket);
  $('#request_text').html('<b>GET: </b><i>' + url + '</i>');
  RestTest.makeRequest(url, 'GET', 'json');
};


RestTest.getCharts = function(id, startDate, endDate, typeOfChart) {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#getcharts_form').attr('action');
  url += '?id=' + encodeURIComponent(id);
  url += '&startDate=' + encodeURIComponent(startDate);
  url += '&endDate=' + encodeURIComponent(endDate);
  url += '&typeOfChart=' + encodeURIComponent(typeOfChart);
  $('#request_text').html('<b>GET: </b><i>' + url + '</i>');
  RestTest.makeRequest(url, 'GET', 'json');
};

RestTest.exportMessages = function(targetId) {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#getcsv_form').attr('action');
  url += '?idTarget=' + encodeURIComponent(targetId);
  RestTest.makeRequest(url, 'GET');
  //window.open(url);
};

RestTest.newfakeenv = function() {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#newfakeenv_form').attr('action');
  $('#request_text').html('<b>GET: </b><i>' + url + '</i>');
  RestTest.makeRequest(url, 'GET', 'json');
};

RestTest.filltestdb = function() {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#filltestdb_form').attr('action');
  $('#request_text').html('<b>POST: </b><i>' + url + '</i>');
  RestTest.makeRequest(url, 'POST');
};

RestTest.cleartestdb = function() {
  RestTest.clearResponses();
  var url = RestTest.contextPath + $('#cleartestdb_form').attr('action');
  $('#request_text').html('<b>POST: </b><i>' + url + '</i>');
  RestTest.makeRequest(url, 'POST');
};

RestTest.makeRequest = function(url, type, dataType, dataParams) {
  var params = {
    url: url,
    success: function(data) {
      RestTest.printResponse(data);
    },
    error: RestTest.processErrorCallback
  };

  if(type !== 'GET') {
    params.type = type;
  }

  if(dataType) {
    params.dataType = dataType;
  }

  if(dataParams) {
    params.data = dataParams;
  }

  var tokenKey =$('#key').val();
  var accessToken = $('#token').val();

  if(tokenKey && accessToken) {
    params.headers = {
      'x-access-token' : accessToken,
      'x-key' : tokenKey
    };
  }

  $.ajax(params);
};


RestTest.processErrorCallback = function(err) {
  var text = 'HTTP ' + err.status + ': ' + err.statusText +
    '\nResponseText: ' + err.responseText +
    '\nResponseHeaders: ' + err.getAllResponseHeaders();
  $('#response_textarea').text(text);
};

RestTest.clearResponses = function() {
  $('#response_textarea').text('');
  $('#request_text').html('');
};


$(function() {
  RestTest.init();
});

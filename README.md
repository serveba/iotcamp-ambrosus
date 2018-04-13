# ZA Core

This is the description file of the project. Here you will find usefull tips for configuring/running the application.

The settings.js file holds the project configuration. It's better to keep that file outside the project, by this way we don't have to store all the credentials/configuration on the source code. In the git repo we only have a mock settings.js and this links to another file (that has all the passwords and sensible data) on our local path. This solution is more secure than storing everything on the config/settings.js file.


### Running the project 

For running the project after clonning the git repo and editing your settings.js file you have to type:

	$> npm install

This command installs all the node.js project dependencies under the node_modules directory.

If you want to rebuild the project you can type:

	$> rm -r node_modules && npm install

After installing node dependencies you are able to run the project; in order to run the project you can use the following scripts that are defined in the package.json file:
    
    "start": "node app.js",
    
    "test": "mocha test/helpers/testtwiliohelper.js && mocha test/helpers/testzatargethelper && mocha test/helpers/testzastafferhelper.js 
    && mocha test/helpers/testzamessagehelper.js",
    
    "local_env": "NODE_ENV=local node app.js",
    
    "local_env_disable_sms": "NODE_ENV=local DISABLE_SMS=true supervisor app.js",
    
    "test_env": "NODE_ENV=test node app.js",
    
    "production_env": "NODE_ENV=production node app.js"


The scrips "start" and "test" are special because are always defined (in a implicit or explicit way). For example if you are on your project root directory and type:

    $> npm test

You will run all the unit test of ZA core with the mocha utility. Or if you type:

	$> npm start

You run a instance on ZA core with the mongo test db (is the same of ```npm run-script testenv``` script). The other scripts has to be invoked like that:

    $> npm run-script local_env

    $> npm run-script local_env_disable_sms

	$> npm run-script test_env

	$> npm run-script production_env

With all these commands the port of ZA core is 3000 by default, but you can change it setting the PORT environment var before running the command. For example:

	$> PORT=1337 npm run-script localenv

### Generating test data in mongodb 

If you have configured the test mongo db you can create test collections and documents with this POST from the shell:

	$> curl -X POST "http://localhost:3000/testing/filltestdb"

This command removes the created collections:

	$> curl -X POST "http://localhost:3000/testing/cleartestdb"


Both commands manage the entities with the mongoose framework and uses the file test/fixtures.json.

### Interactive Testing 

For testing the restful methods from the browser I have created a simple frontend interface where you can perform some actions: <http://localhost:3000/testing/rest>

### Running unit tests

If you want to run all the unit test of the ZA core app you only have to type:

	$> npm test


If you want to run some specific unit test, for example:


	$> mocha test/helpers/testtwiliohelper.js
	
**Note**: in order to run unit tests you need to configure the settings.js db.localtest key with the parameters of the local mongo database for running the unit tests, by default I have the following configuration:

	//This db environment is only for unit testing
    localtest : {
      uri : 'localhost:27017/localtest',
      options : {
        db : {
          native_parser : true
        },
        user : 'serveba',
        pass : ''
      }
    }
//TODO We have to figure out how to get this working in the deployment phase

***

# ZACore RESTFull API Documentation

At this section we will describe all the methods of the ZACore API.

###Authenticate


Resource URI:

	POST '/api/v1/admin/authenticate'

PARAMETERS   | DESCRIPTION  
:----------- | :-----------
**login**    | (Body param : String) -> The staffer login 
**password** | (Body param : String) -> The staffer password 

#####Examples:

curl -X POST -d "login=hulk&password=hu1k" http://localhost:3000/api/v1/admin/authenticate

HTTP 200 Response:

	{
	    "user": {
	        "__v": 0,
	        "_id": "5598fbf6a34e119fe4ae0eae",
	        "closedTickets": 6,
	        "email": "hulk@gmail.com",
	        "idTarget": "5589d6864d8b8ebe059a813b",
	        "targetIds": [
	            "5589d6864d8b8ebe059a813b"
	        ],
	        "job": "facilis tempora repellendus rerum omnis sed assumenda laudantium",
	        "language": "ES",
	        "login": "hulk",
	        "name": "David Bruce Banner",
	        "password": "4202185e39a2048489eb3ad03897539ccc76cc75570e4b8eac5a546a4533b41c",
	        "phone": "(081) 555-1450 x144",
	        "role": "STAFF",
	        "smsEnabled": false
	    }
	}

curl -X POST -d "login=hulk&password=hk" http://localhost:3000/api/v1/admin/authenticate

HTTP 500 Response:

	{
    	"code": "ZAE0003",
	    "message": "The credentials are wrong"
	}
###Targets


Resource URI:

	GET '/api/v1/admin/targets'

PARAMETERS   | DESCRIPTION  
:----------- | :-----------
idTarget    | (Query param : ObjectId) -> The target to retrieve. If not provided then return all the targets


#####Examples:

Retrieve only one target:

curl "http://localhost:3000/api/v1/admin/targets?idTarget=5589d6864d8b8ebe059a813b"

HTTP 200 Response:

	
    {
        "__v": 0,
        "_id": "5589d6864d8b8ebe059a813b",
        "active": true,
        "address": "9416 Rosenbaum Radial",
        "contactNumber": "+34941060465",
        "createdAt": "2015-09-05T09:13:56.523Z",
        "description": "First target for testing purposes",
        "language": "ES",
        "name": "First target"
    }

Retrieving all targets:

curl "http://localhost:3000/api/v1/admin/targets"

HTTP 200 Response:

	[
	    {
	        "__v": 0,
	        "_id": "5589d6864d8b8ebe059a813b",
	        "active": true,
	        "address": "9416 Rosenbaum Radial",
	        "contactNumber": "+34941060465",
	        "createdAt": "2015-09-05T09:13:56.523Z",
	        "description": "First target for testing purposes",
	        "language": "ES",
	        "name": "First target"
	    },
	    {
	        "__v": 0,
	        "_id": "55d9f9de2e2fac6f3f2d75af",
	        "active": true,
	        "address": "Walt Disney Studios",
	        "contactNumber": "+34941060466",
	        "createdAt": "2015-09-05T09:13:56.533Z",
	        "description": "Second target for testing purposes",
	        "language": "ES",
	        "name": "Second target"
	    },
	    {
	        "__v": 0,
	        "_id": "55d9fb822e2fac6f3f2d75b4",
	        "active": true,
	        "address": "George RR Martin house",
	        "contactNumber": "+34941060467",
	        "createdAt": "2015-09-05T09:13:56.534Z",
	        "description": "Third target for testing purposes",
	        "language": "ES",
	        "name": "Third Target"
	    }
	]
	
Importing targets and supporters from a given file

Resource URI:

	POST '/api/v1/admin/targets'

PARAMETERS   | DESCRIPTION  
:----------- | :-----------
file    | (body param : file) -> The file to import, is the same structure of test/fixtures.json sample file


#####Examples:

Importing three targets and his supporters:

curl -F "file=@test/fixtures.json" "http://localhost:3000/api/v1/admin/targets"

HTTP 200 Response:

	OK
	
Updating target attributes:
	
Resource URI:

	PUT '/api/v1/admin/targets'

PARAMETERS   | DESCRIPTION  
:----------- | :-----------
**idTarget**    | (query param : ObjectId) -> The target to update (mandatory)
contactNumber    | (body param : String) -> Target contact number
name    | (body param : String) -> Target name
description    | (body param : String) -> Target description 
address    | (body param : String) -> Target address
active    | (body param : boolean) -> Target enabled
oofInit    | (body param : String) -> String with four numbers that represents the time (HHMM) when the oof starts, for example if is 1900 oof starts at 7 p.m.
oofEnd    | (body param : String) -> String with four numbers that represents the time (HHMM) when the oof ends, for example if is 0800 oof ends at 8 a.m.
oofMessage    | (body param : String) -> The reply text to reporter when the OOF time range is active (140 chars)
tplInternalNote    | (body param : String) -> Template text that is included at the beginning of the message (by default is empty) of internal note notification.
tplNewTicket    | (body param : String) -> Template text that is included at the beginning of the message (by default is empty) of new ticket notification.
gracePeriod | (body param : number) -> Seconds of grace after closing a ticket. If a message comes in between this period we don't create a new ticket.
offline | (body param : boolean) -> Marks the target offline for an undefined period of time (e.g. summertime, weekends...)



#####Examples:

Updating contactNumber of a given target: 

curl -X PUT -d "contactNumber=1234" "http://localhost:3000/api/v1/admin/targets?idTarget=5589d6864d8b8ebe059a813b"

HTTP 200 Response:

	{
	    "__v": 0,
	    "_id": "5589d6864d8b8ebe059a813b",
	    "active": true,
	    "address": "9416 Rosenbaum Radial",
	    "contactNumber": "1234",
	    "createdAt": "2015-09-05T18:33:48.431Z",
	    "description": "First target for testing purposes",
	    "language": "ES",
	    "name": "First target"
	}
	
###Adding/Removing numbers to the target blacklist

Resource URI:

	PUT '/api/v1/admin/target/:id/blacklist'
	DELETE '/api/v1/admin/target/:id/blacklist'

PARAMETERS    | DESCRIPTION  
:-----------  | :-----------
**:id** | (Path param String : ObjectId) -> represents the target 
**number** | (Query String : String) -> number to block

#####Examples:

Blocking a new number (BANNED_USER):

  curl -X PUT "http://localhost:3000/api/v1/admin/targets/5589d6864d8b8ebe059a813b/blacklist?number=BANNED_USER"

HTTP 200 Response:
	
	{
	    "__v": 0,
	    "_id": "5589d6864d8b8ebe059a813b",
	    "active": true,
	    "address": "9416 Rosenbaum Radial",
	    "blacklist": [
	        "BANNED_USER"
	    ],
	    "contactNumber": "34600124219",
	    "createdAt": "2015-11-16T19:57:26.573Z",
	    "description": "First target for testing purposes",
	    "keywords": [
	        "sangre",
	        "cuchillo",
	        "pistola",
	        "amenaza",
	        "pelea"
	    ],
	    "language": "ES",
	    "name": "First target",
	    "oofEnd": 2359,
	    "oofInit": 0,
	    "oofMessage": "We are stopped our service until 8 p.m., at this time we will attend you. Sorry for the inconvenience",
	    "tags": [
	        "violencia de g\u00e9nero",
	        "sexual",
	        "racista",
	        "agresi\u00f3n",
	        "amenaza"
	    ],
	    "tplInternalNote": "Lorem ipsum\n",
	    "tplNewTicket": "Lorem ipsum\n"
	}
	
HTTP 500 Response:

	{
    	"code": "ZAE0307",
	    "message": "You must provide the number."
	}
	    
Unblocking the number:
	    
curl -X DELETE "http://localhost:3000/api/v1/admin/targets/5589d6864d8b8ebe059a813b/blacklist?number=BANNED_USER"

HTTP 200 Response:

	
	{
	    "__v": 0,
	    "_id": "5589d6864d8b8ebe059a813b",
	    "active": true,
	    "address": "9416 Rosenbaum Radial",
	    "blacklist": [],
	    "contactNumber": "34600124219",
	    "createdAt": "2015-11-16T19:57:26.573Z",
	    "description": "First target for testing purposes",
	    "keywords": [
	        "sangre",
	        "cuchillo",
	        "pistola",
	        "amenaza",
	        "pelea"
	    ],
	    "language": "ES",
	    "name": "First target",
	    "oofEnd": 2359,
	    "oofInit": 0,
	    "oofMessage": "We are stopped our service until 8 p.m., at this time we will attend you. Sorry for the inconvenience",
	    "tags": [
	        "violencia de g\u00e9nero",
	        "sexual",
	        "racista",
	        "agresi\u00f3n",
	        "amenaza"
	    ],
	    "tplInternalNote": "Lorem ipsum\n",
	    "tplNewTicket": "Lorem ipsum\n"
	}
	

###TicketsCount

Gets the amount of tickets that the staffer has visibility to. 

Resource URI:

	GET '/api/v1/admin/ticketsCount'

PARAMETERS    | DESCRIPTION  
:-----------  | :-----------
**idStaffer** | (Query String : ObjectId) -> staffer who makes the request, is a mandatory parameter


#####Examples:

curl "http://localhost:3000/api/v1/admin/ticketsCount?idStaffer=55d9fb822e2fac6f3f2d75b5"

HTTP 200 Response:
	
    {
        "in": 13,
        "out": 0,
        "closed" : 0"
    }

In the response **in** means that the last message is from the reporter, **out** from the staffer and **closed** the amount of closed tickets.

###Tickets


Resource URI:

	GET '/api/v1/admin/tickets'

PARAMETERS    | DESCRIPTION  
:-----------  | :-----------
**idStaffer** | (Query String : ObjectId) -> staffer who makes the request, is a mandatory parameter
text | (Query String : String) -> you can search tickets by some substring (looking for into the message text) from all the visible tickets of the staffer.
idTicket  | (Query String : ObjectId) -> if you want to retrieve only one ticket you must provide the idTicket 
lastRespondedByMe  | (boolean) -> if you want to retrieve only the tickets that the last responder is the idStaffer provided
state     | (Query String : String) -> "IN", "OUT" or "CLOSED"
from      | (Query String : int) -> The index of the pagination (begins on 0)
sortBy    | (Query String : String) -> The field that the tickets are sorted (default 'lastUpdate')
sortType  | (Query String : String) -> -1 or +1 (DESC or ASC) (default -1)
offset     | (Query String : int) -> pagination offset

**Note**: If you want to paginate, 'from', and 'to' are required parameters.

#####Examples:

curl "http://localhost:3000/api/v1/admin/tickets?idStaffer=55d9fb822e2fac6f3f2d75b5&from=0&offset=3"

HTTP 200 Response:
	
	[
	    {
	        "__v": 0,
	        "_id": "55e8707504da361d05697c85",
	        "creationDate": "2015-09-03T16:08:21.652Z",
	        "idTarget": "5589d6864d8b8ebe059a813b",
	        "idStaffer": "5598fbf6a34e119fe4ae0eaf",
	        "targetName": "First target",
	        "lastUpdate": "2015-09-03T16:10:51.550Z",
	        "message": "I have a problem",
	        "messageCount": 3,
	        "reporter": "+34652512542", //we have to change this
	        "reporterTicketsCount": 1,
	        "staffer": "spiderman",
	        "state": "IN"
	    },
	    {
	        "__v": 0,
	        "_id": "55e8707104da361d05697c83",
	        "creationDate": "2015-09-03T16:08:17.760Z",
	        "idTarget": "5589d6864d8b8ebe059a813b",
	        "idStaffer": "5598fbf6a34e119fe4ae0eac",
	        "targetName": "First target",
	        "lastUpdate": "2015-09-03T16:08:17.775Z",
	        "message": "I have a problem",
	        "messageCount": 1,
	        "reporter": "+34652512541",
	        "reporterTicketsCount": 1,
	        "staffer": "superman",
	        "state": "IN"
	    },
	    {
	        "__v": 0,
	        "_id": "55e8706e04da361d05697c81",
	        "creationDate": "2015-09-03T16:08:14.554Z",
	        "idTarget": "5589d6864d8b8ebe059a813b",
	        "idStaffer": "5598fbf6a34e119fe4ae0ead",
	        "targetName": "First target",
	        "lastUpdate": "2015-09-03T16:08:14.591Z",
	        "message": "I have a problem",
	        "messageCount": 1,
	        "reporter": "+34652512540",
	        "reporterTicketsCount": 1,
	        "staffer": "batman",
	        "state": "IN"
	    }
	]

Retrieving one single ticket: 

curl "http://localhost:3000/api/v1/admin/tickets?idStaffer=55d9fb822e2fac6f3f2d75b5&idTicket=55e8707104da361d05697c83"

HTTP 200 Response:

	{
	    "__v": 0,
	    "_id": "55e8707104da361d05697c83",
	    "creationDate": "2015-09-03T16:08:17.760Z",
	    "idTarget": "5589d6864d8b8ebe059a813b",
	    "idStaffer": "5598fbf6a34e119fe4ae0eac",
	    "targetName": "First target",
	    "lastUpdate": "2015-09-03T16:08:17.775Z",
	    "message": "I have a problem",
	    "messageCount": 1,
	    "reporter": "+34652512541",
	    "reporterTicketsCount": 1,
	    "staffer": "superman",
	    "state": "IN"
	}

curl "http://localhost:3000/api/v1/admin/tickets?idStaffer=123&idTicket=55e8707104da361d05697c83"

HTTP 500 Response:

	{
		"code": "ZAE0100",
	    "message": "The query has thrown an exception, check ZA core logs."
	}

Retrieving one single ticket: 

curl "http://localhost:3000/api/v1/admin/tickets?idStaffer=55d9fb822e2fac6f3f2d75b5&idTicket=55e8707104da361d05697c83"

HTTP 200 Response:

	{
	    "__v": 0,
	    "_id": "55e8707104da361d05697c83",
	    "creationDate": "2015-09-03T16:08:17.760Z",
	    "idTarget": "5589d6864d8b8ebe059a813b",
	    "idStaffer": "5598fbf6a34e119fe4ae0eac",
	    "targetName": "First target",
	    "lastUpdate": "2015-09-03T16:08:17.775Z",
	    "message": "I have a problem",
	    "messageCount": 1,
	    "reporter": "+34652512541",
	    "reporterTicketsCount": 1,
	    "staffer": "superman",
	    "state": "IN"
	}

curl "http://localhost:3000/api/v1/admin/tickets?idStaffer=123&idTicket=55e8707104da361d05697c83"

HTTP 500 Response:

	{
		"code": "ZAE0100",
	    "message": "The query has thrown an exception, check ZA core logs."
	}
	

###Adding/Removing tags into the ticket

Resource URI:

	PUT '/api/v1/admin/tickets/:id/tag'
	DELETE '/api/v1/admin/tickets/:id/tag'

PARAMETERS    | DESCRIPTION  
:-----------  | :-----------
**:id** | (Path param String : ObjectId) -> represents the target ticket 
**tag** | (Query String : String) -> tag to add

#####Examples:

Adding the tag into the ticket:

  curl -X PUT "http://localhost:3000/api/v1/admin/tickets/563a7e056b9ec0e203f08b62/tag?tag=racista"

HTTP 200 Response:
	
	{
	    "__v": 2,
	    "_id": "563a7e056b9ec0e203f08b62",
	    "creationDate": "2015-11-04T21:52:05.240Z",
	    "idTarget": "5589d6864d8b8ebe059a813b",
	    "idStaffer": null,
	    "targetName": "First target",
	    "lastUpdate": "2015-11-04T21:52:05.261Z",
	    "message": "I have a problem",
	    "messageCount": 1,
	    "oofNotified": true,
	    "reporter": "Thick-Blue-beetle-ii",
	    "reporterTicketsCount": 1,
	    "sentFromStaffer": false,
	    "state": "IN",
	    "tags": [
	        "racista"
	    ]
	}
	
HTTP 500 Response:

	{
	    "code": "ZAE0306",
	    "message": "You must provide the tag parameter."
	}
	    
Removing the tag from the ticket:
	    
curl -X DELETE "http://localhost:3000/api/v1/admin/tickets/563a7e056b9ec0e203f08b62/tag?tag=racista"	    

HTTP 200 Response:

	{
	    "__v": 2,
	    "_id": "563a7e056b9ec0e203f08b62",
	    "creationDate": "2015-11-04T21:52:05.240Z",
	    "idTarget": "5589d6864d8b8ebe059a813b",
	    "idStaffer": null,
	    "targetName": "First target",
	    "lastUpdate": "2015-11-04T21:52:05.261Z",
	    "message": "I have a problem",
	    "messageCount": 1,
	    "oofNotified": true,
	    "reporter": "Thick-Blue-beetle-ii",
	    "reporterTicketsCount": 1,
	    "sentFromStaffer": false,
	    "state": "IN",
	    "tags": []
	}


###CloseTicket

closes the ticket and ends the communication with the reporter.

Resource URI:

	POST '/api/v1/admin/closeTicket'

PARAMETERS    | DESCRIPTION  
:-----------  | :-----------
**idStaffer** | (Body param : ObjectId) -> staffer who makes the request
**idTicket**  | (Body param : ObjectId) -> ticket to close


#####Examples:

curl -X POST -d "idStaffer=55d9fb822e2fac6f3f2d75b5&idTicket=55e8707104da361d05697c83" "http://localhost:3000/api/v1/admin/closeTicket"

HTTP 200 Response:

	55e8707104da361d05697c83


curl -X POST -d "idStaffer=55d9fb822e2fac6f3f2d75b5&idTicket=55e8707104da361d05697c83" "http://localhost:3000/api/v1/admin/closeTicket"

HTTP 500 Response:

	{
		"code": "ZAE0400",
	    "message": "Error closing the ticket, check ZA core logs.""
	}

###Messages

Gets the messages of the given ticket.

Resource URI:

	GET '/api/v1/admin/messages'

PARAMETERS    | DESCRIPTION  
:-----------  | :-----------
**idTicket** | (Query String : ObjectId) -> ticket who contains the messages


#####Examples:

curl "http://localhost:3000/api/v1/admin/messages?idTicket=55e8706604da361d05697c7d"

HTTP 200 Response:
	
	 [
	    {
	        "__v": 0,
	        "_id": "55e8706604da361d05697c7c",
	        "batch": false,
	        "creationDate": "2015-09-03T16:08:06.775Z",
	        "idStaffer": null,
	        "idTicket": "55e8706604da361d05697c7d",
	        "isInternalMessage": false,
	        "sentDate": "2015-09-03T16:08:06.791Z",
	        "sentFromStaffer": false,
	        "source": "+34652512538",
	        "target": "+34941060465",
	        "text": "I have a problem"
	    }
	]
	

curl "http://localhost:3000/api/v1/admin/messages?idTicket=123"

HTTP 500 Response:

	{
	    "code": "ZAE0100",
	    "message": "The query has thrown an exception, check ZA core logs."
	}


###SendMessage

Sends a message to the reporter

Resource URI:

	POST '/api/v1/admin/sendmessage'

PARAMETERS    | DESCRIPTION  
:-----------  | :-----------
**idStaffer** | (Body param : ObjectId) -> staffer who makes the request
**idTicket**  | (Body param : ObjectId) -> ticket who owns the messages
**message**   | (Body param : String) -> message text


#####Examples:

curl -X POST -d "idStaffer=55d9fb822e2fac6f3f2d75b5&idTicket=55e8707104da361d05697c83&message=test" "http://localhost:3000/api/v1/admin/sendmessage"

HTTP 200 Response:

	Message sended to the reporter


curl -X POST -d "idTicket=55e8707104da361d05697c83" "http://localhost:3000/api/v1/admin/sendmessage"

HTTP 500 Response:

	{
		"code": "ZAE0300",
	    "message": "You must provide all required parameters."
	}



###AddInternal

Adds an internal note into the ticket. You can even notify by sms (Principal) and email (each Target staffer) to the staffers in order to have the internal note.

Resource URI:

	POST '/api/v1/admin/messages/addInternal'

PARAMETERS    | DESCRIPTION  
:-----------  | :-----------
**idStaffer** | (Body param : ObjectId) -> staffer who makes the request
**idTicket**  | (Body param : ObjectId) -> ticket who owns the messages
**text**      | (Body param : String) -> internal note text
sms           | (Body param : boolean) -> enables the sms notification to the Principal  (if have the smsEnabled attribute set to true)
email         | (Body param : boolean) -> enables the email notification to the Target staffers (that have the emailEnabled attribute set to true)


#####Examples:

curl -X POST -d "idStaffer=55d9fb822e2fac6f3f2d75b5&idTicket=55e8707104da361d05697c83&text=test" "http://localhost:3000/api/v1/admin/messages/addInternal"

HTTP 200 Response:

	55e9c88eeb5f7150125f7209
	
The response is the message id.

curl -X POST -d "idStaffer=55d9fb822e2fac6f3f2d75b5&idTicket=55e8707104da361d05697c83&text=test&sms=true&email=true" "http://localhost:3000/api/v1/admin/messages/addInternal"

HTTP 200 Response:

	55e9c88eeb5f7150125f7209

# ZACore Error Codes 

If there is an error, the admin api sends an HTTP 500 status error code and the following JSON object, depending on the type of error

#### Authentication errors

code : **'ZAE0001'**, message: **'You must send the login.'**

code : **'ZAE0002'**, message: **'You must send a non-empty password.'**

code : **'ZAE0003'**, message: **'The password you provide for the given user is invalid.'**

code : **'ZAE0004'**, message: **'There was an error retrieving the target from the login.'**

#### Database related errors

code : **'ZAE0100'**, message: **'The query has thrown an exception, check ZA core logs.'**

code : **'ZAE0101'**, message: **'There is an error filling the DB, check ZA core logs.'**

code : **'ZAE0102'**, message: **'There is an error clearing the DB, check ZA core logs.'**


#### Target related errors

code : **'ZAE0200'**, message: **'Error importing target, chec ZA core logs.'**

code : **'ZAE0201'**, message: **'You must provide the file in the POST.'**

code : **'ZAE0202'**, message: **'Error exporting target, check ZA core logs.'**

code : **'ZAE0203'**, message: **'Error getting new target fake data, check ZA core logs.'**

code : **'ZAE0204'**, message: **'Error creating target, check ZA core logs.'**

code : **'ZAE0205'**, message: **'Error updating target, check ZA core logs.'**


#### Messages related errors

code : **'ZAE0300'**, message: **'You must provide all required parameters.'**

code : **'ZAE0301'**, message: **'You must provide the idTicket parameter.'**

code : **'ZAE0302'**, message: **'You must provide the idTarget parameter.'**

code : **'ZAE0303'**, message: **'You must provide the idstaffer parameter.'**

code : **'ZAE0304'**, message: **'You must provide the text of the message.'**

code : **'ZAE0305'**, message: **'You must provide the idmessage parameter.'**

code : **'ZAE0306'**, message: **'You must provide the tag parameter.'**

code : **'ZAE0320'**, message: **'Error sending the message, check ZA core logs.'**

code : **'ZAE0321'**, message: **'Error sending the message, the ticket provided does not exists.'**

code : **'ZAE0322'**, message: **'Error sending the message, the ticket is closed.'**

code : **'ZAE0323'**, message: **'Error sending the message, the staffer provided does not exists.'**

code : **'ZAE0324'**, message: **'Error sending the message, empty body.'**

code : **'ZAE0350'**, message: **'Error receiving the message, check ZA core logs.'**

code : **'ZAE0351'**, message: **'Error receiving the message, we do not have targets with this number.'**

code : **'ZAE0352'**, message: **'Error receiving the message, the target with this contactNumber is disabled.'**

code : **'ZAE0353'**, message: **'Error receiving the message, empty body.'**


#### Ticket related errors

code : **'ZAE0400'**, message: **'Error closing the ticket, check ZA core logs.'**

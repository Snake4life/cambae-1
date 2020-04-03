 /**
  *
  * Description. Client part of the myfreecams data watcher/consumer.
  *   functions located herein are resonsible for consuming the data sent by the mfc websocket, and parsing it into usable info
  *
  * @link   https://github.com/patrick-hudson/cambae
  * @file   This file defines the mfcbae client.
  * @author Patrick Hudson.
  * @copyright 2019 - Patrick Hudson
  */
  Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
  }

 var MFCSocket = require("MFCSocket");
 var MessageType = require('MFCSocket').MFCMessageType;
 var VideoState = require('MFCSocket').MFCVideoState
 var MFCChatOpt = require("MFCSocket").MFCChatOpt;
 //var JoinChannelMessage = require("MFCSocket").JoinChannelMessage;
 var LeaveChannelMessage = require("MFCSocket").LeaveChannelMessage
 var UserLookup = require("MFCSocket").UserLookup;
 var MFCMessage = require('MFCSocket').MFCMessage;
 var socket = new MFCSocket();
 var request = require("request");
 var exec = require('child_process').exec;
 var spawn = require('child_process').spawn;

 /**
  *
  * m_user - mfc user name
  * m_id = mfc room id
  * sess_id - session id that was generated when joining an mfc room
  *
  */
 if (process.env.MODEL_USERNAME === undefined) {
     var m_user = ""
     var m_id = process.env.MODEL_ID
         //m_id = 100000000 + parseInt(m_id)
     m_id = parseInt(m_id)
 } else {
     var m_id = ""
     var m_user = process.env.MODEL_USERNAME
 }


 var sess_id = ""

 /**
  *
  * setting of misc globals
  *
  */

 var debugTime = process.env.DEBUG_TIME
 var backend = process.env.BACKEND
 var cOnline = false
 var room_joined = false
 var roomCount;
 var roomRank
 var cModelAge
 var cModelEthnic
 var cModelMissMfc
 var cModelCountry
 var cModelNew
 var m_vs
 var m_cs
 var rMeta = ""
 var onlineButNotInRoom = 0
 var checkIfJoined = 0
     /**
      *
      * pino logger
      * Description. Create several logging instances to send data to stdout.
      *
      */

 var logger = require('pino')({
     level: "info"
 })

 /**
  *
  * Description. Listens for the 'loggedIn' event triggered by the MFCSocket module
  * requires: m_user
  *
  */

 socket.on("loggedIn", function(u) {
     setSessionInfo(u, function() {

     })
     if (m_user == "") {
         joinChan(sess_id, m_id, function() {

         })
     }

     socket.send(new MFCMessage({
         Type: MessageType.FCTYPE_USERNAMELOOKUP,
         Arg1: 20,
         Data: `${m_user}`
     }))
     var waitTill = new Date(new Date().getTime() + 5 * 1000);
     while (waitTill > new Date()) {}
 });

 /**
  *
  * Description. Listens for the 'mfcMessage' event triggered by the MFCSocket module
  *
  */

 socket.on("mfcMessage", function(msg) {
     //event == chat room message
     if (msg.Type == MessageType.FCTYPE_CMESG) {

         try {


             // check to see if the chat message come from a user, or either the owner of the room, a bot (CharlesBot), or mfc (FCServer)
             if (msg.Data.nm == m_user || msg.Data.nm == "FCServer" || msg.Data.nm == "CharlesBot") {
                 var joined = /You have joined (.*)'s chat as .*\./
                 var tMst = msg.Data.msg
                 var tMatch = tMst.match(joined)
                 var tMatch = tMatch[1]
                 if (tMatch != "") {
                     msg.Data.nm = tMatch
                     m_user = tMatch
                 }
                 server_chat = "true"
                 room_joined = true
             } else {
                 server_chat = "false"
             }
             sendLog({
                 level: 'info',
                 event: 'chat',
                 chat_username: msg.Data.nm,
                 server_chat: server_chat,
                 data_msg: decodeURIComponent(msg.Data.msg)
             })
         } catch (e) {

         }
     }
     // event = username lookup
     // returns with m_id
     if (msg.Type == MessageType.FCTYPE_USERNAMELOOKUP) {

         try {
             if (typeof(msg.Data.u.camserv) == 'undefined') {
                 msg.Data.u.camserv = 0
             }
         } catch (e) {

         }

         if (typeof(msg.Data) === 'undefined') {

             //sendLog({level: 'debug', event: 'offline', data_msg:`${m_user} - unable to determine online status, skipping lookup - model is probably offline`})
         } else {
             try {
                 roomMetaData(msg, function() { })
                     //console.log(msg)
                     //if (checkIfOnline.didRun != true) {
                     //   if(m_user != '' && (msg.Data.vs != '127'))
                     //   if(msg.Data.u.camserv != 0){
                     //     socket.send(new JoinChannelMessage(sess_id, parseInt(m_id)));
                     //     sendLog({level: 'debug', event: 'room_join', data_msg: `${m_user} - detected first run after joining room`})
                     //   }
                     //}

                 checkIfOnline(msg, function() {})
             } catch (e) {
                 sendLog({
                     level: 'debug',
                     event: 'exception',
                     exception: e,
                     data_msg: `ERROR - ${m_user} - unable to determine online status, skipping lookup`
                 })
             }
         }
     }
     //event tip
     if (msg.Type == MessageType.FCTYPE_TOKENINC) {
         var datetime = (new Date).getTime();
         var tipper = msg.Data.u[msg.Data.u.length - 1]
         if (m_user != '') {

             checkIfOnline(msg, function() {})
                 //checking to see if the model is nude when tip arrived
             request.post({
                 headers: {
                     'content-type': 'application/x-www-form-urlencoded'
                 },
                 url: `http://api.services.svc.cluster.local:6902/mfc-status/${m_user}`,
                 body: "hi=heh"
             }, function(error, response, body) {
                 resp = JSON.parse(body);
                 score = resp['nsfwAvg'].toString();
                 nsfwScore = parseInt(score);
                 tip_amount = parseInt(msg.Data.tokens);
                 converted_dollar = tip_amount * .05
                 converted_dollar = converted_dollar.round(2)
                 mfc_total_dollars = tip_amount * .085483
                 mfc_total_dollars = mfc_total_dollars.round(2)
                 status = resp['status'].toString()
                 nsfwLogDefault = {
                     level: 'info',
                     event: 'tip',
                     tipper: tipper,
                     tip_amount: parseInt(msg.Data.tokens),
                     usd_amount: converted_dollar,
                     mfc_usd_amount: mfc_total_dollars,
                     nsfw_score: nsfwScore,
                     status: status
                 }
                 if (!isNaN(nsfwScore)) {
                     if (nsfwScore > 51) {
                         nsfwLogDefault.is_nude = 'true'
                         nsfwLogDefault.data_msg = `Tip Amount: ${tip_amount} - Converted to Dollars: ${converted_dollar} - ${m_user} detected nude`
                         sendLog(nsfwLogDefault)
                     } else {
                         nsfwLogDefault.is_nude = 'false'
                         nsfwLogDefault.data_msg = `Tip Amount: ${tip_amount} - Converted to Dollars: ${converted_dollar} - ${m_user} NOT detected nude`
                         sendLog(nsfwLogDefault)
                     }
                 }
             });
         }
     }
 });
 /**
  * Description. checks if m_user is online, and logs the result
  *
  * @param {string} data - json object that gets returned when a username lookup is called
  * @example
  *     {
  *     Type: 10,
  *     From: '',
  *     To: '',
  *     Arg1: '20',
  *     Arg2: '0',
  *     Data:
  *      { lv: INT,
  *        nm: 'STRING',
  *        pid: 1,
  *        sid: FLOAT,
  *        uid: FLOAT,
  *        vs: INT,
  *        u:
  *         { age: INT,
  *           avatar: INT,
  *           blurb: 'STRING',
  *           camserv: INT,
  *           chat_bg: INT,
  *           chat_color: 'STRING',
  *           chat_font: INT,
  *           chat_opt: INT,
  *           country: 'STRING',
  *           creation: TIMESTAMP,
  *           ethnic: 'STRING',
  *           photos: INT,
  *           profile: INT,
  *           status: '' },
  *        m:
  *         { camscore: INT,
  *           continent: 'EU',
  *           flags: INT,
  *           hidecs: true,
  *           kbit: INT,
  *           lastnews: INT,
  *           mg: INT,
  *           missmfc: INT,
  *           new_model: INT,
  *           rank: INT,
  *           rc: INT,
  *           sfw: INT,
  *           topic:
  *            'URI_ENCODED_STRING'
  *         },
  *        x: { fcext: [Object], share: [Object] } },
  *     asMFCMessage: [Function: asMFCMessage] }
  *
  *
  * @return {function} callback()
  */
 function checkIfOnline(data, callback) {
     //model id and modesl status (vs)
     //model in private
     var statusLogDefault = {

     }
     if (m_vs == '12') {
         checkIfOnline.status = true
         roomMetaData(data, function() {

         })
         sendLog({
             level: 'info',
             event: 'status',
             status: 'private',
             data_msg: `${m_user} is in private show`
         })
         cOnline = true
     }
     //model in public
     if ((m_vs == '90' || m_vs == '0') && m_cs != 0) {
        //if (m_vs == '90') {
         roomMetaData(data, function() {

         })
         checkIfOnline.status = true
         sendLog({
             level: 'info',
             event: 'status',
             status: 'online',
             data_msg: `${m_user} is in online`
         })
         cOnline = true

     }
     //model's video stream is offline
     if (m_vs == '127') {
         checkIfOnline.status = false
         cOnline = false
         var min = 10;
         var max = 20;
         var randomTime = Math.floor(Math.random() * (+max - +min)) + +min;
         var timeInt = parseInt(`${randomTime}00`)
         minutes = 5;
         var the_interval = minutes * 60 * timeInt;
         sendLog({
             level: 'info',
             event: 'status',
             status: 'offline',
             data_msg: `${m_user} is offline`
         })
         setTimeout(function() {
             //if(cOnline == true){
             if (room_joined == true) {
                 socket.send(new LeaveChannelMessage(sess_id, parseInt(m_id)));
                 sendLog({
                     level: 'debug',
                     event: 'status',
                     status: 'offline',
                     data_msg: `Attempting to leave ${m_user}'s room`
                 })
             }
             room_joined = false
         }, the_interval);

     }

     checkIfOnline.didRun = true
     callback(data);

 }

 function roomMetaData(d, callback) {
     try {
         roomCount = !roomCount ? -1 : d.Data.m.rc;
         roomRank = !roomRank ? -1 : d.Data.m.rank;
         cModelAge = !cModelAge ? -1 : d.Data.u.age
         cModelEthnic = !cModelEthnic ? 'unknown' : d.Data.u.ethnic
         cModelMissMfc = !cModelMissMfc ? -1 : d.Data.m.missmfc
         cModelCountry = !cModelCountry ? 'unknown' : d.Data.u.country
         cModelNew = !cModelNew ? -1 : d.Data.m.new_model
         m_user = !m_user ? '' : d.Data.nm
             //m_id = !m_id ? -1 : d.Data.uid
         m_vs = !m_vs ? -1 : d.Data.vs
         m_cs = !m_cs ? -1 : d.Data.u.camserv
         callback();
     } catch (e) {
         sendLog({
             level: 'debug',
             event: 'set_metadata',
             data_msg: `ERROR - ${m_user} - tried setting metadata but shits broke son - quitting`
         })
         process.exit(1);
     }


 }

 function sendLog(logInfo) {
     logInfo = logInfo || {};
     var defaultLogger = {
         model_id: m_id,
         site: 'mfc',
         model_username: `${m_user}`,
         //room_count: `${roomCount}`,
         room_rank: roomRank || -1,
         room_count: parseInt(roomCount) || -1,
         model_age: cModelAge || -1,
         model_ethnicity: cModelEthnic || 'unknown',
         model_was_miss_mfc: cModelMissMfc || -1,
         model_country: cModelCountry || 'unknown',
         model_new: cModelNew || -1,
         mfcURL: `https://mfc.im/${m_user}`,
     }
     level = logInfo.level || 'debug'
     logMsg = logInfo.data_msg
     delete logInfo.data_msg
     logInfo = {...defaultLogger,
         ...logInfo
     }
     logInfo.event = "logging:myfreebae-" + logInfo.event
     var mfc_logger = logger.child(logInfo)
     mfc_logger[level](logMsg);
 }

 function exposeRMeta(d, callback) {
     rMeta = d
     callback(d)
 }

 function setSessionInfo(u, callback) {
     sess_id = u.SessionId

     callback(sess_id);

 }

 function joinChan(sess, m, callback) {
     //console.log(sess)
     //console.log(m)
     socket.send(new JoinChannelMessage(sess, m));
     callback(sess, m);

 }

 function JoinChannelMessage(sessionId, broadcasterId) {
     var publicChannelId = 100000000 + broadcasterId;
     jMsg = new MFCMessage({
         Type: MessageType.FCTYPE_JOINCHAN,
         From: sessionId,
         Arg1: publicChannelId,
         Arg2: MFCChatOpt.FCCHAN_JOIN
     });
     return jMsg
 }

 function getModelInfo(u, callback) {
     sess_id = u.SessionId
     callback(u);
 }
 //check model's online status every ${watch_interval_min} minutes
 //hacky, we check to see fi we've run before, if not, lets run quickly if yes, run every ${watch_interval_min} minutes
 if (checkIfOnline.didRun != true) {
     var status_inter = 1 * 10 * 1000;
 } else {
     var status_inter = 5 * 60 * 1000;
 }
 var watch_interval_min = 3


 setInterval(function() {
     socket.send(new MFCMessage({
         Type: MessageType.FCTYPE_USERNAMELOOKUP,
         Arg1: 20,
         Data: `${m_user}`
     }))

     if (room_joined == false && cOnline == true) {
         onlineButNotInRoom = onlineButNotInRoom + 1
         sendLog({
             level: 'debug',
             event: 'online_not_in_room',
             data_msg: `ERROR - ${m_user} - script indicates that model is online, but not currently in room`
         })
         socket.send(new JoinChannelMessage(sess_id, parseInt(m_id)));
         if (onlineButNotInRoom > 4) {
             sendLog({
                 level: 'debug',
                 event: 'online_not_in_room',
                 data_msg: `ERROR - ${m_user} - unable to join room after 5 attempts, quitting`
             })
             process.exit(1);
         }
     }
 }, status_inter);
 var nude_inter = 8 * 60 * 1000;
 setInterval(function() {
   if(cOnline == true){
     request.post({
         headers: {
             'content-type': 'application/x-www-form-urlencoded'
         },
         url: `http://api.services.svc.cluster.local:6902/mfc-status/${m_user}`,
         body: "hi=heh"
     }, function(error, response, body) {
         resp = JSON.parse(body);
         score = resp['nsfwAvg'].toString();
         nsfwScore = parseInt(score);
         status = resp['status'].toString()
         nudeLogDefault = {
             level: 'info',
             event: 'nude',
             status: status,
             nsfw_score: nsfwScore
         }
         if (!isNaN(nsfwScore)) {
             if (nsfwScore > 51) {
                 nudeLogDefault.is_nude = 'true'
                 nudeLogDefault.data_msg = `${m_user} detected nude`
                 sendLog(nudeLogDefault)
             } else {
                 nudeLogDefault.is_nude = 'false'
                 nudeLogDefault.data_msg = `${m_user} NOT detected nude`
                 sendLog(nudeLogDefault)
             }
         }
     });
   }


 }, nude_inter);
checkJInterval = 10 * 1000;
 setInterval(function() {
   console.log(`check if joined run #${checkIfJoined}`)
   checkIfJoined = checkIfJoined + 1
   if(m_user == "" && checkIfJoined > 6){
     sendLog({
         level: 'info',
         event: 'status',
         status: 'offline',
         data_msg: `unable to set m_user, ${m_id} appears offline`
     })
     process.exit(0)
   }
 }, checkJInterval);

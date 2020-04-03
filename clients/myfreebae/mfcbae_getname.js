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
var JoinChannelMessage = require("MFCSocket").JoinChannelMessage;
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

    var waitTill = new Date(new Date().getTime() + 5 * 1000);
    while (waitTill > new Date()) {}
    if (m_user == "") {
    joinChan(sess_id, m_id, function() {

    })


  }
});

/**
 *
 * Description. Listens for the 'mfcMessage' event triggered by the MFCSocket module
 *
 */

socket.on("mfcMessage", function(msg) {
    // event = username lookup
    // returns with m_id
console.log(msg)
    //console.log(decodeURIComponent(msg.initializer))
    try{
      //console.log(msg.Data.sid)
      if(msg.Data.sid == m_id){

      }
    } catch (e){

    }
    if (msg.Type == MessageType.FCTYPE_USERNAMELOOKUP) {
      //console.log(msg)
      roomMetaData(msg, function() { })

    }
    if (msg.Type == MessageType.FCTYPE_LISTCHAN) {

      //roomMetaData(msg, function() { })

    }
    if (msg.Type == MessageType.FCTYPE_CMESG) {
      try{
        var joined = /You have joined (.*)'s chat as .*\./
        var tMst = msg.Data.msg
        var tMatch = tMst.match(joined)
        var tMatch = tMatch[1]
        if (tMatch != "") {
            msg.Data.nm = tMatch
            m_user = tMatch
            //console.log(m_user)
        }
      } catch(e) {
        //console.log(e)
      }

    }
});


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
    //socket.send(new JoinChannelMessage(sess, m));
    //JoinChannelMessage(sess, m)
    socket.send(new JoinChannelMessage(sess, parseInt(m)));
    socket.send(new ListChannelMessage(sess, parseInt(m)));
    callback(sess, m);

}
function ListChannelMessage(sessionId, broadcasterId) {
    var publicChannelId = 100000000 + broadcasterId;
    jMsg = new MFCMessage({
        Type: MessageType.FCTYPE_LISTCHAN,
        From: sessionId,
        Arg1: publicChannelId,
        Arg2: MFCChatOpt.FCCHAN_LIST
    });
    return jMsg
}
//function JoinChannelMessage(sessionId, broadcasterId) {
//    var publicChannelId = 100000000 + broadcasterId;
//    jMsg = new MFCMessage({
//        Type: MessageType.FCTYPE_JOINCHAN,
//        From: sessionId,
//        Arg1: publicChannelId,
//        Arg2: MFCChatOpt.FCCHAN_JOIN
//    });
//    return jMsg
//}

function getModelInfo(u, callback) {
    sess_id = u.SessionId
    callback(u);
}
var nude_inter = 1 * 250;
setInterval(function() {
if(m_user != ""){
  console.log(m_user)
  process.exit(0)
}
  //console.log(m_user)
  socket.send(new MFCMessage({
      Type: MessageType.FCTYPE_USERNAMELOOKUP,
      Arg1: 20,
      Data: `${m_user}`
  }))
}, nude_inter);

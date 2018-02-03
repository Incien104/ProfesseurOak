// ProfesseurOak

// GENERAL FUNCTIONS MODULE

var Discord = require('discord.js');

const config = require('../../config/config.json');

const rolesList = require('../../config/rolesList.json');
const chansLists = require('../../config/chansLists.json');

// REPLY TO AND DELETE MESSAGE FUNCTION
exports.replyDelete = (replyMessage = 0,originalMessage = 0,delayOriginalMsg = 1000, delayReply = 5000) => {
	if (replyMessage !== 0 && originalMessage !== 0) {
		originalMessage.reply(replyMessage)
			.then(rep => {
				originalMessage.delete(delayOriginalMsg);
				rep.delete(delayReply);
			})
			.catch(console.error);
	}
}

// SEND AND DELETE MESSAGE FUNCTION
exports.sendDelete = (sendMessage = 0,originalMessage = 0,delayOriginalMsg = 1000, delaySend = 5000) => {
	if (sendMessage !== 0 && originalMessage !== 0) {
		originalMessage.channel.send(sendMessage)
			.then(rep => {
				originalMessage.delete(delayOriginalMsg);
				rep.delete(delaySend);
			})
			.catch(console.error);
	}
}

// BOT'S LOGS IN A LOG CHANNEL
exports.botPostLog = (messageToPost = 0,logsChannel = null) => {
	// If param is an array, first element is the message, second is the channel where to log
	// If not (or if second element value is int 0), param (or first element) is the message, and channel where to log is automatically the one on the server in the config file
	// If message is int 0, no log
	
	if (messageToPost !== 0) {
		var d = new Date();	
		d = d - config.timeFromUTC*60*60*1000;
		var dateLog = new Date(d);
		dateLog = dateLog.toString();
		dateLog = dateLog.substring(0,dateLog.length-15);
		if (logsChannel !== null) {
			logsChannel.send('*['+dateLog+']* : **'+messageToPost+'**');
		}
		console.log(messageToPost);
	}
}

// BUILD AN ARRAY FROM TWO SEPARATE VARIABLES
exports.buildArray = (paramOne,paramTwo) => {
	var resArray = new Array();
	resArray.push(paramOne);
	resArray.push(paramTwo);
	return resArray;
}

// TEST FOR AN INTEGER VALUE
exports.isInt = (value) => {
	return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

// FIND FIRST INDEX OF MAX VALUE OF AN ARRAY
exports.indexOfMax = (arr) => {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

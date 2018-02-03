// ProfesseurOak

// BANNED WORDS FUNCTIONS MODULE

var Discord = require('discord.js');

const config = require('../../config/config.json');
const lang = require('../../config/lang.json');

const rolesList = require('../../config/rolesList.json');
const chansLists = require('../../config/chansLists.json');

const generalFunc = require('./generalFunc.js');

// CHECK BANNED WORDS IN MESSAGE FUNCTION
exports.process = (message) => {
	let messageWords = message.content.split(' ');
	let wordToTest = "";
	let incorrectLanguage = false;
	let i;
	let j;
	
	for (i in messageWords) {
		wordToTest = messageWords[i].toLowerCase();
		if (config.bannedWords.indexOf(wordToTest) !== -1) {
			incorrectLanguage = true;
			break;
		}
	}
	if (incorrectLanguage) {
		// Delete a message
		generalFunc.botPostLog(`Message de ${message.user} dans ${message.channel} supprimé pour mauvais language : *${message.content}*`,message.guild.channels.find("name",chansLists.chanBotLog));
		generalFunc.replyDelete("**attention à ton langage !!** :rage: ",message);
	}
}
// ProfesseurOak

// MESSAGE HANDLING MODULE

var Discord = require('discord.js');

const config = require('../../config/config.json');
const lang = require('../../config/lang.json');

const rolesList = require('../../config/rolesList.json');
const chansLists = require('../../config/chansLists.json');

const command = require('./commandHandler.js');
const generalFunc = require('./generalFunc.js');
const checkBannedWords = require('./checkBannedWords.js');
const scanNotif = require('../scanUtils/scanNotification.js');

// HANDLE MESSAGE FUNCTION
exports.handle = (message,contributors = 0) => {
	
	if (message.author !== null) {
		var args = message.content.split(' ');	
		if (args[0] === config.command && message.member !== null) { // FUNCTIONS CALLED BY COMMANDS
			command.handle(message,contributors);
		} else { // FUNCTIONS USING NO COMMAND
			if (message.guild !== null) {
				if (message.guild.name === chansLists.guildName && message.channel.name === chansLists.chanScanPokemon) {
					scanNotif.process(message,contributors);
				} else if (chansLists.chanFreeFromBannedWords.indexOf(message.channel.name) === -1 && message.member !== null) {
					checkBannedWords.process(message);
				}
			}
		}
	}
}
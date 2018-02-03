// ProfesseurOak

// DEV COMMANDS MODULE

var Discord = require('discord.js');

const config = require('../../config/config.json');
const languages = require('../../config/languages.json');

const rolesList = require('../../config/rolesList.json');
const chansLists = require('../../config/chansLists.json');

const scanFilter = require('../scanUtils/scanFilter.json');

const generalFunc = require('./generalFunc.js');

// TEST FUNCTION
exports.test = (message) => {
	return 0;
}

// RESTART FUNCTION
exports.restart = (message) => {
	if (message.guild.name === chansLists.guildName && message.member.roles.find("name",rolesList.admin)) {
		generalFunc.replyDelete("commande désactivée ! Utiliser le bouton sur http://professeur-oak-sherbrooke.online",message);
	}
}

// SCAN HUNTR INFO FUNCTION
exports.scanHuntrConfig = (message) => {
	if (message.guild.name === chansLists.guildName) {
		if (message.member.roles.find("name",rolesList.admin)) {
			var channelHuntr = message.guild.channels.find('name', chansLists.chanScanPokemon);
			if (channelHuntr === null) {return};
			channelHuntr.send("!setup 45.39652136952787,-71.88354492187501\n!radius 10\n!filter "+scanFilter.list);
		} else {
			generalFunc.replyDelete("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ",message);
		}
	}
}

// SCAN GYMHUNTR INFO FUNCTION
exports.scanGymhuntrConfig = (message) => {
	if (message.guild.name === chansLists.guildName) {
		if (message.member.roles.find("name",rolesList.admin)) {
			var channelHuntr = message.guild.channels.find('name', chansLists.chanScanPokemon);	
			if (channelHuntr === null) {return};	
			channelHuntr.send("!setup 45.39652136952787,-71.88354492187501\n!radius 10");
		} else {
			generalFunc.replyDelete("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ",message);
		}
	}
}
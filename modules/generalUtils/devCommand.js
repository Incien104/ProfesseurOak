// ProfesseurOak

// DEV COMMANDS MODULE

var Discord = require('discord.js');
var Firebase = require('firebase-admin');

const config = require('../../config/config.json');
const lang = require('../../config/lang.json');

const rolesList = require('../../config/rolesList.json');
const chansLists = require('../../config/chansLists.json');

const scanFilter = require('../scanUtils/scanFilter.json');

const generalFunc = require('./generalFunc.js');

Firebase.initializeApp({
  credential: Firebase.credential.cert({
    projectId: 'professeuroakmap-1513030094447',
    clientEmail: 'firebase-adminsdk-03wf4@professeuroakmap-1513030094447.iam.gserviceaccount.com',
    privateKey: process.env.FIREBASE_KEY
  }),
  databaseURL: 'https://professeuroakmap-1513030094447.firebaseio.com'
});

// TEST FUNCTION
exports.test = (message) => {
	if (message.guild.name === chansLists.guildName && message.member.roles.find("name",rolesList.admin)) {
		var guildRef = Firebase.database().ref('/guilds/' + message.guild.name);
		guildRef.once('value')
			.then(function(guildData) {
				var idGuild = guildData.id;
				message.channel.send(idGuild);
			})
			.catch(function(error) {
				console.log('Failed to get data :', error);
			});
	}
}

// RESTART FUNCTION
exports.restart = (message) => {
	if (message.guild.name === chansLists.guildName && message.member.roles.find("name",rolesList.admin)) {
		generalFunc.replyDelete("commande désactivée ! Utiliser le bouton sur http://professeur-oak-sherbrooke.online",message);
	}
}

// NUMBER OF GUILDS FUNCTION
exports.guildsNumber = (message) => {
	if (message.guild.name === chansLists.guildName && message.member.roles.find("name",rolesList.admin)) {
		var guildsIsMember = Array.from(message.member.user.client.guilds.values());
		var j = 0;
		for (i in guildsIsMember) {
			j = j+1;
		}
		generalFunc.botPostLog("Oak membre de "+j+" guildes",message.guild.channels.find('name',chansLists.chanBotLog));
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
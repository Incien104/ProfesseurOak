// ** Description **
// ProfesseurOak, v3.4.1, developed by Incien104
// Oct. 2017 - Jan. 2018
// Works with Node.js
// Require discord.js and request

// BOT CORE
// Have to be started using node


// =================================================
//                  INITIALIZATION
// =================================================

// -------------------------------------------------
// Main variables
const botVersion = "v3.4.1";
const botVersionDate = "02/02/2018";

// Required modules, files and variables
var Discord = require('discord.js');

const config = require('./config/config.json');
const languages = require('./config/languages.json');

const chansLists = require('./config/chansLists.json');

const contributors_backup = require('./modules/scanUtils/contributors.json');
var contributors;
var devBotLogChannel;

const events = require('./modules/generalUtils/events.js');
const jsonQuery = require('./modules/generalUtils/jsonQuery.js');
const messageHandler = require('./modules/generalUtils/messageHandler.js');
const generalFunc = require('./modules/generalUtils/generalFunc.js');

// -------------------------------------------------
// Bot creation and login
var bot = new Discord.Client();
bot.login(process.env.BOT_TOKEN);

// -------------------------------------------------
// Bot start on Heroku server, including settings for scheduled announcements
bot.on('ready', () => {    
    // Bot ready !		
		devBotLogChannel = bot.guilds.find("name",chansLists.guildName).channels.find("name",chansLists.chanBotLog);
		
		generalFunc.botPostLog('Démarré  !    Oak prêt  !    Exécutant '+botVersion+' - '+botVersionDate,devBotLogChannel);
		bot.user.setGame('!oak ('+botVersion+')');
		
		getContributorsJSON("start");
	
	// Scheduled events
		// 12h scheduled app restarting
		var intervalAppRestart = setInterval(appRestart, 43200000); // Every 12h
		// 15min scheduled contributors JSON file loading
		var intervalLoadJSON = setInterval(getContributorsJSON, 900000); // Every 15min
		// 1h scheduled weather forecast request + execution at launch
		//var intervalWeather = setInterval(weatherPost, 3600000); // Every 1h
		//weatherPost();
});


// =================================================
//                  BOT'S EVENTS
// =================================================

// -------------------------------------------------
// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
	events.arrivingMember(member);
});

// -------------------------------------------------
// Create an event listener for leaving/kicked out guild members
bot.on('guildMemberRemove', member => {
	events.leavingMember(member);
});

// -------------------------------------------------
// Create an event listener for when a guild members nickname is updated
bot.on('guildMemberUpdate', (oldMember,newMember) => {
	events.updatedMember(oldMember,newMember);
});


// =================================================
//                  BOT'S COMMANDS
// =================================================

// -------------------------------------------------
// Responding messages starting with the command word
bot.on('message', message => {	
	if (contributors !== null) {
		messageHandler.handle(message,contributors);
	} else {
		messageHandler.handle(message,contributors_backup);
	}
});


// =================================================
//            !! ESSENTIAL FUNCTIONS !!
// =================================================

// -------------------------------------------------
// LOAD CONTRIBUTORS JSON FILE !
function getContributorsJSON(requested) {
	jsonQuery.get(process.env.REMOTE_JSON)
		.then(res => {
			contributors = res;
			if (requested === "start") {
				generalFunc.botPostLog("Fichier JSON distant chargé.",devBotLogChannel);
			}
		})
		.catch(err => {
			if (requested === "start") {
				contributors = contributors_backup;
				generalFunc.botPostLog("Erreur au chargement de fichier JSON distant ("+err+"). Backup sur Github chargé.",devBotLogChannel);
			} else {
				generalFunc.botPostLog("Erreur au chargement de fichier JSON distant ("+err+"). Backup déjà en mémoire.",devBotLogChannel);
			}
		});
}

// -------------------------------------------------
// RESTART OAK DYNO !
function appRestart(requestType = 0) {
    var token = process.env.HEROKU_API_KEY;
	var appName = 'professeur-oak';
	var dynoName = 'worker';
	
	var request = require('request');
	
	request.delete(
		{
			url: 'https://api.heroku.com/apps/' + appName + '/dynos/',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/vnd.heroku+json; version=3',
				'Authorization': 'Bearer ' + token
			}
		},
		function(error, response, body) {
			if (requestType === "manuel") {
				generalFunc.botPostLog("Commande de redémarrage manuel effectuée !",devBotLogChannel);
			} else {
				generalFunc.botPostLog("Commande de redémarrage aux 12h effectuée !",devBotLogChannel);
			}
		}
	);
}

// =================================================

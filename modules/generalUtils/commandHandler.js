// ProfesseurOak

// COMMANDS HANDLING MODULE

var Discord = require('discord.js');

const config = require('../../config/config.json');
const languages = require('../../config/languages.json');

const rolesList = require('../../config/rolesList.json');
const chansLists = require('../../config/chansLists.json');

const generalFunc = require('./generalFunc.js');
const devCommand = require('./devCommand.js');
const modCommand = require('./modCommand.js');
const pokeCommand = require('../pokemonUtils/pokeCommand.js');

// HANDLE MESSAGE WITH COMMAND FUNCTION
exports.handle = (message,contributors = 0) => {	
	var args = message.content.split(' ');
	var cmd = args[1].toLowerCase();
	
	if (message.guild !== null) { // FUNCTIONS IN A GUILD'S CHANNELS
		switch(cmd) {
			// -------------
			// DEV FUNCTIONS
			// -------------
			
			// Test function
			case config.devCommand.test:
				devCommand.test(message);
			break;
			
			// Restart function
			case config.devCommand.restart:
				devCommand.restart(message);
			break;
			
			// Commands to start Huntr Bot
			case config.devCommand.scanHuntrConfig:
				devCommand.scanHuntrConfig(message);
			break;
			
			// Commands to start GymHuntr Bot
			case config.devCommand.scanGymhuntrConfig:
				devCommand.scanGymhuntrConfig(message);
			break;

			// --------------------------------
			// MODERATING AND GENERAL FUNCTIONS
			// --------------------------------
			
			// Ping function
			case config.modCommand.ping:
				modCommand.ping(message);
			break;	
			
			// Help function
			case config.modCommand.help:
				modCommand.help(message);
			break;
			
			// Annoucement function
			case config.modCommand.announcement:
				modCommand.announcement(message);
			break;
			
			// Roling function
			case config.modCommand.team:
				modCommand.team(message);
			break;
			
			// Mute function (mute a member in a single channel only)
			case config.modCommand.chanMute:
				modCommand.chanMute(message);
			break;
			
			// UnMute function (unmute a member in a single channel only)
			case config.modCommand.chanUnmute:
				modCommand.chanUnmute(message);
			break;
			
			// SuperMute function (mute a member on all channels)
			case config.modCommand.globalMute:
				modCommand.globalMute(message);
			break;
			
			// SuperUnmute function
			case config.modCommand.globalUnmute:
				modCommand.globalUnmute(message);
			break;
			
			// Clear messages function
			case config.modCommand.clearMessages:
				modCommand.clearMessages(message);
			break;	
			
			// Flush Role function
			case config.modCommand.roleRemoveMembers:
				modCommand.roleRemoveMembers(message);
			break;
			
			// -----------------
			// POKEMON FUNCTIONS
			// -----------------
			
			// Pokedex function
			case config.pokeCommand.pokedex:
				pokeCommand.pokedex(message);
			break;
			
			// Pokedex translation function
			case config.pokeCommand.translation:
				pokeCommand.translation(message);
			break;
			
			// Pokedex shiny function
			case config.pokeCommand.shiny:
				pokeCommand.shiny(message);
			break;
			
			// Pokedex Unown Alphabet function
			case config.pokeCommand.unown:
				pokeCommand.unown(message);
			break;
			
			case config.pokeCommand.zarbi:
				pokeCommand.unown(message);
			break;
			
			// Pokedex mega function
			case config.pokeCommand.mega:
				pokeCommand.mega(message);
			break;
			
			// Breakpoints Calc function
			case config.pokeCommand.breakpoint:
				pokeCommand.breakpoint(message);
			break;
			
			// IV Calc function
			case config.pokeCommand.iv:
				pokeCommand.iv(message);
			break;
			
			// Counter function
			case config.pokeCommand.counters:
				pokeCommand.counters(message);
			break;
			
			// Effect function
			case config.pokeCommand.effect:
				pokeCommand.effect(message);
			break;
			
			// Incien function
			case config.pokeCommand.easterEgg:
				pokeCommand.easterEgg(message);
			break;
			
			// INVALID COMMAND
			// Default : Not a command
			default:
				generalFunc.replyDelete("Commande invalide !",message);
		}
	} else { // FUNCTIONS IN DM CHANNELS
		switch(cmd) {		
			// Infoscan function
			case config.pokeCommand.privateNotifInfo:
				pokeCommand.privateNotifInfo(message,contributors);
			break;
				
			// INVALID COMMAND
			// Default : Not a command
			default:
				generalFunc.replyDelete("Commande invalide !",message);
		}
	}
}
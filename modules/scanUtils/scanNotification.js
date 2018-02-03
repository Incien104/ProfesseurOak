// ProfesseurOak

// SCAN NOTIFICATION MODULE

var Discord = require('discord.js');

const config = require('../../config/config.json');
const languages = require('../../config/languages.json');

const rolesList = require('../../config/rolesList.json');
const chansLists = require('../../config/chansLists.json');

const pokedex = require('../pokemonUtils/pokedex.json');

const scanFilter = require('./scanFilter.json');
const contributors_backup = require('./contributors.json');

exports.process = (message,contributors) => {
	// Scanned Pokemon Personal Alert : check HuntrBot messages to alert people with private messages
	var pokemonNumber = "";
	var pokemonNameFr = "";
	var pokemonNameEn = "";
	var memberToAlert = "";
	var colorForEmbed = "#43B581";
	
	// Read message embeds
	if (message.embeds[0] !== undefined) { //
		// Get informations from the bot's message					
		var argsTitle = message.embeds[0].title.split('(');
		argsTitle = argsTitle[1].split(')');
		var argsPokemonNumber = argsTitle[0];
		var remainingTimeText = message.embeds[0].description.split(': ');
		var remainingTime = remainingTimeText[1];
		var mapURL = message.embeds[0].url;
		var textURL = mapURL.split('#');
		var coords = textURL[1];
		var remainingTimeSplit = remainingTime.split(' min ');
		var minutes = parseInt(remainingTimeSplit[0]);
		var seconds = parseInt(remainingTimeSplit[1]);
		if (seconds < 10) {
			remainingTime = minutes+"m 0"+seconds+"s";
		} else {
			remainingTime = minutes+"m "+seconds+"s";
		}
		// Find the pokemon of the alert
		pokemonNumber = parseInt(argsPokemonNumber);
		var t = new Date();	
		t = t - config.timeFromUTC*60*60*1000 + minutes*60*1000 + seconds*1000;
		var disappearingTime = new Date(t);
		disappearingTime = disappearingTime.toString();
		disappearingTime = disappearingTime.substring(16,disappearingTime.length-18);
		disappearingTime = disappearingTime.replace(":"," h ");
		pokemonNameFr = pokedex.pokemonName[1][pokemonNumber-1];
		pokemonNameEn = pokedex.pokemonName[0][pokemonNumber-1];
		var thumbnail = "https://poketoolset.com/assets/img/pokemon/thumbnails/"+pokemonNumber+".png";
		// var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
		
		// Define the zone
		var areasNumber = 0;
		var areasName = "à Sherbrooke";
		var coordsSplited = coords.split(',');
		var latGPS = coordsSplited[0];
		var lonGPS = coordsSplited[1];
		if ((latGPS >= 45.353965 && latGPS < 45.403884) && (lonGPS >= -72.021852 && lonGPS < -71.960569)) {
			areasNumber = 1;
			areasName = "à Rock Forest";
		} else if ((latGPS >= 45.394000 && latGPS < 45.421478) && (lonGPS >= -71.960569 && lonGPS < -71.907869)) {
			areasNumber = 2;
			areasName = "dans le Nord";
		} else if ((latGPS >= 45.367474 && latGPS < 45.394000) && (lonGPS >= -71.960569 && lonGPS < -71.879201)) {
			areasNumber = 3;
			areasName = "à UdeS/Bellevue";
		} else if ((latGPS >= 45.394000 && latGPS < 45.421478) && (lonGPS >= -71.907869 && lonGPS < -71.879201)) {
			areasNumber = 4;
			areasName = "au Centro/Marais";
		} else if ((latGPS >= 45.348174 && latGPS < 45.382306) && (lonGPS >= -71.879201 && lonGPS < -71.817060)) {
			areasNumber = 5;
			areasName = "à Lennox";
		} else if ((latGPS >= 45.382306 && latGPS < 45.429429) && (lonGPS >= -71.879201 && lonGPS < -71.817060)) {
			areasNumber = 6;
			areasName = "à Fleurimont";
		}
		
		var weatherBoosted = "";
		if (remainingTimeText[2] !== '*None*') {
			weatherBoosted = "\n**Boosté** (météo)";
		}
		
		// Create Rich Embed									
		var embed = new Discord.RichEmbed()
			.setTitle(pokemonNameEn+"/"+pokemonNameFr+" ("+pokemonNumber+") "+areasName+" !")
			.setColor(colorForEmbed)
			.setDescription("Disparaît à **"+disappearingTime+"** (reste **"+remainingTime+"**)"+weatherBoosted)
			.setImage("https://maps.googleapis.com/maps/api/staticmap?center="+coords+"&zoom=13&markers="+coords+"&size=300x150&format=JPEG&key="+process.env.MAP_API_KEY)
			.setThumbnail(thumbnail)
			.setURL(mapURL);
			
		// Send messages to persons seeking for that pokemon
		var contributorID = "";
		for (k in contributors.list) {
			contributorID = contributors.list[k].id;
			if (contributors.list[k].activated === 1 && contributors.list[k].notify === 1 && ((contributors.list[k].pokemons.indexOf(pokemonNumber) !== -1 && contributors.list[k].areas.indexOf(areasNumber) !== -1) || pokemonNumber === 201)) {
				// Send a private message
				memberToAlert = message.guild.members.find('id', contributorID);
				if (memberToAlert !== null) {									
					memberToAlert.send({embed}).catch(console.error);
				} else {
					console.log(contributorID+" not found !");
				}
			}
		}
		console.log("Notifications send !");
	}
}
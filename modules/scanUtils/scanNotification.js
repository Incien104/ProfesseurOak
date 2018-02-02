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
	let pokemonNumber = "";
	let pokemonNameFr = "";
	let pokemonNameEn = "";
	let memberToAlert = "";
	let colorForEmbed = "#43B581";
	
	// Read message embeds
	if (message.embeds[0] !== undefined) { //
		// Get informations from the bot's message					
		let argsTitle = message.embeds[0].title.split('(');
		argsTitle = argsTitle[1].split(')');
		let argsPokemonNumber = argsTitle[0];
		let remainingTimeText = message.embeds[0].description.split(': ');
		let remainingTime = remainingTimeText[1];
		let mapURL = message.embeds[0].url;
		let textURL = mapURL.split('#');
		let coords = textURL[1];
		let remainingTimeSplit = remainingTime.split(' min ');
		let minutes = parseInt(remainingTimeSplit[0]);
		let seconds = parseInt(remainingTimeSplit[1]);
		if (seconds < 10) {
			remainingTime = minutes+"m 0"+seconds+"s";
		} else {
			remainingTime = minutes+"m "+seconds+"s";
		}
		// Find the pokemon of the alert
		pokemonNumber = parseInt(argsPokemonNumber);
		let t = new Date();	
		t = t - config.timeFromUTC*60*60*1000 + minutes*60*1000 + seconds*1000;
		let disappearingTime = new Date(t);
		disappearingTime = disappearingTime.toString();
		disappearingTime = disappearingTime.substring(16,disappearingTime.length-18);
		disappearingTime = disappearingTime.replace(":"," h ");
		pokemonNameFr = pokedex.pokemonName[1][pokemonNumber-1];
		pokemonNameEn = pokedex.pokemonName[0][pokemonNumber-1];
		let thumbnail = "https://poketoolset.com/assets/img/pokemon/thumbnails/"+pokemonNumber+".png";
		// var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
		
		// Define the zone
		let areasNumber = 0;
		let areasName = "à Sherbrooke";
		let coordsSplited = coords.split(',');
		let latGPS = coordsSplited[0];
		let lonGPS = coordsSplited[1];
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
		
		if (remainingTimeText[2] !== '*None*') {
			let weatherBoosted = "\n**Boosté** (météo)";
		} else {
			let weatherBoosted = "";
		}
		
		// Create Rich Embed									
		let embed = new Discord.RichEmbed()
			.setTitle(pokemonNameEn+"/"+pokemonNameFr+" ("+pokemonNumber+") "+areasName+" !")
			.setColor(colorForEmbed)
			.setDescription("Disparaît à **"+disappearingTime+"** (reste **"+remainingTime+"**)"+weatherBoosted)
			.setImage("https://maps.googleapis.com/maps/api/staticmap?center="+coords+"&zoom=13&markers="+coords+"&size=300x150&format=JPEG&key="+process.env.MAP_API_KEY)
			.setThumbnail(thumbnail)
			.setURL(mapURL);
			
		// Send messages to persons seeking for that pokemon
		let contributorID = "";
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
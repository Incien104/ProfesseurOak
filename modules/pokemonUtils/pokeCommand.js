// ProfesseurOak

// POKEMON COMMANDS MODULE

var Discord = require('discord.js');

const config = require('../../config/config.json');
const languages = require('../../config/languages.json');

const rolesList = require('../../config/rolesList.json');
const chansLists = require('../../config/chansLists.json');

const jsonQuery = require('../generalUtils/jsonQuery.js');
const generalFunc = require('../generalUtils/generalFunc.js');

const scanFilter = require('../scanUtils/scanFilter.json');

const pokedex = require('./pokedex.json');
const movesTypesStats = require('./movesTypesStats.json');
const mega_primal_xy = require('./mega_primal_xy.json');

// POKEMON NAME TRANSLATION FUNCTION
exports.translation = (message) => {
	if (message.channel.name === chansLists.chanOak) {	
		var args = message.content.split(' ');
		var parameter = args[2];
		if (generalFunc.isInt(parameter) && parameter >= 1 && parameter <= 807) {
			var pokemonNumber = parameter;
			var pokemonNameFr = pokedex.pokemonName[1][pokemonNumber-1];
			var pokemonNameEn = pokedex.pokemonName[0][pokemonNumber-1];
			// Create Rich Embed
			var colorForEmbed = "#43B581";
			var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
			var embed = new Discord.RichEmbed()
				.setTitle("#"+pokemonNumber)
				.setColor(colorForEmbed)
				.setDescription("Français : "+pokemonNameFr+"\nAnglais : "+pokemonNameEn)
				.setThumbnail(thumbnail)
			generalFunc.replyDelete({embed},message,1000,60000);
		} else if (generalFunc.isInt(parameter) && (parameter < 1 || parameter > 807)) {
			generalFunc.replyDelete("Ne correspond pas au numéro d'un pokémon !",message,5000,5000);
		} else {
			var pokemonName = parameter.capitalize();
			var pokemonNumber = 0;
			var numPokemon = pokedex.pokemonName[0].indexOf(pokemonName);
			if (numPokemon === -1) {
				numPokemon = pokedex.pokemonName[1].indexOf(pokemonName);
			}
			if (numPokemon !== -1) {
				var pokemonNumber = numPokemon+1;
				var pokemonNameFr = pokedex.pokemonName[1][pokemonNumber-1];
				var pokemonNameEn = pokedex.pokemonName[0][pokemonNumber-1];
				// Create Rich Embed
				var colorForEmbed = "#43B581";
				var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
				var embed = new Discord.RichEmbed()
					.setTitle("#"+pokemonNumber)
					.setColor(colorForEmbed)
					.setDescription("Français : "+pokemonNameFr+"\nAnglais : "+pokemonNameEn)
					.setThumbnail(thumbnail)
				generalFunc.replyDelete({embed},message,1000,60000);							
			} else {
				generalFunc.replyDelete("Pokémon introuvable ! Vérifiez l'orthographe...",message,5000,5000);
			}
		}
	}
}

// POKEMON SHINY FUNCTION
exports.shiny = (message) => {
	if (message.channel.name === chansLists.chanOak) {	
		var args = message.content.split(' ');
		var parameter = args[2];
		if (generalFunc.isInt(parameter) && parameter >= 1 && parameter <= 807) {
			var pokemonNumber = parameter;
			var pokemonNameFr = pokedex.pokemonName[1][pokemonNumber-1];
			var pokemonNameEn = pokedex.pokemonName[0][pokemonNumber-1];
			var pokemonNumberZeros = null;
			if (pokemonNumber < 10) {
				pokemonNumberZeros = "00"+pokemonNumber;
			} else if (pokemonNumber >= 10 && pokemonNumber < 100) {
				pokemonNumberZeros = "0"+pokemonNumber;
			} else {
				pokemonNumberZeros = pokemonNumber;
			}
			// Create Rich Embed
			var colorForEmbed = "#43B581";
			var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
			var embed = new Discord.RichEmbed()
				.setTitle("#"+pokemonNumber)
				.setColor(colorForEmbed)
				.setDescription(pokemonNameFr+" (fr) - "+pokemonNameEn+" (en)\nForme shiny : ")
				.setImage("http://www.psypokes.com/dex/shiny/"+pokemonNumberZeros+".png")
				.setThumbnail(thumbnail)
			generalFunc.replyDelete({embed},message,1000,60000);
		} else if (generalFunc.isInt(parameter) && (parameter < 1 || parameter > 807)) {
			generalFunc.replyDelete("Ne correspond pas au numéro d'un pokémon !",message,5000,5000);
		} else {
			var pokemonName = parameter.capitalize();
			var pokemonNumber = 0;
			var numPokemon = pokedex.pokemonName[0].indexOf(pokemonName);
			if (numPokemon === -1) {
				numPokemon = pokedex.pokemonName[1].indexOf(pokemonName);
			}
			if (numPokemon !== -1) {
				var pokemonNumber = numPokemon+1;
				var pokemonNameFr = pokedex.pokemonName[1][pokemonNumber-1];
				var pokemonNameEn = pokedex.pokemonName[0][pokemonNumber-1];
				var pokemonNumberZeros = null;
				if (pokemonNumber < 10) {
					pokemonNumberZeros = "00"+pokemonNumber;
				} else if (pokemonNumber >= 10 && pokemonNumber < 100) {
					pokemonNumberZeros = "0"+pokemonNumber;
				} else {
					pokemonNumberZeros = pokemonNumber;
				}
				// Create Rich Embed
				var colorForEmbed = "#43B581";
				var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
				var embed = new Discord.RichEmbed()
					.setTitle("#"+pokemonNumber)
					.setColor(colorForEmbed)
					.setDescription(pokemonNameFr+" (fr) - "+pokemonNameEn+" (en)\nForme shiny : ")
					.setImage("http://www.psypokes.com/dex/shiny/"+pokemonNumberZeros+".png")
					.setThumbnail(thumbnail)
				generalFunc.replyDelete({embed},message,1000,60000);							
			} else {
				generalFunc.replyDelete("Pokémon introuvable ! Vérifiez l'orthographe...",message,5000,5000);
			}
		}
	}
}

// UNOWN ALPHABET FUNCTION
exports.unown = (message) => {
	if (message.channel.name === chansLists.chanOak) {
		// Create Rich Embed
		var colorForEmbed = "#43B581";
		var embed = new Discord.RichEmbed()
			.setTitle("Formes de Unown/Zarbi (201) : ")
			.setColor(colorForEmbed)
			.setImage("https://raw.githubusercontent.com/Incien104/ProfesseurOak/master/img/unown_alphabet.png")
		generalFunc.replyDelete({embed},message,1000,60000);
	}
}

// POKEMON MEGA FUNCTION
exports.mega = (message) => {
	if (message.channel.name === chansLists.chanOak) {	
		var args = message.content.split(' ');
		var parameter = args[2];
		var listMega = null;
		if (parameter === null || parameter === undefined) {
			listMega = "Méga-Évolution :\n";
			for (i in mega_primal_xy.mega) {
				listMega = listMega+"#"+mega_primal_xy.mega[i]+" Méga-"+pokedex.pokemonName[0][mega_primal_xy.mega[i]-1];
				if (mega_primal_xy.xy.indexOf(mega_primal_xy.mega[i]) !== -1) {
					listMega = listMega+" X/Y";
				}
				listMega = listMega+", ";
			}
			listMega = listMega+"\n\nPrimo-Résurgence :\n";
			for (i in mega_primal_xy.primal) {
				listMega = listMega+"#"+mega_primal_xy.primal[i]+" Primo-"+pokedex.pokemonName[0][mega_primal_xy.primal[i]-1];
				listMega = listMega+", ";
			}
			generalFunc.replyDelete(listMega,message,1000,60000);
		} else if (generalFunc.isInt(parameter) && (mega_primal_xy.mega.indexOf(parameter) !== -1 || mega_primal_xy.primal.indexOf(parameter) !== -1)) {
			var pokemonNumber = parameter;
			var pokemonNameFr = pokedex.pokemonName[1][pokemonNumber-1];
			var pokemonNameEn = pokedex.pokemonName[0][pokemonNumber-1];
			var pokemonNumberZeros = null;
			if (pokemonNumber < 10) {
				pokemonNumberZeros = "00"+pokemonNumber;
			} else if (pokemonNumber >= 10 && pokemonNumber < 100) {
				pokemonNumberZeros = "0"+pokemonNumber;
			} else {
				pokemonNumberZeros = pokemonNumber;
			}
			var forme = null;
			var suffixe = null;
			if (mega_primal_xy.xy.indexOf(pokemonNumber) === -1) {
				if (mega_primal_xy.mega.indexOf(pokemonNumber) !== -1) {
					forme = "Méga-";
					suffixe = "_mega";
				} else {
					forme = "Primo-";
					suffixe = "_primal";
				}
				// Create Rich Embed
				var colorForEmbed = "#43B581";
				var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
				var embed = new Discord.RichEmbed()
					.setTitle("#"+pokemonNumber)
					.setColor(colorForEmbed)
					.setDescription(forme+pokemonNameFr+" (fr) - "+forme+pokemonNameEn+" (en)\nForme Méga/Antique : ")
					.setImage("http://www.psypokes.com/dex/regular/"+pokemonNumberZeros+suffixe+".png")
					.setThumbnail(thumbnail)
				generalFunc.replyDelete({embed},message,1000,60000);
			} else {
				forme = "Méga-";
				suffixe = "_xmega";
				// Create Rich Embed
				var colorForEmbed = "#43B581";
				var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
				var embed = new Discord.RichEmbed()
					.setTitle("#"+pokemonNumber)
					.setColor(colorForEmbed)
					.setDescription(forme+pokemonNameFr+" X (fr) - "+forme+pokemonNameEn+" X (en)\nForme Méga/Antique : ")
					.setImage("http://www.psypokes.com/dex/regular/"+pokemonNumberZeros+suffixe+".png")
					.setThumbnail(thumbnail)
				generalFunc.replyDelete({embed},message,1000,60000);
				forme = "Méga-";
				suffixe = "_ymega";
				// Create Rich Embed
				embed = new Discord.RichEmbed()
					.setTitle("#"+pokemonNumber)
					.setColor(colorForEmbed)
					.setDescription(forme+pokemonNameFr+" Y (fr) - "+forme+pokemonNameEn+" Y (en)\nForme Méga/Antique : ")
					.setImage("http://www.psypokes.com/dex/regular/"+pokemonNumberZeros+suffixe+".png")
					.setThumbnail(thumbnail)
				generalFunc.replyDelete({embed},message,1000,60000);
			}
		} else if (generalFunc.isInt(parameter) && (mega_primal_xy.mega.indexOf(mega_primal_xy.mega[i]) === -1 && mega_primal_xy.primal.indexOf(mega_primal_xy.primal[i]) === -1)) {
			generalFunc.replyDelete("Ne correspond pas au numéro d'un pokémon ou n'a pas de forme Méga!",message,5000,5000);
		} else {
			generalFunc.replyDelete("Entrez le numéro du pokémon pour voir sa forme Méga/Antique...",message,5000,5000);
		}
	}
}

// BREAKPOINT CALC FUNCTION
exports.breakpoint = (message) => {	
	var args = message.content.split(' ');
	if (message.channel.name === chansLists.chanOak && args.length >= 6) {
		var pokemon = args[2];
		var iv = parseInt(args[3]);
		var boss = args[4];
		var attack = args[5].capitalize();
		if (args.length === 7) {
			attack = args[5].capitalize()+" "+args[6].capitalize();
		} else if (args.length === 8) {
			attack = args[5].capitalize()+" "+args[6].capitalize()+" "+args[7].capitalize();
		}
		
		var pokemonName = pokemon.capitalize();
		var numPokemon = pokedex.pokemonName[0].indexOf(pokemonName);
		if (numPokemon === -1) {
			numPokemon = pokedex.pokemonName[1].indexOf(pokemonName);
		}
		var pokemonNumber = numPokemon+1;
		var bossName = boss.capitalize();
		var numBoss = pokedex.pokemonName[0].indexOf(bossName);
		if (numBoss === -1) {
			numBoss = pokedex.pokemonName[1].indexOf(bossName);
		}
		var attackName = attack;
		var numAttack = movesTypesStats.moveName[0].indexOf(attackName);
		if (numAttack === -1) {
			numAttack = movesTypesStats.moveName[1].indexOf(attackName);
		}
		
		if (numPokemon !== -1 && numBoss !== -1 && numAttack !== -1) {
			var weatherBoost = 1.2;
			var movePower = movesTypesStats.movePower[numAttack];
			var moveType = movesTypesStats.moveType[numAttack];
			var numBossLvl = movesTypesStats.raidBossName.indexOf(pokedex.pokemonName[0][numBoss]);
			var bossCpM = 0;
			var defenderText = "";
			var bossLvl = 0;
			if (numBossLvl === -1) {
				bossCpM = movesTypesStats.attackerCpM[movesTypesStats.attackerCpM.length-9];
				defenderText = " (lvl 36)";
			} else {
				bossLvl = movesTypesStats.raidBossLvl[numBossLvl];
				bossCpM = movesTypesStats.bossCpM[bossLvl-1];				
			}
			
			// Check if STAB
			var STAB = 1;
			if (pokedex.pokemonType[numPokemon].indexOf(moveType) !== -1) {
				STAB = 1.2;
			}
			
			// Compute effectiveness
			var effectiveness = 1;
			var moveTypeEffectiveness = movesTypesStats.typeEffectiveness[movesTypesStats.typeName[0].indexOf(moveType)];
			var typeBoss = pokedex.pokemonType[numBoss];
			for (i in typeBoss) {
				effectiveness = effectiveness*moveTypeEffectiveness[movesTypesStats.typeName[0].indexOf(typeBoss[i])];
			}
			
			var attackerBaseATK = movesTypesStats.pokemonStat[numPokemon][0];
			var bossBaseDEF = movesTypesStats.pokemonStat[numBoss][1];
			var lvlBreakpoint = new Array();
			var lvlBreakpointWeather = new Array();
			
			var movePowerCalc = 0.5 * (movePower * STAB * effectiveness);
			var movePowerCalcWeather = 0.5 * (movePower * weatherBoost * STAB * effectiveness);
			var pokeRatio = ((attackerBaseATK + iv) / (bossBaseDEF + 15));
						
			// Compute Breakpoints
			var cpMRatio = 0;
			for (j in movesTypesStats.attackerCpM) {
				cpMRatio = (movesTypesStats.attackerCpM[j] / bossCpM);
				
				lvlBreakpoint.push(Math.floor(1 + movePowerCalc * pokeRatio * cpMRatio));
				lvlBreakpointWeather.push(Math.floor(1 + movePowerCalcWeather * pokeRatio * cpMRatio));
			}
			
			var maxIndexBreakpoint = generalFunc.indexOfMax(lvlBreakpoint);
			var maxIndexBreakpointWeather = generalFunc.indexOfMax(lvlBreakpointWeather);
			var lvl = movesTypesStats.levelAttacker[maxIndexBreakpoint];
			var lvlWeather = movesTypesStats.levelAttacker[maxIndexBreakpointWeather];
			
			// Create Rich Embed
			var colorForEmbed = "#43B581";
			var thumbnail = "https://poketoolset.com/assets/img/pokemon/thumbnails/"+pokemonNumber+".png";
			embed = new Discord.RichEmbed()
				.setTitle(pokemonName+" (ATK "+iv+" - "+attackName+")"+" vs "+bossName+defenderText)
				.setColor(colorForEmbed)
				.setDescription("Dégâts (DPS) max = "+lvlBreakpoint[maxIndexBreakpoint]+" au niveau **"+lvl+"** (**sans** boost météo)\nDégâts (DPS) max = "+lvlBreakpointWeather[maxIndexBreakpointWeather]+" au niveau **"+lvlWeather+"** (**avec** boost météo)")
				.setThumbnail(thumbnail)
			generalFunc.replyDelete({embed},message,1000,60000);
		} else {
			generalFunc.replyDelete("**Pokémon** __ou__ **Boss** __ou__ **Attaque** introuvable ! Vérifiez l'orthographe...\nCommande de la forme !oak breakpoint [Pokémon Attaquant] [IV ATK] [Pokémon Opposant] [Attaque Pokémon Attaquant]",message,5000,5000);
		}
	}
}	

// IV CALC FUNCTION
exports.iv = (message) => {
	if (message.channel.name === chansLists.chanOak) {
		// !oak iv [Pokemon] [CP] [HP] [Stardust]	
		var args = message.content.split(' ');
		if (args.length === 6) {
			var pokemon = args[2];
			var cp = parseInt(args[3]);
			var hp = parseInt(args[4]);
			var stardust = parseInt(args[5]);
		
			var pokemonName = pokemon.capitalize();
			var numPokemon = pokedex.pokemonName[0].indexOf(pokemonName);
			if (numPokemon === -1) {
				numPokemon = pokedex.pokemonName[1].indexOf(pokemonName);
			}
			
			if (numPokemon !== -1) {
				var pokemonNumber = numPokemon+1;
				
				// Base values
				var baseATK = movesTypesStats.pokemonStat[numPokemon][0];
				var baseDEF = movesTypesStats.pokemonStat[numPokemon][1];
				var baseSTA = movesTypesStats.pokemonStat[numPokemon][2];
				
				// Use stardust to find lvl range
				var numFirstLvl = movesTypesStats.levelStardust.indexOf(stardust);
				
				// Use lvl range to find lvls and STA IV
				var numLvls = new Array();
				var ivHP = new Array();
				var calcHP = 0;
				for (i = 0; i < 4; i++) {
					for (j = 0; j < 16; j++) {
						calcHP = Math.floor((baseSTA+j)*movesTypesStats.cpMultiplier[numFirstLvl+i]);
						if (calcHP === hp) {
							numLvls.push(numFirstLvl+i);
							ivHP.push(j);
						}
					}
				}
				
				// Use results to find possible legal ATK and DEF values
				var calcCP = 0;
				var lvl = new Array();
				var percentage = new Array();
				var ivATK = new Array();
				var ivDEF = new Array();
				var ivSTA = new Array();
				for (k = 0; k < ivHP.length; k++) {
					for (i = 0; i < 16; i++) {
						for (j = 0; j < 16; j++) {
							calcCP = Math.floor(((baseATK+i)*Math.sqrt(baseDEF+j)*Math.sqrt(baseSTA+ivHP[k])*Math.pow(movesTypesStats.cpMultiplier[numLvls[k]],2))/10);
							if (calcCP === cp) {
								lvl.push(movesTypesStats.levelCpMultiplier[numLvls[k]]);
								cpMin = Math.floor(((baseATK)*Math.sqrt(baseDEF)*Math.sqrt(baseSTA)*Math.pow(movesTypesStats.cpMultiplier[numLvls[k]],2))/10);
								cpMax = Math.floor(((baseATK+15)*Math.sqrt(baseDEF+15)*Math.sqrt(baseSTA+15)*Math.pow(movesTypesStats.cpMultiplier[numLvls[k]],2))/10);
								percentage.push((cp-cpMin)/(cpMax-cpMin));
								ivATK.push(i);
								ivDEF.push(j);
								ivSTA.push(ivHP[k]);
							}
						}
					}
				}
				
				var ivResults = "";
				for (k = 0; k < lvl.length; k++) {
					ivResults = ivResults+"Niveau **"+lvl[k]+"**, **"+Math.round(percentage[k]*1000)/10+"%**, ATK **"+ivATK[k]+"** / DEF **"+ivDEF[k]+"** / STA **"+ivSTA[k]+"**\n";
				}
		
				// Create Rich Embed
				var colorForEmbed = "#43B581";
				var thumbnail = "https://poketoolset.com/assets/img/pokemon/thumbnails/"+pokemonNumber+".png";
				embed = new Discord.RichEmbed()
					.setTitle("IV de "+pokemonName+" (CP "+cp+" / HP "+hp+")")
					.setColor(colorForEmbed)
					.setDescription(ivResults)
					.setThumbnail(thumbnail)
				generalFunc.replyDelete({embed},message,1000,60000);							
			} else {
				generalFunc.replyDelete("informations manquantes, ou nom de pokémon introuvable, je ne peux pas calculer les IV de ton pokémon !\nCommande de la forme !oak iv [Pokémon] [CP] [HP] [Stardust]",message,5000,5000);
			}
		} else {
			generalFunc.replyDelete("informations manquantes, je ne peux pas calculer les IV de ton pokémon !\nCommande de la forme !oak iv [Pokémon] [CP] [HP] [Stardust]",message,5000,5000);
		}
	}
}

// BEST COUNTERS FUNCTION
exports.counters = (message) => {
	if (message.channel.name === chansLists.chanOak) {
		// !oak counter [Pokemon]
		var args = message.content.split(' ');
		var parameter = args[2];
		var pokemonNumber = 0;
		var pokemonNameEn = "";
		var pokemonName = "";
		var pokeOk = false;
		if (generalFunc.isInt(parameter) && parameter >= 1 && parameter <= 386) {
			pokemonNumber = parseInt(parameter);
			pokemonNameEn = pokedex.pokemonName[0][pokemonNumber-1];
			pokemonName = pokedex.pokemonName[0][pokemonNumber-1];
			pokeOk = true;
		} else if (generalFunc.isInt(parameter) && (parameter < 1 || parameter > 386)) {
			generalFunc.replyDelete("Données non disponibles pour ce # de Pokémon !",message,5000,5000);
		} else {
			pokemonName = parameter.capitalize();
			var numPokemon = pokedex.pokemonName[0].indexOf(pokemonName);
			if (numPokemon === -1) {
				numPokemon = pokedex.pokemonName[1].indexOf(pokemonName);
			}
			if (numPokemon !== -1) {
				pokemonNumber = numPokemon+1;
				pokemonNameEn = pokedex.pokemonName[0][pokemonNumber-1];
				pokeOk = true;							
			} else {
				generalFunc.replyDelete("Pokémon introuvable ! Vérifiez l'orthographe...",message,5000,5000);
			}
		}
		if (pokeOk === true && pokemonNumber !== 0) {
			jsonQuery.get("https://db.pokemongohub.net/pokemon/"+pokemonNumber+"/counters")
				.then(res => {
					var counters = "Meilleurs opposants :\n";
					for (i=0;i<res.counters.length;i++) {
						counters = counters + (i+1) + ". : " + res.counters[i].pokemon + " - " + res.counters[i].bmQuick + "/" + res.counters[i].bmCharge + " - " + res.counters[i].averageDPS + " DPS moyen\n"
					}
					// Create Rich Embed
					var colorForEmbed = "#43B581";
					var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
					var embed = new Discord.RichEmbed()
						.setTitle("#"+pokemonNumber+" - "+pokemonName)
						.setColor(colorForEmbed)
						.setDescription(counters)
						.setThumbnail(thumbnail)
					generalFunc.replyDelete({embed},message,1000,60000);
				})
				.catch(err => {
					generalFunc.replyDelete("Erreur lors de l'accès aux données. Réessayez !",message,5000,5000);
					console.log(err);
				});
		}
	}
}

// BEST COUNTERS FUNCTION
exports.effect = (message) => {
	if (message.channel.name === chansLists.chanOak) {
		// !oak counter [Pokemon]
		var args = message.content.split(' ');
		if (args.length < 3) {
			generalFunc.replyDelete("Spécifiez un Type ou un Pokémon !",message,5000,5000);
		} else {
			var typeName = args[2].toLowerCase();
			typeName = typeName.capitalize();
			var typeNumber = movesTypesStats.typeName[0].indexOf(typeName);
			if (typeNumber === -1) {
				typeNumber = movesTypesStats.typeName[1].indexOf(typeName);
			}
			if (typeNumber !== -1) {
				var attEffect = "";
				var defEffect = "";
				var attStrong = " ";
				var attWeak = " ";
				var attSuperWeak = " ";
				var defSuperStrong = " ";
				var defStrong = " ";
				var defWeak = " ";
				for (i = 0;i<movesTypesStats.typeName[0].length;i++) {
					if (movesTypesStats.typeEffectiveness[typeNumber][i] > 1) {
						attStrong = attStrong+movesTypesStats.typeName[1][i]+",";
					} else if (movesTypesStats.typeEffectiveness[typeNumber][i] < 1 && movesTypesStats.typeEffectiveness[typeNumber][i] > 0.6) {
						attWeak = attWeak+movesTypesStats.typeName[1][i]+",";
					} else if (movesTypesStats.typeEffectiveness[typeNumber][i] < 0.6) {
						attSuperWeak = attSuperWeak+movesTypesStats.typeName[1][i]+",";
					}
					if (movesTypesStats.typeEffectiveness[i][typeNumber] > 0.6 && movesTypesStats.typeEffectiveness[i][typeNumber] < 1) {
						defStrong = defStrong+movesTypesStats.typeName[1][i]+",";
					} else if (movesTypesStats.typeEffectiveness[i][typeNumber] > 1) {
						defWeak = defWeak+movesTypesStats.typeName[1][i]+",";
					} else if (movesTypesStats.typeEffectiveness[i][typeNumber] < 0.6) {
						defSuperStrong = defSuperStrong+movesTypesStats.typeName[1][i]+",";
					}
				}
				attStrong = attStrong.substring(0,attStrong.length-1);
				attWeak = attWeak.substring(0,attWeak.length-1);
				attSuperWeak = attSuperWeak.substring(0,attSuperWeak.length-1);
				defSuperStrong = defSuperStrong.substring(0,defSuperStrong.length-1);
				defStrong = defStrong.substring(0,defStrong.length-1);
				defWeak = defWeak.substring(0,defWeak.length-1);
				
				attEffect = "Très efficace contre : "+attStrong+"\nPeu efficace contre : "+attWeak+"\nTrès peu efficace contre : "+attSuperWeak;
				defEffect = "Très résistant contre : "+defSuperStrong+"\nRésistant contre : "+defStrong+"\nFaible contre : "+defWeak;
				
				// Create Rich Embed
				var colorForEmbed = "#43B581";
				var embed = new Discord.RichEmbed()
					.setTitle("Type "+typeName)
					.setColor(colorForEmbed)
					.addField("En attaque",attEffect)
					.addField("En défense",defEffect)
				generalFunc.replyDelete({embed},message,1000,60000);			
			} else {
				var pokemonName = args[2].toLowerCase();
				pokemonName = pokemonName.capitalize();
				var pokemonNumber = pokedex.pokemonName[0].indexOf(pokemonName);
				if (pokemonNumber === -1) {
					pokemonNumber = pokedex.pokemonName[1].indexOf(pokemonName);
				}
				if (pokemonNumber !== -1) {
					var defEffect = "";
					var defSuperStrong = " ";
					var defStrong = " ";
					var defWeak = " ";
					var defSuperWeak = " ";
					var effectiveness = 0;
					var pokemonType = pokedex.pokemonType[pokemonNumber];
					var pokemonTypes = "";
					if (pokemonType.length === 1) {
						pokemonTypes = movesTypesStats.typeName[1][movesTypesStats.typeName[0].indexOf(pokemonType[0])];
					} else {
						pokemonTypes = movesTypesStats.typeName[1][movesTypesStats.typeName[0].indexOf(pokemonType[0])]+"/"+movesTypesStats.typeName[1][movesTypesStats.typeName[0].indexOf(pokemonType[1])];
					}
					for (i = 0;i<movesTypesStats.typeName[0].length;i++) {
						if (pokemonType.length === 1) {
							effectiveness = movesTypesStats.typeEffectiveness[i][movesTypesStats.typeName[0].indexOf(pokemonType[0])];
						} else {
							effectiveness = movesTypesStats.typeEffectiveness[i][movesTypesStats.typeName[0].indexOf(pokemonType[0])]*movesTypesStats.typeEffectiveness[i][movesTypesStats.typeName[0].indexOf(pokemonType[1])];
						}
						if (effectiveness > 0.6 && effectiveness < 0.99) {
							defStrong = defStrong+movesTypesStats.typeName[1][i]+",";
						} else if (effectiveness > 1 && effectiveness < 1.5) {
							defWeak = defWeak+movesTypesStats.typeName[1][i]+",";
						} else if (effectiveness < 0.6) {
							defSuperStrong = defSuperStrong+movesTypesStats.typeName[1][i]+",";
						} else if (effectiveness > 1.5) {
							defSuperWeak = defSuperWeak+movesTypesStats.typeName[1][i]+",";
						}
					}
					defSuperStrong = defSuperStrong.substring(0,defSuperStrong.length-1);
					defStrong = defStrong.substring(0,defStrong.length-1);
					defWeak = defWeak.substring(0,defWeak.length-1);
					defSuperWeak = defSuperWeak.substring(0,defSuperWeak.length-1);
					
					defEffect = "Très résistant contre : "+defSuperStrong+"\nRésistant contre : "+defStrong+"\nFaible contre : "+defWeak+"\nTrès faible contre : "+defSuperWeak;
					
					// Create Rich Embed
					var colorForEmbed = "#43B581";
					var embed = new Discord.RichEmbed()
						.setTitle("#"+(pokemonNumber+1)+" - "+pokemonName+" - "+pokemonTypes)
						.setColor(colorForEmbed)
						.addField("En attaque","voir effet du type de l'attaque")
						.addField("En défense",defEffect)
					generalFunc.replyDelete({embed},message,1000,60000);
				} else {
					generalFunc.replyDelete("Type ou Pokémon introuvable ! Vérifiez l'orthographe...",message,5000,5000);
				}
			}
		}
	}
}

// POKEDEX FUNCTION
exports.pokedex = (message) => {
	if (message.channel.name === chansLists.chanOak) {
		var args = message.content.split(' ');
		var parameter = args[2];
		if (generalFunc.isInt(parameter) && parameter >= 1 && parameter <= 807) {
			var pokemonNumber = parameter;
			var pokemonNameFr = pokedex.pokemonName[1][pokemonNumber-1];
			var pokemonNameEn = pokedex.pokemonName[0][pokemonNumber-1];
			var evoFamily = pokedex.pokemonEvoFamilyNumber[pokemonNumber-1];
			if (evoFamily !== -1) {
				// Create Rich Embed
				var colorForEmbed = "#43B581";
				var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
				var embed = new Discord.RichEmbed()
					.setTitle("#"+pokemonNumber)
					.setColor(colorForEmbed)
					.setDescription("Français : "+pokemonNameFr+"/Anglais : "+pokemonNameEn)
					.addField("Type(s)", pokedex.pokemonType[pokemonNumber-1])
					.addField("Évolution", pokedex.pokemonEvoFamily[0][evoFamily])
					.setThumbnail(thumbnail)
				generalFunc.replyDelete({embed},message,1000,60000);
			} else {
				// Create Rich Embed
				var colorForEmbed = "#43B581";
				var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
				var embed = new Discord.RichEmbed()
					.setTitle("#"+pokemonNumber)
					.setColor(colorForEmbed)
					.setDescription("Français : "+pokemonNameFr+"/Anglais : "+pokemonNameEn)
					.addField("Type(s)", pokedex.pokemonType[pokemonNumber-1])
					.setThumbnail(thumbnail)
				generalFunc.replyDelete({embed},message,1000,60000);
			}
		} else if (generalFunc.isInt(parameter) && (parameter < 1 || parameter > 807)) {
			generalFunc.replyDelete("Ne correspond pas au numéro d'un pokémon !",message,5000,5000);
		} else {
			var pokemonName = parameter.capitalize();
			var pokemonNumber = 0;
			var numPokemon = pokedex.pokemonName[0].indexOf(pokemonName);
			if (numPokemon === -1) {
				numPokemon = pokedex.pokemonName[1].indexOf(pokemonName);
			}
			if (numPokemon !== -1) {
				var pokemonNumber = numPokemon+1;
				var pokemonNameFr = pokedex.pokemonName[1][pokemonNumber-1];
				var pokemonNameEn = pokedex.pokemonName[0][pokemonNumber-1];
				var evoFamily = pokedex.pokemonEvoFamilyNumber[pokemonNumber-1];
				if (evoFamily !== -1) {
					// Create Rich Embed
					var colorForEmbed = "#43B581";
					var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
					var embed = new Discord.RichEmbed()
						.setTitle("#"+pokemonNumber)
						.setColor(colorForEmbed)
						.setDescription("Français : "+pokemonNameFr+"/Anglais : "+pokemonNameEn)
						.addField("Type(s)", pokedex.pokemonType[pokemonNumber-1])
						.addField("Évolution", pokedex.pokemonEvoFamily[0][evoFamily])
						.setThumbnail(thumbnail)
					generalFunc.replyDelete({embed},message,1000,60000);
				} else {
					// Create Rich Embed
					var colorForEmbed = "#43B581";
					var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
					var embed = new Discord.RichEmbed()
						.setTitle("#"+pokemonNumber)
						.setColor(colorForEmbed)
						.setDescription("Français : "+pokemonNameFr+"/Anglais : "+pokemonNameEn)
						.addField("Type(s)", pokedex.pokemonType[pokemonNumber-1])
						.setThumbnail(thumbnail)
					generalFunc.replyDelete({embed},message,1000,60000);
				}			
			} else {
				generalFunc.replyDelete("Pokémon introuvable ! Vérifiez l'orthographe...",message,5000,5000);
			}
		}
	}
}

// MINMAX CP FUNCTION
exports.cp = (message) => {
	if (message.channel.name === chansLists.chanOak) {
		// !oak cp [Pokemon] [LVL]	
		var args = message.content.split(' ');
		if (args.length === 4) {
			var pokemon = args[2];
			var lvl = parseInt(args[3]);
		
			var pokemonName = pokemon.capitalize();
			var numPokemon = pokedex.pokemonName[0].indexOf(pokemonName);
			if (numPokemon === -1) {
				numPokemon = pokedex.pokemonName[1].indexOf(pokemonName);
			}
			
			if (numPokemon !== -1) {
				var pokemonNumber = numPokemon+1;
				
				// Base values
				var baseATK = movesTypesStats.pokemonStat[numPokemon][0];
				var baseDEF = movesTypesStats.pokemonStat[numPokemon][1];
				var baseSTA = movesTypesStats.pokemonStat[numPokemon][2];
				
				var numLvl = movesTypesStats.levelCpMultiplier.indexOf(lvl);
				
				var cpMin = Math.floor(((baseATK)*Math.sqrt(baseDEF)*Math.sqrt(baseSTA)*Math.pow(movesTypesStats.cpMultiplier[numLvl],2))/10);
				var cpMax = Math.floor(((baseATK+15)*Math.sqrt(baseDEF+15)*Math.sqrt(baseSTA+15)*Math.pow(movesTypesStats.cpMultiplier[numLvl],2))/10);
		
				// Create Rich Embed
				var colorForEmbed = "#43B581";
				var thumbnail = "https://poketoolset.com/assets/img/pokemon/thumbnails/"+pokemonNumber+".png";
				embed = new Discord.RichEmbed()
					.setTitle(pokemonName+" niveau "+lvl)
					.setColor(colorForEmbed)
					.setDescription("CP Min : "+cpMin+" / CP Max : "+cpMax)
					.setThumbnail(thumbnail)
				generalFunc.replyDelete({embed},message,1000,60000);							
			} else {
				generalFunc.replyDelete("informations manquantes, ou nom de pokémon introuvable !\nCommande de la forme !oak cp [Pokémon] [LVL]",message,5000,5000);
			}
		} else {
			generalFunc.replyDelete("informations manquantes, je ne peux pas te donner les CP Min/Max de ce pokémon !\nCommande de la forme !oak cp [Pokémon] [LVL]",message,5000,5000);
		}
	}
}

// EASTER EGG FUNCTION
exports.easterEgg = (message) => {
	if (message.channel.name === chansLists.chanOak) {
		// Create Rich Embed									
		var embed = new Discord.RichEmbed()
			.setTitle("Un Incien sauvage apparaît !!!")
			.setColor("#43B581")
			.setImage('https://raw.githubusercontent.com/Incien104/ProfesseurOak/master/img/incien.gif')
		generalFunc.replyDelete({embed},message,1000,60000);	
	} else {
		generalFunc.replyDelete("tu n'es pas autorisé à utiliser cette commande ici ! :no_entry: ",message);
	}
}

// INFOSCAN PRIVATE FUNCTION
exports.privateNotifInfo = (message,contributors) => {
	for (k in contributors.list) {
		if (contributors.list[k].id === message.author.id) {
			message.channel.send("**Compte activé :** "+contributors.list[k].activated+"\n**Notifications activées :** "+contributors.list[k].notify+"\n**Zones :** "+contributors.list[k].areas+"\n**Notifications personnalisées :** "+contributors.list[k].pokemons.sort(function(a, b){return a-b})+"\n\n**Scan global :** "+scanFilter.list.sort(function(a, b){return a-b})).catch(console.error);
			break;
		}
	}
}

// ---------------------------------
//         NEEDED FUNCTIONS

// CAPITALIZE FIRST LETTER
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
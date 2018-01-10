// ** Description **
// ProfesseurOak, v2.7.1, developed by Incien104
// GPL 3.0, Oct. 2017 - Jan. 2018
// Works on Heroku server using a node.js worker dyno
// Require discord.js and request


// =================================================
//                  INITIALIZATION
// =================================================

// -------------------------------------------------
// Main variables
const botVersion = "v2.7.1";
const botVersionDate = "10/01/2018";
const timeUTCQuebec = 5; // Hours from UTC to have the right time

var Discord = require('discord.js');
var chansLists = require('./chansLists.json');
var bannedWords = require('./bannedWords.json');
var scanFilter = require('./scanFilter.json');
var pokedex_fr = require('./pokedex_fr.json');
var pokedex_en = require('./pokedex_en.json');
var mega_primal_xy = require('./mega_primal_xy.json');
var weatherBoost = require('./weatherBoost.json');
var contributors_backup = require('./contributors.json');
var contributors;

// -------------------------------------------------
// Bot creation and login
var bot = new Discord.Client();
bot.login(process.env.BOT_TOKEN);

// -------------------------------------------------
// Bot start on Heroku server, including settings for scheduled announcements
bot.on('ready', () => {    
    // Bot ready !
	botPostLog('Démarré  !    Oak prêt  !    Exécutant '+botVersion+' - '+botVersionDate);
	loadJSONFile("start");	
	// 12h scheduled app restarting
    var intervalAppRestart = setInterval(appRestart, 43200000); // Every 12h
    // 15min scheduled contributors JSON file loading
    var intervalLoadJSON = setInterval(loadJSONFile, 900000); // Every 15min
	// 1h scheduled weather forecast request + execution at launch
    //var intervalWeather = setInterval(weatherPost, 3600000); // Every 1h
	//weatherPost();
});


// =================================================
//                  BOT'S COMMANDS
// =================================================

// -------------------------------------------------
// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('name', chansLists.chanGeneral);
  const channelAdmins = member.guild.channels.find('name', chansLists.chanAdmins);
  const server = member.guild.name;
  const serverCount = member.guild.memberCount;
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  if (member.guild.name === chansLists.guildName) {
	channel.send(`${member} est arrivé ! Bienvenue au **${serverCount}ème** dresseur à nous rejoindre ! :tada:`).catch(console.error);
	member.send(`-----------------------------------------------------\n**Bienvenue ${member} sur la plateforme ${server} !!!** Je suis le Professeur Oak !\nTu es le **${serverCount}ème** dresseur à nous rejoindre.\n\nPour pouvoir écrire des messages, pense bien à valider l'adresse mail de ton compte Discord !\nPrend le temps de consulter les règles du chat ainsi que le fonctionnement de Discord dans les salons adéquats !\n__Les administrateurs vont te contacter par message privé afin de te donner les accès au chat de ton équipe.__\n\n**N'oublis pas qu'ici le respect entre joueurs est primordial** :wink: \n\nExplore les différents channels, il y a tout pour les dresseurs de Sherbrooke !\nSi tu as des questions ou des soucis, contacte un des __administrateurs__ (leur pseudo est de couleur mauve) ou un des __modérateurs__ (pseudo de couleur verte claire).\n\nHave Fun !\n-----------------------------------------------------`).catch(console.error);
	// Giving default role
	let roleDef = member.guild.roles.find("name", "@NoTeam");
	member.addRole(roleDef).catch(console.error);
	channelAdmins.send(`<@&370319180534382603> Nouveau membre : ${member} !`);
	botPostLog(`Nouveau membre : ${member} !`);
  }
});

// -------------------------------------------------
// Create an event listener for leaving/kicked out guild members
bot.on('guildMemberRemove', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('name', chansLists.chanGeneral);
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  if (member.guild.name === chansLists.guildName) {
	channel.send("**"+member.displayName+"** *vient de partir. Bye bye...* :vulcan: ").catch(console.error);
	botPostLog(member.displayName+" a quitté ou a été expulsé/banni !");
  }
});

// -------------------------------------------------
// Create an event listener for when a guild members nickname is updated
bot.on('guildMemberUpdate', (oldMember,newMember) => {
  // Send the message, mentioning the member
  var previousNickname = oldMember.nickname;
  if (newMember.guild.name === chansLists.guildName && previousNickname !== null && oldMember.nickname !== newMember.nickname) {
	botPostLog('__'+previousNickname+`__ a changé son pseudo pour ${newMember} !`);
  }
});

// -------------------------------------------------
// Responding messages starting with "!"
bot.on('message', message => {
	var user = message.member; // user as a GuildMember
	if (message.guild !== null && user !== null) {
		var userRoles = user.roles; // roles as a Role Collection
		
		// -----------------------------------------------
		// Commands to the bot in guild, starting with "!"
		if (message.content.substring(0, 1) === '!' && message.guild.name === chansLists.guildName) {
			var args = message.content.substring(1).split(' ');
			var cmd = args[0];
	
			if (cmd === "équipe") {
				cmd = "equipe";
			}
        
			switch(cmd) {
				// -------------		
				// Ping function
				case 'oakping':
					if (userRoles.find("name","@Admins")) {
						botPostLog("Exécute "+botVersion+" !");
					} else {
						message.reply("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ");
					}
				break;	
				
				// ----------------
				// Restart function
				case 'oakrestart':
					if (userRoles.find("name","@Admins")) {
						appRestart("manual");
					} else {
						message.reply("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ");
					}
				break;
				
				// -------------
				// Help function
				case 'oakhelp':
					if (userRoles.find("name","@Admins") && message.channel.name === chansLists.chanBotConfig) {						
						message.channel.send("Fonctions :\n\
						- !oakhelp : revoie les fonctions disponibles (*admins seulement*)\n\
						- !oakping : vérifie si le bot fonctionne et retourne le numéro de version (*admins seulement*)\n\
						- !oaktest : permet de tester la dernière fonction en développement (actuellement **rien**) (*admins seulement*)\n\
						- !oakrestart : permet de redémarrer le robot (mais il doit encore fonctionner) (*admins seulement*)\n\
						- !annonce : permet de lancer une annonce sur un chan (*admins seulement*). Liste des annonces :\n\
						. . . . . . .  - !annonce noteam : envoie un message sur #general pour rappeler aux NoTeam de choisir une équipe\n\
						. . . . . . .  - !annonce nests : envoie un message sur #nests lors d'une migration pour inviter les gens à remplir l'Atlas\n\
						- !equipe : permet de choisir une équipe (*tout le monde*)\n\
						- !mute @utilisateur : permet de mute un utilisateur sur un chan en particulier (*admins et mods*)\n\
						- !unmute @utilisateur : permet de unmute un utilisateur sur un chan en particulier (*admins et mods*)\n\
						- !supermute @utilisateur : permet de mute un utilisateur sur tout le serveur (*admins seulement*)\n\
						- !superunmute @utilisateur : permet de unmute un utilisateur sur tout le serveur (*admins seulement*)\n\
						- !starthuntr : redémarre et configure le bot PokeHuntr dans le chan #scan-pokemons (*admins seulement*)\n\
						- !startgymhunter : redémarre et configure le bot GymHuntr dans le chan #scan-raids (*admins seulement*)\n\
						- !oaktrad #/nom pokémon : permet d'avoir le nom en français et en anglais (*salon pokedex seulement*)\n\
						- !oakshiny #/nom pokémon : permet de voir la forme shiny (*salon pokedex seulement*)\n\
						- !oakmega : donne la liste des méga-évolutions et primo-résurgeances (*salon pokedex seulement*)\n\
						- !oakmega #/nom pokémon : permet de voir la forme méga ou antique (*salon pokedex seulement*)\n\
						- !oakunown ou !oakzarbi : affiche la liste des formes de Unown/Zarbi (*salon pokedex seulement*)\n\
						");
					} else if (message.channel.name === chansLists.chanPokedex) {						
						message.channel.send("Fonctions :\n\
						- !oaktrad #/nom pokémon : permet d'avoir le nom en français et en anglais (*salon pokedex seulement*)\n\
						- !oakshiny #/nom pokémon : permet de voir la forme shiny (*salon pokedex seulement*)\n\
						- !oakmega : donne la liste des méga-évolutions et primo-résurgeances (*salon pokedex seulement*)\n\
						- !oakmega #/nom pokémon : permet de voir la forme méga ou antique (*salon pokedex seulement*)\n\
						- !oakunown ou !oakzarbi : affiche la liste des formes de Unown/Zarbi (*salon pokedex seulement*)\n\
						");
					}
				break;
				
				// --------------------
				// Annoucement function
				case 'annonce':
					if (userRoles.find("name","@Admins")) {
						var announce = args[1];
						var botGuild = bot.guilds.find('name', chansLists.guildName);
						
						switch(announce) {
							case 'noteam':
								var channelAnnouncements = botGuild.channels.find('name', chansLists.chanGeneral);
	
								if (!channelAnnouncements) return;
								// Send the message, mentioning the members
								channelAnnouncements.send(`<@&371096330614996993> Pour ceux qui ne sont pas encore intégrés à leur équipe, veuillez envoyer par message privé un screenshot de votre écran de joueur (où l'on voit pseudo, niveau et équipe) à un administrateur, pour qu'il puisse vous donner les accès au salon privilégié de votre couleur ! :wink:`).catch(console.error);
								botPostLog('Annonce aux NoTeam effectuée');
							break;
							case 'nests':
								var channelAnnouncements = botGuild.channels.find('name', chansLists.chanNests);
	
								if (!channelAnnouncements) return;
								// Send the message, mentioning the members
								channelAnnouncements.send(`@everyone Dresseurs, les nids de pokémon viennent de changer. Aidez-nous à les découvrir et à les répertorier sur https://thesilphroad.com/atlas#12.12/45.4027/-71.8959 ! :smiley:`).catch(console.error);
								botPostLog('Annonce de changement des nids effectuée');
							break;	
							default:
								message.reply("annonce inexistante ! ");
						}
					} else {
						message.reply("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ");
					}
				break;
				
				// ---------------
				// Roling function
				case 'equipe':
					message.reply("commande désactivée !");
					/*
					var askedRole = args[1];
					args = args.splice(1);
					askedRole = askedRole.toLowerCase();
					if (askedRole === "intuition" || askedRole === "jaune" || askedRole === "yellow") {
						askedRole = "instinct";
					} else if (askedRole === "sagesse" || askedRole === "bleu" || askedRole === "bleue" || askedRole === "blue") {
						askedRole = "mystic";
					} else if (askedRole === "bravoure" || askedRole === "rouge" || askedRole === "red") {
						askedRole = "valor";
					}
		
					if (userRoles.find("name","@Instinct") || userRoles.find("name","@Mystic") || userRoles.find("name","@Valor")) {
						message.reply(" :warning: tu as déjà une équipe ! Contacte les administrateurs (<@&370319180534382603>) si tu as un problème.");
					} else if (userRoles.find("name","@Multi")) {
						message.reply(" :no_entry: Pas de multi-compte autorisé ! Contacte les administrateurs (<@&370319180534382603>) pour plus d'infos.");
					} else {
						let roleRem = message.guild.roles.find("name", "@NoTeam");
						user.removeRole(roleRem).catch(console.error);                
						switch(askedRole) {
							case 'instinct':
								let roleI = message.guild.roles.find("name", "@Instinct");
								user.addRole(roleI).catch(console.error);
								message.reply("bienvenue dans la team Instinct ! :wink:");
								botPostLog(`Équipe choisie : ${user} -> Instinct`);
							break;
							case 'mystic':
								let roleM = message.guild.roles.find("name", "@Mystic");
								user.addRole(roleM).catch(console.error);
								message.reply("bienvenue dans la team Mystic ! :wink:");
								botPostLog(`Équipe choisie : ${user} -> Mystic`);
							break;
							case 'valor':
								let roleV = message.guild.roles.find("name", "@Valor");
								user.addRole(roleV).catch(console.error);
								message.reply("bienvenue dans la team Valor ! :wink:");
								botPostLog(`Équipe choisie : ${user} -> Valor`);
							break;
							default:
								message.reply(" :warning: nom d'équipe incorrect !\nTape **!equipe instinct**, **!equipe mystic** ou **!equipe valor** pour choisir ton équipe.");
						}
					}
					*/
				break;
				
				// ------------------------------------------------------
				// Mute function (mute a member in a single channel only)
				case 'mute':
					if (userRoles.find("name","@Admins") || userRoles.find("name","@Mods")) {					
						var memberToMute = message.mentions.members.first();
						var channelForMute = message.channel;
						
						if (memberToMute !== undefined) {
							if (memberToMute.roles.find("name","@Admins") || memberToMute.roles.find("name","@Mods") || memberToMute.roles.find("name","@Bots")) {
								message.reply("opération impossible sur un admin/mod/bot ! :no_entry: ");
							} else if (channelForMute.permissionOverwrites.find("id",memberToMute.id) !== null) {
								message.reply(` :warning: ${memberToMute} est déjà :mute: !`);
							} else {
								channelForMute.overwritePermissions(memberToMute, {
									'SEND_MESSAGES': false,
									'ADD_REACTIONS': false
								})
								.then(() => {
									channelForMute.send(`${memberToMute} est maintenant :mute: !`);
									botPostLog(`${memberToMute} a été :mute: par ${user} sur le chan ${channelForMute} !`);
								})
								.catch(console.error);
							}
						} else {
							message.reply("mention invalide, membre non trouvé :warning: ");
						}
					} else {
						message.reply("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ");
					}
				break;
				
				// ----------------------------------------------------------
				// UnMute function (unmute a member in a single channel only)
				case 'unmute':
					if (userRoles.find("name","@Admins") || userRoles.find("name","@Mods")) {					
						var memberToUnmute = message.mentions.members.first();
						var channelForUnmute = message.channel;
						
						if (memberToUnmute !== undefined) {
							if (memberToUnmute.roles.find("name","@Admins") || memberToUnmute.roles.find("name","@Mods") || memberToUnmute.roles.find("name","@Bots")) {
								message.reply("opération impossible sur un admin/mod/bot ! :no_entry: ");
							} else if (channelForUnmute.permissionOverwrites.find("id",memberToUnmute.id) === null) {
								message.reply(` :warning: ${memberToUnmute} est déjà :loud_sound: !`);
							} else {
								channelForUnmute.permissionOverwrites.find("id",memberToUnmute.id).delete()
								.then(() => {
									channelForUnmute.send(`${memberToUnmute} est maintenant :loud_sound: !`);
									botPostLog(`${memberToUnmute} a été :loud_sound: par ${user} sur le chan ${channelForUnmute} !`);
								})
								.catch(console.error);							
							}
						} else {
							message.reply("mention invalide, membre non trouvé :warning: ");
						}
					} else {
						message.reply("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ");
					}
				break;
				
				// --------------------------------------------------
				// SuperMute function (mute a member on all channels)
				case 'supermute':
					if (userRoles.find("name","@Admins")) {					
						var memberToMute = message.mentions.members.first();
						
						if (memberToMute !== undefined) {
							if (memberToMute.roles.find("name","@Admins") || memberToMute.roles.find("name","@Mods") || memberToMute.roles.find("name","@Bots")) {
								message.reply("opération impossible sur un admin/mod/bot ! :no_entry: ");
							} else if (memberToMute.roles.find("name","@Muted")) {
								message.reply(` :warning: ${memberToMute} est déjà supermute !`);
							} else {
								if (memberToMute.roles.find("name","@RM")) {
									let roleRM = message.guild.roles.find("name", "@RM");
									memberToMute.removeRole(roleRM).catch(console.error);
								}
								if (memberToMute.roles.find("name","@Instinct")) {
									let roleI = message.guild.roles.find("name", "@Instinct");
									memberToMute.removeRole(roleI).catch(console.error);
									var team = "Instinct";
								} else if (memberToMute.roles.find("name","@Mystic")) {
									let roleM = message.guild.roles.find("name", "@Mystic");
									memberToMute.removeRole(roleM).catch(console.error);
									var team = "Mystic";
								} else if (memberToMute.roles.find("name","@Valor")) {
									let roleV = message.guild.roles.find("name", "@Valor");
									memberToMute.removeRole(roleV).catch(console.error);
									var team = "Valor";
								} else {
									var team = "No Team";
								}
								let roleMute = message.guild.roles.find("name", "@Muted");									
								memberToMute.addRole(roleMute).catch(console.error);
								message.reply(`${memberToMute} (`+team+`) est maintenant **super** :mute: !`);
								botPostLog(`${memberToMute} (`+team+`) a été SUPER MUTE par ${user} !`);
							}
						} else {
							message.reply("mention invalide, membre non trouvé :warning: ");
						}
					} else {
						message.reply("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ");
					}
				break;
				
				// -------------------
				// SperUnmute function
				case 'superunmute':
					if (userRoles.find("name","@Admins")) {					
						var memberToUnmute = message.mentions.members.first();
						
						if (memberToUnmute !== undefined) {
							if (memberToUnmute.roles.find("name","@Admins") || memberToUnmute.roles.find("name","@Mods") || memberToMute.roles.find("name","@Bots")) {
								message.reply("opération impossible sur un admin/mod/bot ! :no_entry: ");
							} else if (!memberToUnmute.roles.find("name","@Muted")) {
								message.reply(` :warning: ${memberToUnmute} est déjà unmute !`);
							} else {
								let roleMute = message.guild.roles.find("name", "@Muted");
								memberToUnmute.removeRole(roleMute).catch(console.error);
								message.reply(`${memberToUnmute} est n'est plus **super** :mute: !`);
								botPostLog(`${memberToUnmute} a été SUPER UnMUTE par ${user} !`);
							}
						} else {
							message.reply("mention invalide, membre non trouvé :warning: ");
						}
					} else {
						message.reply("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ");
					}
				break;
				
				// -----------------------
				// Clear messages function
				case 'clear':
					if (userRoles.find("name","@Admins")) {
						var channelToClear = message.channel;
						var nbMessagesToClear = args[1];
						if (nbMessagesToClear >= 1 && nbMessagesToClear <= 30) {
							var fetchedMessages = channelToClear.fetchMessages({limit: nbMessagesToClear})					
								.then(messages => {
									messages.deleteAll();
									message.reply("*"+messages.size+" messages supprimés ! :wastebasket:*");
								})
								.catch(console.error);
						} else if (nbMessagesToClear > 30) {
							message.reply("maximum de 30 messages supprimables d'un coup :warning: ");
						} else {
							var nbMessagesToClear = 30;
							var memberToClearMessages = message.mentions.members.first();
							
							if (memberToClearMessages !== undefined) {
								var fetchedMessages = channelToClear.fetchMessages({limit: nbMessagesToClear})					
									.then(messages => {
										var nbClearedMessages = 0;
										message.reply(`**`+nbClearedMessages+`** *messages de* **${memberToClearMessages}** *supprimés ! :wastebasket:*`);
									})
									.catch(console.error);
							} else {
								message.reply("mention invalide, membre non trouvé :warning: ");
							}
						}
					} else {
						message.reply("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ");
					}
				break;
				
				// ---------------------------
				// Commands to start Huntr Bot
				case 'starthuntr':
					if (userRoles.find("name","@Admins")) {
						var botGuild = bot.guilds.find('name', chansLists.guildName);
						var channelHuntr = botGuild.channels.find('name', chansLists.chanScanPokemon);
						
						channelHuntr.send("!setup 45.39652136952787,-71.88354492187501");
						channelHuntr.send("!radius 10");
						channelHuntr.send("!filter "+scanFilter.list);
					} else {
						message.reply("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ");
					}
				break;
				
				// ------------------------------
				// Commands to start GymHuntr Bot
				case 'startgymhuntr':
					if (userRoles.find("name","@Admins")) {
						var botGuild = bot.guilds.find('name', chansLists.guildName);
						var channelHuntr = botGuild.channels.find('name', chansLists.chanScanRaid);
						
						channelHuntr.send("!setup 45.39652136952787,-71.88354492187501");
						channelHuntr.send("!radius 10");
					} else {
						message.reply("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ");
					}
				break;
				
				// ----------------------------
				// Pokedex translation function
				case 'oaktrad':
					if (message.channel.name === chansLists.chanPokedex) {
						var parameter = args[1];
						if (isInt(parameter) && parameter >= 1 && parameter <= 806) {
							var pokemonNumber = parameter;
							var pokemonNameFr = pokedex_fr.list[pokemonNumber-1];
							var pokemonNameEn = pokedex_en.list[pokemonNumber-1];
							// Create Rich Embed
							var colorForEmbed = "#43B581";
							var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
							var embed = new Discord.RichEmbed()
								.setTitle("#"+pokemonNumber)
								.setColor(colorForEmbed)
								.setDescription("Français : "+pokemonNameFr+"\nAnglais : "+pokemonNameEn)
								.setThumbnail(thumbnail)
							message.channel.send({embed}).catch(console.error);
						} else if (isInt(parameter) && (parameter < 1 || parameter > 806)) {
							message.channel.send("Ne correspond pas au numéro d'un pokémon !").catch(console.error);
						} else {
							var pokemonName = parameter.capitalize();
							var pokemonNumber = 0;
							var numPokemon = pokedex_en.list.indexOf(pokemonName);
							if (numPokemon === -1) {
								numPokemon = pokedex_fr.list.indexOf(pokemonName);
							}
							if (numPokemon !== -1) {
								var pokemonNumber = numPokemon+1;
								var pokemonNameFr = pokedex_fr.list[pokemonNumber-1];
								var pokemonNameEn = pokedex_en.list[pokemonNumber-1];
								// Create Rich Embed
								var colorForEmbed = "#43B581";
								var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
								var embed = new Discord.RichEmbed()
									.setTitle("#"+pokemonNumber)
									.setColor(colorForEmbed)
									.setDescription("Français : "+pokemonNameFr+"\nAnglais : "+pokemonNameEn)
									.setThumbnail(thumbnail)
								message.channel.send({embed}).catch(console.error);								
							} else {
								message.channel.send("Pokémon introuvable ! Vérifiez l'orthographe...").catch(console.error);
							}
						}
					}
				break;
				
				// ----------------------
				// Pokedex shiny function
				case 'oakshiny':
					if (message.channel.name === chansLists.chanPokedex) {
						var parameter = args[1];
						if (isInt(parameter) && parameter >= 1 && parameter <= 806) {
							var pokemonNumber = parameter;
							var pokemonNameFr = pokedex_fr.list[pokemonNumber-1];
							var pokemonNameEn = pokedex_en.list[pokemonNumber-1];
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
							message.channel.send({embed}).catch(console.error);
						} else if (isInt(parameter) && (parameter < 1 || parameter > 806)) {
							message.channel.send("Ne correspond pas au numéro d'un pokémon !").catch(console.error);
						} else {
							var pokemonName = parameter.capitalize();
							var pokemonNumber = 0;
							var numPokemon = pokedex_en.list.indexOf(pokemonName);
							if (numPokemon === -1) {
								numPokemon = pokedex_fr.list.indexOf(pokemonName);
							}
							if (numPokemon !== -1) {
								var pokemonNumber = numPokemon+1;
								var pokemonNameFr = pokedex_fr.list[pokemonNumber-1];
								var pokemonNameEn = pokedex_en.list[pokemonNumber-1];
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
								message.channel.send({embed}).catch(console.error);								
							} else {
								message.channel.send("Pokémon introuvable ! Vérifiez l'orthographe...").catch(console.error);
							}
						}
					}
				break;
				
				// -------------------------------
				// Pokedex Unown Alphabet function
				case 'oakunown':
					if (message.channel.name === chansLists.chanPokedex) {
						// Create Rich Embed
						var colorForEmbed = "#43B581";
						var embed = new Discord.RichEmbed()
							.setTitle("Formes de Unown/Zarbi (201) : ")
							.setColor(colorForEmbed)
							.setImage("https://raw.githubusercontent.com/Incien104/ProfesseurOak/master/unown_alphabet.png")
						message.channel.send({embed}).catch(console.error);
					}
				break;
				case 'oakzarbi':
					if (message.channel.name === chansLists.chanPokedex) {
						// Create Rich Embed
						var colorForEmbed = "#43B581";
						var embed = new Discord.RichEmbed()
							.setTitle("Formes de Unown/Zarbi (201) : ")
							.setColor(colorForEmbed)
							.setImage("https://raw.githubusercontent.com/Incien104/ProfesseurOak/master/unown_alphabet.png")
						message.channel.send({embed}).catch(console.error);
					}
				break;
				
				// ---------------------
				// Pokedex mega function
				case 'oakmega':
					if (message.channel.name === chansLists.chanPokedex) {
						var parameter = args[1];
						var listMega = null;
						if (parameter === null || parameter === undefined) {
							listMega = "Méga-Évolution :\n";
							for (i in mega_primal_xy.mega) {
								listMega = listMega+"#"+mega_primal_xy.mega[i]+" Méga-"+pokedex_en.list[mega_primal_xy.mega[i]-1];
								if (mega_primal_xy.xy.indexOf(mega_primal_xy.mega[i]) !== -1) {
									listMega = listMega+" X/Y";
								}
								listMega = listMega+", ";
							}
							listMega = listMega+"\n\nPrimo-Résurgence :\n";
							for (i in mega_primal_xy.primal) {
								listMega = listMega+"#"+mega_primal_xy.primal[i]+" Primo-"+pokedex_en.list[mega_primal_xy.primal[i]-1];
								listMega = listMega+", ";
							}
							message.channel.send(listMega).catch(console.error);
						} else if (isInt(parameter) && (mega_primal_xy.mega.indexOf(parameter) !== -1 || mega_primal_xy.primal.indexOf(parameter) !== -1)) {
							var pokemonNumber = parameter;
							var pokemonNameFr = pokedex_fr.list[pokemonNumber-1];
							var pokemonNameEn = pokedex_en.list[pokemonNumber-1];
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
									var forme = "Méga-";
									var suffixe = "_mega";
								} else {
									var forme = "Primo-";
									var suffixe = "_primal";
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
								message.channel.send({embed}).catch(console.error);
							} else {
								var forme = "Méga-";
								var suffixe = "_xmega";
								// Create Rich Embed
								var colorForEmbed = "#43B581";
								var thumbnail = "http://static.pokemonpets.com/images/monsters-images-60-60/"+pokemonNumber+"-"+pokemonNameEn+".png";
								var embed = new Discord.RichEmbed()
									.setTitle("#"+pokemonNumber)
									.setColor(colorForEmbed)
									.setDescription(forme+pokemonNameFr+" X (fr) - "+forme+pokemonNameEn+" X (en)\nForme Méga/Antique : ")
									.setImage("http://www.psypokes.com/dex/regular/"+pokemonNumberZeros+suffixe+".png")
									.setThumbnail(thumbnail)
								message.channel.send({embed}).catch(console.error);
								forme = "Méga-";
								suffixe = "_ymega";
								// Create Rich Embed
								embed = new Discord.RichEmbed()
									.setTitle("#"+pokemonNumber)
									.setColor(colorForEmbed)
									.setDescription(forme+pokemonNameFr+" Y (fr) - "+forme+pokemonNameEn+" Y (en)\nForme Méga/Antique : ")
									.setImage("http://www.psypokes.com/dex/regular/"+pokemonNumberZeros+suffixe+".png")
									.setThumbnail(thumbnail)
								message.channel.send({embed}).catch(console.error);
							}
						} else if (isInt(parameter) && (mega_primal_xy.mega.indexOf(mega_primal_xy.mega[i]) === -1 && mega_primal_xy.primal.indexOf(mega_primal_xy.primal[i]) === -1)) {
							message.channel.send("Ne correspond pas au numéro d'un pokémon ou n'a pas de forme Méga!").catch(console.error);
						} else {
							message.channel.send("Entrez le numéro du pokémon pour voir sa forme Méga/Antique...").catch(console.error);
						}
					}
				break;
				
				// -------------
				// Test function
				case 'oaktest':
					if (userRoles.find("name","@Admins")) {
						
					} else {
						message.reply("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ");
					}
				break;
			}
		} else if (message.content.substring(0, 1) === '?' && message.guild.name === chansLists.guildName) {
			var args = message.content.substring(1).split(' ');
			var cmd = args[0];
			var cmd2 = args[1];
			
			if (message.channel.name === chansLists.chanPokedex && cmd === "pokedex" && (cmd2 === "Incien" || cmd2 === "incien")) {
				// Create Rich Embed									
				var embed = new Discord.RichEmbed()
					.setTitle("Un Incien sauvage apparaît !!!")
					.setColor("#43B581")
					.setImage('https://raw.githubusercontent.com/Incien104/ProfesseurOak/master/img/incien.gif')
				message.channel.send({embed}).catch(console.error);
			}
		} else {
			// -----------------------------------
			// Banned Words : check entire message
			if (message.guild.name === chansLists.guildName && chansLists.chanFreeFromBannedWords.indexOf(message.channel.name) === -1 && !user.roles.find("name","@Bots")) {
				var messageWords = message.content.split(' ');
				var wordToTest = "";
				var incorrectLanguage = false;
				var i;
				var j;
			
				for (i in messageWords) {
					wordToTest = messageWords[i].toLowerCase();
					if (bannedWords.list.indexOf(wordToTest) !== -1) {
						incorrectLanguage = true;
					}
				}
			
				if (incorrectLanguage) {
					var channelOfMessage = message.channel;
					// Delete a message
					message.delete()
						.then(() => {
							botPostLog(`Message de ${user} dans ${channelOfMessage} supprimé pour mauvais language : *${message.content}*`);
						})
						.catch(console.error);
					channelOfMessage.send(`${user}, **attention à ton langage !!** :rage: `)
						.then(msg => {
							msg.delete(5000);
						})
						.catch(console.error);
				}				
			} else if (message.channel.name === chansLists.chanScanPokemon) {
			// ----------------------------------------------------------------------------------------------
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
					t = t - timeUTCQuebec*60*60*1000 + minutes*60*1000 + seconds*1000;
					var disappearingTime = new Date(t);
					disappearingTime = disappearingTime.toString();
					disappearingTime = disappearingTime.substring(16,disappearingTime.length-18);
					disappearingTime = disappearingTime.replace(":"," h ");
					pokemonNameFr = pokedex_fr.list[pokemonNumber-1];
					pokemonNameEn = pokedex_en.list[pokemonNumber-1];
					var thumbnail = "https://poketoolset.com/assets/img/pokemon/thumbnails/"+pokemonNumber+".png";
					// var thumbnail = "https://raw.githubusercontent.com/Incien104/ProfesseurOak/master/pokemon_thumbnails/"+pokemonNumber+".png";
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
					
					if (remainingTimeText[2] !== '*None*') {
						var weatherBoosted = "\n**Boosté** (météo)";
					} else {
						var weatherBoosted = "";
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
								botPostLog(contributorID+" est introuvable");
							}
						}
					}
					console.log("Message send !");
				}
			}
		}
	} else {
		// -------------------------------------------------------------
		// Commands to the bot using private messages, starting with "!"
		if (message.content.substring(0, 1) === '!') {
			var args = message.content.substring(1).split(' ');
			var cmd = args[0];
        
			switch(cmd) {
				// ----------------------------------------
				// Commands to see contributor informations
				case 'infoscan':
					for (k in contributors.list) {
						if (contributors.list[k].id === message.author.id) {
							message.channel.send("**Compte activé :** "+contributors.list[k].activated+"\n**Notifications activées :** "+contributors.list[k].notify+"\n**Zones :** "+contributors.list[k].areas+"\n**Notifications personnalisées :** "+contributors.list[k].pokemons.sort(function(a, b){return a-b})+"\n\n**Scan global :** "+scanFilter.list.sort(function(a, b){return a-b})).catch(console.error);
							break;
						}
					}
				break;
			}
		}
	}
});


// =================================================
//                    FUNCTIONS
// =================================================

// -------------------------------------------------
// Bot's logs in a log channel !
function botPostLog(messageToPost) {
	var d = new Date();	
	d = d - timeUTCQuebec*60*60*1000;
	var dateQuebec = new Date(d);
	dateQuebec = dateQuebec.toString();
	dateQuebec = dateQuebec.substring(0,dateQuebec.length-15);
	const botGuild = bot.guilds.find('name', chansLists.guildName);
	const logsChannel = botGuild.channels.find('name', chansLists.chanBotLog);
	logsChannel.send('*['+dateQuebec+']* : **'+messageToPost+'**');
	console.log(messageToPost);
}

// -------------------------------------------------
// Test for an integer value !
function isInt(value) {
	return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

// -------------------------------------------------
// Capitalize first letter !
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// -------------------------------------------------
// Load contributors JSON file !
function loadJSONFile(requested) {        
    getContributorsFile()
		.then(response => {
			contributors = response;
			if (requested === "start") {
				botPostLog("Fichier JSON distant chargé.");
			}
		})
		.catch(error => {
			if (requested === "start") {
				contributors = contributors_backup;
				botPostLog("Erreur au chargement de fichier JSON distant ("+error+"). Backup sur Github chargé.");
			} else {
				botPostLog("Erreur au chargement de fichier JSON distant ("+error+"). Backup déjà en mémoire.");
			}			
		});
}

// -------------------------------------------------
// Get contributors.json !
function getContributorsFile() {
	var http = require('http');
	return new Promise((resolve,reject)=>{
		http.get(process.env.REMOTE_JSON, (res) => {
			var { statusCode } = res;
			var contentType = res.headers['content-type'];
			
			let error;
			if (statusCode !== 200) {
				error = new Error('Échec de la requête. ' +
								`Code status : ${statusCode}`);
			} /*else if (!/^application\/json/.test(contentType)) {
				error = new Error('Type de contenu invalide : ' +
								`Attendu application/json, reçu ${contentType}`);
			}*/
			if (error) {
				console.error(error.message);
				// consume response data to free up memory
				res.resume();
			}
			
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				try {
					const parsedData = JSON.parse(rawData);
					resolve(parsedData);					
				} catch (e) {
					reject(e.message);
				}
			});
		}).on('error', (e) => {
			reject(`Erreur reçue : ${e.message}`);
		}).end();
	})
}

// -------------------------------------------------
// Get weather from pokefetch !
function getWeather() {
	var https = require('https');
	return new Promise((resolve,reject)=>{
		https.get("https://pokefetch.com/#45.39712406621648,-71.89710617065431", (res) => {
			var { statusCode } = res;
			var contentType = res.headers['content-type'];
			
			let error;
			if (statusCode !== 200) {
				error = new Error('Échec de la requête. ' +
								`Code status : ${statusCode}`);
			}
			if (error) {
				console.error(error.message);
				// consume response data to free up memory
				res.resume();
			}
			
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				try {
					//<img src="assets/img/weather/weatherIcon_small_Sunny.png"></img>
					rawData = rawData.split("<img src=\"assets/img/weather/weatherIcon_small_");
					rawData = rawData[1].split(".png\"></img>");
					weather = rawData[0];
					resolve(weather);
				} catch (e) {
					reject(e.message);
				}
			});
		}).on('error', (e) => {
			reject(`Erreur reçue : ${e.message}`);
		}).end();
	})
}

// -------------------------------------------------
// Get coords from huntr.gg redirect ! (UNUSED)
function getCoords(pathURL) {
	var http = require('http');
	var options = {method: 'GET', host: 'huntr.gg', path: pathURL};
	return new Promise((resolve,reject)=>{
		http.get(options, (res) => {
			var { statusCode } = res;
			var contentType = res.headers['content-type'];
			
			let error;
			if (statusCode !== 200) {
				error = new Error('Échec de la requête. ' +
								`Code status : ${statusCode}`);
			}
			if (error) {
				console.error(error.message);
				// consume response data to free up memory
				res.resume();
			}
			
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				try {
					const parsedData = JSON.parse(rawData);
					console.log(parsedData);
					resolve(parsedData);
				} catch (e) {
					reject(e.message);
				}
			});
		}).on('error', (e) => {
			reject(`Erreur reçue : ${e.message}`);
		}).end();
	})
}

// -------------------------------------------------
// Restart Oak dyno !
function appRestart(requested) {  
	requested = requested || 0;      
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
			if (requested === "manual") {
				botPostLog("Commande de redémarrage manuel effectuée !");
			} else {
				botPostLog("Commande de redémarrage aux 12h effectuée !");
			}
		}
	);
}

// -------------------------------------------------
// Post weather forecast in weather channel !
function weatherPost() {        
    getWeather()
		.then(response => {
			const botGuild = bot.guilds.find('name', chansLists.guildName);
			const channelWeather = botGuild.channels.find('name', chansLists.chanWeather);
			var d = new Date();	
			d = d - timeUTCQuebec*60*60*1000;
			var dateQuebec = new Date(d);
			dateQuebec = dateQuebec.toString();
			var timeWeather = dateQuebec.substring(16,18);
			var timeWeatherStart = parseInt(timeWeather);
			if (timeWeatherStart === 23) {
				var timeWeatherEnd = 0;
			} else {
				var timeWeatherEnd = timeWeatherStart+1;
			}
			var boostNumber = weatherBoost.weatherList.indexOf(response);
			if (boostNumber !== -1) {
				var boost = weatherBoost.boostList[boostNumber];
				var weatherText = weatherBoost.weatherListFR[boostNumber];
				var thumbnailWeather = "https://raw.githubusercontent.com/Incien104/ProfesseurOak/master/img/weather/"+weatherBoost.weatherIcon[boostNumber];
			} else {
				var boost = "---";
				var weatherText = response;
				var thumbnailWeather = "https://pbs.twimg.com/profile_images/879422659620163584/wudfVGeL_400x400.jpg";
			}
			// Create Rich Embed			
			var colorForEmbed = "#43B581";
			var embed = new Discord.RichEmbed()
				.setTitle("Météo de **"+timeWeatherStart+"h** à **"+timeWeatherEnd+"h** dans le jeu :")
				.setColor(colorForEmbed)
				.setDescription("**"+weatherText+"**\n\n**Boost : "+boost+"**")
				.setThumbnail(thumbnailWeather)
			
			channelWeather.send({embed}).catch(console.error);
			console.log("Weather posted !");
		})
		.catch(error => {
			botPostLog("Erreur au chargement de la météo ("+error+").");
		});
}

// -------------------------------------------------
// Get 1h weather forecast from accuwheather !
function weather() {        
    var http = require('http');
	return new Promise((resolve,reject)=>{
		http.get("http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/50017?apikey="+process.env.WEATHER_API_KEY+"&language=fr-ca&metric=true", (res) => {
			var { statusCode } = res;
			var contentType = res.headers['content-type'];
			
			let error;
			if (statusCode !== 200) {
				error = new Error('Échec de la requête. ' +
								`Code status : ${statusCode}`);
			} /*else if (!/^application\/json/.test(contentType)) {
				error = new Error('Type de contenu invalide : ' +
								`Attendu application/json, reçu ${contentType}`);
			}*/
			if (error) {
				console.error(error.message);
				// consume response data to free up memory
				res.resume();
			}
			
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				try {
					//const parsedData = JSON.parse(rawData);
					resolve(rawData);					
				} catch (e) {
					reject(e.message);
				}
			});
		}).on('error', (e) => {
			reject(`Erreur reçue : ${e.message}`);
		}).end();
	})
}

// =================================================

// ProfesseurOak

// MOD AND GENERAL COMMANDS MODULE

var Discord = require('discord.js');

const config = require('../../config/config.json');
const languages = require('../../config/languages.json');

const rolesList = require('../../config/rolesList.json');
const chansLists = require('../../config/chansLists.json');

const generalFunc = require('./generalFunc.js');

// PING FUNCTION
exports.ping = (message) => {
	let userRoles = message.member.roles;
	if (userRoles.find("name",rolesList.admin)) {
		let returnedLog = new Array();
		generalFunc.botPostLog(botVersion+" running !",message.guild.channels.find("name",chansLists.chanBotLog));
	} else {
		generalFunc.replyDelete("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ",message);
	}
}

// HELP FUNCTION
exports.help = (message) => {
	let userRoles = message.member.roles;	
	let args = message.content.split(' ');
	if (userRoles.find("name",rolesList.admin)) {		
		if (args.length < 3) {
			generalFunc.sendDelete("Commandes de Oak (commencer par !oak) :\n\
				Annonces :\n\
				....- announcement nom_de_lannonce\n\
				........- nests (annonce de la migration)\n\
				........- noteam (rappel d'envoi du screenshot pour assignation d'équipe)\n\
				Modération :\n\
				....- help (affiche l'aide de Oak : liste des commandes)\n\
				....- team [Team Name]\n\
				....- mute @la_personne\n\
				....- unmute @la_personne\n\
				....- supermute @la_personne\n\
				....- superunmute @la_personne\n\
				....- clear [nombre_de_messages]\n\
				Pokémons :\n\
				....- pokedex (pas encore développé)\n\
				....- trad [Nom ou # Pokémon]\n\
				....- shiny [Nom ou # Pokémon]\n\
				....- mega [Rien ou Nom ou # Pokémon]\n\
				....- unown\n\
				....- zarbi\n\
				....- breakpoint [Pokémon Attaquant] [IV ATK] [Pokémon Opposant] [Attaque rapide pokémon attaquant]\n\
				....- iv [Pokémon] [CP] [HP] [Stardust/Poussière étoile]\n\
				....- counter (pas encore développé)\n\
				....- incien (easter egg ^^)\n\
				Technique :\n\
				....- ping (teste la réponse de Oak)\n\\n\
			*Ce message disparaît au bout de 30 secondes..*",message,1000,30000);
		}
	} else if (message.channel.name === chansLists.chanOak) {		
		if (args.length < 3) {			
			generalFunc.sendDelete("Commandes de Oak (commencer par !oak) :\n\
				....- trad [Nom ou # Pokémon]\n\
				....- shiny [Nom ou # Pokémon]\n\
				....- mega [Rien ou Nom ou # Pokémon]\n\
				....- unown\n\
				....- zarbi\n\
				....- breakpoint [Pokémon Attaquant] [IV ATK] [Pokémon Opposant] [Attaque rapide pokémon attaquant]\n\
				....- iv [Pokémon] [CP] [HP] [Stardust/Poussière étoile]\n\
				....- incien\n\\n\
			*Ce message disparaît au bout de 30 secondes..*",message,1000,30000);
		}
	}
}

// ANNOUNCEMENT FUNCTION
exports.announcement = (message) => {
	let userRoles = message.member.roles;	
	let args = message.content.split(' ');
	let announce = args[2].toLowerCase();
	if (userRoles.find("name",rolesList.admin)) {
		let channelAnnouncements;
		switch(announce) {
			case config.announce[0]:
				channelAnnouncements = message.guild.channels.find('name', chansLists.chanNests);	
				if (!channelAnnouncements) return;
				// Send the message, mentioning the members
				channelAnnouncements.send("@everyone Dresseurs, les nids de pokémon viennent de changer. Aidez-nous à les découvrir et à les répertorier sur https://thesilphroad.com/atlas#12.12/45.4027/-71.8959 ! :smiley:").catch(console.error);
				generalFunc.botPostLog('Annonce de changement des nids effectuée',message.guild.channels.find("name",chansLists.chanBotLog));
			break;
			case config.announce[1]:
				channelAnnouncements = message.guild.channels.find('name', chansLists.chanGeneral);	
				if (!channelAnnouncements) return;
				// Send the message, mentioning the members
				channelAnnouncements.send("@"+rolesList.noTeam+" Pour ceux qui ne sont pas encore intégrés à leur équipe, veuillez envoyer par message privé un screenshot de votre écran de joueur (où l'on voit pseudo, niveau et équipe) à un administrateur, pour qu'il puisse vous donner les accès au salon privilégié de votre couleur ! :wink:").catch(console.error);
				generalFunc.botPostLog('Annonce aux NoTeam effectuée',message.guild.channels.find("name",chansLists.chanBotLog));
			break;
			case config.announce[2]:
				channelAnnouncements = message.guild.channels.find('name', chansLists.chanContributors);	
				if (!channelAnnouncements) return;
				// Send the message, mentioning the members
				channelAnnouncements.send("@"+rolesList.contributor+" De nouveaux pokémons sont apparus et on été ajoutés aux notifications ! RDV sur http://professeur-oak-sherbrooke.online pour les ajouter à vos notifications ! :smiley:").catch(console.error);
				generalFunc.botPostLog('Annonce d\'ajout de pokémons aux scanners effectuée',message.guild.channels.find("name",chansLists.chanBotLog));
			break;	
			default:
				generalFunc.replyDelete("annonce inexistante ! ",message);
		}
	} else {
		generalFunc.replyDelete("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ",message);
	}
}

// ROLING FUNCTION
exports.team = (message) => {
	if (message.guild.name === chansLists.guildName) {
		generalFunc.replyDelete("commande désactivée !",message);
	} else {
		let userRoles = message.member.roles;	
		let args = message.content.split(' ');
		let askedRole = args[2];
		askedRole = askedRole.toLowerCase();
		
		if (askedRole === "intuition" || askedRole === "jaune" || askedRole === "yellow") {
			askedRole = "instinct";
		} else if (askedRole === "sagesse" || askedRole === "bleu" || askedRole === "bleue" || askedRole === "blue") {
			askedRole = "mystic";
		} else if (askedRole === "bravoure" || askedRole === "rouge" || askedRole === "red") {
			askedRole = "valor";
		}
		
		if (userRoles.find("name",rolesList.instinct) || userRoles.find("name",rolesList.mystic) || userRoles.find("name",rolesList.valor)) {
			generalFunc.replyDelete(" :warning: tu as déjà une équipe ! Contacte les administrateurs (@"+rolesList.admin+") si tu as un problème.",message);
		} else if (userRoles.find("name",rolesList.multi)) {
			generalFunc.replyDelete(" :no_entry: Pas de multi-compte autorisé ! Contacte les administrateurs (@"+rolesList.admin+") pour plus d'infos.",message);
		} else {
			let roleRem = message.guild.roles.find("name", rolesList.noTeam);
			user.removeRole(roleRem).catch(console.error);                
			switch(askedRole) {
				case 'instinct':
					let roleI = message.guild.roles.find("name", rolesList.instinct);
					user.addRole(roleI).catch(console.error);
					generalFunc.replyDelete("bienvenue dans la team Instinct ! :wink:",message);
					generalFunc.botPostLog(`Équipe choisie : ${user} -> Instinct`,message.guild.channels.find("name",chansLists.chanBotLog));
				break;
				case 'mystic':
					let roleM = message.guild.roles.find("name", rolesList.mystic);
					user.addRole(roleM).catch(console.error);
					generalFunc.replyDelete("bienvenue dans la team Mystic ! :wink:",message);
					generalFunc.botPostLog(`Équipe choisie : ${user} -> Mystic`,message.guild.channels.find("name",chansLists.chanBotLog));
				break;
				case 'valor':
					let roleV = message.guild.roles.find("name", rolesList.valor);
					user.addRole(roleV).catch(console.error);
					generalFunc.replyDelete("bienvenue dans la team Valor ! :wink:",message);
					generalFunc.botPostLog(`Équipe choisie : ${user} -> Valor`,message.guild.channels.find("name",chansLists.chanBotLog));
				break;
				default:
					generalFunc.replyDelete(" :warning: nom d'équipe incorrect !\nTape **!oak team instinct**, **!oak team mystic** ou **!oak team valor** pour choisir ton équipe.",message,1000,10000);
			}
		}
	}
}

// CHANNEL MUTE FUNCTION
exports.chanMute = (message) => {
	let userRoles = message.member.roles;
	if (userRoles.find("name",rolesList.admin) || userRoles.find("name",rolesList.mod)) {					
		let memberToMute = message.mentions.members.first();
		let channelForMute = message.channel;
		
		if (memberToMute !== undefined) {
			if (memberToMute.roles.find("name",rolesList.admin) || memberToMute.roles.find("name",rolesList.mod) || memberToMute.roles.find("name",rolesList.bot)) {
				generalFunc.replyDelete("opération impossible sur un admin/mod/bot ! :no_entry: ",message);
			} else if (channelForMute.permissionOverwrites.find("id",memberToMute.id) !== null) {
				generalFunc.replyDelete(` :warning: ${memberToMute} est déjà :mute: !`,message);
			} else {
				channelForMute.overwritePermissions(memberToMute, {
					'SEND_MESSAGES': false,
					'ADD_REACTIONS': false
				})
				.then(() => {
					generalFunc.sendDelete(`${memberToMute} est maintenant :mute: !`,message);
					generalFunc.botPostLog(`${memberToMute} a été :mute: par ${user} sur le chan ${channelForMute} !`,message.guild.channels.find("name",chansLists.chanBotLog));
				})
				.catch(console.error);
			}
		} else {
			generalFunc.replyDelete("mention invalide, membre non trouvé :warning: ",message);
		}
	} else {
		generalFunc.replyDelete("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ",message);
	}
}

// CHANNEL UNMUTE FUNCTION
exports.chanUnmute = (message) => {
	let userRoles = message.member.roles;
	if (userRoles.find("name",rolesList.admin) || userRoles.find("name",rolesList.mod)) {					
		let memberToUnmute = message.mentions.members.first();
		let channelForUnmute = message.channel;
		
		if (memberToUnmute !== undefined) {
			if (memberToUnmute.roles.find("name",rolesList.admin) || memberToUnmute.roles.find("name",rolesList.mod) || memberToUnmute.roles.find("name",rolesList.bot)) {
				generalFunc.replyDelete("opération impossible sur un admin/mod/bot ! :no_entry: ",message);
			} else if (channelForUnmute.permissionOverwrites.find("id",memberToUnmute.id) === null) {
				generalFunc.replyDelete(` :warning: ${memberToUnmute} est déjà :loud_sound: !`,message);
			} else {
				channelForUnmute.permissionOverwrites.find("id",memberToUnmute.id).delete()
				.then(() => {
					generalFunc.sendDelete(`${memberToUnmute} est maintenant :loud_sound: !`,message);
					generalFunc.botPostLog(`${memberToUnmute} a été :loud_sound: par ${user} sur le chan ${channelForUnmute} !`,message.guild.channels.find("name",chansLists.chanBotLog));
				})
				.catch(console.error);							
			}
		} else {
			generalFunc.replyDelete("mention invalide, membre non trouvé :warning: ",message);
		}
	} else {
		generalFunc.replyDelete("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ",message);
	}
}

// GLOBAL (WHOLE SERVER) MUTE FUNCTION
exports.globalMute = (message) => {
	let userRoles = message.member.roles;
	if (userRoles.find("name",rolesList.admin)) {					
		let memberToMute = message.mentions.members.first();
		
		if (memberToMute !== undefined) {
			if (memberToMute.roles.find("name",rolesList.admin) || memberToMute.roles.find("name",rolesList.mod) || memberToMute.roles.find("name",rolesList.bot)) {
				generalFunc.replyDelete("opération impossible sur un admin/mod/bot ! :no_entry: ",message);
			} else if (memberToMute.roles.find("name",rolesList.muted)) {
				generalFunc.replyDelete(` :warning: ${memberToMute} est déjà supermute !`,message);
			} else {
				if (memberToMute.roles.find("name",rolesList.instinct)) {
					let roleI = message.guild.roles.find("name", rolesList.instinct);
					memberToMute.removeRole(roleI).catch(console.error);
					let team = "Instinct";
				} else if (memberToMute.roles.find("name",rolesList.mystic)) {
					let roleM = message.guild.roles.find("name", rolesList.mystic);
					memberToMute.removeRole(roleM).catch(console.error);
					let team = "Mystic";
				} else if (memberToMute.roles.find("name",rolesList.valor)) {
					let roleV = message.guild.roles.find("name", rolesList.valor);
					memberToMute.removeRole(roleV).catch(console.error);
					let team = "Valor";
				} else {
					let team = "No Team";
				}
				let roleMute = message.guild.roles.find("name", rolesList.muted);									
				memberToMute.addRole(roleMute).catch(console.error);
				generalFunc.replyDelete(`${memberToMute} (`+team+`) est maintenant **super** :mute: !`,message);
				generalFunc.botPostLog(`${memberToMute} (`+team+`) a été SUPER MUTE par ${user} !`,message.guild.channels.find("name",chansLists.chanBotLog));
			}
		} else {
			generalFunc.replyDelete("mention invalide, membre non trouvé :warning: ",message);
		}
	} else {
		generalFunc.replyDelete("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ",message);
	}
}

// GLOBAL (WHOLE SERVER) UNMUTE FUNCTION
exports.globalUnmute = (message) => {
	let userRoles = message.member.roles;
	if (userRoles.find("name",rolesList.admin)) {					
		let memberToUnmute = message.mentions.members.first();
		
		if (memberToUnmute !== undefined) {
			if (memberToUnmute.roles.find("name",rolesList.admin) || memberToUnmute.roles.find("name",rolesList.mod) || memberToMute.roles.find("name",rolesList.bot)) {
				generalFunc.replyDelete("opération impossible sur un admin/mod/bot ! :no_entry: ",message);
			} else if (!memberToUnmute.roles.find("name",rolesList.muted)) {
				generalFunc.replyDelete(` :warning: ${memberToUnmute} est déjà unmute !`,message);
			} else {
				let roleMute = message.guild.roles.find("name", rolesList.muted);
				memberToUnmute.removeRole(roleMute).catch(console.error);
				generalFunc.replyDelete(`${memberToUnmute} est n'est plus **super** :mute: !`,message);
				generalFunc.botPostLog(`${memberToUnmute} a été SUPER UnMUTE par ${user} !`,message.guild.channels.find("name",chansLists.chanBotLog));
			}
		} else {
			generalFunc.replyDelete("mention invalide, membre non trouvé :warning: ",message);
		}
	} else {
		generalFunc.replyDelete("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ",message);
	}
}

// CLEAR MESSAGES FUNCTION
exports.clearMessages = (message) => {
	let userRoles = message.member.roles;
	if (userRoles.find("name",rolesList.admin)) {
		let channelToClear = message.channel;	
		let args = message.content.split(' ');
		let nbMessagesToClear = args[2];
		if (nbMessagesToClear >= 1 && nbMessagesToClear <= 30) {
			let fetchedMessages = channelToClear.fetchMessages({limit: nbMessagesToClear})					
				.then(messages => {
					generalFunc.replyDelete("*"+messages.size+" messages supprimés ! :wastebasket:*",message);
					messages.deleteAll();
				})
				.catch(console.error);
		} else if (nbMessagesToClear > 30) {
			let fetchedMessages = channelToClear.fetchMessages({limit: 30})					
				.then(messages => {
					generalFunc.replyDelete("*"+messages.size+" messages supprimés ! :wastebasket:*",message);
					messages.deleteAll();
				})
				.catch(console.error);
		}
	} else {
		generalFunc.replyDelete("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ",message);
	}
}

// REMOVE ROLE TO MEMBERS FUNCTION
exports.roleRemoveMembers = (message) => {
	let userRoles = message.member.roles;
	if (userRoles.find("name",rolesList.admin)) {	
		let args = message.content.split(' ');
		let role = args[2];
		
		let targetRole = user.guild.roles.find("name",role);
		if (!targetRole) {
			generalFunc.replyDelete("rôle introuvable !",message);
		} else {
			let membersOfTheGuild = Array.from(user.guild.members.values());
			let j = 0;
			for (i in membersOfTheGuild) {
				if (membersOfTheGuild[i].roles.find("name",role)) {
					membersOfTheGuild[i].removeRole(targetRole).catch(console.error);
					j = j+1;
				}
			}
			generalFunc.replyDelete("rôle "+role+" enlevé à "+j+" membres !",message);
		}
	} else {
		generalFunc.replyDelete("tu n'es pas autorisé à utiliser cette commande ! :no_entry: ",message);
	}
}
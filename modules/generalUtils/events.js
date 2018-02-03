// ProfesseurOak

// EVENTS HANDLING MODULE

const Discord = require('discord.js');

const rolesList = require('../../config/rolesList.json');
const chansLists = require('../../config/chansLists.json');

const generalFunc = require('./generalFunc.js');

exports.arrivingMember = (member) => {
	// Send the message to a designated channel on a server:
		let channel = member.guild.channels.find('name', chansLists.chanGeneral);
		let channelAdmins = member.guild.channels.find('name', chansLists.chanAdmins);
		let server = member.guild.name;
		let serverCount = member.guild.memberCount;
	// Do nothing if the channel wasn't found on this server
		if (!channel) return;
		if (!channelAdmins) return;
	// Send the message, mentioning the member
		channel.send(`${member} est arrivé ! Bienvenue au **${serverCount}ème** dresseur à nous rejoindre ! :tada:`).catch(console.error);
		member.send(`-----------------------------------------------------\n**Bienvenue ${member} sur la plateforme ${server} !!!** Je suis le Professeur Oak !\nTu es le **${serverCount}ème** dresseur à nous rejoindre.\n\nPour pouvoir écrire des messages, pense bien à valider l'adresse mail de ton compte Discord !\nPrend le temps de consulter les règles du chat ainsi que le fonctionnement de Discord dans les salons adéquats !\n__Les administrateurs vont te contacter par message privé afin de te donner les accès au chat de ton équipe.__\n\n**N'oublis pas qu'ici le respect entre joueurs est primordial** :wink: \n\nExplore les différents channels, il y a tout pour les dresseurs de Sherbrooke !\nSi tu as des questions ou des soucis, contacte un des __administrateurs__ (leur pseudo est de couleur mauve) ou un des __modérateurs__ (pseudo de couleur verte claire).\n\nHave Fun !\n-----------------------------------------------------`).catch(console.error);
		// Giving default role
		let defaultRole = member.guild.roles.find("name", rolesList.noTeam);
		member.addRole(defaultRole).catch(console.error);
		let adminRole = member.guild.roles.find("name", rolesList.admin);
		channelAdmins.send(`${adminRole} Nouveau membre : ${member} !`);
		generalFunc.botPostLog(`Nouveau membre : ${member} !`,member.guild.channels.find("name",chansLists.chanBotLog));
}

exports.leavingMember = (member) => {
	// Send the message to a designated channel on a server:
		let channel = member.guild.channels.find('name', chansLists.chanGeneral);
	// Do nothing if the channel wasn't found on this server
		if (!channel) return;
	// Send the message, mentioning the member
		channel.send("**"+member.displayName+"** *vient de partir. Bye bye...* :vulcan: ").catch(console.error);
		generalFunc.botPostLog(member.displayName+" a quitté ou a été expulsé/banni !",member.guild.channels.find("name",chansLists.chanBotLog));
}

exports.updatedMember = (oldMember,newMember) => {
	// Send the message, mentioning the member
		let previousNickname = oldMember.displayName;
		if (previousNickname !== null && oldMember.displayName !== newMember.displayName) {
			generalFunc.botPostLog('__'+previousNickname+`__ a changé son pseudo pour ${newMember} !`,newMember.guild.channels.find("name",chansLists.chanBotLog));
		}
}
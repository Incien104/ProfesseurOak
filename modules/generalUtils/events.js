// ** Description **
// ProfesseurOak, v3.2.1, developed by Incien104
// GPL 3.0, Oct. 2017 - Jan. 2018
// Works with Node.js
// Require discord.js and request

// EVENTS HANDLING FILE

const discord = require('discord.js');

const rolesList = require('./config/rolesList.json');
const chansLists = require('./config/chansLists.json');

exports.arrivingMember = (member) => {
	// Send the message to a designated channel on a server:
		let channel = member.guild.channels.find('name', chansLists.chanGeneral);
		let channelAdmins = member.guild.channels.find('name', chansLists.chanAdmins);
		let server = member.guild.name;
		let serverCount = member.guild.memberCount;
	// Do nothing if the channel wasn't found on this server
		if (!channel || !channelAdmins) return;
	// Send the message, mentioning the member
		channel.send(`${member} est arrivé ! Bienvenue au **${serverCount}ème** dresseur à nous rejoindre ! :tada:`).catch(console.error);
		member.send(`-----------------------------------------------------\n**Bienvenue ${member} sur la plateforme ${server} !!!** Je suis le Professeur Oak !\nTu es le **${serverCount}ème** dresseur à nous rejoindre.\n\nPour pouvoir écrire des messages, pense bien à valider l'adresse mail de ton compte Discord !\nPrend le temps de consulter les règles du chat ainsi que le fonctionnement de Discord dans les salons adéquats !\n__Les administrateurs vont te contacter par message privé afin de te donner les accès au chat de ton équipe.__\n\n**N'oublis pas qu'ici le respect entre joueurs est primordial** :wink: \n\nExplore les différents channels, il y a tout pour les dresseurs de Sherbrooke !\nSi tu as des questions ou des soucis, contacte un des __administrateurs__ (leur pseudo est de couleur mauve) ou un des __modérateurs__ (pseudo de couleur verte claire).\n\nHave Fun !\n-----------------------------------------------------`).catch(console.error);
		// Giving default role
		let defaultRole = member.guild.roles.find("name", rolesList.noTeam);
		member.addRole(defaultRole).catch(console.error);
		channelAdmins.send("@"+rolesList.admin+` Nouveau membre : ${member} !`);
		let returnedLog = `Nouveau membre : ${member} !`;
		return returnedLog;
}

exports.leavingMember = (member) => {
	// Send the message to a designated channel on a server:
		let channel = member.guild.channels.find('name', chansLists.chanGeneral);
	// Do nothing if the channel wasn't found on this server
		if (!channel) return;
	// Send the message, mentioning the member
		channel.send("**"+member.displayName+"** *vient de partir. Bye bye...* :vulcan: ").catch(console.error);
		let returnedLog = member.displayName+" a quitté ou a été expulsé/banni !";
		return returnedLog;
}

exports.updatedMember = (oldMember,newMember) => {
	// Send the message, mentioning the member
	var previousNickname = oldMember.nickname;
	if (previousNickname !== null && oldMember.nickname !== newMember.nickname) {
		let returnedLog = '__'+previousNickname+`__ a changé son pseudo pour ${newMember} !`;
		return returnedLog;
	} else {
		let returnedLog = `${newMember} a été mis à jour sans changer de pseudo !`;
		return returnedLog;
	}
}
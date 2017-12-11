# Professeur Oak
Powerful Pokemon Go Discord Bot

Uses Node.js (discord.js)

This bot is meant to set roles to guild members when they ask for one, but in addition, it takes into account other possible roles in order to avoid that a member asks for two incompatible roles.
For instance, if there are three roles A, B and C, and a member can only have one of them, the bot will check if the member already has one of them, and will not give an another role in this case. If a member has A and asks for B, the bot will not give it to him.
Also, the bot can delete a temporary role from a member when it gives one role in its list.

Important ! The bot needs MANAGE_ROLE permission, and its role must be higher than the roles you want to add to or remove from a member.

The bot is set to work on a Heroku server, as it uses a worker (free dyno).

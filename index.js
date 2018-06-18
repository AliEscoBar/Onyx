let token_obj = require(`token.json`);
var token = token_obj["token"];
let silvia_channel_id_obj = require(`silvia_channel_id.json`);
var silvia_channel_id = silvia_channel_id_obj["silvia_channel_id"];
let owner_id_obj = require(`owner_discord_id.json`);
var owner_discord_id = owner_id_obj["owner_discord_id"]
var report_channel = require("report_channel.json")
var channel_id = report_channel["channel"]

// NPM MODULES
const commando = require('discord.js-commando');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const sqlite = require('sqlite');
sqlite.open("./database.sqlite3");

const client = new commando.Client({
	owner: owner_discord_id,
	commandPrefix: '-',
	disableEveryone: true,
	unknownCommandResponse: false
});

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
var bot_prefix = "-"
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
	// client.user.setActivity(`${bot_prefix}help | Running on ${client.guilds.size} servers`);
	client.user.setActivity(`${bot_prefix}help | Now with sticker & GIF cmds!`);
});

// Error handling
client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log);

// Bot status
client.on('reconnecting', () => { console.warn('Onyx is reconnecting...'); })
	.on('disconnect', () => { console.warn('Warning! Onyx has disconnected!'); });


// Command specific event listeners that come with the Commando module
client.on('commandError', (cmd, err) => {
	if (err instanceof commando.FriendlyError) return;
	console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
		msg.reply("Command has been blocked.")
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);

	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('message', async msg => {
		if (msg.author.bot || msg.channel.id === silvia_channel_id) return;


		// Check Prefix
		var guild_id = msg.channel.guild.id
		console.log(guild_id)
		var row = await sqlite.get(`SELECT * FROM settings WHERE guild ="${guild_id}"`);
		var prefix;

		// If undefined, then no special prefixes corresponding to that server were found.
		if (row === undefined) {
			prefix = client.commandPrefix;
		}
		else {
			var settings = row.settings;
			var jsonSettings = JSON.parse(settings);
			prefix = jsonSettings.prefix;
		}
		console.log("THIS SERVER'S PREFIX IS" + prefix);

		if (msg.content === "-help") {
			msg.reply("My custom prefix for this server is: " + prefix);
			msg.channel.send("Type " + prefix + "help for a full list of commands.")
		}

		if (msg.content[0] != prefix && msg.content != "-help") {
			console.log("Not equal to prefix.")
			console.log(prefix)
			console.log(msg.content[0])
			return;
		}
		else {
			// Logging
			var message = `Message: ${msg.content} Author: ${msg.author} Timestamp: ${msg.createdTimestamp} Date: ${msg.createdAt} Server: ${msg.guild.name} Server Count: ${msg.guild.memberCount} Region: ${msg.guild.region}`
			console.log(message)
			try {
				// fs.appendFile('test.txt', `\nMessage Content: ${msg.content} Author: ${msg.author} Timestamp: ${msg.createdTimestamp} Date: ${msg.createdAt} Server: ${msg.guild.name} Server Count: ${msg.guild.memberCount} Region: ${msg.guild.region}`, (err) => {
				// 	if (err) throw err;
				// });

				client.channels.get(channel_id).send(`@Silvia923#9909 ${message}`)
			}
			catch (error) {
				console.log(error)
			}
		}
	});

client.on("guildCreate", guild => {
	var message = `JOINED NEW SERVER: Joined a new server called: ${guild.name} (id: ${guild.id}). This server has ${guild.memberCount} members! :D`;
	console.log(message);
	client.channels.get(channel_id).send(`@Silvia923#9909 ${message}`)
	client.user.setActivity(`${bot_prefix}help | Running on ${client.guilds.size} servers`);

	guild.owner.send("I'm honoured to have been added to your server. ^.^ \n \nI come with over 50 media, fun, search, and social commands.\nHere's a quick getting started guide and summary of how to get started.")
	var colour_array = ["1211996", "3447003", "13089792", "16711858", "1088163", "16098851", "6150962"]
	var randomNumber = getRandomNumber(0, colour_array.length - 1);
	var randomColour = colour_array[randomNumber];

	guild.owner.send({
	
		embed: {
			color: randomColour,
			// author: {
			//     name: "../../media/onyx.jpg",
			//     icon_url: "../../media/onyx.jpg"
			// },
			title: `A Quick Getting Started Guide`,
			fields: [{
				name: "Changing My Prefix In Your Server",
				value: "My default prefixes are `-` and `@Onyx#4347`, but you can change my prefix to whatever you like using `-prefix`.\n Just go to one of your server's channels, and type `-prefix [your desired prefix]`. \n For example, if you wanted to change to ! you'd type `-prefix !`"
			},
			{
				name: "Seeing All Of My Commands",
				value: "In this DM, you can see all of my commands by typing `help` and you can run commands in this DM by typing `command` (I don't require any prefix in DMs)."
			},
			{
				name: "Getting Help & Support",
				value: "Have a bug to report? Want to chat to Onyx's maintainer? Join [Onyx's Support Server](https://discord.gg/cSWHaEK), a fun community that gets insider access to Onyx's development. \n Or add @Silvia923#9909 on Discord, I'm always here to chat."
			}
			], 
			footer: {
				text: "Coded by Silvia923#9909 <3"
			}
		}

	})

});

client.on("guildDelete", guild => {
	var message = `REMOVAL: Bot has been removed from the following server: ${guild.name} (id: ${guild.id})`
	console.log(message);
	client.user.setActivity(`${bot_prefix}help | Running on ${client.guilds.size} servers`);
	client.channels.get(channel_id).send(`@Silvia923#9909 ${message}`)

});

client.on("guildMemberAdd", member => {
	// image welcoming coming soon
});

client.setProvider(
	sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

client.registry
	.registerDefaultTypes()

	.registerGroups([['util', "Util"], ["media", "Media commands: Search for stickers & GIFs, make memes, make qr codes/captchas, etc.,"],
	["fun", "Fun commands: All sorts of entertaining commands can be found here. "],
	["search", "Search commands: Search YouTube, ask Onyx questions, get answers to anything, get data, definitions, etc.,"],
	["message_formatting", "Format your messages, translate them to 1337, binary, emojipastas, and more."],
	["social", "Social commands: Get avatars, wave and poke people. More on the way."],
	["space", "Space commands: Get live NASA footage, ISS coordinates, and space imagery."],
	["meta", "Meta commands: Get info about your server, about Onyx, who coded her, etc.,"],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({help:false})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);
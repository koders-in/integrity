//Libraries
const Discord = require('discord.js');
const ms = require('ms');
const JSON = require('JSON')

//Config file
const config = require("./config.json");


//Meme functions
const superagent = require('superagent')

//Todo files
const fs = require('fs')
const cheerio = require('cheerio') // Image libraries
const request = require('request')
const ytdl = require('ytdl-core') //Music libraries

//Token prefix and version
const token = (config.token);
const PREFIX = (config.prefix);
const version = (config.version);

//Music
const servers = {};

//For cooldown
const cooldownMembers = new Set();


//Initialization 
const bot = new Discord.Client();

//Set bot as online with status
bot.on('ready', async () => {
    console.log('Bot is running on version: '+ version);
    bot.user.setStatus('available')
    await bot.user.setActivity('Koders', {
             type: "watching",
         }).catch(error => {
             console.log(error.stack);
         })
});


bot.on('message', async message =>{
    let args = message.content.substring(PREFIX.length).split(" ");
    switch(args[0].toLowerCase()){
        // case 'exportchat':
        //     if(message.channel.type == "text") {
        //     console.log(message.channel.messages.fetch);
        //     }
        // break;
        case 'playmusic':
            function play(connection, message){
            var server = servers[message.guild.id];
                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
                server.queue.shift();
                server.dispatcher.on("end", function() {
                    if(server.queue[0]) play(connection, message);
                    else connection.disconnect();
                });
            }
        
            if(!args[1]){
                message.channel.send("You need to provide a youtube link");
                return;
            }
            
            if(!message.member.voice.channel){
                message.channel.send("You must be in a voice channel!");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id]
            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection){
                play(connection,message);
            })
        break

        case 'skipmusic':
            var server = servers[message.guild.id]
            if(server.dispatcher) server.dispatcher.end();
                server.dispatcher.end();
        break

        case 'stopmusic':
            var server = servers[message.guild.id]
            if(message.guild.voiceConnection){
                for(var i = server.queue.length - 1; i >= 0; i--){
                    server.queue.splice(i, 1);
                }
                server.dispatcher.end();
                message.channel.send("Music Stopped!")
                console.log('Music Stopped!')
            }
            if(message.guild.connection) message.guild.voiceConnection.disconnect();
        break

        case "poll":
            const pollEmbed = new Discord.MessageEmbed()
            .setColor(0xFFC300)
            .setTitle("Initiate Poll")
            .setDescription("To do yes or no poll")

            if(!args[1]){
                message.channel.send(pollEmbed);
                break
            }

            let messageArgs = args.slice(1).join(" ");
                message.channel.send( "**" + messageArgs + "**").then( async messageReaction => {
                messageReaction.react("✔️");
                messageReaction.react("❌");
            });
            break


            // case 'changerole':
        //     let person = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[2]))
        //     if(!person) return message.reply("No user with such name");

        //     let oldRole = message.guild.roles.fetch('name', person.displayName);
        //     let newRole = message.guild.roles.cache.find( role => role.name === args[1]);

        //     if(!newRole) return message.reply("Couldn't find client role");
            
        //     //person.roles.remove(oldRole.id)
        //     //person.roles.add(newRole.id)
        //     message.channel.send(`${person.displayName}`);
        //     message.channel.send(`${oldRole.id}`);

        // break


        case 'meme':
            var options = {
                url: "http://apis.duncte123.me/meme",
                method: "GET", 
                headers: {
                    "Accept": "text/html",
                    "User-Agent": "Chrome"
                    }
                };
        
                request(options, function(error, response, responseBody) {
                    if (error) {
                        return;
                    }
                    $ = cheerio.load(responseBody);
                    const obj = JSON.parse(responseBody)
                    message.channel.send(obj.data.image);
            });
        break
        // case 'addtodo':
        //     let data = args[0];
        //     fs.appendFile('todo.txt', data, (err) =>{
        //         if(err) throw err;
        //     })

        //     message.channel.send("To do has been saved!");
        // break

        // //Have to fix
        // case 'cooldown':
        //     if(!args[1]) return message.reply("Mention someone!")
        //     let person = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[1]))
        //     if(!person) return message.reply("Can't find!")

        //     if(cooldownMembers.has(person.id)){
        //         message.reply("You can't text yet! Wait for 30 seconds!");
        //     }
        //     else{
        //         message.reply("Setting cooldown");
        //         person.
        //         setTimeout(() => {
        //             cooldownMembers.delete(person.id);
        //         })
        //     }
        // break

        case 'remind':
            if(!args[1]) return message.reply("Try correct syntax")
            if(!args[2]) return message.reply("Give me a message to remind about!")
            message.delete()
            var d = new Date();
            const updateEmbed = new Discord.MessageEmbed()
            .setColor(0x0794f2)
            .setTitle("Reminder!")
            .setDescription(args.slice(2).join(" "))
            .setFooter("Reminded by: " + message.member.user.tag + "\nTimestamp: " + d.toLocaleString())

            setTimeout(() =>
            {
                message.channel.send(updateEmbed)
            }, args[1]*1000*60*60
            )
        break

        case 'image':
            imageFetch(message, args[1])
        break

        // case 'projectinfo':
        //     const projectEmbed = new Discord.MessageEmbed()
        //     .setTitle('Project Information')
        //     .addField('Project Name', "Some project name")
        //     .addField('Description:', "Some description")
        //     .addField('Start Date:', "DD/MM/YY")
        //     .addField('End Date:', "DD/MM/YY")
        //     message.channel.send(projectEmbed)
        // break

        case 'ping':
            message.channel.send("pong!")
        break

        case 'Hey':
            message.channel.send("Hi!")
        break

        // case 'website':
        //     message.channel.send('koders.in')
        // break

        // case 'payment':
        //     message.channel.send("Paytm 7017799756")
        // break

        case 'version':
            message.channel.send("Version: " + version);
        break
		
	case 'clientinfo':
		if(!args[1]) return message.reply("tag someone")
				
	        if(message.content.includes(args[1]))
			 {
				  let user = message.mentions.users.first();
				 var id=user.username; 
				 //console.log(id)
			  }
		  
              
			 //const id=args.slice(1).join(" ")
		var options = {
				 
                url: "https://sheltered-plateau-96720.herokuapp.com/client?discordID="+id,
                method: "GET", 
                headers: {
                    "Accept": "text/html",
                    "User-Agent": "Chrome"
                    }
                };
        
                request(options, function(error, response, responseBody) {
                    if (error) {
                        return;
                    }
                    try{
                    const obj = JSON.parse(responseBody)
					if(responseBody.length<3)
					{
						return message.reply("no such user")
					}
					const res=obj[0]
					
					const clientEmbed = new Discord.MessageEmbed()
					.setColor(0xFFC300)
					.setTitle(res.clientName)
					.setDescription("Email: "+(res.email[0].e_primary)+"\nContact: "+(res.contact[0].c_primary))
					
					message.channel.send(clientEmbed)
					id=""
					}
					catch(err){console.err(err)}
					
					
                    
            });
	break
			
	case 'teaminfo':
			if(!args[1]) return message.reply("tag someone")
				
			  if(message.content.includes(args[1]))
			  {
				  let user = message.mentions.users.first();
				 var id=user.username; 
				 //console.log(id)
			  }
		  
              
			 //const id=args.slice(1).join(" ")
		var options = {
				 
                url: "https://sheltered-plateau-96720.herokuapp.com/team?discordID="+id,
                method: "GET", 
                headers: {
                    "Accept": "text/html",
                    "User-Agent": "Chrome"
                    }
                };
        
                request(options, function(error, response, responseBody) {
                    if (error) {
                        return;
                    }
                    try{
                    const obj = JSON.parse(responseBody)
					if(responseBody.length<3)
					{
						return message.reply("no such user")
					}
					const res=obj[0]
					
					const clientEmbed = new Discord.MessageEmbed()
					.setColor(0xFFC300)
					.setTitle(res.memberName)
					.setDescription("Email: "+(res.email[0].e_primary)+"\nContact: "+(res.contact[0].c_primary))
					
					message.channel.send(clientEmbed)
					id=""
					}
					catch(err){console.err(err)}
					
					
                    
            });
	break
			
			

        case 'clear':
            if(!args[1]){
                message.reply("Let me know how many messages you want me to delete!")
            }
            message.channel.bulkDelete(args[1]);
            break;
        }
})

function imageFetch(message, object){
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + object,
        method: "GET", 
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
            }
        };

        request(options, function(error, response, responseBody) {
            if (error) {
                return;
            }
            $ = cheerio.load(responseBody);
            var links = $(".image a.link");
            var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
            console.log(urls);
            if (!urls.length) {
                return;
            }

            message.channel.send( urls[Math.floor(Math.random() * urls.length)]);
    });
}

bot.login(token);

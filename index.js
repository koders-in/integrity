//Libraries
const Discord = require('discord.js');
const ms = require('ms');

//Config file
const config = require("./config.json");

const cheerio = require('cheerio') // Image libraries
const request = require('request')

const ytdl = require('ytdl-core') //Music libraries


const bot = new Discord.Client();
//Auth Token
const token = (config.token);

const PREFIX = '!';
var version = "0.1.1";

//Music
const servers = {};

//Set bot as online with status
bot.on('ready', () => {
    console.log('Bot is running on version: '+ version);
    bot.user.setStatus('available')
    bot.user.setActivity({
        game: {
            name: 'Koders',
            type: "watching",
            url: "https://www.twitch.tv/monstercat"
        }
    });
});


bot.on('message', message =>{
    let args = message.content.substring(PREFIX.length).split(" ");
    switch(args[0]){
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


        case 'clientinfo':
            const clientEmbed = new Discord.MessageEmbed()
            .setTitle('Client Information')
            .addField('Client Name', message.author.username)
            .addField('Phone:', "XXXXXXXXX")
            .addField('Email:', "someemail@gmail.com")
            message.channel.send(clientEmbed)
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

        case 'image':
            imageFetch(message, args[1])
        break

        case 'projectinfo':
            const projectEmbed = new Discord.MessageEmbed()
            .setTitle('Project Information')
            .addField('Project Name', "Some project name")
            .addField('Description:', "Some description")
            .addField('Start Date:', "DD/MM/YY")
            .addField('End Date:', "DD/MM/YY")
            message.channel.send(projectEmbed)
        break

        case 'ping':
            message.channel.send("pong!")
        break

        case 'website':
            message.channel.send('koders.in')
        break

        case 'payment':
            message.channel.send("Paytm 7017799756")
        break

        case 'version':
            message.channel.send("Version: " + version);
        break

        case 'clear':
            if(!args[1]){
                message.reply("Please define second argument")
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

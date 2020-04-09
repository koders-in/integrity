//Libraries
const Discord = require('discord.js');
const ms = require('ms');
const cheerio = require('cheerio')
const request = require('request')

const bot = new Discord.Client();
//Auth Token
const token = '';

const PREFIX = '!';
var version = "0.1.0";
bot.on('ready', () => {
    console.log('This is online');
})

bot.on('message', message =>{
    let args = message.content.substring(PREFIX.length).split(" ");
    switch(args[0]){

        case 'clientinfo':
            const clientEmbed = new Discord.MessageEmbed()
            .setTitle('Client Information')
            .addField('Client Name', message.author.username)
            .addField('Phone:', "XXXXXXXXX")
            .addField('Email:', "someemail@gmail.com")
            message.channel.send(clientEmbed)
        break;

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
        break;

        case 'ping':
            message.channel.send("pong!")
        break;

        case 'website':
            message.channel.send('koders.in')
        break;

        case 'payment':
            message.channel.send("Paytm 7017799756")
        break;

        case 'version':
            message.channel.send("Version: " + version);
        break;

        case 'clear':
            if(!args[1]){
                message.reply("Please define second argument")
            }
            message.channel.bulkDelete(args[1]);
            break;
        }
    if(message.content === "TESTING"){
        message.reply("TESTED OK");
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

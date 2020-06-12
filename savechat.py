from discord.ext import commands
import settings
bot = commands.Bot(command_prefix='!')

@bot.event
async def on_message(message):
    guild = message.guild
    if guild:
        path = "{}.txt".format(message.channel.name)  
        with open(path, 'a') as f:
            print("{0.created_at} : {0.author.name} : {0.content}".format(message), file=f)
    await bot.process_commands(message)

bot.run(settings.token)

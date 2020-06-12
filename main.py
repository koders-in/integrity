import discord
from discord.ext import commands
import time
import asyncio

# Manual imports
import settings
import info

# Manual Commands
bot = commands.Bot(command_prefix=settings.prefix, description='Watching')
	
@bot.event
async def on_ready():
	print("Integrity is ready and running on version {0}".format(info.version))

@bot.event
async def on_message(message):
    guild = message.guild
    if guild:
        path = "{}.txt".format(message.channel.name)  
        with open(path, 'a') as f:
            print("{0.created_at} : {0.author.name} : {0.content}".format(message), file=f)
    await bot.process_commands(message)

# Global 		
@bot.command()
async def ping(message):
	await message.send("Pong!")		
		
@bot.command()
async def whoami(message):
	print(message.author.name)


@bot.command()
async def register(ctx):
	inputs = []
	def pred(m):
		return m.author == ctx.author and m.channel == ctx.channel
	
	def check(reaction, user):
		return (str(reaction.emoji) == '☑' or str(reaction.emoji) == '❎') and user == ctx.message.author

	async def take_input():
		try:
			message = await bot.wait_for('message', check=pred, timeout=45.0)
		except asyncio.TimeoutError:
			await ctx.send("Timeout. Please request a koder for reregistration.")
		else:
			return message

	async def take_reaction():
		try:
			result = await bot.wait_for('reaction_add', check=check, timeout=45.0)
		except asyncio.TimeoutError:
			await ctx.send("Timeout. Please request a koder for reregistration.")
		else:
			reaction, user = result
			if(str(reaction.emoji) == '☑'):
				return True
			if(str(reaction.emoji) == '❎'):
				return False

	#Embed for name
	embed=discord.Embed(title="Hello there! (1/7)", description="Let's begin your registration.\n\nPlease enter your full name.")
	embed.set_author(name="Welcome to Koders | Registration", icon_url="https://cdn.discordapp.com/attachments/700257704723087360/709710821382553640/K_with_bg_1.png")
	embed.set_footer(text="Example\nJane Doe")
	textEmbed = await ctx.send(embed=embed)
	textInput = await take_input()
	inputs.append(textInput.content)
	await textInput.delete()
	await textEmbed.delete()
	
	#Embed for email
	embed=discord.Embed(title="Great, next step! (2/7)", description="Please enter your email\n(we won't spam, pinky promise!)")
	embed.set_author(name="Welcome to Koders | Registration", icon_url="https://cdn.discordapp.com/attachments/700257704723087360/709710821382553640/K_with_bg_1.png")
	embed.set_footer(text="Example\njane@gmail.com")
	textEmbed = await ctx.send(embed=embed)
	textInput = await take_input()
	inputs.append(textInput.content)
	await textInput.delete()
	await textEmbed.delete()

	#Embed for phone
	embed=discord.Embed(title="Nice, next step! (3/7)", description="Please enter your phone number\n(we won't spam, pinky promise again!)")
	embed.set_author(name="Welcome to Koders | Registration", icon_url="https://cdn.discordapp.com/attachments/700257704723087360/709710821382553640/K_with_bg_1.png")
	embed.set_footer(text="Example\n9876543210")
	textEmbed = await ctx.send(embed=embed)
	textInput = await take_input()
	inputs.append(textInput.content)
	await textInput.delete()
	await textEmbed.delete()
	
	# Whatsapp Check
	embed=discord.Embed(title="Thanks, next step! (4/7)", description="Is the same number on whatsapp?\nWe can send you updates over WhatsApp if you'd like. :)")
	embed.set_author(name="Welcome to Koders | Registration", icon_url="https://cdn.discordapp.com/attachments/700257704723087360/709710821382553640/K_with_bg_1.png")
	text = await ctx.send(embed=embed)
	await text.add_reaction(emoji="☑")
	await text.add_reaction(emoji="❎")
	
	result = await take_reaction()
	await text.delete()


	#Embed for whatsapp
	if(result):
		inputs.append(inputs[2])
	else:
		embed=discord.Embed(title="Great, next step! (5/7)", description="May we have your Instagram handle?\n\nFollower +1")
		embed.set_author(name="Welcome to Koders | Registration", icon_url="https://cdn.discordapp.com/attachments/700257704723087360/709710821382553640/K_with_bg_1.png")
		embed.set_footer(text="Example\n@janedoe")
		textEmbed = await ctx.send(embed=embed)
		textInput = await take_input()
		inputs.append(textInput.content)
		await textInput.delete()
		await textEmbed.delete()

	#Embed for instagram	
	embed=discord.Embed(title="Great, next step! (5/7)", description="May we have your Instagram handle?\n\nFollower +1")
	embed.set_author(name="Welcome to Koders | Registration", icon_url="https://cdn.discordapp.com/attachments/700257704723087360/709710821382553640/K_with_bg_1.png")
	embed.set_footer(text="Example\n@janedoe")
	textEmbed = await ctx.send(embed=embed)
	textInput = await take_input()
	inputs.append(textInput.content)
	await textInput.delete()
	await textEmbed.delete()

	#Embed for twitter
	embed=discord.Embed(title="Thanks, next step! (6/7)", description="May we have your Twitter handle?\n\nFollower +1")
	embed.set_author(name="Welcome to Koders | Registration", icon_url="https://cdn.discordapp.com/attachments/700257704723087360/709710821382553640/K_with_bg_1.png")
	embed.set_footer(text="Example\n@janedoe")
	textEmbed = await ctx.send(embed=embed)
	textInput = await take_input()
	inputs.append(textInput.content)
	await textInput.delete()
	await textEmbed.delete()


	#Embed for linkedin
	embed=discord.Embed(title="Thanks, final step! (7/7)", description="May we have your Linkedin handle?\n\nConnection +1")
	embed.set_author(name="Welcome to Koders | Registration", icon_url="https://cdn.discordapp.com/attachments/700257704723087360/709710821382553640/K_with_bg_1.png")
	embed.set_footer(text="Example\nlinkedin.com/in/janedoe")
	textEmbed = await ctx.send(embed=embed)
	textInput = await take_input()
	inputs.append(textInput.content)
	await textInput.delete()
	await textEmbed.delete()


	# Name email phone whatsapp instagram twitter linkedin
	# Embed confirm
	embed=discord.Embed(title="Confirmation", description="Please recheck the information and type yes or no", color=0x0e71c8)
	embed.set_author(name="Are you sure?", url="https://www.github.com/koders-in/integrity", icon_url=ctx.author.avatar_url)
	embed.set_thumbnail(url="https://image0.flaticon.com/icons/png/32/2921/2921124.png")
	embed.add_field(name="Name", value=inputs[0], inline=False)
	embed.add_field(name="Email", value=inputs[1], inline=False)
	embed.add_field(name="Phone", value=inputs[2], inline=True)
	embed.add_field(name="Whatsapp", value=inputs[3], inline=False)
	embed.add_field(name="Instagram", value=inputs[4], inline=True)
	embed.add_field(name="Twitter", value=inputs[5], inline=True)
	embed.add_field(name="LinkedIn", value=inputs[5], inline=True)
	text = await ctx.send(embed=embed)
	
	await text.add_reaction(emoji="☑")
	await text.add_reaction(emoji="❎")
	
	result = await take_reaction()
	await text.delete()
	if(result):
		await ctx.send("Registration Completed")
	else:
		await ctx.send("Registeration failed. Ask a Koder for registration")


# Kore


# Management


# Koders

bot.run(settings.token)



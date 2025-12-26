'use server'

import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js'
import { DailyRiddleType } from '../schemas/DailyRiddleSchema'
import { getRiddleOfTheDay } from './riddleService'
import { serverLogger } from '../util/logger'

interface DiscordConfig {
	botToken: string
	channelNamePattern?: string
	targetChannels?: string // Format: "guildId:channelId,guildId:channelId"
}

interface ChannelTarget {
	guildId: string
	channelId: string
}

/**
 * Parse target channels from environment variable
 * Format: "guildId:channelId,guildId:channelId"
 */
const parseTargetChannels = (targetChannelsStr?: string): ChannelTarget[] => {
	if (!targetChannelsStr) return []

	return targetChannelsStr
		.split(',')
		.map((pair) => {
			const [guildId, channelId] = pair.trim().split(':')
			if (guildId && channelId) {
				return { guildId: guildId.trim(), channelId: channelId.trim() }
			}
			return null
		})
		.filter((target): target is ChannelTarget => target !== null)
}

/**
 * Get Discord configuration from environment variables
 */
const getDiscordConfig = (): DiscordConfig | null => {
	const botToken = process.env.DISCORD_BOT_TOKEN
	if (!botToken) {
		serverLogger.warn('DISCORD_BOT_TOKEN is not set. Discord notifications will be skipped.')
		return null
	}

	return {
		botToken,
		channelNamePattern: process.env.DISCORD_CHANNEL_NAME_PATTERN || undefined,
		targetChannels: process.env.DISCORD_TARGET_CHANNELS || undefined,
	}
}

/**
 * Format daily riddle message for Discord
 */
const formatDailyRiddleMessage = (dailyRiddle: DailyRiddleType, baseUrl: string): string => {
	const riddleUrl = `${baseUrl}/riddle/daily/${dailyRiddle.riddleNumber}`
	const authorText = dailyRiddle.author ? ` by ${dailyRiddle.author}` : ''

	return `🎯 **Daily Riddle #${dailyRiddle.riddleNumber}**${authorText}

**${dailyRiddle.word}**

${dailyRiddle.riddle}

${dailyRiddle.context ? `*${dailyRiddle.context}*` : ''}

🔗 [Solve it here](${riddleUrl})`
}

/**
 * Find channels matching the pattern across all guilds
 */
const findChannelsByPattern = async (
	client: Client,
	pattern: string
): Promise<Array<{ guildId: string; channelId: string }>> => {
	const channels: Array<{ guildId: string; channelId: string }> = []

	try {
		// Get all guilds the bot is in
		const guilds = await client.guilds.fetch()

		for (const [guildId, guild] of guilds) {
			try {
				const fullGuild = await guild.fetch()
				const allChannels = await fullGuild.channels.fetch()

				// Find text channels matching the pattern (case-insensitive)
				for (const [channelId, channel] of allChannels) {
					if (
						channel &&
						channel.isTextBased() &&
						channel.name.toLowerCase().includes(pattern.toLowerCase())
					) {
						channels.push({ guildId, channelId })
						serverLogger.info(`Found matching channel: ${channel.name} in guild ${fullGuild.name}`)
					}
				}
			} catch (error) {
				serverLogger.error(`Error fetching guild ${guildId}: ${error}`)
			}
		}
	} catch (error) {
		serverLogger.error(`Error finding channels by pattern: ${error}`)
	}

	return channels
}

/**
 * Send message to a specific Discord channel
 */
const sendMessageToChannel = async (
	client: Client,
	guildId: string,
	channelId: string,
	message: string
): Promise<boolean> => {
	try {
		const guild = await client.guilds.fetch(guildId)
		const channel = await guild.channels.fetch(channelId)

		if (!channel || !channel.isTextBased()) {
			serverLogger.warn(`Channel ${channelId} in guild ${guildId} is not a text channel`)
			return false
		}

		const textChannel = channel as TextChannel
		await textChannel.send(message)
		serverLogger.info(`Successfully sent message to channel ${textChannel.name} in guild ${guild.name}`)
		return true
	} catch (error) {
		serverLogger.error(`Error sending message to channel ${channelId} in guild ${guildId}: ${error}`)
		return false
	}
}

/**
 * Post daily riddle announcement to Discord
 * Sends to all configured channels across all servers
 */
export const postDailyRiddleToDiscord = async (
	dailyRiddle: DailyRiddleType,
	baseUrl: string
): Promise<{ success: boolean; channelsPosted: number; errors: string[] }> => {
	const config = getDiscordConfig()
	if (!config) {
		return { success: false, channelsPosted: 0, errors: ['Discord bot token not configured'] }
	}

	const errors: string[] = []
	let channelsPosted = 0

	try {
		// Create Discord client with minimal intents (we only need to read channels and send messages)
		const client = new Client({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
		})

		// Login to Discord
		await client.login(config.botToken)
		serverLogger.info('Discord bot logged in successfully')

		// Wait for client to be ready
		await client.user?.fetch()

		const message = formatDailyRiddleMessage(dailyRiddle, baseUrl)
		let targetChannels: Array<{ guildId: string; channelId: string }> = []

		// Determine which channels to post to
		if (config.targetChannels) {
			// Use specific target channels
			targetChannels = parseTargetChannels(config.targetChannels)
			serverLogger.info(`Using ${targetChannels.length} specific target channel(s)`)
		} else if (config.channelNamePattern) {
			// Find channels matching the pattern
			targetChannels = await findChannelsByPattern(client, config.channelNamePattern)
			serverLogger.info(
				`Found ${targetChannels.length} channel(s) matching pattern "${config.channelNamePattern}"`
			)
		} else {
			serverLogger.warn(
				'No Discord channel configuration found. Set DISCORD_CHANNEL_NAME_PATTERN or DISCORD_TARGET_CHANNELS'
			)
			await client.destroy()
			return { success: false, channelsPosted: 0, errors: ['No channel configuration found'] }
		}

		if (targetChannels.length === 0) {
			serverLogger.warn('No Discord channels found to post to')
			await client.destroy()
			return { success: false, channelsPosted: 0, errors: ['No channels found'] }
		}

		// Send message to all target channels
		for (const { guildId, channelId } of targetChannels) {
			const success = await sendMessageToChannel(client, guildId, channelId, message)
			if (success) {
				channelsPosted++
			} else {
				errors.push(`Failed to post to channel ${channelId} in guild ${guildId}`)
			}
		}

		// Destroy client connection
		await client.destroy()

		const success = channelsPosted > 0
		serverLogger.info(`Discord posting completed: ${channelsPosted} channel(s) posted, ${errors.length} error(s)`)

		return { success, channelsPosted, errors }
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		serverLogger.error(`Error posting to Discord: ${errorMessage}`)
		return { success: false, channelsPosted, errors: [errorMessage] }
	}
}

/**
 * Get the website base URL for generating riddle links
 */
const getWebsiteBaseUrl = (): string => {
	return (
		process.env.NEXT_PUBLIC_SITE_URL ||
		process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1/riddonk/web', '') ||
		'https://riddonkulous.com'
	)
}

/**
 * Handle !daily command in Discord channels
 */
const handleDailyCommand = async (message: Message): Promise<void> => {
	try {
		// Check if message is in a channel named "riddles" (case-insensitive)
		if (!message.channel.isTextBased() || message.channel.isDMBased()) {
			return
		}

		const channel = message.channel as TextChannel
		if (channel.name.toLowerCase() !== 'riddles') {
			return
		}

		// Fetch current daily riddle
		const dailyRiddle = await getRiddleOfTheDay()
		const baseUrl = getWebsiteBaseUrl()
		const riddleMessage = formatDailyRiddleMessage(dailyRiddle, baseUrl)

		// Send the riddle message
		await message.channel.send(riddleMessage)
		serverLogger.info(`Sent daily riddle to channel ${channel.name} in guild ${channel.guild.name}`)
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		serverLogger.error(`Error handling !daily command: ${errorMessage}`)

		// Try to send error message to user
		try {
			await message.reply("Sorry, I couldn't fetch the daily riddle right now. Please try again later.")
		} catch {
			// Ignore errors sending error message
		}
	}
}

// Global client instance for message listening
let discordClient: Client | null = null
let isListening = false

/**
 * Start Discord bot listener for !daily command
 * This creates a persistent connection to listen for messages
 */
export const startDiscordBotListener = async (): Promise<{ success: boolean; error?: string }> => {
	if (isListening && discordClient) {
		serverLogger.info('Discord bot listener is already running')
		return { success: true }
	}

	const config = getDiscordConfig()
	if (!config) {
		return { success: false, error: 'Discord bot token not configured' }
	}

	try {
		// Create Discord client with message content intent
		const client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent, // Required to read message content (privileged intent)
			],
		})

		// Handle ready event
		client.once('ready', () => {
			serverLogger.info(`Discord bot logged in as ${client.user?.tag}`)
			isListening = true
		})

		// Handle message events
		client.on('messageCreate', async (message: Message) => {
			// Ignore bot messages
			if (message.author.bot) {
				return
			}

			// Check for !daily command
			if (message.content.trim().toLowerCase() === '!daily') {
				await handleDailyCommand(message)
			}
		})

		// Handle errors
		client.on('error', (error) => {
			const errorMessage = error instanceof Error ? error.message : String(error)
			const lowerErrorMessage = errorMessage.toLowerCase()

			// Check if this is an intents error (various formats Discord.js might use)
			if (
				lowerErrorMessage.includes('disallowed intents') ||
				lowerErrorMessage.includes('invalid intents') ||
				lowerErrorMessage.includes('used disallowed intents') ||
				(lowerErrorMessage.includes('intent') &&
					(lowerErrorMessage.includes('disallowed') || lowerErrorMessage.includes('not enabled')))
			) {
				serverLogger.error(
					`Discord bot intents not enabled. Please enable the "Message Content Intent" in your Discord Developer Portal (https://discord.com/developers/applications). This is a privileged intent required to read message content.`
				)
			} else {
				serverLogger.error(`Discord client error: ${error}`)
			}
		})

		// Login to Discord
		await client.login(config.botToken)
		discordClient = client

		return { success: true }
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error)
		const lowerErrorMessage = errorMessage.toLowerCase()

		// Check if this is an intents error (various formats Discord.js might use)
		if (
			lowerErrorMessage.includes('disallowed intents') ||
			lowerErrorMessage.includes('invalid intents') ||
			lowerErrorMessage.includes('used disallowed intents') ||
			(lowerErrorMessage.includes('intent') &&
				(lowerErrorMessage.includes('disallowed') || lowerErrorMessage.includes('not enabled')))
		) {
			const detailedError = `Discord bot intents not enabled. Please enable the "Message Content Intent" in your Discord Developer Portal (https://discord.com/developers/applications). This is a privileged intent required to read message content.`
			serverLogger.error(`Error starting Discord bot listener: ${detailedError}`)
			return { success: false, error: detailedError }
		}

		serverLogger.error(`Error starting Discord bot listener: ${errorMessage}`)
		return { success: false, error: errorMessage }
	}
}

/**
 * Stop Discord bot listener
 */
export const stopDiscordBotListener = async (): Promise<void> => {
	if (discordClient) {
		await discordClient.destroy()
		discordClient = null
		isListening = false
		serverLogger.info('Discord bot listener stopped')
	}
}

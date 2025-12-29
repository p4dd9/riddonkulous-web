import { redirect } from 'next/navigation'

/**
 * Permanent redirect to Discord OAuth URL for adding the Riddonkulous bot
 */
export default function DiscordAddBot() {
	redirect(
		'https://discord.com/api/oauth2/authorize?client_id=1454040384312184836&permissions=68608&scope=bot%20applications.commands',
		'permanent'
	)
}


import { MetadataRoute } from 'next'
import { getLatestRiddles } from './services/riddleService'
import { listTags } from './services/tagService'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = 'https://riddonkulous.com'

	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'hourly',
			priority: 1,
		},
		{
			url: `${baseUrl}/riddle-feed`,
			lastModified: new Date(),
			changeFrequency: 'hourly',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/faq`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		{
			url: `${baseUrl}/about-us`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: `${baseUrl}/writing-riddles`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/using-riddles`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/riddles-in-history`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/community-interview`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/credits`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5,
		},
	]

	// Dynamic category pages
	let categoryPages: MetadataRoute.Sitemap = []
	try {
		const tagsData = await listTags(100, 0)
		categoryPages = tagsData.tags.map((tag) => ({
			url: `${baseUrl}/riddles/${tag.id}`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		}))
	} catch (error) {
		console.error('Error fetching tags for sitemap:', error)
	}

	// Dynamic riddle pages (limit to recent riddles to avoid huge sitemap)
	let riddlePages: MetadataRoute.Sitemap = []
	try {
		const recentRiddles = await getLatestRiddles(5, 0, 90) // Last 90 days
		riddlePages = recentRiddles.riddles.map((riddle) => ({
			url: `${baseUrl}/riddle/${riddle.postId}`,
			lastModified: riddle.date ? new Date(Number(riddle.date)) : new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		}))
	} catch (error) {
		console.error('Error fetching riddles for sitemap:', error)
	}

	return [...staticPages, ...categoryPages, ...riddlePages]
}

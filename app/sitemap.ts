import { MetadataRoute } from 'next'

// Browsers only get the app landing page plus the legal/info pages (riddles are
// played in the native app; see proxy.ts), so only those are listed.
export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://riddonkulous.com'
	const lastModified = new Date()

	return [
		{ url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
		{ url: `${baseUrl}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
		{ url: `${baseUrl}/credits`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
		{ url: `${baseUrl}/privacy-policy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
		{ url: `${baseUrl}/terms-of-service`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
		{ url: `${baseUrl}/content-policy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
	]
}

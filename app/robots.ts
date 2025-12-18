import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/admin/', '/api/', '/password/', '/user/'],
			},
		],
		sitemap: 'https://riddonkulous.com/sitemap.xml',
	}
}









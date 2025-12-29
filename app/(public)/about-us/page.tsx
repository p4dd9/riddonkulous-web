import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'About Us | Riddonkulous',
	description:
		'Learn about Hammertime e.U., the studio behind Riddonkulous, and our mission to create educational gaming experiences.',
	openGraph: {
		title: 'About Us | Riddonkulous',
		description:
			'Learn about Hammertime e.U., the studio behind Riddonkulous, and our mission to create educational gaming experiences.',
		url: 'https://riddonkulous.com/about-us',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'About Us | Riddonkulous',
		description:
			'Learn about Hammertime e.U., the studio behind Riddonkulous, and our mission to create educational gaming experiences.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/about-us',
	},
}

export const revalidate = false // Static page

export default async function AboutUsPage() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-4xl flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl text-center mb-4">About Us</h1>

				<div className="flex justify-center mb-6">
					<Image
						src="/pals/frog_magician.gif"
						alt="Frog Magician"
						width={200}
						height={200}
						className="w-48 h-48 md:w-64 md:h-64"
						unoptimized
					/>
				</div>

				<div className="prose prose-invert max-w-none">
					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">About Hammertime e.U.</h2>
						<p className="text-white/80 mb-4">
							Riddonkulous is a platform dedicated to creating and solving riddles, bringing together
							riddle enthusiasts from around the world. We believe that riddles are more than just
							entertainment - they are powerful tools for education, cognitive development, and creative
							expression.
						</p>
						<p className="text-white/80 mb-4">
							Our mission is to make riddles accessible to everyone while fostering a vibrant community of
							riddle creators and solvers. Whether you&apos;re looking to challenge your mind, learn about
							the history of riddles, or create your own brain teasers, Riddonkulous provides the tools
							and community to support your journey.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Contact Us</h2>
						<p className="text-white/80 mb-4">
							We&apos;d love to hear from you! Whether you have questions, feedback, or just want to say
							hello, please don&apos;t hesitate to reach out.
						</p>
						<p className="text-white/80 mb-4">
							Email us at{' '}
							<a href="mailto:hello@hammertime.studio" className="underline text-primary">
								hello@hammertime.studio
							</a>
						</p>
						<p className="text-white/80 mb-4">
							You can also learn more about our other projects and support our work by visiting{' '}
							<Link
								href="https://hammertime.studio"
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-primary"
							>
								hammertime.studio
							</Link>
							.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Credits</h2>
						<p className="text-white/80 mb-4">
							Riddonkulous wouldn&apos;t be possible without the amazing contributors, authors, and
							creators who have helped bring this platform to life. To learn more about the people behind
							Riddonkulous, visit our{' '}
							<Link href="/credits" className="underline text-primary">
								Credits page
							</Link>
							.
						</p>
					</section>
				</div>
			</div>
		</div>
	)
}

'use client'

import { FAQItem } from '@/app/components/faq/FAQItem'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

export const dynamic = 'force-static'

export default function FAQPage() {
	useEffect(() => {
		// Check hash and open corresponding FAQ item
		const checkHash = () => {
			const hash = window.location.hash.slice(1) // Remove the #
			if (hash) {
				// Close "What is Riddonkulous?" if it's open and a different hash is provided
				if (hash !== 'what-is-riddonkulous') {
					const defaultElement = document.getElementById('what-is-riddonkulous')
					if (defaultElement) {
						const button = defaultElement.querySelector('button') as HTMLButtonElement
						if (button) {
							const answerDiv = defaultElement.querySelector('div.mt-2')
							if (answerDiv && answerDiv.getBoundingClientRect().height > 0) {
								// Item is open, close it
								button.click()
							}
						}
					}
				}

				const element = document.getElementById(hash)
				if (element) {
					// Find the button inside the FAQ item and click it to open
					const button = element.querySelector('button') as HTMLButtonElement
					if (button) {
						// Check if the FAQ item is closed by checking if the answer div is not visible
						const answerDiv = element.querySelector('div.mt-2')
						if (!answerDiv || answerDiv.getBoundingClientRect().height === 0) {
							// Item is closed, click to open it
							button.click()
						}
					}
					// Scroll to the element after a delay to ensure it's opened
					setTimeout(() => {
						element.scrollIntoView({ behavior: 'smooth', block: 'start' })
					}, 150)
				}
			} else {
				// No hash, open "What is Riddonkulous?" by default
				const defaultElement = document.getElementById('what-is-riddonkulous')
				if (defaultElement) {
					const button = defaultElement.querySelector('button') as HTMLButtonElement
					if (button) {
						const answerDiv = defaultElement.querySelector('div.mt-2')
						if (!answerDiv || answerDiv.getBoundingClientRect().height === 0) {
							button.click()
						}
					}
				}
			}
		}

		// Check immediately on mount
		setTimeout(checkHash, 100)

		// Listen for hash changes
		const handleHashChange = () => {
			setTimeout(checkHash, 50)
		}

		// Listen for clicks on links (including Next.js Link components)
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			const link = target.closest('a[href*="#"]') as HTMLAnchorElement
			if (link) {
				const href = link.getAttribute('href')
				if (href && href.includes('#') && href.includes('/faq')) {
					const hash = href.split('#')[1]
					if (hash) {
						setTimeout(() => {
							checkHash()
						}, 100)
					}
				}
			}
		}

		window.addEventListener('hashchange', handleHashChange)
		document.addEventListener('click', handleClick, true)

		return () => {
			window.removeEventListener('hashchange', handleHashChange)
			document.removeEventListener('click', handleClick, true)
		}
	}, [])

	return (
		<div className="relative h-full w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-2xl flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl text-center mb-4">Frequently Asked Questions</h1>
				<div className="flex justify-center mb-4">
					<Image
						src="/pals/PAL012.gif"
						alt="FAQ character"
						width={200}
						height={200}
						className="object-contain"
						unoptimized
					/>
				</div>

				<div className="flex flex-col gap-4">
					<FAQItem
						id="what-is-riddonkulous"
						question="What is Riddonkulous?"
						answer="Riddonkulous is a platform for creating and solving riddles. It's a community-driven game where users can share their own riddles and challenge others to solve them."
					/>
					<FAQItem
						id="is-it-free"
						question="Is Riddonkulous free to use?"
						answer="Yes! Riddonkulous is completely free to use. You can browse, solve riddles, and participate in the community without any cost."
					/>
					<FAQItem
						id="how-to-create"
						question="How do I create a riddle?"
						answer="You can create a riddle by clicking the 'Create' button in the header or drawer menu, which will take you to Reddit where you can submit your riddle to the community."
					/>
					<FAQItem
						id="approval-process"
						question="Why does the approval process take time?"
						answer={
							<p>
								The approval process can take time if we detect malicious, poor, or NSFW (Not Safe For Work) content. Our moderation team reviews all submissions to ensure they meet our quality standards and content policies. This helps maintain a safe and enjoyable experience for all users. If your riddle is flagged for review, please be patient while we process it. Approval decisions are ultimately up to the moderation team.
							</p>
						}
					/>
					<FAQItem
						id="solve-without-account"
						question="Can I solve riddles without creating an account?"
						answer={
							<p>
								Yes, you can solve riddles without creating an account. However, to create riddles and
								participate in the subbredit, you&apos;ll need to join us on Reddit at{' '}
								<Link
									href="https://www.reddit.com/r/riddonkulous"
									target="_blank"
									rel="noopener noreferrer"
									className="underline"
								>
									reddit.com/r/riddonkulous
								</Link>
								.
							</p>
						}
					/>
					<FAQItem
						id="how-to-login"
						question="How do I login or create an account?"
						answer={
							<p>
								You can login or create an account using Google login only. Simply click the login button in the header or drawer menu, and you&apos;ll be prompted to sign in with your Google account. If you don&apos;t have an account yet, the same process will create one for you automatically.
							</p>
						}
					/>
					<FAQItem
						id="high-quality-content"
						question='What is considered "quality content"?'
						answer={
							<div className="flex flex-col gap-3">
								<p>
									Quality riddles on Riddonkulous should meet these minimum requirements to ensure a
									great experience for everyone:
								</p>
								<ul className="list-disc list-inside space-y-2 text-sm">
									<li>
										Clear and solvable: The riddle should have a logical answer that can be deduced
										from the clues provided.
									</li>
									<li>
										Proper grammar and spelling: The riddle should be well-written and free of
										errors that might confuse solvers.
									</li>
									<li>
										Appropriate length: The riddle should be long enough to provide meaningful clues
										but concise enough to be engaging.
									</li>
									<li>
										Original or properly attributed: If using an existing riddle, credit the
										original source when possible.
									</li>
									<li>
										Respectful content: Riddles should be appropriate for all ages and avoid
										offensive or harmful content.
									</li>
									<li>
										Correct answer: Ensure the answer is accurate and matches the clues provided in
										the riddle.
									</li>
								</ul>
								<p className="text-sm opacity-90">
									Following these guidelines helps maintain a positive and engaging community for all
									riddle enthusiasts!
								</p>
								<p className="text-sm">
									For more details, please review our{' '}
									<Link
										href="https://hammertime.studio/en/reddit/content-policy"
										target="_blank"
										rel="noopener noreferrer"
										className="underline"
									>
										Content Policy
									</Link>
									.
								</p>
							</div>
						}
					/>
					<FAQItem
						id="how-to-delete-account"
						question="How do I delete my account?"
						answer={
							<p>
								To delete your account, go to your Profile page and scroll down to the &quot;Advanced Settings&quot; section. Click on &quot;Advanced Settings&quot; to expand it, then click the &quot;Delete Account&quot; button in the Danger Zone. You&apos;ll be asked to confirm the deletion. Please note that this action is permanent and cannot be undone. All your data will be permanently deleted.
							</p>
						}
					/>
					<FAQItem
						id="contact"
						question="How can I contact Riddonkulous?"
						answer={
							<p>
								You can contact us at <a className="underline">hello[at]hammertime[dot]studio</a>. If
								you encounter content that violates our policies, please report it to this email
								address.
							</p>
						}
					/>
					<FAQItem
						id="how-to-support"
						question="How can I support this project?"
						answer={
							<p>
								You can support Riddonkulous by{' '}
								<Link
									href="https://hammertime.studio/en/support-my-work"
									target="_blank"
									rel="noopener noreferrer"
									className="underline"
								>
									visiting our support page
								</Link>
								.
							</p>
						}
					/>
				</div>
			</div>
		</div>
	)
}

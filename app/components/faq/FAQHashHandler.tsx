'use client'

import { useEffect } from 'react'

export const FAQHashHandler = () => {
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

	return null
}

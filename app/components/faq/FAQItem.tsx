'use client'

import Image from 'next/image'
import { type ReactNode, useEffect, useState } from 'react'

interface FAQItemProps {
	id: string
	question: string
	answer: string | ReactNode
	defaultOpen?: boolean
}

export const FAQItem = ({ id, question, answer, defaultOpen = false }: FAQItemProps) => {
	const [isOpen, setIsOpen] = useState(defaultOpen)

	useEffect(() => {
		// Check if this item matches the hash in the URL
		const checkHash = () => {
			if (typeof window !== 'undefined' && window.location.hash === `#${id}`) {
				setIsOpen(true)
				// Scroll to the element after a short delay to ensure it's rendered
				setTimeout(() => {
					const element = document.getElementById(id)
					if (element) {
						element.scrollIntoView({ behavior: 'smooth', block: 'start' })
					}
				}, 100)
			}
		}

		checkHash()

		// Listen for hash changes
		const handleHashChange = () => {
			checkHash()
		}

		window.addEventListener('hashchange', handleHashChange)
		return () => window.removeEventListener('hashchange', handleHashChange)
	}, [id])

	return (
		<div id={id} className="border-b border-gray-700 pb-4 scroll-mt-20">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between gap-4 text-left py-2 hover:text-primary transition-colors cursor-pointer"
			>
				<span className="text-lg">{question}</span>
				<Image
					src="/icons/arrow_up.png"
					alt={isOpen ? 'Collapse' : 'Expand'}
					width={20}
					height={20}
					className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
				/>
			</button>
			{isOpen && (
				<div className="mt-2 text-gray-300 pl-4">{typeof answer === 'string' ? <p>{answer}</p> : answer}</div>
			)}
		</div>
	)
}

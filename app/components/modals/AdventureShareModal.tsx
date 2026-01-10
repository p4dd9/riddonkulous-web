'use client'

import Image from 'next/image'
import { useState } from 'react'

interface AdventureShareModalProps {
	url?: string
	title?: string
	text?: string
	onClose: () => void
}

export const AdventureShareModal = ({ url, title, text, onClose }: AdventureShareModalProps) => {
	const [copied, setCopied] = useState(false)
	const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
	const shareTitle = title || 'Check this out!'

	const getShareContent = () => {
		if (text) {
			return `${shareTitle}\n\n${text}\n\n${currentUrl}`
		}
		return `${shareTitle}\n\n${currentUrl}`
	}

	const copyToClipboard = async () => {
		try {
			const contentToCopy = getShareContent()
			// Use the modern Clipboard API if available
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(contentToCopy)
			} else {
				// Fallback for older browsers
				const textArea = document.createElement('textarea')
				textArea.value = contentToCopy
				textArea.style.position = 'fixed'
				textArea.style.left = '-999999px'
				textArea.style.top = '-999999px'
				document.body.appendChild(textArea)
				textArea.focus()
				textArea.select()
				document.execCommand('copy')
				document.body.removeChild(textArea)
			}
			setCopied(true)
		} catch (err) {
			console.error('Failed to copy:', err)
			// Fallback: show URL in alert for manual copy
			alert(`Failed to copy. Here's the content:\n\n${getShareContent()}`)
		}
	}

	const shareContent = getShareContent()

	return (
		<div className="share-modal overflow-hidden">
			<div className="mb-6 flex flex-col gap-4">
				<p className="text-gray-300 text-center text-lg">
					{copied ? '✅ Copied to clipboard!' : 'Copy your adventure results to share'}
				</p>
				{copied ? (
					<div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
						<p className="text-green-400 text-sm text-center mb-2">
							Your results have been copied! You can now paste them anywhere:
						</p>
						<ul className="text-green-300 text-xs space-y-1 text-center">
							<li>• Social media (Twitter, Facebook, etc.)</li>
							<li>• Messaging apps (WhatsApp, Discord, etc.)</li>
							<li>• Email or any text field</li>
						</ul>
					</div>
				) : (
					<div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
						<p className="text-gray-400 text-sm mb-3">What will be copied:</p>
						<div className="bg-gray-900 rounded p-3 max-h-48 overflow-y-auto">
							<pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">{shareContent}</pre>
						</div>
					</div>
				)}
			</div>

			<div className="flex gap-3 flex-col">
				<button
					onClick={copyToClipboard}
					disabled={copied}
					className={`flex items-center justify-center gap-3 px-5 py-3 rounded-lg transition-colors ${
						copied ? 'bg-green-700 hover:bg-green-600 cursor-default' : 'bg-primary hover:bg-secondary'
					}`}
				>
					<Image
						src={copied ? '/icons/check.png' : '/icons/link.png'}
						alt={copied ? 'Copied' : 'Copy'}
						width={20}
						height={20}
						className="w-5 h-5"
					/>
					<span>{copied ? 'Copied!' : 'Copy Results'}</span>
				</button>
				{copied && (
					<button
						onClick={onClose}
						className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg transition-colors"
					>
						<span>Done</span>
					</button>
				)}
			</div>
		</div>
	)
}

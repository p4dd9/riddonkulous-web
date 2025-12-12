'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ShareModalProps {
	url?: string
	title?: string
	onClose: () => void
}

export const ShareModal = ({ url, title, onClose }: ShareModalProps) => {
	const [copied, setCopied] = useState(false)
	const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
	const shareTitle = title || 'Check this out!'
	const canShare = typeof navigator !== 'undefined' && 'share' in navigator

	const copyToClipboard = async () => {
		try {
			// Use the modern Clipboard API if available
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(currentUrl)
			} else {
				// Fallback for older browsers
				const textArea = document.createElement('textarea')
				textArea.value = currentUrl
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
			setTimeout(() => {
				setCopied(false)
				onClose()
			}, 2000)
		} catch (err) {
			console.error('Failed to copy:', err)
			// Fallback: show URL in alert for manual copy
			alert(`URL: ${currentUrl}`)
		}
	}

	const handleShare = async () => {
		if (!canShare) {
			// Fallback to copy if Share API is not available
			copyToClipboard()
			return
		}

		try {
			await navigator.share({
				title: shareTitle,
				url: currentUrl,
			})
			onClose()
		} catch (err) {
			// User cancelled or error occurred
			if ((err as Error).name !== 'AbortError') {
				console.error('Error sharing:', err)
			}
		}
	}

	return (
		<div className="share-modal overflow-hidden">
			<div className="mb-6">
				<p className="text-gray-300 text-center">Share this Riddle with the World.</p>
			</div>

			<div className="flex gap-3 flex-col">
				<button
					onClick={copyToClipboard}
					className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg  transition-colors"
				>
					<Image src="/icons/link.png" alt="Copy link" width={20} height={20} className="w-5 h-5" />
					<span>{copied ? 'Copied!' : 'Copy URL'}</span>
				</button>
				{canShare && (
					<button
						onClick={handleShare}
						className="flex items-center justify-center gap-3 bg-primary hover:bg-secondary px-5 py-3 rounded-lg  transition-colors"
					>
						<Image src="/icons/world.png" alt="Share" width={20} height={20} className="w-5 h-5" />
						<span>Share</span>
					</button>
				)}
			</div>
		</div>
	)
}

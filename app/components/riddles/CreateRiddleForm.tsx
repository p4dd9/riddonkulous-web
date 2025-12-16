'use client'

import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { RiddleApprovedModal } from '@/app/components/modals/RiddleApprovedModal'
import { RiddleReviewModal } from '@/app/components/modals/RiddleReviewModal'
import cosmetics from '@/app/data/cosmetics.json'
import {
	createRiddle,
	validateBg,
	validateExplanation,
	validateRiddle,
	validateWord,
	type ErrorResponse,
	type RiddleFormData,
} from '@/app/services/riddleCreationService'
import { getCurrentUserData } from '@/app/services/userService'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Cosmetic {
	name: string
	sku: string
	assetName: string
	type: string
	description?: string
}

const canvasCosmetics = (cosmetics as Cosmetic[]).filter((item) => item.type === 'canvas')

interface CharacterCounterProps {
	current: number
	max: number
	min?: number
}

const CharacterCounter = ({ current, max, min }: CharacterCounterProps) => {
	const percentage = (current / max) * 100
	const isWarning = percentage > 80
	const isError = current > max
	const isBelowMin = min !== undefined && current > 0 && current < min

	let displayText = `${current}/${max} characters`
	if (min !== undefined) {
		displayText = `${current}/${max} characters (min: ${min})`
	}

	return (
		<div
			className={`text-xs mt-1 ${
				isError || isBelowMin ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-gray-400'
			}`}
		>
			{displayText}
		</div>
	)
}

export const CreateRiddleForm = () => {
	const [formData, setFormData] = useState<RiddleFormData>({
		word: '',
		riddle: '',
		bg: '',
		explanation: '',
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState('')
	const [rateLimitCooldown, setRateLimitCooldown] = useState<number | null>(null)
	const [hasUsername, setHasUsername] = useState<boolean | null>(null)
	const [isCheckingUsername, setIsCheckingUsername] = useState(true)
	const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false)
	const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
	const [createdPostId, setCreatedPostId] = useState<string | null>(null)

	// Check username on mount
	useEffect(() => {
		const checkUsername = async () => {
			try {
				const userData = await getCurrentUserData()
				setHasUsername(!!userData?.username)
			} catch (error) {
				console.error('Failed to check username:', error)
				setHasUsername(false)
			} finally {
				setIsCheckingUsername(false)
			}
		}
		checkUsername()
	}, [])

	// Rate limit countdown timer
	useEffect(() => {
		if (rateLimitCooldown === null || rateLimitCooldown <= 0) return

		const interval = setInterval(() => {
			setRateLimitCooldown((prev) => {
				if (prev === null || prev <= 1) {
					return null
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [rateLimitCooldown])

	const handleModalClose = () => {
		setIsApprovedModalOpen(false)
		setIsReviewModalOpen(false)
		setCreatedPostId(null)
	}

	const handleChange = (field: keyof RiddleFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
		// Clear error for this field
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev }
				delete newErrors[field]
				return newErrors
			})
		}
	}

	const handleBlur = (field: keyof RiddleFormData) => {
		let error: string | null = null

		switch (field) {
			case 'word':
				error = validateWord(formData.word)
				break
			case 'riddle':
				error = validateRiddle(formData.riddle)
				break
			case 'bg':
				error = validateBg(formData.bg)
				break
			case 'explanation':
				error = validateExplanation(formData.explanation || '')
				break
		}

		if (error) {
			setErrors((prev) => ({ ...prev, [field]: error! }))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSubmitError('')

		// Validate all fields
		const validationErrors: Record<string, string> = {}
		const wordError = validateWord(formData.word)
		const riddleError = validateRiddle(formData.riddle)
		const bgError = validateBg(formData.bg)
		const explanationError = validateExplanation(formData.explanation || '')

		if (wordError) validationErrors.word = wordError
		if (riddleError) validationErrors.riddle = riddleError
		if (bgError) validationErrors.bg = bgError
		if (explanationError) validationErrors.explanation = explanationError

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors)
			return
		}

		setIsSubmitting(true)

		try {
			const result = await createRiddle(formData)

			// Reset form
			setFormData({ word: '', riddle: '', bg: '', explanation: '' })
			setErrors({})
			setCreatedPostId(result.data.postId)

			// Show appropriate modal based on status from response
			const riddleStatus = result.data.status || 'IN_REVIEW'

			if (riddleStatus === 'APPROVED') {
				setIsApprovedModalOpen(true)
			} else {
				setIsReviewModalOpen(true)
			}
		} catch (error) {
			const errorResponse = error as ErrorResponse

			if (errorResponse.status === 429) {
				setRateLimitCooldown(60)
				setSubmitError('Too many requests. Please wait 1 minute before creating another riddle.')
			} else if (errorResponse.status === 400 && errorResponse.message?.includes('Username')) {
				setSubmitError('Please set your username in profile settings before creating riddles.')
				setHasUsername(false)
			} else if (errorResponse.status === 401) {
				setSubmitError('You must be logged in to create riddles.')
			} else if (errorResponse.status === 400 && errorResponse.details) {
				// Field-specific validation errors from backend
				const fieldErrors: Record<string, string> = {}
				errorResponse.details.forEach((detail) => {
					if (detail.path && detail.path.length > 0) {
						fieldErrors[detail.path[0]] = detail.message
					}
				})
				setErrors(fieldErrors)
				setSubmitError('Please fix the errors above.')
			} else {
				setSubmitError(errorResponse.message || 'Failed to create riddle. Please try again.')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	const isFormDisabled = isSubmitting || rateLimitCooldown !== null || hasUsername === false

	if (isCheckingUsername) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">Loading...</div>
			</div>
		)
	}

	return (
		<div className="w-full">
			{hasUsername === false && (
				<div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-6">
					<p className="text-yellow-300 mb-2">You need to set a username before creating riddles.</p>
					<Link href="/user/me" className="text-yellow-400 hover:text-yellow-300 underline">
						Go to Profile Settings
					</Link>
				</div>
			)}

			{submitError && (
				<div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
					<p className="text-red-300">{submitError}</p>
				</div>
			)}

			{rateLimitCooldown !== null && (
				<div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-6">
					<p className="text-yellow-300">
						Please wait {rateLimitCooldown} second{rateLimitCooldown !== 1 ? 's' : ''} before creating
						another riddle.
					</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Word Field */}
				<div>
					<label htmlFor="word-input" className="block text-sm text-gray-400 mb-2">
						Solution Word{' '}
						<span className="text-red-400" aria-label="required">
							*
						</span>
					</label>
					<input
						id="word-input"
						type="text"
						value={formData.word}
						onChange={(e) => handleChange('word', e.target.value)}
						onBlur={() => handleBlur('word')}
						className={`w-full bg-gray-600 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary ${
							errors.word ? 'border-red-500' : 'border-gray-500'
						}`}
						placeholder="Enter the solution word"
						disabled={isFormDisabled}
						aria-describedby={errors.word ? 'word-error' : 'word-help'}
						aria-invalid={!!errors.word}
						aria-required="true"
						maxLength={20}
					/>
					<CharacterCounter current={formData.word.length} max={20} />
					{errors.word && (
						<div id="word-error" role="alert" aria-live="polite" className="text-red-400 text-sm mt-1">
							{errors.word}
						</div>
					)}
				</div>

				{/* Riddle Field */}
				<div>
					<label htmlFor="riddle-input" className="block text-sm text-gray-400 mb-2">
						Riddle Text{' '}
						<span className="text-red-400" aria-label="required">
							*
						</span>{' '}
						<span className="text-gray-500 text-xs">(50-750 characters)</span>
					</label>
					<textarea
						id="riddle-input"
						value={formData.riddle}
						onChange={(e) => handleChange('riddle', e.target.value)}
						onBlur={() => handleBlur('riddle')}
						className={`w-full bg-gray-600 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-y ${
							errors.riddle ? 'border-red-500' : 'border-gray-500'
						}`}
						placeholder="Enter your riddle question or text (minimum 50 characters)"
						disabled={isFormDisabled}
						aria-describedby={errors.riddle ? 'riddle-error' : 'riddle-help'}
						aria-invalid={!!errors.riddle}
						aria-required="true"
						minLength={50}
						maxLength={750}
					/>
					<CharacterCounter current={formData.riddle.length} max={750} min={50} />
					{errors.riddle && (
						<div id="riddle-error" role="alert" aria-live="polite" className="text-red-400 text-sm mt-1">
							{errors.riddle}
						</div>
					)}
				</div>

				{/* Background Field */}
				<div>
					<label htmlFor="bg-input" className="block text-sm text-gray-400 mb-2">
						Background{' '}
						<span className="text-red-400" aria-label="required">
							*
						</span>
					</label>
					<select
						id="bg-input"
						value={formData.bg}
						onChange={(e) => handleChange('bg', e.target.value)}
						onBlur={() => handleBlur('bg')}
						className={`w-full bg-gray-600 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary ${
							errors.bg ? 'border-red-500' : 'border-gray-500'
						}`}
						disabled={isFormDisabled}
						aria-describedby={errors.bg ? 'bg-error' : 'bg-help'}
						aria-invalid={!!errors.bg}
						aria-required="true"
					>
						<option value="">Select a background...</option>
						{canvasCosmetics.map((canvas) => (
							<option key={canvas.sku} value={canvas.sku}>
								{canvas.name}
							</option>
						))}
					</select>
					{formData.bg && (
						<div className="mt-4">
							{(() => {
								const selectedCanvas = canvasCosmetics.find((c) => c.sku === formData.bg)
								if (!selectedCanvas) return null
								return (
									<div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
										<div className="flex flex-col sm:flex-row gap-4">
											<div className="shrink-0">
												<Image
													src={`/canvas/${selectedCanvas.assetName}`}
													alt={selectedCanvas.name}
													width={200}
													height={150}
													className="rounded-md object-cover w-full sm:w-[200px] h-[150px]"
												/>
											</div>
											<div className="flex-1">
												<h4 className="text-lg mb-1">{selectedCanvas.name}</h4>
												{selectedCanvas.description && (
													<p className="text-sm text-gray-300">
														{selectedCanvas.description}
													</p>
												)}
											</div>
										</div>
									</div>
								)
							})()}
						</div>
					)}
					{errors.bg && (
						<div id="bg-error" role="alert" aria-live="polite" className="text-red-400 text-sm mt-1">
							{errors.bg}
						</div>
					)}
				</div>

				{/* Explanation Field */}
				{/* <div>
					<label htmlFor="explanation-input" className="block text-sm text-gray-400 mb-2">
						Explanation <span className="text-gray-500 text-xs">(Optional)</span>
					</label>
					<textarea
						id="explanation-input"
						value={formData.explanation}
						onChange={(e) => handleChange('explanation', e.target.value)}
						onBlur={() => handleBlur('explanation')}
						className={`w-full bg-gray-600 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y ${
							errors.explanation ? 'border-red-500' : 'border-gray-500'
						}`}
						placeholder="Enter additional explanation (optional)"
						disabled={isFormDisabled}
						aria-describedby={errors.explanation ? 'explanation-error' : 'explanation-help'}
						aria-invalid={!!errors.explanation}
						maxLength={1000}
					/>
					<CharacterCounter current={formData.explanation?.length || 0} max={1000} />
					{errors.explanation && (
						<div
							id="explanation-error"
							role="alert"
							aria-live="polite"
							className="text-red-400 text-sm mt-1"
						>
							{errors.explanation}
						</div>
					)}
				</div> */}

				{/* Form Actions */}
				<div className="flex flex-col sm:flex-row gap-3 pt-4">
					<button
						type="submit"
						disabled={isFormDisabled}
						className="flex-1 bg-primary hover:bg-secondary px-2 py-2 rounded-md text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isSubmitting && (
							<img
								src="/icons/hourglass.png"
								alt=""
								className="w-5 h-5 animate-spin"
							/>
						)}
						{isSubmitting ? 'Creating Riddle...' : 'Create Riddle'}
					</button>
				</div>
			</form>

			{/* Approved Modal */}
			<BottomSheetModal
				isOpen={isApprovedModalOpen}
				onClose={handleModalClose}
				title="Riddle Approved"
				icon="/icons/light.png"
			>
				{createdPostId && <RiddleApprovedModal postId={createdPostId} onContinue={handleModalClose} />}
			</BottomSheetModal>

			{/* Review Modal */}
			<BottomSheetModal
				isOpen={isReviewModalOpen}
				onClose={handleModalClose}
				title="Riddle Submitted"
				icon="/icons/pencil.png"
			>
				<RiddleReviewModal onContinue={handleModalClose} />
			</BottomSheetModal>
		</div>
	)
}

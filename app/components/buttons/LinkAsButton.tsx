'use client'

import Link from 'next/link'
import { useMemo, type ReactNode } from 'react'

interface LinkAsButtonProps {
	href: string
	text?: string
	customClass?: string
	className?: string
	threeD?: boolean
	variant?: 'primary' | 'secondary'
	icon?: string
	iconClass?: string
	textAlign?: 'left' | 'center' | 'right'
	children?: ReactNode
	target?: string
	rel?: string
	disabled?: boolean
}

const defaultClasses = 'bg-primary hover:bg-primary px-2 py-.5 rounded-md text-white transition-colors'

const secondaryClasses = 'bg-[var(--color-bg)] border-2 border-primary hover:bg-[var(--color-bg)] px-2 py-.5 rounded-md text-white transition-colors'

const threeDClasses =
	'shadow-[0_5px_0_0_rgba(0,0,0,0.7)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.7)] hover:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(0,0,0,0.7)] active:translate-y-[4px] transition-all duration-150'

export const LinkAsButton = ({
	href,
	text = '',
	customClass = '',
	className = '',
	threeD = true,
	variant = 'primary',
	icon,
	iconClass = 'w-5 h-5',
	textAlign,
	children,
	target,
	rel,
	disabled = false,
}: LinkAsButtonProps) => {
	const buttonClasses = useMemo(() => {
		// Choose base classes based on variant
		let baseClasses = variant === 'secondary' ? secondaryClasses : defaultClasses
		
		// If customClass contains bg- or hover:bg-, remove default background classes
		if (customClass.includes('bg-') || customClass.includes('hover:bg-')) {
			if (variant === 'primary') {
				baseClasses = baseClasses.replace('bg-primary', '').replace('hover:bg-primary', '').trim()
			} else {
				baseClasses = baseClasses.replace('bg-[var(--color-bg)]', '').replace('hover:bg-[var(--color-bg)]', '').trim()
			}
		}
		
		baseClasses = `${baseClasses} ${customClass}`.trim()
		// Only apply 3D effect if not disabled and variant is primary
		const classesWith3D = threeD && !disabled && variant === 'primary' ? `${baseClasses} ${threeDClasses}` : baseClasses
		// Add disabled styles if disabled
		const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
		return `${classesWith3D} ${disabledClasses}`.trim()
	}, [customClass, threeD, disabled, variant])

	const textAlignClass = useMemo(() => {
		if (textAlign === 'center') {
			return 'justify-center'
		} else if (textAlign === 'right') {
			return 'justify-end'
		}
		return ''
	}, [textAlign])

	const textAlignStyle = useMemo(() => {
		if (textAlign) {
			return { textAlign }
		}
		return {}
	}, [textAlign])

	const displayText = children || text

	// Check if customClass or className contains display utilities (flex, grid, block, etc.)
	const hasDisplayUtility =
		/(^|\s)(flex|grid|block|inline|inline-block|inline-flex|table|contents|hidden)(\s|$)/.test(
			`${customClass} ${className}`
		)

	// Merge all classes: default display (inline-block unless overridden), button classes, text align, and custom className (last so it can override)
	const displayClass = hasDisplayUtility ? '' : 'inline-block'
	const mergedClassName = `${displayClass} ${buttonClasses} ${textAlignClass} ${className}`.trim()

	const content = (
		<div className={icon ? 'flex items-center gap-2' : ''}>
			{icon && <img src={icon} alt="" className={iconClass} />}
			{displayText}
		</div>
	)

	if (disabled) {
		return (
			<span className={mergedClassName} style={textAlignStyle} aria-disabled="true">
				{content}
			</span>
		)
	}

	return (
		<Link href={href} target={target} rel={rel} className={mergedClassName} style={textAlignStyle}>
			{content}
		</Link>
	)
}

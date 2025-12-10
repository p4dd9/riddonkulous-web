'use client'

import Link from 'next/link'
import { useMemo, type ReactNode } from 'react'

interface LinkAsButtonProps {
	href: string
	text?: string
	customClass?: string
	threeD?: boolean
	icon?: string
	iconClass?: string
	textAlign?: 'left' | 'center' | 'right'
	children?: ReactNode
	target?: string
	rel?: string
}

const defaultClasses = 'bg-primary hover:bg-primary px-2 py-.5 rounded-md text-white transition-colors'

const threeDClasses =
	'shadow-[0_5px_0_0_rgba(0,0,0,0.7)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.7)] hover:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(0,0,0,0.7)] active:translate-y-[4px] transition-all duration-150'

export const LinkAsButton = ({
	href,
	text = '',
	customClass = '',
	threeD = true,
	icon,
	iconClass = 'w-5 h-5',
	textAlign,
	children,
	target,
	rel,
}: LinkAsButtonProps) => {
	const buttonClasses = useMemo(() => {
		const baseClasses = customClass || defaultClasses
		if (threeD) {
			return `${baseClasses} ${threeDClasses}`
		}
		return baseClasses
	}, [customClass, threeD])

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

	return (
		<Link
			href={href}
			target={target}
			rel={rel}
			className={`inline-block ${buttonClasses} ${textAlignClass}`}
			style={textAlignStyle}
		>
			<div className={icon ? 'flex items-center gap-2' : ''}>
				{icon && <img src={icon} alt="" className={iconClass} />}
				{displayText}
			</div>
		</Link>
	)
}

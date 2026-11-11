'use client'

import { useMemo, type ReactNode } from 'react'

interface BasicButtonProps {
	text?: string
	customClass?: string
	threeD?: boolean
	variant?: 'primary' | 'secondary'
	icon?: string
	iconClass?: string
	textAlign?: 'left' | 'center' | 'right'
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
	children?: ReactNode
	disabled?: boolean
}

const defaultClasses = 'btn-stone px-2'

const secondaryClasses = 'btn-stone-gray px-2'

// The kit buttons carry their own bevel; threeD is kept in the props for callers but adds nothing
const threeDClasses = ''

export const BasicButton = ({
	text = '',
	customClass = '',
	threeD = true,
	variant = 'primary',
	icon,
	iconClass = 'w-5 h-5',
	textAlign,
	onClick,
	children,
	disabled = false,
}: BasicButtonProps) => {
	const buttonClasses = useMemo(() => {
		const baseClasses = variant === 'secondary' ? secondaryClasses : defaultClasses
		const classesWithCustom = `${baseClasses} ${customClass}`
		if (threeD && variant === 'primary') {
			return `${classesWithCustom} ${threeDClasses}`
		}
		return classesWithCustom
	}, [customClass, threeD, variant])

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
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`${buttonClasses} ${textAlignClass}`}
			style={textAlignStyle}
		>
			<div className={`${buttonClasses.includes('btn-stone') ? 'btn-stone-tight' : ''} ${icon ? 'flex items-center gap-2' : ''}`.trim()}>
				{icon && <img src={icon} alt="" className={iconClass} />}
				{displayText}
			</div>
		</button>
	)
}

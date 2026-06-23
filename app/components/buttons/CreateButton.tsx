'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'

interface CreateButtonProps {
	variant?: 'header' | 'drawer'
	className?: string
	onClick?: () => void
}

export const CreateButton = ({ variant = 'header', className = '', onClick }: CreateButtonProps) => {
	const router = useRouter()
	const { user } = useAuth()

	const handleCreate = () => {
		onClick?.()
		if (user) {
			router.push('/user/me/create')
		} else {
			// If not logged in, navigate to login/profile page
			router.push('/user/me')
		}
	}

	const baseClasses =
		variant === 'header'
			? 'text-sm cursor-pointer py-1 flex items-center gap-2 bg-primary hover:bg-secondary px-2 rounded-md text-white transition-colors max-[346px]:gap-0'
			: 'w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-secondary rounded-md transition-colors text-white'

	return (
		<button onClick={handleCreate} className={`${baseClasses} ${className}`}>
			<Image src="/icons/pencil.png" alt="Create" width={20} height={20} className="w-5 h-5" />
			<span className={variant === 'header' ? 'max-[346px]:hidden' : ''}>Create</span>
		</button>
	)
}

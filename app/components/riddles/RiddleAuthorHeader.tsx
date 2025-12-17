'use client'

import { formatDate } from '@/app/util/format'
import Image from 'next/image'
import Link from 'next/link'

interface RiddleAuthorHeaderProps {
	username: string
	avatar?: string | null
	createdAt?: string
	className?: string
}

export const RiddleAuthorHeader = ({ username, avatar, createdAt, className = '' }: RiddleAuthorHeaderProps) => {
	const avatarUrl = avatar ? `/avatars/${avatar}` : '/avatars/avatar_02.png'

	return (
		<div className={`flex items-center gap-3 ${className}`}>
			<Link href={`/profile/${username}`} className="flex-shrink-0">
				<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary hover:border-secondary transition-colors">
					<Image src={avatarUrl} alt={`${username}'s avatar`} fill className="object-cover" />
				</div>
			</Link>
			<div className="flex flex-col gap-0.5">
				<Link
					href={`/profile/${username}`}
					className="text-white hover:text-primary transition-colors text-base"
				>
					{username}
				</Link>
				{createdAt && <p className="text-sm text-white/60">{formatDate(createdAt)}</p>}
			</div>
		</div>
	)
}

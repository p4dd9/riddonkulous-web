'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface UserMenuModalProps {
	onClose: () => void
}

export const UserMenuModal = ({ onClose }: UserMenuModalProps) => {
	const router = useRouter()
	const { signOut } = useAuth()

	const handleCreate = () => {
		router.push('/user/me/create')
		onClose()
	}

	const handleMyProfile = () => {
		router.push('/user/me')
		onClose()
	}

	const handleMyRiddles = () => {
		router.push('/user/me/riddles')
		onClose()
	}

	const handleLogout = async () => {
		try {
			await signOut()
			onClose()
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}

	return (
		<div className="user-menu-modal overflow-hidden">
			<div className="flex gap-3 flex-col">
				<button
					onClick={handleCreate}
					className="flex items-center justify-start gap-3 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg transition-colors"
				>
					<Image src="/icons/pencil.png" alt="Create" width={20} height={20} className="w-5 h-5" />
					<span>Create</span>
				</button>

				<button
					onClick={handleMyProfile}
					className="flex items-center justify-start gap-3 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg transition-colors"
				>
					<Image src="/icons/character.png" alt="My Profile" width={20} height={20} className="w-5 h-5" />
					<span>My Profile</span>
				</button>

				<button
					onClick={handleMyRiddles}
					className="flex items-center justify-start gap-3 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg transition-colors"
				>
					<Image src="/icons/script_lightning.png" alt="My Riddles" width={20} height={20} className="w-5 h-5" />
					<span>My Riddles</span>
				</button>

				<div className="border-t border-gray-600 my-2" />

				<button
					onClick={handleLogout}
					className="flex items-center justify-start gap-3 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg transition-colors"
				>
					<Image src="/icons/exit.png" alt="Logout" width={20} height={20} className="w-5 h-5" />
					<span>Logout</span>
				</button>
			</div>
		</div>
	)
}

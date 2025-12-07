'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

interface DetectiveImage {
	id: number
	left: number
	top: number
	rotation: number
	size: number
}

export default function Home() {
	const [images, setImages] = useState<DetectiveImage[]>([])

	const spawnImage = useCallback(() => {
		const newImage: DetectiveImage = {
			id: Date.now(),
			left: Math.random() * 100,
			top: Math.random() * 100,
			rotation: Math.random() * 360,
			size: 50 + Math.random() * 150,
		}
		setImages((prev) => {
			const updated = [...prev, newImage]
			return updated.length > 250 ? updated.slice(-100) : updated
		})
	}, [])

	useEffect(() => {
		const interval = setInterval(
			() => {
				spawnImage()
			},
			1000 + Math.random() * 2000
		)

		console.log(
			`%c
╔═══════════════════════════════════╗
║                                   ║
║        r/riddonkulous             ║
║                                   ║
╚═══════════════════════════════════╝
`,
			'color: #0b1416; font-weight: bold; font-size: 12px;'
		)
		return () => clearInterval(interval)
	}, [spawnImage])

	return (
		<div className="relative min-h-screen w-full overflow-hidden cursor-pointer" onClick={spawnImage}>
			{images.map((img) => (
				<Image
					key={img.id}
					src="/img/detective_think.gif"
					alt="Detective"
					width={img.size}
					height={img.size}
					unoptimized
					className="absolute"
					style={{
						left: `${img.left}%`,
						top: `${img.top}%`,
						transform: `rotate(${img.rotation}deg)`,
						width: `${img.size}px`,
						height: `${img.size}px`,
					}}
				/>
			))}
		</div>
	)
}

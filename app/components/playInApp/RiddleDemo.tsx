'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A riddle from the app, playable on the landing page. Pixi and the scene load on the client only
 * (app/components/playInApp/demo); until then, and if WebGL is missing, the stone frame shows a short note.
 */
export const RiddleDemo = () => {
	const mountRef = useRef<HTMLDivElement>(null)
	const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')

	useEffect(() => {
		const mount = mountRef.current
		if (!mount) return
		let cancelled = false
		let destroy: (() => void) | undefined
		import('./demo/riddleDemo')
			.then(({ startRiddleDemo }) => startRiddleDemo(mount))
			.then((demo) => {
				if (cancelled) return demo.destroy()
				destroy = demo.destroy
				setState('ready')
			})
			.catch(() => {
				if (!cancelled) setState('failed')
			})
		return () => {
			cancelled = true
			destroy?.()
		}
	}, [])

	return (
		<div className="relative w-full max-w-[390px] aspect-[390/640] rounded-[28px] border-[3px] border-primary/80 overflow-hidden bg-bg shadow-[0_18px_40px_rgba(12,9,5,0.7)]">
			<div
				ref={mountRef}
				className="absolute inset-0"
				role="img"
				aria-label="A playable riddle from the Riddonkulous app: tap the letters to spell the answer"
			/>
			{state !== 'ready' && (
				<div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xl text-[var(--color-muted)] pointer-events-none">
					{state === 'loading' ? 'Loading a riddle…' : 'Get the app to play the riddles.'}
				</div>
			)}
		</div>
	)
}

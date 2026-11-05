'use client'

import { useState } from 'react'

type ViewChoice = 'auto' | 'app' | 'web'

interface ViewSwitcherProps {
	override: 'app' | 'web' | null
	isNativeApp: boolean
	canPlay: boolean
}

const choices: { value: ViewChoice; label: string }[] = [
	{ value: 'web', label: 'Browser' },
	{ value: 'app', label: 'App' },
	{ value: 'auto', label: 'Auto' },
]

/**
 * Local debugging only (dev server, or VIEW_SWITCHER_ENABLED=true): forces the
 * page to render as the native app or as a regular browser. The proxy turns
 * `?view=` into a cookie, so the choice sticks across navigation and reloads.
 */
export const ViewSwitcher = ({ override, isNativeApp, canPlay }: ViewSwitcherProps) => {
	const [collapsed, setCollapsed] = useState(false)
	const current: ViewChoice = override ?? 'auto'

	const select = (value: ViewChoice) => {
		const url = new URL(window.location.href)
		url.searchParams.set('view', value)
		window.location.assign(url.toString())
	}

	if (collapsed) {
		return (
			<button
				type="button"
				onClick={() => setCollapsed(false)}
				className="fixed bottom-3 left-3 z-[200] px-3 py-1 rounded-full border-2 border-primary bg-[var(--color-bg)] text-sm text-primary shadow-lg"
				aria-label="Show view switcher"
			>
				{isNativeApp ? 'App view' : 'Browser view'}
			</button>
		)
	}

	return (
		<div className="fixed bottom-3 left-3 z-[200] flex flex-col gap-2 p-3 rounded-lg border-2 border-primary bg-[var(--color-bg)] shadow-lg text-sm">
			<div className="flex items-center justify-between gap-4">
				<span className="text-primary">Debug view</span>
				<button
					type="button"
					onClick={() => setCollapsed(true)}
					className="opacity-60 hover:opacity-100"
					aria-label="Hide view switcher"
				>
					Hide
				</button>
			</div>
			<div className="flex gap-1">
				{choices.map((choice) => (
					<button
						key={choice.value}
						type="button"
						onClick={() => select(choice.value)}
						className={`px-3 py-1 rounded-md border-2 transition-colors ${
							current === choice.value
								? 'bg-primary border-primary text-bg'
								: 'border-primary/40 hover:border-primary'
						}`}
					>
						{choice.label}
					</button>
				))}
			</div>
			<span className="text-xs opacity-70">
				Rendering as {isNativeApp ? 'native app' : 'browser'}, gameplay {canPlay ? 'on' : 'off'}
			</span>
		</div>
	)
}

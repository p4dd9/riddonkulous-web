import { Assets, Container, Graphics, NineSliceSprite, Sprite, Text, type Texture, type Ticker } from 'pixi.js'

/**
 * The drawing kit of the mobile game (riddonkulous-mobile src/stage/kit.ts, theme.ts, tween.ts and fx.ts), cut down
 * to what the landing page's playable riddle needs. Keep the numbers in step with the game when its look changes.
 */

export const COLORS = {
	bg: 0x2b2720,
	text: 0xf6ecd6,
	muted: 0xc9bc9f,
	gold: 0xffd54a,
	goldShadow: 0x6b4a12,
	shadow: 0x2a2116,
	greenShadow: 0x2c6e3f,
	ribbonShadow: 0x8a5a24,
	bad: 0xff9d82,
	white: 0xffffff,
	xp: 0x5fd07a,
	dim: 0x0c0905,
} as const

/** Declared in app/globals.css. */
export const FONT = 'BubblegumSans'

const GUI = [
	'background',
	'popup_bg',
	'message_frame_default',
	'title_rabel',
	'btn_green',
	'btn_item_green',
	'btn_position_green',
	'btn_remove_green',
	'btn_help_green',
	'btn_ff_green',
	'btn_toggle_off',
	'switch_bg',
	'slot_default',
	'slot_lock',
	'icon_score_coin',
	'icon_star',
] as const

export type GuiName = (typeof GUI)[number]
export type Textures = Record<GuiName, Texture>

export const loadTextures = async (): Promise<Textures> => {
	const entries = await Promise.all(
		GUI.map(async (name) => [name, await Assets.load<Texture>(`/gui/${name}.png`)] as const)
	)
	return Object.fromEntries(entries) as Textures
}

export type FrameKind =
	| 'popup'
	| 'message'
	| 'ribbon'
	| 'buttonGreen'
	| 'pill'
	| 'tile'
	| 'tileUsed'
	| 'slotEmpty'
	| 'slotFilled'
	| 'slotRight'
	| 'slotWrong'

interface FrameStyle {
	texture: GuiName
	/** Left, top, right, bottom borders in texture pixels. */
	border: [number, number, number, number]
	/** Texture pixels to design pixels. */
	scale: number
	tint?: number
	alpha?: number
}

const all = (size: number): [number, number, number, number] => [size, size, size, size]

const FRAMES: Record<FrameKind, FrameStyle> = {
	popup: { texture: 'popup_bg', border: all(44), scale: 0.5 },
	message: { texture: 'message_frame_default', border: all(24), scale: 0.58 },
	ribbon: { texture: 'title_rabel', border: [80, 14, 80, 44], scale: 0.5 },
	buttonGreen: { texture: 'btn_green', border: all(30), scale: 0.47 },
	pill: { texture: 'switch_bg', border: all(16), scale: 0.6 },
	tile: { texture: 'btn_toggle_off', border: all(22), scale: 0.41 },
	tileUsed: { texture: 'btn_toggle_off', border: all(22), scale: 0.41, alpha: 0.28 },
	slotEmpty: { texture: 'slot_lock', border: all(34), scale: 0.21 },
	slotFilled: { texture: 'slot_default', border: all(34), scale: 0.21 },
	slotRight: { texture: 'btn_item_green', border: all(18), scale: 0.39 },
	slotWrong: { texture: 'slot_default', border: all(34), scale: 0.21, tint: 0xff8a7a },
}

/** A frame source: Pixi's ticker. */
export interface Clock {
	add(step: (deltaMS: number) => void): void
	remove(step: (deltaMS: number) => void): void
}

export const createClock = (ticker: Ticker): Clock => {
	const running = new Map<(ms: number) => void, (ticker: Ticker) => void>()
	return {
		add: (step) => {
			const run = (frame: Ticker): void => step(frame.deltaMS)
			running.set(step, run)
			ticker.add(run)
		},
		remove: (step) => {
			const run = running.get(step)
			if (!run) return
			ticker.remove(run)
			running.delete(step)
		},
	}
}

export type Ease = (t: number) => number
export const easeOutCubic: Ease = (t) => 1 - (1 - t) ** 3
export const easeOutBack: Ease = (t) => {
	const c1 = 1.70158
	const c3 = c1 + 1
	return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
}

/** Moves `target`'s numeric fields to `to` over `ms`; resolves when they arrive. */
export const tween = (
	clock: Clock,
	target: object,
	to: Record<string, number>,
	ms: number,
	ease: Ease = easeOutCubic
): Promise<void> =>
	new Promise((resolve) => {
		const fields = target as Record<string, number>
		const keys = Object.keys(to)
		const from = Object.fromEntries(keys.map((key) => [key, fields[key] ?? 0]))
		let elapsed = 0
		const step = (deltaMS: number): void => {
			elapsed += deltaMS
			const t = ms <= 0 ? 1 : Math.min(1, elapsed / ms)
			const k = t === 1 ? 1 : ease(t)
			for (const key of keys) fields[key] = from[key] + (to[key] - from[key]) * k
			if (t < 1) return
			clock.remove(step)
			resolve()
		}
		clock.add(step)
	})

export const wait = (clock: Clock, ms: number): Promise<void> => tween(clock, { t: 0 }, { t: 1 }, ms)

export interface LabelOptions {
	size?: number
	color?: number
	/** The dark edge under the text; null for none. */
	shadow?: number | null
	wrap?: number
	lineHeight?: number
	anchorX?: number
	anchorY?: number
}

export interface Kit {
	clock: Clock
	texture(name: GuiName): Texture
	frame(kind: FrameKind, width: number, height: number): NineSliceSprite
	picture(name: GuiName, size: number): Sprite
	label(text: string, options?: LabelOptions): Text
	pressable(target: Container, onPress: () => void): Container
	button(width: number, height: number, text: string, size: number, onPress: () => void): Container
	burst(parent: Container, x: number, y: number, count?: number): void
}

/** Places `node` at `x`, `y` and returns it. */
export const at = <T extends Container>(node: T, x: number, y: number): T => {
	node.position.set(x, y)
	return node
}

/** Wraps `children` (drawn from 0, 0) in a container whose pivot is the center of `width` x `height`. */
export const centered = (width: number, height: number, ...children: Container[]): Container => {
	const body = new Container()
	body.addChild(...children)
	body.pivot.set(width / 2, height / 2)
	body.position.set(width / 2, height / 2)
	return body
}

export const createKit = (textures: Textures, clock: Clock, textResolution: number): Kit => {
	const texture = (name: GuiName): Texture => textures[name]

	const frame: Kit['frame'] = (kind, width, height) => {
		const style = FRAMES[kind]
		const [leftWidth, topHeight, rightWidth, bottomHeight] = style.border
		const sprite = new NineSliceSprite({
			texture: texture(style.texture),
			leftWidth,
			topHeight,
			rightWidth,
			bottomHeight,
		})
		sprite.width = width / style.scale
		sprite.height = height / style.scale
		sprite.scale.set(style.scale)
		if (style.tint !== undefined) sprite.tint = style.tint
		if (style.alpha !== undefined) sprite.alpha = style.alpha
		return sprite
	}

	const picture: Kit['picture'] = (name, size) => {
		const sprite = new Sprite(texture(name))
		sprite.scale.set(size / Math.max(sprite.texture.width, sprite.texture.height))
		return sprite
	}

	const label: Kit['label'] = (text, options = {}) => {
		const { size = 24, color = COLORS.text, shadow = COLORS.shadow, wrap, lineHeight, anchorX = 0, anchorY = 0 } =
			options
		const distance = Math.max(2, Math.round(size / 12))
		const node = new Text({
			text,
			resolution: textResolution,
			style: {
				fontFamily: FONT,
				fontSize: size,
				fill: color,
				...(shadow !== null && {
					dropShadow: { color: shadow, alpha: 1, angle: Math.PI / 2, blur: 0, distance },
				}),
				...(wrap !== undefined && { wordWrap: true, wordWrapWidth: wrap }),
				...(lineHeight !== undefined && { lineHeight }),
			},
		})
		node.anchor.set(anchorX, anchorY)
		// Pixi counts the shadow's distance into the text's width although it only drops down
		if (shadow !== null) node.pivot.x = -anchorX * distance
		return node
	}

	const pressable: Kit['pressable'] = (target, onPress) => {
		target.eventMode = 'static'
		target.cursor = 'pointer'
		let down = false
		target.on('pointerdown', () => {
			down = true
			void tween(clock, target.scale, { x: 0.93, y: 0.93 }, 70)
		})
		const release = (): void => {
			if (!down) return
			down = false
			void tween(clock, target.scale, { x: 1, y: 1 }, 220, easeOutBack)
		}
		target.on('pointerup', release)
		target.on('pointerupoutside', release)
		target.on('pointercancel', release)
		target.on('pointertap', onPress)
		return target
	}

	const button: Kit['button'] = (width, height, text, size, onPress) => {
		const title = label(text, { size, color: COLORS.white, shadow: COLORS.greenShadow, anchorX: 0.5, anchorY: 0.5 })
		const body = centered(width, height, frame('buttonGreen', width, height), at(title, width / 2, height / 2 - 2))
		pressable(body, onPress)
		const view = new Container()
		view.addChild(body)
		return view
	}

	/** Confetti and little stars flying out from `x`, `y`, falling and fading. */
	const burst: Kit['burst'] = (parent, x, y, count = 30) => {
		const colors = [COLORS.gold, COLORS.text, COLORS.xp]
		const life = 900
		const layer = at(new Container(), x, y)
		parent.addChild(layer)
		const bits = Array.from({ length: count }, (_, index) => {
			let bit: Container
			if (index % 4 === 0) {
				const star = new Sprite(texture('icon_star'))
				star.anchor.set(0.5)
				star.scale.set(0.2 + (index % 3) * 0.05)
				bit = star
			} else {
				const size = 4 + (index % 3) * 2
				bit = new Graphics().roundRect(-size / 2, -size / 2, size, size, 1).fill(colors[index % colors.length])
			}
			layer.addChild(bit)
			const angle = (index / count) * Math.PI * 2 + Math.random() * 0.5
			const speed = 0.18 + Math.random() * 0.25
			return {
				bit,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed - 0.2,
				spin: (Math.random() - 0.5) * 0.02,
			}
		})
		let elapsed = 0
		const step = (ms: number): void => {
			if (layer.destroyed) return void clock.remove(step)
			elapsed += ms
			for (const piece of bits) {
				piece.vy += 0.0007 * ms
				piece.bit.x += piece.vx * ms
				piece.bit.y += piece.vy * ms
				piece.bit.rotation += piece.spin * ms
				piece.bit.alpha = Math.max(0, 1 - elapsed / life)
			}
			if (elapsed < life) return
			clock.remove(step)
			layer.destroy({ children: true })
		}
		clock.add(step)
	}

	return { clock, texture, frame, picture, label, pressable, button, burst }
}

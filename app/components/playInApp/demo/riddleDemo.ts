import { Application, Container, Graphics, Sprite } from 'pixi.js'
import {
	at,
	centered,
	COLORS,
	createClock,
	createKit,
	easeOutBack,
	FONT,
	loadTextures,
	tween,
	wait,
	type FrameKind,
	type GuiName,
} from './kit'

/**
 * The landing page's playable riddle: the mobile game's riddle screen (riddonkulous-mobile src/screens/riddle.ts)
 * with a handful of ladder riddles, drawn with Pixi on the same 390-wide column. Tap only, no saves, no sound.
 */

const WIDTH = 390
const HEIGHT = 640
const COLUMN = 354
const LEFT = 18
const TOP = 14
const SLOT_GAP = 5
const WORD_GAP = 18
const TILE_GAP = 7
const TILE_COLUMNS = 6
const TILE_HEIGHT = 56
const ITEMS_HEIGHT = 96
const CARD_PADDING = 16
const START_COINS = 228
const SOLVE_REWARD = 20
const COSTS = { reveal: 25, decoys: 40, hint: 15, skip: 60 } as const

interface DemoRiddle {
	n: number
	category: string
	riddle: string
	answer: string
	hints: string[]
	decoys: string
}

/** From the game's main ladder (same numbers as in the app). */
const RIDDLES: DemoRiddle[] = [
	{
		n: 12,
		category: 'Dad Joke',
		riddle: 'What do you call a bear with absolutely no teeth?',
		answer: 'gummy bear',
		hints: ['Without teeth, all you have left are gums.', 'A chewy candy shaped like a little animal.'],
		decoys: 'WLO',
	},
	{
		n: 37,
		category: 'Animals',
		riddle: 'I carry my home and move real slow, leaving a slimy trail wherever I go.',
		answer: 'snail',
		hints: ['I live in a spiral shell.', 'Like a slug, but with a shell.'],
		decoys: 'TUGHERO',
	},
	{
		n: 51,
		category: 'Dad Joke',
		riddle: 'What do you call a pig that practices karate?',
		answer: 'pork chop',
		hints: ['Pig meat has its own name.', 'A karate hit with the side of the hand.'],
		decoys: 'BIAT',
	},
	{
		n: 61,
		category: 'Places',
		riddle: "I'm a house that melts if you think about it too hard.",
		answer: 'igloo',
		hints: ["I'm built in the Arctic.", 'A dome house made of snow blocks.'],
		decoys: 'CEWNSAT',
	},
]

interface Tile {
	letter: string
	decoy: boolean
	removed: boolean
}

/** A fixed shuffle per riddle, so the board looks the same on every visit. */
const shuffled = <T>(items: T[], seed: number): T[] => {
	const list = [...items]
	let state = seed * 2654435761
	for (let index = list.length - 1; index > 0; index--) {
		state = (state * 1664525 + 1013904223) >>> 0
		const other = state % (index + 1)
		;[list[index], list[other]] = [list[other], list[index]]
	}
	return list
}

export interface RiddleDemo {
	destroy(): void
}

export const startRiddleDemo = async (mount: HTMLElement): Promise<RiddleDemo> => {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const app = new Application()
	await app.init({
		width: mount.clientWidth || WIDTH,
		height: mount.clientHeight || HEIGHT,
		background: COLORS.bg,
		antialias: true,
		autoDensity: true,
		resolution: Math.min(window.devicePixelRatio || 1, 3),
	})
	// The page still scrolls when a finger starts on the canvas; the demo only needs taps
	app.canvas.style.touchAction = 'pan-y'
	app.canvas.style.display = 'block'
	app.canvas.style.width = '100%'
	app.canvas.style.height = '100%'
	mount.appendChild(app.canvas)

	const [textures] = await Promise.all([loadTextures(), document.fonts.load(`24px ${FONT}`)])
	const clock = createClock(app.ticker)
	const kit = createKit(textures, clock, Math.ceil(app.renderer.resolution * 1.5))
	const { frame, label, picture, pressable } = kit

	const root = new Container()
	app.stage.addChild(root)
	const fit = (): void => {
		const width = mount.clientWidth
		const height = mount.clientHeight
		if (!width || !height) return
		app.renderer.resize(width, height)
		root.scale.set(Math.min(width / WIDTH, height / HEIGHT))
	}
	fit()
	const observer = new ResizeObserver(fit)
	observer.observe(mount)

	// The stone floor, covering the column
	const floor = new Sprite(textures.background)
	floor.scale.set(Math.max(WIDTH / floor.texture.width, HEIGHT / floor.texture.height))
	floor.position.set((WIDTH - floor.width) / 2, (HEIGHT - floor.height) / 2)
	root.addChild(floor)

	// Faint question marks drifting up behind everything, like the store art
	const marks = Array.from({ length: 9 }, (_, index) => {
		const mark = label('?', { size: 46 + (index % 4) * 22, color: COLORS.gold, shadow: null, anchorX: 0.5, anchorY: 0.5 })
		mark.alpha = 0.05 + (index % 3) * 0.015
		mark.position.set(30 + ((index * 97) % 330), (index * 151) % HEIGHT)
		mark.rotation = ((index % 5) - 2) * 0.12
		root.addChild(mark)
		return { mark, speed: 0.006 + (index % 4) * 0.003, sway: index * 1.7 }
	})
	if (!reducedMotion) {
		let time = 0
		clock.add((ms) => {
			time += ms
			for (const { mark, speed, sway } of marks) {
				mark.y -= speed * ms
				mark.x += Math.sin(time / 1900 + sway) * 0.012 * ms
				if (mark.y < -60) mark.y = HEIGHT + 60
			}
		})
	}

	const screenLayer = new Container()
	const headerLayer = new Container()
	const sheetLayer = new Container()
	root.addChild(screenLayer, headerLayer, sheetLayer)

	// The coin counter stays through every riddle
	let coins = START_COINS
	const counter = { value: coins }
	const coinIcon = new Container()
	coinIcon.addChild(at(picture('icon_score_coin', 32), -16, -16))
	const amount = label(String(coins), { size: 22, anchorY: 0.5 })
	const pill = new Container()
	pill.addChild(at(coinIcon, 16, 21), at(amount, 36, 21))
	headerLayer.addChild(at(pill, WIDTH - LEFT - 80, TOP + 4))
	const setCoins = (next: number): void => {
		coins = next
		void tween(clock, counter, { value: next }, 500)
		const step = (): void => {
			amount.text = String(Math.round(counter.value))
			if (Math.round(counter.value) === coins) clock.remove(step)
		}
		clock.add(step)
		coinIcon.scale.set(1.25)
		void tween(clock, coinIcon.scale, { x: 1, y: 1 }, 220, easeOutBack)
	}
	const shake = async (target: Container, amountX = 8, ms = 360): Promise<void> => {
		const home = target.x
		const state = { t: 0 }
		const step = (): void => {
			target.x = home + Math.sin(state.t * Math.PI * 6) * amountX * (1 - state.t)
		}
		clock.add(step)
		await tween(clock, state, { t: 1 }, ms, (t) => t)
		clock.remove(step)
		target.x = home
	}

	let current = 0

	const show = (riddleIndex: number): void => {
		current = riddleIndex
		const riddle = RIDDLES[riddleIndex % RIDDLES.length]
		screenLayer.removeChildren().forEach((child) => child.destroy({ children: true }))
		const view = new Container()
		screenLayer.addChild(view)
		view.alpha = 0
		void tween(clock, view, { alpha: 1 }, 260)

		const words = riddle.answer.toUpperCase().split(' ')
		const solution = words.join('')
		const tiles: Tile[] = shuffled(
			[
				...[...solution].map((letter) => ({ letter, decoy: false, removed: false })),
				...[...riddle.decoys].map((letter) => ({ letter, decoy: true, removed: false })),
			],
			riddle.n
		)
		const slots: (number | null)[] = solution.split('').map(() => null)
		const revealed = slots.map(() => false)
		let busy = false
		let hintsShown = 0
		let decoysRemoved = false

		// Header: the wooden ribbon
		const ribbon = new Container()
		const ribbonWidth = 186
		ribbon.addChild(
			frame('ribbon', ribbonWidth, 72),
			at(label('TRY A RIDDLE', { size: 13, color: 0xfff3d6, shadow: COLORS.ribbonShadow, anchorX: 0.5 }), ribbonWidth / 2, 7),
			at(
				label(`Riddle ${riddle.n}`, { size: 26, color: COLORS.white, shadow: COLORS.ribbonShadow, anchorX: 0.5 }),
				ribbonWidth / 2,
				19
			)
		)
		ribbon.pivot.x = ribbonWidth / 2
		view.addChild(at(ribbon, WIDTH / 2, TOP - 6))

		// The riddle card
		const text = label(riddle.riddle, { size: 23, wrap: COLUMN - CARD_PADDING * 2, lineHeight: 27 })
		const cardHeight = text.height + 52
		const card = new Container()
		card.addChild(
			frame('message', COLUMN, cardHeight),
			at(label(riddle.category.toUpperCase(), { size: 15, color: COLORS.gold }), CARD_PADDING, 12),
			at(text, CARD_PADDING, 32)
		)
		view.addChild(at(card, LEFT, TOP + 86))

		// Answer boxes, words side by side
		const letters = solution.length
		const slotWidth = Math.min(
			44,
			Math.floor((COLUMN - (letters - words.length) * SLOT_GAP - (words.length - 1) * WORD_GAP) / letters)
		)
		const slotHeight = Math.round(slotWidth * 1.22)
		const rowWidth = letters * slotWidth + (letters - words.length) * SLOT_GAP + (words.length - 1) * WORD_GAP
		const slotsRow = at(new Container(), 0, card.y + cardHeight + 18)
		view.addChild(slotsRow)
		const slotViews: Container[] = []
		let x = LEFT + (COLUMN - rowWidth) / 2
		words.forEach((word, wordIndex) => {
			for (let k = 0; k < word.length; k++) {
				const slot = new Container()
				slot.pivot.set(slotWidth / 2, slotHeight / 2)
				slot.position.set(x + slotWidth / 2, slotHeight / 2)
				const index = slotViews.length
				pressable(slot, () => clearSlot(index))
				slotsRow.addChild(slot)
				slotViews.push(slot)
				x += slotWidth + SLOT_GAP
			}
			if (wordIndex < words.length - 1) x += WORD_GAP - SLOT_GAP
		})
		const message = at(
			label('', { size: 19, color: COLORS.bad, anchorX: 0.5, wrap: COLUMN }),
			WIDTH / 2,
			slotsRow.y + slotHeight + 12
		)
		message.style.align = 'center'
		view.addChild(message)
		const say = (words: string, color: number = COLORS.bad): void => {
			message.text = words
			message.style.fill = color
			message.alpha = 0
			void tween(clock, message, { alpha: 1 }, 180)
		}

		// Items and letters, from the bottom up
		const itemsY = HEIGHT - 16 - ITEMS_HEIGHT
		const itemsLayer = at(new Container(), LEFT, itemsY)
		view.addChild(itemsLayer)
		const tileWidth = (COLUMN - (TILE_COLUMNS - 1) * TILE_GAP) / TILE_COLUMNS
		const tileRows = Math.ceil(tiles.length / TILE_COLUMNS)
		const gridY = itemsY - 16 - (tileRows * TILE_HEIGHT + (tileRows - 1) * TILE_GAP)
		const tileViews = tiles.map((_, index) => {
			const tile = new Container()
			tile.pivot.set(tileWidth / 2, TILE_HEIGHT / 2)
			tile.position.set(
				LEFT + (index % TILE_COLUMNS) * (tileWidth + TILE_GAP) + tileWidth / 2,
				gridY + Math.floor(index / TILE_COLUMNS) * (TILE_HEIGHT + TILE_GAP) + TILE_HEIGHT / 2
			)
			pressable(tile, () => pickTile(index))
			view.addChild(tile)
			return tile
		})

		const fill = (target: Container, kind: FrameKind, width: number, height: number, letter: string, shadow: number): void => {
			target.removeChildren().forEach((child) => child.destroy())
			target.addChild(frame(kind, width, height))
			if (!letter) return
			target.addChild(
				at(
					label(letter, { size: Math.round(height * 0.6), color: COLORS.white, shadow, anchorX: 0.5, anchorY: 0.5 }),
					width / 2,
					height / 2 - 1
				)
			)
		}
		const drawSlot = (index: number, kind?: FrameKind): void => {
			const tile = slots[index]
			const letter = tile === null ? '' : tiles[tile].letter
			const look = kind ?? (revealed[index] ? 'slotRight' : tile === null ? 'slotEmpty' : 'slotFilled')
			fill(slotViews[index], look, slotWidth, slotHeight, letter, look === 'slotRight' ? COLORS.greenShadow : COLORS.shadow)
		}
		const drawTile = (index: number): void => {
			const tile = tiles[index]
			const used = slots.includes(index)
			tileViews[index].visible = !tile.removed
			fill(tileViews[index], used ? 'tileUsed' : 'tile', tileWidth, TILE_HEIGHT, used ? '' : tile.letter, COLORS.shadow)
		}
		const draw = (): void => {
			slots.forEach((_, index) => drawSlot(index))
			tiles.forEach((_, index) => drawTile(index))
		}
		const pop = (target: Container): void => {
			target.scale.set(0.7)
			void tween(clock, target.scale, { x: 1, y: 1 }, 240, easeOutBack)
		}

		const solved = async (): Promise<void> => {
			busy = true
			say('')
			for (let index = 0; index < slotViews.length; index++) {
				drawSlot(index, 'slotRight')
				pop(slotViews[index])
				await wait(clock, 55)
			}
			kit.burst(view, WIDTH / 2, slotsRow.y + slotHeight / 2, 34)
			setCoins(coins + SOLVE_REWARD)
			await wait(clock, 750)
			if (view.destroyed) return
			showSolved(riddle)
		}

		const check = (): void => {
			if (slots.some((tile) => tile === null)) return
			const guess = slots.map((tile) => tiles[tile as number].letter).join('')
			if (guess === solution) return void solved()
			busy = true
			slots.forEach((_, index) => revealed[index] || drawSlot(index, 'slotWrong'))
			say('Not quite. Tap a letter to take it back.')
			void shake(slotsRow).then(() => {
				if (view.destroyed) return
				busy = false
				draw()
			})
		}

		const pickTile = (index: number): void => {
			if (busy || tiles[index].removed || slots.includes(index)) return
			const free = slots.indexOf(null)
			if (free === -1) return
			slots[free] = index
			draw()
			pop(slotViews[free])
			check()
		}
		const clearSlot = (index: number): void => {
			if (busy || revealed[index] || slots[index] === null) return
			slots[index] = null
			say('')
			draw()
		}

		/** Takes `cost` coins, or says where coins come from. */
		const pay = (cost: number): boolean => {
			if (coins >= cost) {
				setCoins(coins - cost)
				return true
			}
			say('Not enough coins. In the app every solved riddle pays.')
			void shake(pill, 5)
			return false
		}
		const reveal = (): void => {
			const target = slots.findIndex((tile, index) => !revealed[index] && (tile === null || tiles[tile].letter !== solution[index]))
			if (busy || target === -1 || !pay(COSTS.reveal)) return
			const wanted = solution[target]
			slots[target] = null
			// A free tile with that letter, else one sitting in a wrong box
			let tile = tiles.findIndex((entry, index) => !entry.decoy && entry.letter === wanted && !slots.includes(index))
			if (tile === -1) {
				const from = slots.findIndex((entry, index) => entry !== null && !revealed[index] && tiles[entry].letter === wanted)
				tile = slots[from] as number
				slots[from] = null
			}
			slots[target] = tile
			revealed[target] = true
			say('')
			draw()
			pop(slotViews[target])
			check()
		}
		const removeDecoys = (): void => {
			if (busy || decoysRemoved || !pay(COSTS.decoys)) return
			decoysRemoved = true
			tiles.forEach((tile, index) => {
				if (!tile.decoy) return
				tile.removed = true
				const slot = slots.indexOf(index)
				if (slot !== -1) slots[slot] = null
			})
			say('')
			draw()
			drawItems()
		}
		const hint = (): void => {
			if (busy || hintsShown >= riddle.hints.length || !pay(COSTS.hint)) return
			say(riddle.hints[hintsShown], COLORS.text)
			hintsShown += 1
			drawItems()
		}
		const skip = (): void => {
			if (busy || !pay(COSTS.skip)) return
			busy = true
			show(current + 1)
		}

		const item = (icon: GuiName, name: string, cost: string, width: number, enabled: boolean, onPress: () => void): Container => {
			const price = label(cost, { size: 16, anchorY: 0.5 })
			const pillWidth = 30 + price.width
			const costPill = new Container()
			costPill.addChild(frame('pill', pillWidth, 24), at(picture('icon_score_coin', 18), 4, 3), at(price, 25, 12))
			const body = centered(
				width,
				ITEMS_HEIGHT,
				at(picture(icon, 52), width / 2 - 26, 0),
				at(label(name, { size: 17, anchorX: 0.5 }), width / 2, 50),
				at(costPill, width / 2 - pillWidth / 2, 72)
			)
			if (enabled) pressable(body, onPress)
			else body.alpha = 0.4
			const holder = new Container()
			holder.addChild(body)
			return holder
		}
		const drawItems = (): void => {
			itemsLayer.removeChildren().forEach((child) => child.destroy({ children: true }))
			const width = (COLUMN - 3 * TILE_GAP) / 4
			const hintsLeft = hintsShown < riddle.hints.length
			const items = [
				item('btn_position_green', 'Reveal', String(COSTS.reveal), width, true, reveal),
				item('btn_remove_green', 'Decoys', decoysRemoved ? 'used' : String(COSTS.decoys), width, !decoysRemoved, removeDecoys),
				item('btn_help_green', 'Hint', hintsLeft ? String(COSTS.hint) : 'open', width, hintsLeft, hint),
				item('btn_ff_green', 'Skip', String(COSTS.skip), width, true, skip),
			]
			items.forEach((entry, index) => itemsLayer.addChild(at(entry, index * (width + TILE_GAP), 0)))
		}

		draw()
		drawItems()
	}

	/** The result sheet over the solved riddle. */
	const showSolved = (riddle: DemoRiddle): void => {
		const PANEL = 318
		const PANEL_HEIGHT = 352
		const sheet = new Container()
		sheetLayer.addChild(sheet)
		const shade = new Graphics().rect(0, 0, WIDTH, HEIGHT).fill({ color: COLORS.dim, alpha: 0.62 })
		shade.eventMode = 'static'
		shade.alpha = 0
		void tween(clock, shade, { alpha: 1 }, 200)
		const content = new Container()
		content.addChild(frame('popup', PANEL, PANEL_HEIGHT))
		content.addChild(at(label('SOLVED!', { size: 38, color: COLORS.gold, shadow: COLORS.goldShadow, anchorX: 0.5 }), PANEL / 2, 26))
		const stars = [-1, 0, 1].map((offset) => {
			const size = offset === 0 ? 62 : 50
			const star = picture('icon_star', size)
			star.anchor.set(0.5)
			star.position.set(PANEL / 2 + offset * 66, offset === 0 ? 112 : 120)
			star.rotation = offset * 0.16
			const full = star.scale.x
			star.scale.set(0)
			content.addChild(star)
			return { star, full }
		})
		content.addChild(
			at(label(riddle.answer.toUpperCase(), { size: 26, anchorX: 0.5 }), PANEL / 2, 160),
			at(label(`+${SOLVE_REWARD} coins`, { size: 20, color: COLORS.gold, shadow: COLORS.goldShadow, anchorX: 0.5 }), PANEL / 2, 194),
			at(label('The ladder goes on in the app.', { size: 17, color: COLORS.muted, anchorX: 0.5 }), PANEL / 2, 224)
		)
		const next = kit.button(PANEL - 56, 60, 'Next riddle', 28, () => {
			sheet.destroy({ children: true })
			show(current + 1)
		})
		content.addChild(at(next, 28, PANEL_HEIGHT - 60 - 28))
		const panel = centered(PANEL, PANEL_HEIGHT, content)
		panel.position.set(WIDTH / 2, HEIGHT / 2)
		panel.scale.set(0.6)
		sheet.addChild(shade, panel)
		void tween(clock, panel.scale, { x: 1, y: 1 }, 320, easeOutBack)
		void (async () => {
			await wait(clock, 280)
			for (const { star, full } of stars) {
				if (sheet.destroyed) return
				void tween(clock, star.scale, { x: full, y: full }, 300, easeOutBack)
				kit.burst(content, star.x, star.y, 10)
				await wait(clock, 200)
			}
		})()
	}

	show(0)

	return {
		destroy: () => {
			observer.disconnect()
			// The textures stay cached for the next mount
			app.destroy({ removeView: true }, { children: true })
		},
	}
}

/**
 * Local (device-side) count of riddles the visitor has solved.
 *
 * Used to decide when to ask for an app rating — see `RateAppModalProvider`.
 * Nothing here talks to reddicore: the count is deliberately per-device, so a
 * signed-out visitor still accumulates one.
 *
 * Solves are stored as a list of postIds rather than a plain integer so that
 * re-solving the same riddle (revisiting a page, replaying an adventure) does
 * not inflate the count. The list stops growing once the threshold is reached,
 * so it holds at most SOLVE_THRESHOLD entries.
 */

const SOLVED_KEY = 'riddonkulous:solvedPostIds'

/** Solves required before we ask the user to rate the app. */
export const SOLVE_THRESHOLD = 3

/** Fired on the window the moment the visitor's solve count reaches the threshold. */
export const SOLVE_THRESHOLD_EVENT = 'riddonkulous:solveThresholdReached'

const readSolvedIds = (): string[] => {
	try {
		const raw = window.localStorage.getItem(SOLVED_KEY)
		if (!raw) return []
		const parsed: unknown = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
	} catch {
		// Unavailable (private mode) or corrupt JSON — treat as no solves.
		return []
	}
}

export const getSolveCount = (): number => {
	if (typeof window === 'undefined') return 0
	return readSolvedIds().length
}

/**
 * Record a solved riddle. Ignores duplicates and reveals (callers must not
 * call this when the answer was revealed rather than guessed).
 *
 * Dispatches SOLVE_THRESHOLD_EVENT exactly once — on the solve that reaches
 * SOLVE_THRESHOLD — so the rating prompt can react without this module
 * needing to know anything about modals.
 */
export const recordSolve = (postId: string): void => {
	if (typeof window === 'undefined' || !postId) return

	const solved = readSolvedIds()
	// Already at the threshold: the count has served its purpose, stop writing.
	if (solved.length >= SOLVE_THRESHOLD || solved.includes(postId)) return

	solved.push(postId)

	try {
		window.localStorage.setItem(SOLVED_KEY, JSON.stringify(solved))
	} catch {
		// Can't persist — still fire the event so this session isn't a dead end.
	}

	if (solved.length >= SOLVE_THRESHOLD) {
		window.dispatchEvent(new CustomEvent(SOLVE_THRESHOLD_EVENT))
	}
}

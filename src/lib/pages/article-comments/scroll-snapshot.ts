import type { Snapshot } from '@sveltejs/kit'

/** Height of the fixed app bar (`h-12`) that covers the top of the page */
export const APPBAR_HEIGHT = 48

/** Comment at the top of the viewport and how far its top is from the app bar */
export type CommentsScrollAnchor = { id: string; offset: number }
type ScrollRestorer = (anchor: CommentsScrollAnchor) => void

let restorer: ScrollRestorer | undefined
let pendingAnchor: CommentsScrollAnchor | undefined

const captureAnchor = (): CommentsScrollAnchor | null => {
	const sections = document.querySelectorAll<HTMLElement>('section[data-comment-id]')
	for (const section of sections) {
		const rect = section.getBoundingClientRect()
		// Skip collapsed (hidden) comments
		if (rect.height === 0) continue
		if (rect.bottom > APPBAR_HEIGHT) {
			return { id: section.dataset.commentId!, offset: rect.top - APPBAR_HEIGHT }
		}
	}
	return null
}

/**
 * Comments are rendered progressively, so when SvelteKit restores the scroll
 * position (on reload or back/forward) the page is still too short and the
 * position gets clamped. Remember which comment was on top instead and scroll
 * back to it once the comments page has rendered up to that comment.
 *
 * Export it as `snapshot` from the comments route's `+page.svelte`.
 */
export const commentsSnapshot: Snapshot<CommentsScrollAnchor | null> = {
	capture: captureAnchor,
	restore: (anchor) => {
		if (!anchor) return
		if (restorer) restorer(anchor)
		// Comments are still loading, restore once the page mounts
		else pendingAnchor = anchor
	}
}

/** Called by the comments page on mount, returns an unregister function */
export const registerScrollRestorer = (fn: ScrollRestorer) => {
	restorer = fn
	if (pendingAnchor) {
		const anchor = pendingAnchor
		pendingAnchor = undefined
		fn(anchor)
	}

	return () => {
		if (restorer === fn) restorer = undefined
		pendingAnchor = undefined
	}
}

import { onNavigate } from '$app/navigation'
import type { OnNavigate } from '@sveltejs/kit'

const SLIDE_OFFSET = 32

class Transitions {
	pageConfig = [
		this.makePageConfig('/articles/[...params]', 'slide-left', '/articles/[id]', 'slide-left'),
		this.makePageConfig(
			'/articles/[...params]',
			'slide-left',
			'/companies/[alias]/articles/[id]',
			'slide-left'
		)
	]

	makePageConfig(
		sourceRouteId: string,
		sourceAnimation: string,
		targetRouteId: string,
		targetAnimation: string
	) {
		function getAnimation(name: string) {
			if (name == 'fade') {
				return {
					enter: { name: 'fade-in' },
					leave: { name: 'fade-out' }
				}
			}
			if (name == 'slide-left') {
				return {
					enter: { name: 'slide-in-from-left' },
					leave: { name: 'slide-out-to-left' }
				}
			}
		}
		return {
			source: {
				route: { id: sourceRouteId },
				...getAnimation(sourceAnimation)
			},
			target: {
				route: { id: targetRouteId },
				...getAnimation(targetAnimation)
			}
		}
	}

	onNavigateViewTransition() {
		onNavigate((navigation) => {
			const transitionConfig = this.getTransitionConfig(navigation)

			// If there is no transition config for this navigation, do nothing.
			if (!transitionConfig) return

			return new Promise((resolve) => {
				const viewTransition = document.startViewTransition(async () => {
					resolve()
					await navigation.complete
				})
				// Wait until the new page has been created in the DOM.
				viewTransition.ready.then(() => this.performViewTransition(transitionConfig))
			})
		})
	}

	getTransitionConfig(navigation: OnNavigate) {
		// If view transitions are not available, do nothing.
		if (!document.startViewTransition) return

		// Try to find a matching page configuration for current navigation routes.
		for (const config of this.pageConfig) {
			// If going from source to target, direction is entering.
			if (
				config.source.route.id == navigation.from?.route.id &&
				config.target.route.id == navigation.to?.route.id
			) {
				return { ...config, direction: 'entering' }
			}
			// If going from target to source, direction is leaving.
			if (
				config.source.route.id == navigation.to?.route.id &&
				config.target.route.id == navigation.from?.route.id
			) {
				return { ...config, direction: 'leaving' }
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	performViewTransition(config: { direction: any; source: any; target: any }) {
		if (config.direction == 'entering') {
			// this.animatePage(config.source.leave, 'old')
			// this.animatePage(config.target.enter, 'new', true)
			this.animatePage({ name: 'slide-out-to-right' }, 'old', true)
			this.animatePage({ name: 'slide-in-from-right' }, 'new')
		}
		if (config.direction == 'leaving') {
			// this.animatePage(config.target.leave, 'old', true)
			// this.animatePage(config.source.enter, 'new')
			this.animatePage({ name: 'slide-out-to-left', leaving: true }, 'old')
			this.animatePage({ name: 'slide-in-from-left', leaving: true }, 'new', true)
		}
	}

	animatePage(animation: { name: string; leaving?: boolean }, el: 'old' | 'new', onTop?: boolean) {
		let keyframes: Keyframe[] = []
		const options: KeyframeAnimationOptions = {
			easing: 'cubic-bezier(0.2, 0, 0, 1)',
			duration: 300,
			fill: 'none',
			composite: 'replace',
			pseudoElement: `::view-transition-${el}(root)`
		}

		if (animation.name == 'fade-in') {
			keyframes = [{ opacity: '0' }, { opacity: '1' }]
		}
		if (animation.name == 'fade-out') {
			keyframes = [{ opacity: '1' }, { opacity: '0' }]
		}
		if (animation.name == 'slide-in-from-left') {
			keyframes = [
				{ transform: `translate(-${SLIDE_OFFSET}px)`, opacity: 0 },
				{ transform: 'translate(0)', opacity: 1 }
			]
		}
		if (animation.name == 'slide-out-to-left') {
			keyframes = [
				{ transform: 'translate(0)', opacity: 1 },
				{ transform: `translate(${SLIDE_OFFSET}px)`, opacity: 0 }
			]
		}
		if (animation.name == 'slide-in-from-right') {
			keyframes = [
				{ transform: `translate(${SLIDE_OFFSET}px)`, opacity: 0 },
				{ transform: 'translate(0)', opacity: 1 }
			]
		}
		if (animation.name == 'slide-out-to-right') {
			keyframes = [
				{ transform: 'translate(0)', opacity: 1 },
				{ transform: `translate(-${SLIDE_OFFSET}px)`, opacity: 0 }
			]
		}

		if (onTop) {
			keyframes[0].zIndex = '1000'
			keyframes[1].zIndex = '1000'
		}

		document.documentElement.animate(keyframes, options)
	}
}

const transitions = new Transitions()
export default transitions

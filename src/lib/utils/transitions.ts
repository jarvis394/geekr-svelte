import type {
	SveltekitViewTransitionEventsMap,
	SveltekitViewTransitionEvents,
	OnOptions
} from 'sveltekit-view-transition'

export const classes = (
	toAdd:
		| string[]
		| ((
				props: SveltekitViewTransitionEventsMap['before-start-view-transition']
		  ) => string[] | undefined),
	on: <T extends SveltekitViewTransitionEvents>(
		event: T,
		callback: (props: SveltekitViewTransitionEventsMap[T]) => void,
		{ registerDuringTransition, autoWrap, autoClean }?: OnOptions
	) => (wrap?: boolean) => void,
	autoWrap = true
) => {
	let classes: string[] | undefined
	const offTransitionFinished = on(
		'transition-finished',
		() => {
			if (classes && classes.length > 0) {
				document.documentElement.classList.remove(...classes)
			}
		},
		{
			registerDuringTransition: false,
			autoWrap
		}
	)
	// This runs after 'transition-finished' event when view transition is already running
	on(
		'transition-ready',
		(navigation) => {
			classes = Array.isArray(toAdd) ? toAdd : toAdd(navigation)
			if (classes) {
				document.documentElement.classList.add(...classes)
			} else {
				offTransitionFinished(true)
			}
		},
		{
			registerDuringTransition: true,
			autoWrap
		}
	)
}

import { createSignal, on, createEffect, createRoot } from "solid-js"

function createAccordian() {
	const [ref, panelRef] = createSignal<HTMLElement | undefined>(undefined)
	const [prevHeight, setPrevHeight] = createSignal(0)
	const getHeight = (ele: HTMLElement): number => {
		const rect = ele.getBoundingClientRect()
		for (var i in rect) {
			if (i === "height") {
				return rect[i]
			}
		}
		return 0
	}
	let height: number
	const [animationState, setAnimationState] = createSignal<
		| "expanded"
		| "expanding"
		| "collapsing"
		| "collapsed"
		| "removing"
		| "removed"
		| "adding"
		| "added"
	>("")

	createEffect(
		on(animationState, () => {
			if (ref())
				switch (animationState()) {
					case "expanding":
						ref().style.display = ""
						height = getHeight(ref())
						ref().style.height = `0px`
						ref().style.overflowY = "hidden"
						let expandingAnim = ref().animate(
							{
								height: [`${height}px`],
							},
							{
								fill: "forwards",
								duration: 100,
								easing: "ease-out",
							}
						)
						expandingAnim.onfinish = () => {
							expandingAnim.commitStyles()
							ref().style.height = `auto`
							ref().style.overflowY = ""
							expandingAnim.cancel()
							setAnimationState("expanded")
						}
						break
					case "expanded":
						setPrevHeight(getHeight(ref()))
						console.log("Animation is ", animationState())
						break
					case "collapsing":
						ref().style.overflowY = "hidden"
						height = getHeight(ref())
						let collapsinganim = ref().animate(
							{
								height: [`${height}px`, `0px`],
							},
							{
								duration: 100,
								easing: "ease-out",
							}
						)
						collapsinganim.onfinish = () => {
							collapsinganim.commitStyles()
							ref().style.display = "none"
							ref().style.height = `auto`
							collapsinganim.cancel()
							setAnimationState("collapsed")
						}
						break
					case "collapsed":
						console.log("Animation is ", animationState())
						break
					case "adding":
						console.log("Animation is ", animationState())
						height = getHeight(ref())
						if (height === 0) {
							ref().style.height = `0px`
						}
						ref().style.overflowY = "hidden"
						let addingAnim = ref().animate(
							{
								height: [`${prevHeight()}px`, `${height}px`],
							},
							{
								fill: "forwards",
								duration: 100,
								easing: "ease-out",
							}
						)
						addingAnim.onfinish = () => {
							addingAnim.commitStyles()
							ref().style.height = `auto`
							ref().style.overflowY = ""
							addingAnim.cancel()
							// setAnimationState("added");
							setAnimationState("expanded")
						}
						break
					case "added":
						setPrevHeight(getHeight(ref()))
						break
					case "removing":
						console.log("Animation is ", animationState())
						height = getHeight(ref())
						if (height === 0) {
							ref().style.height = `0px`
						}
						ref().style.overflowY = "hidden"
						let removingAnim = ref().animate(
							{
								height: [`${prevHeight()}px`, `${height}px`],
							},
							{
								fill: "forwards",
								duration: 100,
								easing: "ease-out",
							}
						)
						removingAnim.onfinish = () => {
							removingAnim.commitStyles()
							ref().style.height = `auto`
							ref().style.overflowY = ""
							removingAnim.cancel()
							// setAnimationState("added");
							setAnimationState("expanded")
						}
						break
					case "removed":
						setPrevHeight(getHeight(ref()))
						break
					default:
						break
				}
		})
	)
	return { panelRef, animationState, setAnimationState }
}

export default () => createRoot(createAccordian)

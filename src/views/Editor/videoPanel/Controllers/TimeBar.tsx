// TimeBarContainer
// TimeBar
// TimeBarItem

import { createMemo, createReaction, createUniqueId, onCleanup } from "solid-js"

import colors from "@/ui2/helpers/colors"
import Split from "split.js"

import { createStore, produce } from "solid-js/store"

export type BarDetailsOptions = {
	name: string
	color?: string
	id?: string
	element?: any
	progressStamps: [number, number]
}

const colors_circular_iter = () => {
	let count = -1
	return () => {
		count += 1
		if (count >= colors.length) count = 0
		return colors[count][1]
	}
}

export const colorsIter = colors_circular_iter()

export const [barDetails, setBarDetails] = createStore<BarDetailsOptions[]>([])

export let triggerBarDetailsUpdate: (
	tracking: () => void // TimeBar
) => void

export const addBarItem = (details: BarDetailsOptions) => {
	setBarDetails(
		produce((bars) => {
			if (bars) {
				bars.push({
					id: createUniqueId(),
					element: document.createElement("div"),
					color: colorsIter(),
					...details,
				})
			}
		})
	)
}

export const updateProgressStamps = ({
	id,
	progressStamps,
}: {
	id: string
	progressStamps: [number, number]
}) => {
	setBarDetails((bar) => bar.id === id, "progressStamps", progressStamps)
}

export const removeBarItem = (id: string) => {
	setBarDetails((bars) => {
		const newArr = [...bars]
		newArr.splice(
			newArr.findIndex((i) => i.id === id),
			1
		)
		return newArr
	})
}

export const TimeBarsContainer = () => {
	let container: HTMLDivElement

	const progressStampsArr = createMemo(() => {
		let progressStamps: {
			timestamp: number
			color: string
		}[] = [
			{
				timestamp: 0,
				color: "#FFF",
			},
		]

		for (let index = 0; index < barDetails.length; index++) {
			const details = barDetails[index]
			if (progressStamps[index])
				progressStamps = [
					...progressStamps,
					{
						color: details.color,
						timestamp: details.progressStamps[0],
					},
					{
						color: details.color,
						timestamp: details.progressStamps[1],
					},
				]
		}

		function compare(
			a: { timestamp: number; color: string },
			b: { timestamp: number; color: string }
		) {
			return a.timestamp - b.timestamp
		}

		progressStamps.sort(compare)
		progressStamps = [
			...progressStamps,
			{
				timestamp: 1,
				color: "#FFF",
			},
		]
		return progressStamps
	})

	const sizes = createMemo(() => {
		let sizes: {
			size: number
			color: string
		}[] = []
		// progressStamps 0 0.1 0.3 0.7 1
		// sizes 10 20 40 30
		// 10/100 , 10+20/100 , 10+20+40/100, 10+
		progressStampsArr().reduce((p, v, i) => {
			sizes.push({
				size: (v.timestamp - p.timestamp) * 100,
				color: i % 2 === 0 ? v.color : "#FFF",
			})
			return v
		})
		return sizes
	})

	const getProgressStampsFromSize = (sizes: number[]) => {
		let progressStamps: number[] = []
		sizes.reduce((t, v) => {
			progressStamps.push((v + t) / 100)
			return v + t
		}, 0)
		return progressStamps
	}
	// onMount(() => {
	// 	container.addEventListener("dblclick", (e) => {
	// 		let { width, x } = container.getBoundingClientRect()
	// 		let xPos = e.x - x
	// 		addBarItem({
	// 			name: "a",
	// 			color: colorsIter(),
	// 			progressStamps: [xPos / width - 0.05, xPos / width + 0.05],
	// 		})
	// 	})
	// })
	triggerBarDetailsUpdate = createReaction(() => {
		console.log("RUNNING")
		const elements: HTMLDivElement[] = []
		let elementsizes: number[] = []
		sizes().forEach((size) => {
			let i = barDetails.findIndex((e) => e.color === size.color)
			const div = barDetails[i]?.element || document.createElement("div")
			div.setAttribute(
				"class",
				"w-full text-white h-full truncate flex items-center pl-2 focus:outline-none"
			)
			div.style.backgroundColor = size.color
			div.innerText = barDetails[i]?.name || ""
			div.style.color = "#FFF"
			container.appendChild(div)
			elements.push(div)
			elementsizes.push(size.size)
		})
		let a = Split(elements, {
			direction: "horizontal",
			gutterSize: 0,
			sizes: elementsizes,
			snapOffset: 0,
			minSize: 0,
			cursor: "w-resize",
			elementStyle: (dimension, size, gutterSize) => {
				if (size < 0.5) size = 0
				return {
					"flex-basis": "calc(" + size + "%)",
				}
			},
			gutterStyle: (dimension, gutterSize) => ({
				"flex-basis": gutterSize + "px",
			}),
			onDrag: (e) => {
				let progressStamps = getProgressStampsFromSize(e)
				let count = 0
				barDetails.forEach((e, i) => {
					updateProgressStamps({
						id: e?.id,
						progressStamps: [progressStamps[count], progressStamps[count + 1]],
					})
					count += 2
				})
			},
		})
		onCleanup(() => {
			elements.forEach((element) => {
				element.remove()
			})
			a.destroy()
		})
	})
	return (
		<section class="w-full border-y-2 pl-2">
			<div
				ref={(el) => (container = el)}
				class="flex flex-row w-full h-8"
			></div>
		</section>
	)
}

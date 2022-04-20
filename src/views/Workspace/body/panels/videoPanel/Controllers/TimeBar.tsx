// reimplement TimeBar with new API for Backend API

/**
  video_instance_id: string
	prefix_time_marker_start: string
	prefix_time_marker_end: string
	suffix_time_marker_start: string
	suffix_time_marker_end: string
	audio_variable_name: string
	variable_time_marker_start: string
	variable_time_marker_end: string
 */

// TimeBarContainer
// TimeBar
// TimeBarItem

import {
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	mapArray,
	on,
	onCleanup,
	onMount,
} from "solid-js"
import colors from "@/ui/helpers/colors"
import Split from "split.js"

type BarDetailsOptions = {
	name: string
	color: string
	id?: string
	element?: HTMLDivElement
	timestamps: [number, number]
}

const colors_circular_iter = () => {
	let count = -1
	return () => {
		count += 1
		if (count >= colors.length) count = 0
		return colors[count][1]
	}
}

const colorsIter = colors_circular_iter()

export const TimeBarsContainer = () => {
	let container: HTMLDivElement
	const [barDetails, setBarDetails] = createSignal<BarDetailsOptions[]>([
		{
			color: colorsIter(),
			name: "name",
			id: createUniqueId(),
			element: document.createElement("div"),
			timestamps: [0.1, 0.3],
		},
		{
			color: colorsIter(),
			name: "class",
			id: createUniqueId(),
			element: document.createElement("div"),
			timestamps: [0.4, 0.7],
		},
	])

	const mapped = mapArray(barDetails, (barModel) => {
		const [name, setName] = createSignal(barModel.name)
		const [timestamps, setTimestamps] = createSignal(barModel.timestamps)
		return {
			id: barModel.id,
			color: barModel.color,
			element: barModel.element,
			get name() {
				return name()
			},
			get timestamps() {
				return timestamps()
			},
			setName,
			setTimestamps,
		}
	})

	const timestampsArr = createMemo(() => {
		let timestamps: {
			timestamp: number
			color: string
		}[] = [
			{
				timestamp: 0,
				color: "#FFF",
			},
		]

		for (let index = 0; index < mapped().length; index++) {
			const details: BarDetailsOptions = mapped()[index]
			if (timestamps[index])
				timestamps = [
					...timestamps,
					{
						color: details.color,
						timestamp: details.timestamps[0],
					},
					{
						color: details.color,
						timestamp: details.timestamps[1],
					},
				]
		}

		function compare(
			a: { timestamp: number; color: string },
			b: { timestamp: number; color: string }
		) {
			return a.timestamp - b.timestamp
		}

		timestamps.sort(compare)
		timestamps = [
			...timestamps,
			{
				timestamp: 1,
				color: "#FFF",
			},
		]
		return timestamps
	})

	const addBarItem = (details: BarDetailsOptions) => {
		const div = document.createElement("div")
		setBarDetails((barDetails) => {
			barDetails = [
				...barDetails,
				{
					id: createUniqueId(),
					element: div,
					...details,
				},
			]
			return barDetails
		})
	}

	const removeBarItem = (id: string) => {
		setBarDetails((barDetails) => {
			const newArr = [...barDetails]
			newArr.splice(
				newArr.findIndex((i) => i.id === id),
				1
			)
			return newArr
		})
	}

	const sizes = createMemo(() => {
		let sizes: {
			size: number
			color: string
		}[] = []
		// timestamps 0 0.1 0.3 0.7 1
		// sizes 10 20 40 30
		// 10/100 , 10+20/100 , 10+20+40/100, 10+
		timestampsArr().reduce((p, v, i) => {
			sizes.push({
				size: (v.timestamp - p.timestamp) * 100,
				color: i % 2 === 0 ? v.color : "#FFF",
			})
			return v
		})
		return sizes
	})

	const getTimestampsFromSize = (sizes: number[]) => {
		let timestamps: number[] = []
		sizes.reduce((t, v) => {
			timestamps.push((v + t) / 100)
			return v + t
		}, 0)
		return timestamps
	}
	onMount(() => {
		container.addEventListener("dblclick", (e) => {
			let { width, x } = container.getBoundingClientRect()
			let xPos = e.x - x
			addBarItem({
				name: "a",
				color: colorsIter(),
				timestamps: [xPos / width - 0.05, xPos / width + 0.05],
			})
		})
	})
	createEffect(
		on(barDetails, () => {
			const elements: HTMLDivElement[] = []
			let elementsizes: number[] = []
			const setN = (index: number, text: string) => () =>
				mapped()[index].setName(text)
			sizes().forEach((size) => {
				let i = mapped().findIndex((e) => e.color === size.color)
				const div = mapped()[i]?.element || document.createElement("div")
				div.setAttribute("contenteditable", "true")
				div.setAttribute(
					"class",
					"w-full text-white h-full truncate flex items-center pl-2 focus:outline-none"
				)
				div.style.backgroundColor = size.color
				div.style.color = "#FFF"
				// 1. Listen for changes of the contenteditable element
				div.addEventListener("input", setN(i, div.innerText))
				container.appendChild(div)
				elements.push(div)
				elementsizes.push(size.size)
			})
			let a = Split(elements, {
				direction: "horizontal",
				gutterSize: 4,
				sizes: elementsizes,
				snapOffset: 0,
				minSize: 0,
				onDrag: (e) => {
					let timestamps = getTimestampsFromSize(e)
					let count = 0
					mapped().forEach((e, i) => {
						e.setTimestamps([timestamps[count], timestamps[count + 1]])
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
	)
	return (
		<section class="w-full border-y-2 pl-2">
			<div
				ref={(el) => (container = el)}
				class="flex flex-row w-full h-8"
			></div>
		</section>
	)
}

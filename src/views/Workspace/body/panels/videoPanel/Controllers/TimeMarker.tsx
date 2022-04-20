import { Accessor, createEffect, createSignal, on, onCleanup } from "solid-js"

export const TimeMarker = (props: {
	prog: Accessor<number>
	progFunc: (a: number) => void
}) => {
	const [isMarkerGrabed, setMarkerGrabedState] = createSignal<boolean>()
	// container for the time marker
	let containerRef: HTMLDivElement
	// time marker itself
	let markerRef: HTMLDivElement

	const handleDrag = () => {
		setMarkerGrabedState(true)
	}

	const handleMouseDown = (e: MouseEvent) => {
		if (e.clientX - containerRef.offsetLeft > markerRef.offsetWidth / 2) {
			const newXPos: number = e.clientX - containerRef.offsetLeft
			const newMarkerPos: number = newXPos - markerRef.offsetWidth / 2
			props.progFunc(
				(newMarkerPos /
					(containerRef.offsetWidth - markerRef.offsetWidth / 2)) *
					100
			)
			markerRef.animate(
				{
					left: [`${newMarkerPos}px`],
				},
				{
					duration: 300,
					fill: "forwards",
				}
			)
			// markerRef.style.left = newMarkerPos + "px";
		} else markerRef.style.left = 1 + "px"
	}

	createEffect(
		on(isMarkerGrabed, () => {
			console.log("isMarkerGrabed", isMarkerGrabed())
			if (isMarkerGrabed()) {
				// "From User: I am grabbing mouse!
				containerRef.addEventListener("mousemove", handleMouseMove)
				containerRef.addEventListener("mouseup", handleMouseUp)
				onCleanup(() => {
					containerRef.removeEventListener("mousemove", handleMouseMove)
					containerRef.removeEventListener("mouseup", handleMouseUp)
					// "From User: I am not grabbing mouse any more
				})
			}
		})
	)

	const handleMouseMove = (e: MouseEvent) => {
		if (e.clientX - containerRef.offsetLeft > markerRef.offsetWidth / 2) {
			const newXPos: number = e.clientX - containerRef.offsetLeft
			const newMarkerPos: number = newXPos - markerRef.offsetWidth / 2
			props.progFunc(
				(newMarkerPos /
					(containerRef.offsetWidth - markerRef.offsetWidth / 2)) *
					100
			)
			// console.log("mousing moving", newMarkerPos, newXPos);
			markerRef.animate(
				{
					left: [`${newMarkerPos}px`],
				},
				{
					duration: 30,
					fill: "forwards",
				}
			)
			// markerRef.style.left = newMarkerPos + "px";
		} else markerRef.style.left = 1 + "px"
	}

	const handleMouseUp = () => setMarkerGrabedState(false)
	// createEffect(()=>{
	// 	console.log("Pro",props.prog());
	// })
	createEffect(
		on(props.prog, () => {
			if (!isMarkerGrabed()) {
				const newMarkerPos: number =
					(props.prog() *
						(containerRef.offsetWidth - markerRef.offsetWidth / 2)) /
					100
				if (newMarkerPos > 0) {
					markerRef.animate(
						{
							left: [`${newMarkerPos}px`],
						},
						{
							duration: 30,
							fill: "forwards",
						}
					)
				}
			}
		})
	)
	return (
		<div
			id="timemarkkercontainer"
			ref={(el) => (containerRef = el)}
			onMouseDown={handleMouseDown}
			class="h-7 flex items-center cursor-grab"
			classList={{
				"cursor-grab": !isMarkerGrabed(),
				"cursor-grabbing": isMarkerGrabed(),
			}}
		>
			<div
				onDragStart={(e) => {
					e.preventDefault()
					handleDrag()
				}}
				classList={{
					"cursor-grab": !isMarkerGrabed(),
					"cursor-grabbing": isMarkerGrabed(),
				}}
				draggable="true"
				ref={(el) => (markerRef = el)}
				class="relative w-0 h-0 border-8 border-x-transparent border-b-transparent"
			>
				<div class="h-28 absolute -left-px -top-0.5 bg-white w-0.5"></div>
			</div>
		</div>
	)
}

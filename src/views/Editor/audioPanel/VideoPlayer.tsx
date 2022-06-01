import { easings } from "@/ui/helpers/easings"
import { PlayIconButton } from "@/ui2/IconButtons"
import {
	Accessor,
	createEffect,
	createSignal,
	on,
	onCleanup,
	onMount,
} from "solid-js"

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
	minimumIntegerDigits: 2,
})

const extractDimension = (el, dimension: "x" | "y" | "width" | "height") => {
	const rect = el.getBoundingClientRect()
	for (let key in rect) {
		if (typeof rect[key] !== "function" && key === dimension) return rect[key]
	}
}

const formatIntoMilli = (time: number) => {
	const milli = Math.floor((time * 1000) % 1000)
	const seconds = Math.floor(time % 60)
	const minutes = Math.floor(time / 60) % 60
	if (minutes === 0) {
		return `${leadingZeroFormatter.format(
			seconds
		)}:${leadingZeroFormatter.format(milli)}`
	} else {
		return `${leadingZeroFormatter.format(
			minutes
		)}:${leadingZeroFormatter.format(seconds)}:${leadingZeroFormatter.format(
			milli
		)}`
	}
}
const formatDuration = (time: number) => {
	const seconds = Math.floor(time % 60)
	const minutes = Math.floor(time / 60) % 60
	const hours = Math.floor(time / 3600)
	if (hours === 0) {
		return `${leadingZeroFormatter.format(
			minutes
		)}:${leadingZeroFormatter.format(seconds)}`
	} else {
		return `${hours}:${leadingZeroFormatter.format(
			minutes
		)}:${leadingZeroFormatter.format(seconds)}`
	}
}

export const VideoPlayerDialog = (props: {
	closeEvent: any
	videoURL: Accessor<string>
}) => {
	let overlayRef: HTMLElement
	let panelRef: HTMLElement
	let videoContainerRef: HTMLElement
	let videoRef: HTMLVideoElement
	const [currentTime, setCurrentTime] = createSignal(0)
	const [isPlaying, setIsPlaying] = createSignal<boolean>(true)
	const [duration, setDuration] = createSignal<number>(0)
	const play = () => videoRef.play()
	// setIsPlaying(true)
	const pause = () => videoRef.pause()
	createEffect(
		on(isPlaying, () => {
			videoRef.paused ? play() : pause()
		})
	)
	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case " ":
			case "k":
				if (!isPlaying()) {
					setIsPlaying(true)
				} else {
					setIsPlaying(false)
				}
				break
			default:
				console.log(event.key)
				break
		}
	}
	const [prog, setProg] = createSignal(0)
	let containerRef: HTMLDivElement
	let indicatorBarRef: HTMLDivElement
	let markerRef: HTMLDivElement
	const handleMouseDown = (e: MouseEvent) => {
		const containerOffsetLeft = extractDimension(containerRef, "x")
		const containerWidth = extractDimension(containerRef, "width")
		const markerWidth = extractDimension(markerRef, "width")

		const absXpos: number = e.clientX - containerOffsetLeft

		const markerPos: number = absXpos - markerWidth / 2

		setProg((absXpos / containerWidth) * 100)

		if (prog() < 99.5) {
			if (markerPos > 0) {
				markerRef.style.left = `${markerPos + 8}px`
				indicatorBarRef.style.width = `${markerPos + 8}px`
				if (duration()) {
					setCurrentTime((absXpos / containerWidth) * duration())
					videoRef.currentTime = currentTime()
				}
			} else {
				markerRef.style.left = `2px`
				indicatorBarRef.style.width = `2px`
			}
		}
	}

	onMount(() => {
		window.addEventListener("keydown", handleKeyDown)
		onCleanup(() => {
			window.removeEventListener("keydown", handleKeyDown)
		})
	})
	const onFinish = (Animation: Animation) => {
		Animation.onfinish = () => {
			Animation.commitStyles()
			Animation.cancel()
		}
	}
	let animDur = 400
	onMount(() => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["in-40"],
			}
		)
		onFinish(overlayAnimation)
		const panelAnimation = panelRef.animate(
			{
				// opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["in-30"],
			}
		)
		onFinish(panelAnimation)

		const videoContainerAnimation = videoContainerRef.animate(
			{
				transform: ["scale(1.08)", "scale(1)"],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["elastic-20"],
			}
		)
		onFinish(videoContainerAnimation)
	})
	const onExit = () => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [1, 0],
				// background:['#FFF','#000'],
			},
			{
				duration: 1000,
				fill: "both",
				easing: easings["in-out-20"],
			}
		)
		overlayAnimation.onfinish = () => overlayAnimation.cancel()
		const panelAnimation = panelRef.animate(
			{
				// opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 1000,
				fill: "both",
				easing: easings["in-out-10"],
			}
		)
		panelAnimation.onfinish = () => panelAnimation.cancel()
		const videoContainerAnimation = videoContainerRef.animate(
			{
				transform: ["translateY(0px) scale(1)", "translateY(56%) scale(0)"],
				opacity: [1, 0.45, 0],
			},
			{
				duration: 1000,
				fill: "both",
				easing: easings["squish-20"],
			}
		)
		videoContainerAnimation.onfinish = () => videoContainerAnimation.cancel()
	}
	return (
		<section
			role="dialog"
			aria-modal="true"
			id="modal-title"
			aria-labelledby="modal-title"
			class="overflow-y-auto fixed inset-0 z-50"
		>
			{/* <!-- Overlay --> */}
			<div
				// x-show="isOpen"
				ref={(el: HTMLDivElement) => (overlayRef = el)}
				// x-transition.opacity.duration.500ms
				class="fixed inset-0 bg-slate-900/80 backdrop-blur-md shadow-2xl-inner shadow-slate-700"
			></div>
			{/* <!-- Panel --> */}
			<div
				ref={(el: HTMLDivElement) => (panelRef = el)}
				class="flex relative flex-col justify-center items-center min-h-screen max-h-screen p-12 bg-transparent rounded-lg"
				onClick={() => {
					onExit()
					setTimeout(() => {
						props.closeEvent()
					}, 800)
				}}
			>
				<main
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
					}}
					// x-on:click.stop
					// x-trap.noscroll.inert="isOpen"
					ref={(el: HTMLElement) => (videoContainerRef = el)}
					id="dialog-container"
					class="
							w-full
							bg-slate-900
							border border-slate-800
							shadow-xl
							rounded-2xl
							grow
							overflow-y-auto
							flex items-center justify-center
							overflow-x-hidden
						"
				>
					<video
						ref={(el: HTMLVideoElement) => (videoRef = el)}
						onClick={() => {
							isPlaying() ? setIsPlaying(false) : setIsPlaying(true)
						}}
						class="w-full peer object-contain absolute top-0 left-0 bg-slate-900 h-full rounded-xl"
						src={props?.videoURL()}
						onLoadedData={() => {
							setDuration(videoRef.duration)
						}}
						onTimeUpdate={() => {
							setCurrentTime(videoRef.currentTime)
							setProg((videoRef.currentTime / duration()) * 100)
							if (prog() < 99.7) {
								markerRef.style.left = `${prog()}%`
								indicatorBarRef.style.width = `${prog()}%`
							}
						}}
						// onWaiting={() => {
						// 	setIsPlaying(false)
						// }}
						// onEnded={() => {
						// 	setIsPlaying(false)
						// }}
					/>
					<div class="absolute hidden hover:flex peer-hover:flex bottom-0 p-4 w-full flex-col gap-y-2 bg-black/10 backdrop-blur-sm backdrop-brightness-75">
						<div
							ref={(el) => (containerRef = el)}
							onMouseDown={(el) => {
								handleMouseDown(el)
							}}
							class="flex group relative items-center w-full h-4"
						>
							<div
								ref={(el) => (indicatorBarRef = el)}
								style={{
									width: `${prog()}px !important`,
								}}
								class="cursor-pointer absolute h-1.5 bg-slate-300 group-hover:bg-white rounded-l-full shadow shadow-slate-500/20"
							></div>
							<div
								ref={(el) => (markerRef = el)}
								style={{
									left: `${prog()}px !important`,
								}}
								class="cursor-pointer group absolute h-4 w-4 bg-slate-300 hover:!bg-slate-100 group-hover:bg-white rounded-full shadow"
							>
								<div class="absolute hidden group-hover:block -top-2 -left-4 translate-x-2 bg-white -translate-y-6 px-2 rounded-md">
									<span class="absolute border-8 top-6 border-white border-b-transparent border-x-transparent"></span>
									<span class="">{formatIntoMilli(currentTime())}</span>
								</div>
							</div>
							<div class="cursor-pointer w-full bg-slate-700 h-1.5 rounded-full shadow shadow-slate-900"></div>
						</div>
						<div class="flex gap-x-2 items-center">
							<PlayIconButton
								ref={(el) => el.focus()}
								state={isPlaying}
								setState={setIsPlaying}
							/>
							<div class="flex gap-x-1">
								<span class="text-white">{formatDuration(currentTime())}</span>
								<span class="text-white">/</span>
								<span class="text-white">{formatDuration(duration())}</span>
							</div>
						</div>
					</div>
				</main>
			</div>
		</section>
	)
}

/*
😍
🥰 
🙂
🤨
😕
 */

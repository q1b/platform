import { CheckIcon, StopIcon, XIcon } from "@/assets/icons"
import { useSolidMediaRecorder } from "@/helpers/mediaRecorder"
import { easings } from "@/ui/helpers/easings"
import {
	AudioMicrophoneButton,
	MicrophoneIconButton,
	RecordIconButton,
	StopIconButton,
	TickIconButton,
	XIconButton,
} from "@/ui2/IconButtons"
import {
	createEffect,
	createReaction,
	createSignal,
	onMount,
	Setter,
	Show,
} from "solid-js"

export const RecorderDialog = (props: {
	closeEvent: any
	setBlob: Setter<Blob[]>
}) => {
	let previewRef: HTMLVideoElement
	const [isRecording, setRecording] = createSignal(false)
	const [isStopped, setStopped] = createSignal(false)
	const track = createReaction(() => {
		let stream = new MediaStream(mediaStream()?.getVideoTracks())
		if (previewRef && stream) previewRef.srcObject = stream
	})
	const {
		status,
		startRecording,
		stopRecording,
		resumeRecording,
		pauseRecording,
		clearBlobUrl,
		mediaBlobUrl,
		mediaStream,
		mediaChunks,
	} = useSolidMediaRecorder({
		video: true,
	})
	track(() => mediaStream())
	createEffect(() => {
		switch (status()) {
			case "recording":
				setRecording(true)
				break
			case "idle":
				track(() => mediaStream())
				break
			default:
				setRecording(false)
				break
		}
	})
	let overlayRef: HTMLElement
	let panelRef: HTMLElement
	let statusRef: HTMLElement
	let videoContainerRef: HTMLElement
	let bottomControllerRef: HTMLDivElement
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
		const statusAnimation = statusRef.animate(
			{
				transform: ["translateY(20px)", "translateY(0px)"],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["elastic-30"],
			}
		)
		onFinish(statusAnimation)
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
		const bottomControllerAnimation = bottomControllerRef.animate(
			{
				transform: [
					"translateY(-30px) scale(1.08)",
					"translateY(0px) scale(1)",
				],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				easing: easings["elastic-10"],
				fill: "both",
			}
		)
		onFinish(bottomControllerAnimation)
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
		const statusAnimation = statusRef.animate(
			{
				transform: ["translateY(0px)", "translateY(20px)"],
				opacity: [1, 0.1, 0],
			},
			{
				duration: 1000,
				fill: "both",
				easing: easings["swift"],
			}
		)
		statusAnimation.onfinish = () => statusAnimation.cancel()
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
		const bottomControllerAnimation = bottomControllerRef.animate(
			{
				transform: ["translateY(0px) scale(1)", "translateY(30px) scale(0)"],
				opacity: [1, 0],
			},
			{
				duration: 1000,
				fill: "both",
				easing: easings["squish-50"],
			}
		)
		bottomControllerAnimation.onfinish = () =>
			bottomControllerAnimation.cancel()
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
				class="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
			></div>
			{/* <!-- Panel --> */}
			<div
				ref={(el: HTMLDivElement) => (panelRef = el)}
				class="flex relative flex-col justify-center items-center min-h-screen max-h-screen px-12"
				onClick={() => {
					onExit()
					setTimeout(() => {
						props.closeEvent()
					}, 800)
				}}
			>
				<header
					ref={(el) => (statusRef = el)}
					class="w-full text-white pl-5 py-3"
				>
					<h1
						class="w-max"
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
						}}
					>
						Status {status()}
					</h1>
				</header>
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
							bg-white
							shadow-2xl
							shadow-[rgba(96,165,250,0.05)]
							backdrop-blur-xl
							rounded-2xl
							grow
							overflow-y-auto
							flex items-center justify-center
							overflow-x-hidden
						"
				>
					<Show
						fallback={
							<video
								ref={(el) => {
									previewRef = el
								}}
								class="w-auto h-full rounded-xl"
								autoplay
							/>
						}
						when={mediaBlobUrl()}
					>
						<video
							class="w-auto h-full rounded-xl"
							src={mediaBlobUrl()}
							controls
							autoplay
							loop
						/>
					</Show>
				</main>
				<div
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
					}}
					class="flex my-4 w-max items-center justify-evenly"
				>
					{/* <div class="bg-white">00:00:00</div> */}
					<Show
						when={!isStopped()}
						fallback={
							<div
								ref={(el: HTMLDivElement) => (bottomControllerRef = el)}
								class="bg-white flex items-center px-2 py-1.5 rounded-lg"
							>
								<TickIconButton
									onClick={() => {
										onExit()
										clearBlobUrl()
										props.setBlob(mediaChunks())
										setTimeout(() => {
											props.closeEvent()
										}, 800)
									}}
								/>
								<span class="text-2xl text-[#001936] font-semibold leading-6 pl-1 pr-3">
									Done
								</span>
								<XIconButton
									onClick={() => {
										onExit()
										setTimeout(() => {
											props.closeEvent()
										}, 800)
									}}
								/>
							</div>
						}
					>
						<div
							ref={(el: HTMLDivElement) => (bottomControllerRef = el)}
							class="bg-white flex items-center px-2 py-1.5 rounded-lg"
						>
							<RecordIconButton
								width={40}
								height={40}
								state={isRecording}
								setState={setRecording}
								onClick={() => {
									if (isRecording()) {
										stopRecording()
										setStopped(true)
									} else {
										startRecording()
									}
								}}
							/>
							{/* <MicrophoneIconButton
								state={isRecording}
								setState={setRecording}
								onClick={() => {
									!isRecording()
										? status() !== "paused"
											? startRecording()
											: resumeRecording()
										: pauseRecording()
								}}
							/> */}
							{/* <span class="text-2xl text-[#001936] font-semibold leading-6 pl-1 pr-3">
								{status() === "idle" ? "record" : status()}
							</span>
							<StopIconButton
								onClick={() => {
									stopRecording()
									setStopped(true)
								}}
							/> */}
						</div>
					</Show>
					{/* <div></div> */}
				</div>
			</div>
		</section>
	)
}

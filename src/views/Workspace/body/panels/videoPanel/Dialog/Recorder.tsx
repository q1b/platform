import { CheckIcon, StopIcon, XIcon } from "@/assets/icons"
import { useSolidMediaRecorder } from "@/helpers/mediaRecorder"
import { MicrophoneIconButton, PlayIconButton } from "@/ui/IconButtons"
import {
	createEffect,
	createReaction,
	createSignal,
	onMount,
	Show,
} from "solid-js"

export const RecorderDialog = (props: { closeEvent: any; setBlobURL: any }) => {
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
	let overlayRef: HTMLDivElement
	let panelRef: HTMLDivElement
	let statusRef: HTMLDivElement
	let videoContainerRef: HTMLElement
	let bottomControllerRef: HTMLDivElement

	onMount(() => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 300,
				fill: "both",
				easing: "cubic-bezier(.90, 0, 1, 1)",
			}
		)
		overlayAnimation.onfinish = () => {
			overlayAnimation.commitStyles()
			overlayAnimation.cancel()
		}
		const panelAnimation = panelRef.animate(
			{
				// opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 400,
				fill: "both",
				easing: "cubic-bezier(.70, 0, 1, 1)",
			}
		)
		panelAnimation.onfinish = () => {
			panelAnimation.commitStyles()
			panelAnimation.cancel()
		}
		const statusAnimation = statusRef.animate(
			{
				transform: ["translateY(20px)", "translateY(0px)"],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 400,
				fill: "both",
				easing: "cubic-bezier(.5, 1.25, .75, 1.25)",
			}
		)
		statusAnimation.onfinish = () => {
			statusAnimation.commitStyles()
			statusAnimation.cancel()
		}
		const videoContainerAnimation = videoContainerRef.animate(
			{
				transform: ["scale(1.08)", "scale(1)"],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 400,
				fill: "both",
				easing: "cubic-bezier(.5, 1, .75, 1.25)",
			}
		)
		videoContainerAnimation.onfinish = () => {
			videoContainerAnimation.commitStyles()
			videoContainerAnimation.cancel()
		}
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
				duration: 400,
				easing: "cubic-bezier(.5, .75, .75, 1.25)",
				fill: "both",
			}
		)
		bottomControllerAnimation.onfinish = () => {
			bottomControllerAnimation.commitStyles()
			bottomControllerAnimation.cancel()
		}
	})
	const onExit = () => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [1, 0],
				// background:['#FFF','#000'],
			},
			{
				duration: 300,
				fill: "both",
				easing: "cubic-bezier(.3, 0, .7, 1)",
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
				easing: "cubic-bezier(.1, 0, .9, 1)",
			}
		)
		panelAnimation.onfinish = () => panelAnimation.cancel()
		const statusAnimation = statusRef.animate(
			{
				transform: ["translateY(0px)", "translateY(20px)"],
				opacity: [1, 0.9, 0],
				// background:['#FFF','#000'],
			},
			{
				duration: 1000,
				fill: "both",
				easing: "cubic-bezier(0, 0, .3, 1)",
			}
		)
		statusAnimation.onfinish = () => statusAnimation.cancel()
		const videoContainerAnimation = videoContainerRef.animate(
			{
				transform: ["scale(1)", "scale(0)"],
				opacity: [1, 0.45, 0],
				// background:['#FFF','#000'],
			},
			{
				duration: 1000,
				fill: "both",
				easing: "cubic-bezier(.5, -.5, .1, 1.5",
			}
		)
		videoContainerAnimation.onfinish = () => videoContainerAnimation.cancel()
		const bottomControllerAnimation = bottomControllerRef.animate(
			{
				transform: ["translateY(0px) scale(1)", "translateY(-60px) scale(0)"],
				opacity: [1, 0],
				// background:['#FFF','#000'],
			},
			{
				duration: 1000,
				easing: "cubic-bezier(.5, -.9, .1, 1.5)",
				fill: "both",
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
				class="fixed inset-0 bg-slate-700/20 backdrop-blur-sm"
			></div>
			{/* <!-- Panel --> */}
			<div
				ref={(el: HTMLDivElement) => (panelRef = el)}
				class="flex relative flex-col justify-center items-center min-h-screen max-h-screen px-12"
			>
				<div
					ref={(el) => (statusRef = el)}
					class="w-full text-white pl-5 py-3"
				>
					<h1>Status {status()}</h1>
				</div>
				<main
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
				<Show
					when={!isStopped()}
					fallback={
						<div
							ref={(el: HTMLDivElement) => (bottomControllerRef = el)}
							class="bg-white flex items-center px-2 py-1.5 my-4 rounded-lg"
						>
							<button
								class="group"
								onClick={() => {
									onExit()
									props.setBlobURL(mediaBlobUrl())
									setTimeout(() => {
										props.closeEvent()
									}, 500)
								}}
							>
								<CheckIcon
									class="w-10 h-10"
									basic
								/>
							</button>
							<span class="text-2xl text-[#001936] font-semibold leading-6 pl-1 pr-3">
								Done
							</span>
							<button
								class="group"
								onClick={() => {
									onExit()
									setTimeout(() => {
										props.closeEvent()
									}, 500)
								}}
							>
								<XIcon
									class="w-10 h-10"
									basic
								/>
							</button>
						</div>
					}
				>
					<div
						ref={(el: HTMLDivElement) => (bottomControllerRef = el)}
						class="bg-white flex items-center px-2 py-1.5 my-4 rounded-lg"
					>
						<MicrophoneIconButton
							state={isRecording}
							setState={setRecording}
							onClick={() => {
								!isRecording()
									? status() !== "paused"
										? startRecording()
										: resumeRecording()
									: pauseRecording()
							}}
						/>
						<span class="text-2xl text-[#001936] font-semibold leading-6 pl-1 pr-3">
							{status() === "idle" ? "record" : status()}
						</span>
						<button
							class="group"
							onClick={() => {
								stopRecording()
								setStopped(true)
								console.log("Clicked")
							}}
						>
							<StopIcon
								class="w-10 h-10"
								basic
							/>
						</button>
					</div>
				</Show>
			</div>
		</section>
	)
}

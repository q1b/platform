import { easings } from "@/ui/helpers/easings"
import { onMount } from "solid-js"

export const PaymentSuccessModal = (props: { closeEvent: any }) => {
	let overlayRef: HTMLElement
	let panelRef: HTMLElement
	let containerRef: HTMLElement
	const onFinish = (Animation: Animation) => {
		Animation.onfinish = () => {
			Animation.commitStyles()
			Animation.cancel()
		}
	}
	let animDur = 400
	let leaveDur = 800
	onMount(() => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["squish-10"],
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
		const containerAnimation = containerRef.animate(
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
		onFinish(containerAnimation)
	})
	const onExit = () => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [1, 0],
				// background:['#FFF','#000'],
			},
			{
				duration: leaveDur,
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
				duration: leaveDur,
				fill: "both",
				easing: easings["in-out-10"],
			}
		)
		panelAnimation.onfinish = () => panelAnimation.cancel()

		const containerAnimation = containerRef.animate(
			{
				transform: ["translateY(0px) scale(1)", "translateY(56%) scale(0)"],
				opacity: [1, 0.45, 0],
			},
			{
				duration: leaveDur,
				fill: "both",
				easing: easings["squish-20"],
			}
		)
		containerAnimation.onfinish = () => containerAnimation.cancel()
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
				class="fixed inset-0 bg-teal-600/20 saturate-200 backdrop-blur-md"
				style="box-shadow:inset 0px 0px 460px 0px #03170EAA,inset 0px 0px 500px 400px #001A0970;"
			></div>
			{/* <!-- Panel --> */}
			<div
				ref={(el: HTMLDivElement) => (panelRef = el)}
				class="relative flex h-full flex-col items-center justify-center"
				onClick={() => {
					onExit()
					setTimeout(() => {
						props.closeEvent()
					}, leaveDur - 65)
				}}
			>
				<main
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
					}}
					// x-on:click.stop
					// x-trap.noscroll.inert="isOpen"
					ref={(el: HTMLElement) => (containerRef = el)}
					id="dialog-container"
					class="mx-10 flex w-full max-w-md flex-col gap-y-10 overflow-y-auto overflow-x-hidden rounded-2xl bg-green-200 p-6 shadow-3xl shadow-teal-900/20"
				>
					<h1
						style="text-shadow: 0 1px 3px rgba(0,0,0,10%),0 1px 2px rgba(0,0,0,6%);"
						class="text-4xl font-bold leading-6 text-teal-700 select-none"
					>
						Successfully Paid 🥳
					</h1>
					<div class="flex place-content-between items-center">
						<h2
							style="text-shadow: 0 1px 3px rgba(0,0,0,10%),0 1px 2px rgba(0,0,0,6%);"
							class="text-3xl font-bold leading-6 text-teal-400 select-none"
						>
							<span class="text-teal-500">400</span> Videos add
						</h2>
						<button
							onClick={() => {
								onExit()
								setTimeout(() => {
									props.closeEvent()
								}, leaveDur - 65)
							}}
							class="rounded-xl px-4 pt-1 pb-2 text-2xl text-white shadow-sm shadow-teal-500 hover:bg-white hover:text-teal-400 focus:outline-none focus:ring-2 ring-teal-200 ring-offset-2 active:bg-teal-900 active:scale-90 transition-colors select-none"
						>
							close
						</button>
					</div>
				</main>
			</div>
		</section>
	)
}

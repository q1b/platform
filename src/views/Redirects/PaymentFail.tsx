import { easings } from "@/ui/helpers/easings"
import { onMount } from "solid-js"

export const PaymentFailModal = (props: { closeEvent: any }) => {
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
				class="fixed inset-0 bg-[#210006]/40 saturate-200 backdrop-blur-md"
				style="box-shadow:inset 0px 0px 460px 0px #210006AA,inset 0px 0px 230px 10px #48000D77,inset 0px 0px 400px 400px #6C001311,inset 0px 0px 500px 400px #8B001970;"
				// style="box-shadow:inset 0px 0px 400px 0px #03170E;"
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
					class="mx-10 flex w-full max-w-md flex-col gap-y-6 overflow-y-auto overflow-x-hidden rounded-2xl bg-rose-500 p-6 shadow-3xl shadow-rose-900/20"
				>
					<h1
						style="text-shadow: 0 1px 3px rgba(0,0,0,10%),0 1px 2px rgba(0,0,0,6%);"
						class="select-none text-4xl font-bold leading-6 text-white"
					>
						Payment Failed 😔
					</h1>
					<h2
						style="text-shadow: 0 1px 3px rgba(0,0,0,10%),0 1px 2px rgba(0,0,0,6%);"
						class="select-none text-2xl font-bold leading-6 text-rose-100"
					>
						<span class="text-rose-900">400</span> Videos remain unadded
					</h2>
					<div class="flex place-content-between items-center">
						<button class="flex items-center group select-none rounded-xl bg-rose-700 gap-x-2 px-3 text-2xl text-white shadow-sm shadow-pink-100 ring-pink-200 ring-offset-2 transition-colors hover:bg-white hover:text-pink-400 focus:outline-none focus:ring-2 active:scale-90 active:bg-pink-900">
							<span class="relative">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-7 w-7 transition-[opacity,transform] -translate-y-0.5 duration-300 group-hover:-translate-y-2 group-hover:opacity-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
									/>
								</svg>
								<svg
									class="absolute h-7 w-7 -translate-y-2 opacity-0 transition-[opacity,transform] duration-300 group-hover:-translate-y-[calc(100%+1.5px)] group-hover:opacity-100"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
										clip-rule="evenodd"
									/>
								</svg>
							</span>
							<span class="mt-0.5 mb-2.5"> Try again </span>
						</button>
						<button
							onClick={() => {
								onExit()
								setTimeout(() => {
									props.closeEvent()
								}, leaveDur - 65)
							}}
							class="select-none rounded-xl bg-rose-400 px-4 pt-1 pb-2 text-2xl text-white shadow-sm shadow-rose-700 ring-pink-200 ring-offset-2 transition-colors hover:bg-rose-900 hover:text-rose-200 focus:outline-none focus:ring-2 active:scale-90 active:bg-rose-800"
						>
							Close
						</button>
					</div>
				</main>
			</div>
		</section>
	)
}

import { easings } from "@/ui/helpers/easings"

import { For, Index, onMount } from "solid-js"

export const FreeVideoModel = (props: { closeEvent: any }) => {
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
					class="mx-10 relative max-w-4xl p-8 grid grid-cols-6 rounded-2xl bg-white shadow-lg border-t"
				>
					<div class="flex flex-col col-span-4 gap-y-10">
						<div class="flex flex-col">
							<h1 class="text-2xl font-semibold mb-3.5">Get free videos</h1>
							<h2 class="text-[13px] mb-6">
								Invite a friend to BHuman and get 250 videos added to your quota
								when they sign up. Your friend will also get 250 videos added to
								their account.
							</h2>
							<form>
								<div class="flex justify-start gap-x-3 w-full max-w-sm md:max-w-md">
									<input
										type="email"
										name=""
										id=""
										class="grow border focus:outline-none focus:ring-2 ring-slate-600 ring-offset-1 px-2 py-1 rounded-lg"
										placeholder="enter your friend’s email here"
									/>
									<button class="px-2 py-1 bg-blue-400 hover:bg-blue-500 text-white rounded-lg">
										invite
									</button>
								</div>
							</form>
						</div>
						<div class="flex flex-col gap-y-4">
							<h1 class="text-base font-semibold">My invites</h1>
							<div class="overflow-auto mx-h-72 sc bg-slate-800 w-max rounded-md border border-blue-400">
								<table class="border-collapse table-auto w-full text-sm">
									<thead class="bg-blue-400">
										<tr>
											<Index
												each={["Name", "Date Added", "Email Address", "Status"]}
											>
												{(header, i) => (
													<th
														class="whitespace-nowrap border-blue-500 p-1 py-0.5 border-r font-medium text-blue-100 text-left"
														classList={{
															"pr-1.5 border-r-0": i === 3,
															"pl-1.5": i === 0,
														}}
													>
														<span class="text-xs">{header()}</span>
													</th>
												)}
											</Index>
										</tr>
									</thead>
									<tbody class="bg-white">
										<Index
											each={[
												[
													"&Py CBSE",
													"09 January 2021",
													"cbse1112@gmail.com",
													"Active",
												],
												[
													"Sukhpreet Singh",
													"09 September 2021",
													"sukhpreetben10@gmail.com",
													"Active",
												],
												[
													"Pending",
													"07 April 2022",
													"divyamrit@gmail.com",
													"Invited",
												],
											]}
										>
											{(row, i) => (
												<tr>
													<For each={row()}>
														{(cell, j) => (
															<td
																classList={{
																	"pr-1.5 border-r-0": j() === 3,
																	"pl-1.5": j() === 0,
																}}
																class="border-t whitespace-nowrap border-slate-400 p-1 py-0.5 border-r text-slate-900 font-medium"
															>
																<span class="text-xs"> {cell} </span>
															</td>
														)}
													</For>
												</tr>
											)}
										</Index>
									</tbody>
								</table>
							</div>
							{/* <ul>
								<li class="flex items-center gap-x-2">
									<span class="text-[13px]">john@gmail.com </span>
									<span class="text-xs text-blue-500">
										joined March 7, 2022
									</span>
								</li>
								<li class="flex items-center gap-x-2">
									<span class="text-[13px]">mark@aol.com </span>
									<span class="text-xs text-blue-500">
										joined March 7, 2022
									</span>
								</li>
								<li class="flex items-center gap-x-2">
									<span class="text-[13px]">orge@microsoft.com </span>
									<span class="text-xs text-blue-500">
										joined March 7, 2022
									</span>
								</li>
								<li class="flex items-center gap-x-2">
									<span class="text-[13px]">lina@gmail.com </span>
									<span class="text-xs text-blue-500">
										joined March 7, 2022
									</span>
								</li>
							</ul> */}
						</div>
						<div>
							<h1 class="text-blue-400">Total earned: 500 videos</h1>
						</div>
					</div>
					<div class="flex flex-col pl-8 pr-4 w-max col-start-5">
						<div class="mb-6">
							<h1 class="text-2xl">Leaderboard</h1>
							<p class="text-[13px] italic">23 days left!</p>
						</div>
						<div class="flex flex-col gap-y-0.5 mb-5">
							<span class="text-[13px] font-bold"> Rewards </span>
							<ul>
								<li class="text-[13px]">1st place: 3,000 videos</li>
								<li class="text-[13px]">2nd place: 1,000 videos</li>
								<li class="text-[13px]">3rd place: 500 videos</li>
							</ul>
						</div>
						<div>
							<ul class="">
								<li class="text-[13px]">
									🥇 Mark Adams
									<span class="text-blue-400 inline-block text-xs">
										7 sign-ups
									</span>
								</li>
								<li class="text-[13px]">
									🥈 Vish Vadlamani
									<span class="text-blue-400 inline-block text-xs">
										7 sign-ups
									</span>
								</li>
								<li class="text-[13px]">
									🥉 Alisha Keys
									<span class="text-blue-400 inline-block text-xs">
										7 sign-ups
									</span>
								</li>
								<li class="text-[13px]">
									Giorgio Armani
									<span class="text-blue-400 inline-block text-xs">
										7 sign-ups
									</span>
								</li>
								<li class="text-[13px]">
									Hank Rogers
									<span class="text-blue-400 inline-block text-xs">
										7 sign-ups
									</span>
								</li>
							</ul>
						</div>
					</div>
					<button
						class="absolute right-4 top-4 leading-none px-0.5 pb-1"
						onClick={() => {
							onExit()
							setTimeout(() => {
								props.closeEvent()
							}, leaveDur - 65)
						}}
					>
						<span class="brightness-0 text-xs leading-none"> ❌ </span>
					</button>
				</main>
			</div>
		</section>
	)
}

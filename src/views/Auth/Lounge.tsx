import PixelGrid from "@/assets/pixel-grid.svg"
import { Component } from "solid-js"
import { NavLink, useLocation, useParams } from "solid-app-router"
import { BhumanAIFullLogo } from "@/assets/icons/logo"

const Lounge: Component = () => {
	const params = useParams()
	const email = params?.email_id

	return (
		<section class="min-h-screen flex w-full items-center justify-center">
			<div class="flex z-10 flex-col gap-y-1 pb-12">
				<div class="p-8 bg-white rounded-xl shadow-lg shadow-blue-100">
					<div class="flex p-1 pb-2 items-center gap-x-2">
						<BhumanAIFullLogo
							width="175.5"
							height="32.5"
						/>
					</div>
					<div class="flex flex-col select-none items-start gap-y-5">
						<div>
							<h1 class="font-extrabold text-blue-900 text-4xl">
								Check Your Email Account
							</h1>
							<h2 class="font-semibold text-blue-700 text-3xl">
								It's Important
							</h2>
						</div>
						<div class="flex flex-col gap-y-2">
							<div class="flex flex-row gap-x-1">
								<h3 class="text-xl text-blue-600">
									We’ve sent a <b class="text-blue-700"> secure log in</b> link
									to
								</h3>
								<h4 class="text-xl underline text-purple-700">
									{email || "example.gmail.com"},
								</h4>
							</div>
							<h4 class="text-lg text-slate-500">No Email Try again!</h4>
						</div>
					</div>
					<div class="mt-2 mb-2">
						<NavLink
							class="text-cyan-500 font-medium underline text-xl"
							href="/check-in"
						>
							Back to login
						</NavLink>
					</div>
				</div>
			</div>
			<div class="bg-white absolute inset-0 w-full h-full transition-colors">
				<div
					style={{
						"background-image": `url(${PixelGrid})`,
					}}
					class={`absolute [mask-image:linear-gradient(315deg,rgba(0,0,0,0.06),rgba(73,39,244,0.76),rgba(73,39,244,0.25),rgba(73,39,244,0.6),rgba(0,0,0,0.07))] inset-0 bg-center`}
				></div>
			</div>
		</section>
	)
}

export default Lounge

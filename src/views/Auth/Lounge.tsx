import { Component } from "solid-js"
import { AheadLogo, Hailey } from "@/assets/icons/logo"
import { NavLink, useLocation, useParams } from "solid-app-router"

const Lounge: Component = () => {
	const params = useParams()
	const email = params?.email_id

	return (
		<section class="min-h-screen flex w-full items-center justify-center">
			<div class="flex flex-col gap-y-1 pb-12">
				<div class="flex p-1 items-center gap-x-2">
					<AheadLogo />
					<Hailey />
				</div>
				<div class="flex flex-col select-none items-start gap-y-5">
					<div>
						<h1 class="font-bold text-slate-800 text-4xl">
							Check Your Email Account
						</h1>
						<h2 class="font-semibold text-slate-600 text-3xl">
							It's Important
						</h2>
					</div>
					<div class="flex flex-col gap-y-2">
						<div class="flex flex-row gap-x-1">
							<h3 class="text-xl text-slate-600">
								We’ve sent a <b class="text-slate-700"> secure log in</b> link
								to
							</h3>
							<h4 class="text-xl underline text-indigo-700">
								{email || "example.gmail.com"},
							</h4>
						</div>
						<h4 class="text-lg text-slate-500">No Email Try again!</h4>
					</div>
				</div>
				<div class="mt-2 mb-2">
					<NavLink
						class="text-blue-500 font-medium underline text-xl"
						href="/check-in"
						end
					>
						Back to login
					</NavLink>
				</div>
			</div>
		</section>
	)
}

export default Lounge

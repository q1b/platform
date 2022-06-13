import { fetchCustomerPortalLink, fetchPlan } from "@/api"
import { globalStore } from "@/App"
import { LoadingIcon } from "@/assets/icons"
import { InputButton } from "@/ui/Button/InputButton"
import { createEffect, createReaction, createResource, Show } from "solid-js"

export const Billings = () => {
	const [customer_portal] = createResource(fetchCustomerPortalLink)

	const [plan, { refetch }] = createResource(async () => {
		let plan
		if (globalStore.user)
			plan = await fetchPlan({
				plan_id: globalStore.user?.plan_id,
			})
		return plan
	})

	createReaction(() => {
		refetch()
	})(() => globalStore.user?.plan_id)

	return (
		<section class="p-8 grow flex flex-col gap-y-8">
			<div class="flex flex-col gap-y-2">
				<h1 class="text-2xl font-semibold pl-1">Your Plan</h1>
				<Show
					when={!plan.loading}
					fallback={<LoadingIcon class="w-4 h-4 text-slate-600" />}
				>
					<p class="pl-2">{plan()?.name}</p>
				</Show>
				<p class="text-slate-400 pl-2">
					Visit the AI Studio page to change your plan
				</p>
			</div>
			{/* <div class="flex flex-col gap-y-2">
				<h1 class="text-2xl font-semibold pl-2">Primary Card</h1>
				<InputButton
					isupdating={false}
					placeholder="Visa-ending with 3048"
				/>
			</div> */}
			<div class="flex flex-col gap-y-2 pl-2">
				<h1 class="text-2xl font-semibold">Customer Portal Link</h1>
				<Show
					when={!customer_portal.loading}
					fallback={<LoadingIcon class="w-8 h-8 text-slate-700" />}
				>
					<div class="flex gap-x-2">
						{/* <span class="font-medium">March 5 - April 5: $39</span> */}
						<a
							href={customer_portal()?.data?.url}
							class="text-blue-600 underline"
						>
							check it out
						</a>
					</div>
				</Show>
			</div>
		</section>
	)
}

export default Billings

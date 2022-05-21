import { InputButton } from "@/ui/Button/InputButton"

export const Billings = () => {
	return (
		<section class="p-8 grow flex flex-col gap-y-8">
			<div class="flex flex-col gap-y-2">
				<h1 class="text-2xl font-semibold pl-1">Your Plan</h1>
				<p class="pl-2">Scale</p>
				<p class="text-slate-400 pl-2">
					Visit the AI Studio page to change your plan
				</p>
			</div>
			<div class="flex flex-col gap-y-2">
				<h1 class="text-2xl font-semibold pl-2">Primary Card</h1>
				<InputButton placeholder="Visa-ending with 3048" />
			</div>
			<div class="flex flex-col gap-y-2 pl-2">
				<h1 class="text-2xl font-semibold">Billing History</h1>
				<div class="flex gap-x-2">
					<span class="font-medium">April 5 - May 5: $39</span>
					<a
						href=""
						class="text-blue-600 underline"
					>
						download receipt
					</a>
				</div>
				<div class="flex gap-x-2">
					<span class="font-medium">March 5 - April 5: $39</span>
					<a
						href=""
						class="text-blue-600 underline"
					>
						download receipt
					</a>
				</div>
			</div>
		</section>
	)
}

export default Billings

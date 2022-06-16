import MichaelImg from "@/assets/Michael_lulo_image_40X40.png"
import { ProgressBar } from "@/ui/ProgressBar"
import { Plan } from "@/api.type"
import { onMount, createSignal, Show } from "solid-js"
import { fetchCheckoutLink, fetchPlans } from "@/api"
import { globalStore } from "@/App"
import { Link } from "solid-app-router"
import { LoadingIcon } from "@/assets/icons"

const plans: {
	plan: Plan["name"]
	description: string
	features: string[]
}[] = [
	{
		plan: "Free plan",
		description: "Get started with BHuman with an affordable plan",
		features: ["300 VIDEOS A MONTH", "LIMITED ANALYTICS"],
	},
	{
		plan: "Growth",
		description: "Get started with BHuman with an affordable plan",
		features: ["1000 VIDEOS A MONTH", "FULL ANALYTICS"],
	},
	{
		plan: "Ultimate",
		description: "Get started with BHuman with an affordable plan",
		features: ["1000 VIDEOS A MONTH", "FULL ANALYTICS"],
	},
]

// 	["free",[
// 		"300 VIDEOS A MONTH",
// 		"LIMITED ANALYTICS",
// 	]],
// 	["Scale",["1000 VIDEOS A MONTH","FULL ANALYTICS"]]
// ]

const generateBody = ({ plan_id }: { plan_id: string }) => ({
	plan_id,
	success_url: "https://app.bhuman.ai/?success=true",
	cancel_url: "https://app.bhuman.ai/?success=false",
})

const PriceButton = (props: {
	variant: "current" | "upgrade"
	plan_id: string
}) => {
	const [isLoading, setLoadingState] = createSignal(false)
	const [href, setHref] = createSignal("")
	if (props.variant === "current") {
		return (
			<button class="py-5 px-9 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full w-full">
				<span class="text-lg leading-none">Current</span>
			</button>
		)
	}
	return (
		<button
			onClick={async () => {
				setLoadingState(true)
				const res = await fetchCheckoutLink(
					generateBody({
						plan_id: props.plan_id,
					})
				)
				setHref(res.data.url)
				location.href = href()
				setLoadingState(false)
			}}
			class="py-5 px-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full w-full"
		>
			<Show
				when={!isLoading()}
				fallback={<LoadingIcon class="w-5 h-5 text-white" />}
			>
				<span class="text-lg leading-none text-white">Upgrade</span>
			</Show>
		</button>
	)
}

export const AIStudio = () => {
	let [freeTier, setFreeTier] = createSignal<Partial<Plan>>({
		quota: 0,
		price: "0",
		name: "Free plan",
	})
	let [scaleTier, setScaleTier] = createSignal<Partial<Plan>>({
		quota: 0,
		price: "0",
		name: "Scale",
	})
	let [growthTier, setGrowthTier] = createSignal<Partial<Plan>>({
		quota: 0,
		price: "0",
		name: "Growth",
	})
	let [ultimateTier, setUltimateTier] = createSignal<Partial<Plan>>({
		quota: 0,
		price: "0",
		name: "Ultimate",
	})

	let [progress, setProgress] = createSignal(0)

	onMount(async () => {
		const Plans = await fetchPlans()
		setFreeTier(Plans.data.find((plan) => plan.name === "Free plan"))
		setGrowthTier(Plans.data.find((plan) => plan.name === "Growth"))
		setScaleTier(Plans.data.find((plan) => plan.name === "Scale"))
		setUltimateTier(Plans.data.find((plan) => plan.name === "Ultimate"))
		setProgress(
			Math.floor(
				(globalStore.user?.generated_videos_used /
					globalStore.user?.generated_videos_quota) *
					100
			)
		)
		console.log("Progress", progress())
		// console.log("FREE TIER", freeTier())
		// console.log("Growth TIER", growthTier())
		// console.log("Ultimate TIER", ultimateTier())
	})
	return (
		<section class="p-8 grow flex flex-col">
			<div class="flex flex-col gap-y-8 mb-4">
				<div class="flex flex-col gap-y-2">
					<h1 class="text-2xl font-semibold pl-1.5">Usage</h1>
					<div class="flex items-center">
						<ProgressBar.CircularProgressbar
							radius={36}
							progress={progress}
							strokeWidth={7}
							trackStrokeWidth={7.1}
							strokeLinecap="round"
							strokeColor="#4EADF1"
							trackStrokeColor="#F0F0F0"
						>
							<div
								class="flex items-center justify-center text-center absolute
                top-0
                w-full h-full
								mx-auto
								my-0
								text-slate-800 select-none font-semibold"
							>
								<div>{progress() === NaN ? "0" : progress()}%</div>
							</div>
						</ProgressBar.CircularProgressbar>
						<div class="flex flex-col items-start pb-2">
							<h2 class="font-semibold leading-4 mb-1.5"> Free Tier </h2>
							<p class="text-[13px] font-medium mb-2">
								{globalStore.user?.generated_videos_used} of{" "}
								{globalStore.user?.generated_videos_quota} used
							</p>
							<ProgressBar.FlatProgressBar
								completed={progress()}
								borderRadius="10px"
								bgColor="#4EADF1"
								height="6px"
								width="340px"
								isLabelVisible={false}
								labelColor="#e80909"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col">
				<h2 class="text-xl font-extrabold">Plans</h2>
				<main class="grid grid-cols-3 place-items-center gap-4 p-4 mb-11">
					<div class="flex flex-col items-center">
						<div class="flex flex-col py-5 px-4 max-w-[248px] bg-slate-100 rounded-lg">
							<div class="flex flex-col mb-4">
								<h2 class="text-xl font-semibold">{growthTier().name}</h2>
								<p class="text-slate-500">
									Get started with BHuman with an affordable plan
								</p>
							</div>
							<ul class="list-disc list-inside mb-6">
								<li class="font-semibold uppercase">
									{growthTier().quota} videos a month
								</li>
								<li class="font-semibold uppercase">Limited Analytics</li>
							</ul>
							<div class="inline-flex items-end border-t-2 border-slate-200 gap-x-1 mb-7 pt-0.5">
								<p class="text-3xl font-bold">{growthTier().price}$</p>{" "}
								<span class="inline pb-1">/month</span>
							</div>
							<div>
								<PriceButton
									plan_id={growthTier().id}
									variant="upgrade"
								/>
							</div>
						</div>
					</div>
					<div class="flex flex-col items-center">
						<div class="flex flex-col py-5 px-4 max-w-[248px] bg-slate-100 rounded-lg">
							<div class="flex flex-col mb-4">
								<h2 class="text-xl font-semibold">{scaleTier().name}</h2>
								<p class="text-slate-500">
									Get started with BHuman with an affordable plan
								</p>
							</div>
							<ul class="list-disc list-inside mb-6">
								<li class="font-semibold uppercase">
									{scaleTier().quota} videos a month
								</li>
								<li class="font-semibold uppercase">Full Analytics</li>
							</ul>
							<div class="inline-flex items-end border-t-2 border-slate-200 gap-x-1 mb-7 pt-0.5">
								<p class="text-3xl font-bold">{scaleTier().price}$</p>{" "}
								<span class="inline pb-1">/month</span>
							</div>
							<div>
								<PriceButton
									plan_id={scaleTier().id}
									variant="upgrade"
								/>
							</div>
						</div>
					</div>
					<div class="flex flex-col items-center">
						<div class="flex flex-col py-5 px-4 max-w-[248px] bg-slate-100 rounded-lg">
							<div class="flex flex-col mb-4">
								<h2 class="text-xl font-semibold">Ultimate</h2>
								<p class="text-slate-500">
									Get started with BHuman with an affordable plan
								</p>
							</div>
							<ul class="list-disc list-inside mb-6">
								<li class="font-semibold uppercase">UNLIMTED videos</li>
								<li class="font-semibold uppercase">Limited Analytics</li>
							</ul>
							<div class="inline-flex items-end border-t-2 border-slate-200 gap-x-1 mb-7 pt-0.5">
								<p class="text-3xl font-bold">39 cents</p>{" "}
								<span class="inline pb-1">/render</span>
							</div>
							<div>
								<PriceButton
									plan_id={ultimateTier().id}
									variant="upgrade"
								/>
							</div>
						</div>
					</div>
				</main>
				<div class="flex justify-center text-lg w-full items-center mb-2">
					<span class="text-slate-500">
						Want to downgrade to the free plan (15 videos / month)?
					</span>
					<a
						href=""
						class="inline-block px-1 underline text-blue-500"
					>
						Click here
					</a>
				</div>
				<div class="flex justify-center text-lg w-full items-center">
					<img
						src={MichaelImg}
						alt="our VP photo"
						class="w-10 mr-2 h-10 rounded-full"
					/>
					<span class="text-slate-600">Looking for enterprise?</span>
					<span class="text-slate-500">
						Please email Michael lulo, our VP of Sales, at
					</span>
					<a
						href=""
						class="inline-block px-1 underline text-blue-500"
					>
						Michael@BHuman.ai
					</a>
				</div>
			</div>
		</section>
	)
}

export default AIStudio

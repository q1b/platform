import { HappyIcon } from "@/assets/icons"
import { Folder } from "@/ui/Button/Folder"
import { Outlet, useNavigate, useParams } from "solid-app-router"
import { createSelector, createSignal, onMount } from "solid-js"

export const EmptyWorkspace = () => {
	const [active, setActive] = createSignal("Profile")
	const isActive = createSelector(active)
	const navigate = useNavigate()
	const params = useParams()
	onMount(() => {
		console.log(JSON.stringify(params["id"]))
	})
	// onMount(async () => {
	// 	console.log(await fetchPlans())
	// })
	return (
		<>
			<main class="w-60 min-h-screen shrink-0 bg-slate-100 shadow-md  shadow-slate-300 z-0 flex flex-col">
				<div class="w-full px-3 py-2.5 border-b-2 font-semibold text-slate-600">
					<h1>Settings</h1>
				</div>
				<div class="flex w-full items-center justify-center p-4">
					<button class="px-2 py-1.5 bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 active:bg-blue-600 flex items-center justify-center w-full rounded-full transition-colors">
						<span class="text-[13px] font-bold inline-flex items-center text-white leading-3 gap-x-3">
							<HappyIcon class="text-white w-4 h-4" />
							Get Free Videos
						</span>
					</button>
				</div>
				<div class="w-full px-3 flex flex-col gap-y-0.5">
					<h1 class="pl-2">General </h1>
					<div class="flex flex-col gap-y-0.5"></div>
				</div>
			</main>
			<div class="min-h-screen max-h-screen overflow-y-scroll w-full flex flex-col bg-white">
				<div class="px-3 py-2.5 border-b-2 font-semibold text-slate-900">
					<h1>{active()}</h1>
				</div>
			</div>
		</>
	)
}

export default EmptyWorkspace

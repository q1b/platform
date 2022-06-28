import { fetchPlan } from "@/api"
import { Plan } from "@/api.type"
import { globalStore } from "@/App"
import { Folder } from "@/ui/Button/Folder"
import { Outlet, useNavigate } from "solid-app-router"
import {
	createEffect,
	createReaction,
	createResource,
	createSelector,
	createSignal,
} from "solid-js"

export const [activePlan, setActivePlan] = createSignal<Plan>()

export const Settings = () => {
	const [active, setActive] = createSignal("Profile")

	const isActive = createSelector(active)
	const navigate = useNavigate()
	const [plan, { refetch }] = createResource(async () => {
		let plan
		if (globalStore.user)
			plan = await fetchPlan({
				plan_id: globalStore.user?.plan_id,
			})
		return plan
	})

	createEffect(() => {
		if (!plan.loading) setActivePlan(plan())
	})

	createReaction(() => {
		refetch()
	})(() => globalStore.user?.plan_id)

	return (
		<>
			<main class="w-60 min-h-screen shrink-0 bg-slate-100 shadow-md  shadow-slate-300 z-0 flex flex-col">
				<div class="w-full px-3 py-2.5 border-b-2 font-semibold text-slate-600">
					<h1>Settings</h1>
				</div>
				<div class="flex w-full items-center justify-center p-4">
					{/* <FreeVideoBtnWithDialog /> */}
				</div>
				<div class="w-full px-3 flex flex-col gap-y-0.5">
					<h1 class="pl-2">General </h1>
					<div class="flex flex-col gap-y-0.5">
						<Folder
							active={isActive("Profile")}
							label="Profile"
							onClick={() => {
								navigate("./profile")
								setActive("Profile")
							}}
						/>
						<Folder
							active={isActive("Billing")}
							label="Billing"
							onClick={() => {
								navigate("./billings")
								setActive("Billing")
							}}
						/>
					</div>
				</div>
				<div class="w-full px-3 py-2 flex flex-col gap-y-0.5">
					<h1 class="pl-2">Apps </h1>
					<div class="flex flex-col pt-0.5 gap-y-0.5">
						<Folder
							active={isActive("AI Studio")}
							label="AI Studio"
							onClick={() => {
								navigate("./ai_studio")
								setActive("AI Studio")
							}}
						/>
					</div>
				</div>
			</main>
			<div class="min-h-screen max-h-screen overflow-y-scroll w-full flex flex-col bg-white">
				<div class="px-3 py-2.5 border-b-2 font-semibold text-slate-900">
					<h1>{active()}</h1>
				</div>
				<Outlet />
			</div>
		</>
	)
}

export default Settings

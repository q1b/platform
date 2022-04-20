import {
	Component,
	createEffect,
	createReaction,
	createResource,
	For,
	Suspense,
} from "solid-js"
import { useNavigate } from "solid-app-router"

import axiosApi from "../../api"

type UserDetails = {
	id: string
	email: string
	fullname: string
	username: string
	stytch_user_id: string
	updated_at: string
	created_at: string
	generated_videos_quota: number
	generated_videos_used: number
	not_binded_videos: number
	org_id: string
	plan_id: string
	stripe_customer_id: string
	stripe_metred_subscription_item_id: null
	stripe_subscription_id: string
	stripe_subscription_item_id: string
}

type Workspace = {
	created_at: string
	generated_videos_quota: number
	generated_videos_used: number
	id: string
	name: string
	parent_videos_quota: number
	parent_videos_used: number
	updated_at: string
	user_id: string
}

const fetchUserDetails = async () => await axiosApi.get("user")
const fetchWorkspaces = async () => await axiosApi.get("workspace")

const deleteWorkspace = async (id: string) =>
	await axiosApi.delete(`workspace?id=${id}`)

const ControlPanel: Component = (props) => {
	const [workspacesAPI, workspacesAPIHandler] = createResource(fetchWorkspaces)
	const [userDetailsAPI, userDetailsAPIHandler] =
		createResource(fetchUserDetails)

	const triggerOnWorkspacesLoad = createReaction(() => {
		console.log(workspacesAPI()?.data)
	})

	triggerOnWorkspacesLoad(() => workspacesAPI())

	const triggerOnUserDetailsLoad = createReaction(() => {
		console.log(userDetailsAPI()?.data)
	})
	triggerOnUserDetailsLoad(() => userDetailsAPI())
	// const [user, setUser] = createSignal({});
	const navigate = useNavigate()

	createEffect(() => {
		const accessToken = localStorage.getItem("access_token")
		const user_id = localStorage.getItem("user_id")
		if (!accessToken && !user_id) navigate("/check-in", { replace: true })
	})
	return (
		<div class="flex flex-col text-slate-900 min-h-screen px-6 sm:px-20">
			<h1
				style={{
					"font-size": `clamp(3.5rem, 12vw + 1rem, 16rem)`,
				}}
				class="font-extrabold"
			>
				Recents
			</h1>
			<Suspense
				fallback={
					<div
						class="flex cursor-pointer flex-col bg-indigo-500 hover:bg-white focus:bg-white border border-indigo-500 w-max 
                            sm:gap-y-2 px-2 pt-1 pb-2 sm:pl-4 sm:pr-5 sm:py-2
                            rounded-lg group shadow-2xl shadow-indigo-500/0 hover:shadow-indigo-500/20 focus:shadow-indigo-500/20 transition-colors"
					>
						<div class="w-max">
							<span class="sm:text-xl text-indigo-700 leading-6 font-bold">
								Workspace Name
							</span>
						</div>
						<div class="sm:py-4">
							<span class="text-2xl leading-6 sm:text-7xl text-white/30 group-hover:text-indigo-500 group-focus:text-indigo-500 sm:leading-6 font-bold">
								Loading
							</span>
						</div>
					</div>
				}
			>
				<>
					<For each={workspacesAPI()?.data}>
						{(workspace: Workspace) => {
							return (
								// py-4 is padding to fit the text So, why it's 10 to make it eqyally spaced from top and left
								<button
									onClick={() => {
										navigate(`/workspace/${workspace.id}`)
									}}
									class="flex cursor-pointer flex-col bg-indigo-500 hover:bg-white focus:bg-white border border-indigo-500 w-max sm:gap-y-2 px-2 pt-1 pb-2 sm:pl-4 sm:pr-5 sm:py-2 rounded-lg group shadow-2xl shadow-indigo-500/0 hover:shadow-indigo-500/20 focus:shadow-indigo-500/20 transition-colors"
								>
									<div class="w-max">
										<span class="sm:text-xl text-indigo-700 leading-6 font-bold">
											Workspace Name
										</span>
									</div>
									<div class="sm:py-4">
										<span class="text-2xl leading-6 sm:text-7xl text-white group-hover:text-indigo-500 group-focus:text-indigo-500 sm:leading-6 font-bold">
											{workspace?.name}
										</span>
									</div>
								</button>
							)
						}}
					</For>
					{/* <pre>
                        {JSON.stringify(,null,2)}
                    </pre> */}
				</>
			</Suspense>
			{/* <pre>{JSON.stringify(user(), null, 2)},</pre>
			<pre>{JSON.stringify(workspaces(), null, 2)}</pre>
			<pre>{JSON.stringify(folders(), null, 2)},</pre>
			<pre>{JSON.stringify(videoInstances(), null, 2)}</pre> */}
			{/* <button onClick={()=>{ */}
			{/*  createVideoInstance(folders()[1].id); */}
			{/* }} class="bg-black px-2 w-max py-1 text-white hover:bg-gray-200 focus:bg-gray-200 shadow-md hover:text-gray-700"> focus:text-gray-700"> */}
			{/* Create Video Instance */}
			{/* </button> */}
		</div>
	)
}

export default ControlPanel

import PixelGrid from "@/assets/pixel-grid.svg"
import { createFormActions, Errors } from "solid-form-action"
import axiosApi, { fetchUserDetails, fetchWorkspaces } from "../../api"
import { addFolder, addFile } from "../../views/Workspace/api"
import { useNavigate } from "solid-app-router"
import { BHuman, BhumanAIFullLogo } from "@/assets/icons/logo"
import { Component, createSignal, Show, Suspense } from "solid-js"
import { createPath, ROUTE } from "@/routing"
import { setGlobalStore, globalStore } from "@/App"

const Register: Component = () => {
	const [isLoading, setLoadingState] = createSignal(false)
	const navigate = useNavigate()
	const registerUser = async (values: {
		username: string
		fullname: string
		workspace: string
	}) => {
		try {
			setLoadingState(true)
			const userId = localStorage.getItem("stytch_user_id")
			const res = await axiosApi.post(`signup?stytch_user_id=${userId}`, {
				username: values.username,
				fullname: values.fullname,
			})
			const data = res.data
			localStorage.setItem("access_token", data.access_token)
			localStorage.setItem("refresh_token", data.refresh_token)
			localStorage.setItem("user_id", data.user_id)

			const workspace_res = await createWorkspace(values.workspace)
			console.log("First Workspace Created For User", workspace_res)
			const [user, workspaces] = await Promise.allSettled([
				fetchUserDetails(),
				fetchWorkspaces(),
			])
			if (user.status === "fulfilled" && workspaces.status === "fulfilled") {
				setGlobalStore({
					user: user.value.data,
					workspaces: workspaces.value.data,
				})
			}
			const folder_id = await addFolder({
				workspace_id: globalStore.workspaces[0].id,
				name: "Demo Folder",
			})
			await addFile({
				folder_id,
				name: "Demo_File",
			})
			navigate(
				createPath({
					path: ROUTE.WORKSPACE,
					params: {
						folder_id: "000",
						workspace_id: globalStore.workspaces[0].id,
					},
				}),
				{ replace: false }
			)
		} catch (e) {
			localStorage.clear()
			console.log(e)
		} finally {
			setLoadingState(false)
		}
	}
	const {
		actions: { username, fullname, workspace },
		form,
		formState,
		errors,
	} = createFormActions({
		initialValues: {
			username: "",
			fullname: "",
			workspace: "",
		},
		validate: (values) => {
			const errs: Errors<typeof values> = {}
			if (values.username.length === 0) {
				errs.username = "Username is required"
			}
			if (values.fullname.length === 0) {
				errs.fullname = "Fullname is required"
			}
			if (values.workspace.length === 0) {
				errs.workspace = "Workspace is required"
			}
			return errs
		},
		onSubmit: async (values) => {
			registerUser(values)
		},
	})

	const createWorkspace = async (name: string) =>
		await axiosApi.post(`workspace`, { name, generated_videos_quota: 15 })

	// const planCheckout = async () => {
	// 	// TODO: need to redirect to plan selection here
	// 	const body = {
	// 		plan_id: 1,
	// 		success_url: "http://localhost:3001",
	// 		cancel_url: "http://localhost:3001/cancel",
	// 	}
	// 	const res = await axiosApi.post(`checkout`, body)
	// 	console.log("planCheckout", res)
	// }

	// const validateUser = async (token: null | string) => {
	// 	if (token) {
	// 		setLoadingState(true)
	// 		const res = await axiosApi.post("tokenauth", { token })
	// 		setLoadingState(false)
	// 		console.log("VALIDATE RESPONSE", res)
	// 		const data = res.data
	// 		if (data.found) {
	// 			localStorage.setItem("access_token", data.access_token)
	// 			localStorage.setItem("refresh_token", data.refresh_token)
	// 			localStorage.setItem("user_id", data.user_id)
	// 			navigate(ROUTE.CONTROLPANEL, { replace: false })
	// 		} else {
	// 			localStorage.setItem("stytch_user_id", data.stytch_user_id)
	// 			navigate(`/signup`, { replace: false })
	// 		}
	// 	}
	// }

	// createSignal(() => validateUser(token))

	return (
		<section class="min-h-screen flex w-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div class="z-10 absolute inset-0 w-full flex items-center justify-center">
				<main class="max-w-md w-full flex flex-col pb-12">
					<div class="flex flex-col items-start gap-y-1 mb-6">
						<div class="flex items-center pl-1"></div>
						<div class="mt-2">
							<h1 class="text-slate-400 text-3xl">Welcome </h1>
						</div>
						<div class="flex gap-x-2 items-center">
							<h4 class="flex items-center text-xl text-slate-600 whitespace-normal font-normal">
								to access
								<span class="pl-1 inline-block">
									<BhumanAIFullLogo
										width="85.9375"
										height="15.914351851851855"
									/>
								</span>
							</h4>
						</div>
					</div>
					<form use:form>
						<div class="mb-3">
							<div class="rounded-md shadow-sm -space-y-px">
								<label
									for="username"
									class="sr-only"
								>
									Username
								</label>
								<input
									id="username"
									name="username"
									type="text"
									// autocomplete="email"
									autocomplete="off"
									required
									class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									ref={username}
									value={formState.username}
									placeholder="Username"
								/>
								{errors.username && (
									<span class="ml-2 text-red-700">{errors.username}</span>
								)}
							</div>
						</div>
						<div class="mb-3">
							<div class="rounded-md shadow-sm -space-y-px">
								<label
									for="fullname"
									class="sr-only"
								>
									Full Name
								</label>
								<input
									id="fullname"
									name="fullname"
									type="text"
									// autocomplete="email"
									autocomplete="off"
									required
									class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									ref={fullname}
									value={formState.fullname}
									placeholder="fullname"
								/>
								{errors.fullname && (
									<span class="ml-2 text-red-700">{errors.fullname}</span>
								)}
							</div>
						</div>
						<div class="mb-7">
							<div class="rounded-md shadow-sm -space-y-px">
								<label
									for="initial-workspace-name"
									class="sr-only"
								>
									Initial Workspace Name
								</label>
								<input
									id="workspace"
									name="workspace"
									type="text"
									// autocomplete="email"
									autocomplete="off"
									required
									class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									ref={workspace}
									value={formState.workspace}
									placeholder="Workspace Name"
								/>
								{errors.workspace && (
									<span class="ml-2 text-red-700">{errors.workspace}</span>
								)}
							</div>
						</div>
						<div class="mb-3">
							<Suspense>
								<Show
									when={!isLoading()}
									fallback={
										<button
											class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
											disabled
										>
											Loading...
										</button>
									}
								>
									<button
										class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										type="submit"
									>
										Log In
									</button>
								</Show>
							</Suspense>
						</div>
					</form>
				</main>
			</div>
			<div class="bg-white absolute inset-0 w-full h-full transition-colors">
				<div
					style={{
						"background-image": `url(${PixelGrid})`,
					}}
					class={`absolute [mask-image:linear-gradient(rgba(0,0,0,0.06),rgba(73,39,244,1),rgba(0,0,0,0.07))] inset-0 bg-center`}
				></div>
			</div>
		</section>
	)
}

export default Register

import { AxiosResponse } from "axios"
import * as Server from "./api"
import {
	useNavigate,
	Routes,
	Route,
	useRouteData,
	useSearchParams,
	useLocation,
} from "solid-app-router"

import {
	Component,
	createReaction,
	createResource,
	createSelector,
	createSignal,
	For,
	lazy,
	Resource,
	Show,
	Switch,
	untrack,
} from "solid-js"

import { createStore } from "solid-js/store"
import { fetchFiles, fetchFolders } from "./api"

import { User, Workspace } from "./api.type"
import { createPath, ROUTE } from "./routing"
import { SidenavBtn } from "./ui/Sidenav/ActionBtn"
import { Portal } from "solid-js/web"
import { PaymentSuccessModal } from "./views/Redirects/PaymentSuccess"
import { PaymentFailModal } from "./views/Redirects/PaymentFail"

const CheckInPage = lazy(() => import("@/views/Auth/Check-in"))
const LoungePage = lazy(() => import("@/views/Auth/Lounge"))
const VerificationPage = lazy(() => import("@/views/Auth/Verification"))
const RegistrationPage = lazy(() => import("@/views/Auth/Registration"))

const SettingsLayout = lazy(() => import("@/views/Settings"))
const ProfilePage = lazy(() => import("@/views/Settings/Profile"))
const BillingsPage = lazy(() => import("@/views/Settings/Billings"))
const AIStudioPage = lazy(() => import("@/views/Settings/AIStudio"))

const WorkspacePage = lazy(() => import("@/views/Workspace"))

const fetchWorkspaceDetails = async (workspace_id: string) => {
	return await Promise.allSettled([
		fetchFolders({ workspace_id }),
		fetchFiles({ workspace_id }),
	])
}

const WorkspaceData = ({ params, navigate, location, data }) => {
	/** Data function https://github.com/solidjs/solid-app-router#data-functions */
	const [details] = createResource(
		() => params.workspace_id,
		fetchWorkspaceDetails
	)
	return details
}

const EditorData = ({ params, navigate, location, data }) => {
	/** Data function https://github.com/solidjs/solid-app-router#data-functions */
	const [details] = createResource(
		() => params.file_id,
		async (file_id) => await Server.fetchFile({ file_id })
	)
	return details
}

const EditorPage = lazy(() => import("@/views/Editor"))

export const [globalStore, setGlobalStore] = createStore<{
	user?: User
	workspaces: Workspace[]
}>({
	workspaces: [],
})

export const updateUsername = async (username: string) => {
	await Server.updateUsername({ username })
	setGlobalStore("user", "username", username)
}

export const updateFullname = async (fullname: string) => {
	await Server.updateFullname({ fullname })
	setGlobalStore("user", "fullname", fullname)
}

export const [activeWorkspace, setActiveWorkspace] =
	createSignal("workspace_id")

const App: Component = () => {
	const searchParams = useLocation()
	const params = new URLSearchParams(searchParams.search)
	const success = params.get("success")
	const [modal, setModal] = createSignal(success !== null)
	// const openModal = () => setModal(true)
	const closeModal = () => setModal(false)

	const isActive = createSelector(activeWorkspace)
	const navigate = useNavigate()
	const [notificationCount, setNotificationCount] = createSignal(0)
	const data: Resource<
		[
			PromiseSettledResult<AxiosResponse<User>>,
			PromiseSettledResult<AxiosResponse<Workspace[]>>
		]
	> = useRouteData()
	createReaction(async () => {
		if (data()) {
			const [user, workspaces] = data()
			if (user.status === "rejected") {
				navigate(
					createPath({
						path: ROUTE.CHECKIN,
					})
				)
			}
			if (user.status === "fulfilled" && workspaces.status === "fulfilled") {
				console.log("user :- ", user)
				setGlobalStore("user", user.value.data)
				console.log("workspaces :- ", workspaces)
				setGlobalStore("workspaces", workspaces.value.data)
				if (workspaces.value.data[0]?.id) {
					if (searchParams.pathname === "/") {
						navigate(
							createPath({
								path: ROUTE.WORKSPACE,
								params: {
									workspace_id: workspaces.value.data[0]?.id,
									folder_id: "000",
								},
							})
						)
						setActiveWorkspace(workspaces.value.data[0]?.id)
					}
				}
			}
		} else {
			navigate(
				createPath({
					path: ROUTE.CHECKIN,
				})
			)
		}
	})(() => data())
	return (
		<div class="bg-white min-h-screen w-full flex items-center">
			<Show when={globalStore.user}>
				<nav class="min-h-screen shrink-0 w-16 overflow-hidden flex flex-col bg-slate-200">
					<div class="flex flex-col grow">
						<h1 class="w-full py-2 px-2 flex flex-col items-center text-center text-[11px] font-semibold text-indigo-700">
							BHuman
						</h1>
						<div class="h-0.5 w-10/12 mx-auto rounded-xl bg-black"></div>
						<div
							id="user workspaces"
							class="grow py-2"
						>
							<For each={globalStore.workspaces}>
								{(workspace) => (
									<SidenavBtn
										active={isActive(workspace.id)}
										notificationCount={notificationCount}
										svg
										class="bg-blue-900 group-hover:bg-[#27257B] group-focus:bg-[#27257b]"
										classList={{
											"bg-[#27257b]": isActive(workspace.id),
										}}
										onClick={() => {
											navigate(
												createPath({
													path: ROUTE.WORKSPACE,
													params: {
														workspace_id: workspace.id,
														folder_id: "000",
													},
												})
											)
											setActiveWorkspace(workspace.id)
										}}
									>
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M7 6.5H4V5.6C4 5.25 4.25 5 4.6 5H6.4C6.75 5 7 5.25 7 5.6V6.5Z"
												fill="#546E7A"
											/>
											<path
												d="M20 20H4C2.9 20 2 19.1 2 18V11H22V18C22 19.1 21.1 20 20 20Z"
												fill="#168DB3"
											/>
											<path
												d="M6.35 11C6.15 11.65 6 12.3 6 13C6 16.3 8.7 19 12 19C15.3 19 18 16.3 18 13C18 12.3 17.85 11.65 17.65 11H6.35Z"
												fill="#42257A"
											/>
											<path
												d="M4 6H20C21.1 6 22 6.9 22 8V11H2V8C2 6.9 2.9 6 4 6Z"
												fill="#78909C"
											/>
											<path
												d="M16.9496 6.55005H7.09961L8.79961 4.00005C8.99961 3.70005 9.29961 3.55005 9.64961 3.55005H14.4496C14.7996 3.55005 15.0996 3.70005 15.2996 4.00005L16.9496 6.55005Z"
												fill="#78909C"
											/>
											<path
												d="M17.6496 11C16.8496 8.65 14.5996 7 11.9996 7C9.39961 7 7.14961 8.65 6.34961 11H17.6496Z"
												fill="#455A64"
											/>
											<path
												d="M12 17.5C14.4853 17.5 16.5 15.4853 16.5 13C16.5 10.5147 14.4853 8.5 12 8.5C9.51472 8.5 7.5 10.5147 7.5 13C7.5 15.4853 9.51472 17.5 12 17.5Z"
												fill="#73C0D9"
											/>
											<path
												d="M14.4995 11.5C13.8995 10.8 12.9995 10.4 12.0995 10.4C11.1995 10.4 10.2995 10.8 9.69952 11.5C9.44952 11.75 9.49952 12.15 9.74952 12.4C9.99952 12.65 10.3995 12.6 10.6495 12.35C11.3995 11.5 12.7995 11.5 13.5495 12.35C13.6995 12.5 13.8495 12.55 14.0495 12.55C14.1995 12.55 14.3495 12.5 14.4995 12.4C14.6995 12.2 14.7495 11.75 14.4995 11.5Z"
												fill="#A9D8E7"
											/>
											<path
												d="M18 7.5H20.5V9.5H18V7.5Z"
												fill="#DBE2E5"
											/>
										</svg>
									</SidenavBtn>
								)}
							</For>
						</div>
						<div
							id="Main Navigations [Settings,Profile...]"
							class="py-2"
						>
							<SidenavBtn
								active={isActive("settings")}
								notificationCount={() => 0}
								svg
								class="bg-slate-800 group-hover:bg-slate-900 group-focus:bg-slate-900"
								classList={{
									"bg-slate-900": isActive("settings"),
								}}
								onClick={() => {
									navigate(
										createPath({
											path: ROUTE.PROFILE,
										})
									)
									setActiveWorkspace("settings")
								}}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M19.7996 13.6C19.8496 13.25 19.8996 12.9 19.8996 12.5C19.8996 12.1 19.8496 11.75 19.7996 11.4L22.0496 9.80005C22.2496 9.65005 22.3496 9.35005 22.1996 9.10005L19.9996 5.40005C19.8496 5.15005 19.5996 5.05005 19.3496 5.20005L16.8496 6.35005C16.2496 5.90005 15.6496 5.55005 14.9496 5.25005L14.6996 2.50005C14.6496 2.25005 14.4496 2.05005 14.1996 2.05005H9.89957C9.64957 2.05005 9.39957 2.25005 9.39957 2.50005L9.14957 5.25005C8.44957 5.55005 7.79957 5.90005 7.24957 6.35005L4.74957 5.20005C4.49957 5.10005 4.19957 5.20005 4.09957 5.40005L1.94957 9.10005C1.79957 9.35005 1.89957 9.65005 2.09957 9.80005L4.34957 11.4C4.29957 11.75 4.24957 12.1 4.24957 12.5C4.24957 12.9 4.29957 13.25 4.34957 13.6L1.99957 15.2C1.79957 15.35 1.69957 15.65 1.84957 15.9L3.99957 19.6C4.14957 19.85 4.39957 19.95 4.64957 19.8L7.14957 18.65C7.74957 19.1 8.34957 19.4501 9.04957 19.75L9.29957 22.5C9.34957 22.75 9.54957 22.9501 9.79957 22.9501H14.0996C14.3496 22.9501 14.5996 22.75 14.5996 22.5L14.8496 19.75C15.5496 19.4501 16.1996 19.1 16.7496 18.65L19.2496 19.8C19.4996 19.9 19.7996 19.8001 19.8996 19.6L22.0496 15.9C22.1996 15.65 22.0996 15.35 21.8996 15.2L19.7996 13.6Z"
										fill="#E7F7FF"
									/>
									<path
										d="M12 17.5C9.25 17.5 7 15.25 7 12.5C7 9.75 9.25 7.5 12 7.5C14.75 7.5 17 9.75 17 12.5C17 15.25 14.75 17.5 12 17.5Z"
										fill="#E7F7FF"
									/>
									<path
										d="M12 6.5C8.7 6.5 6 9.2 6 12.5C6 15.8 8.7 18.5 12 18.5C15.3 18.5 18 15.8 18 12.5C18 9.2 15.3 6.5 12 6.5ZM12 15C10.6 15 9.5 13.9 9.5 12.5C9.5 11.1 10.6 10 12 10C13.4 10 14.5 11.1 14.5 12.5C14.5 13.9 13.4 15 12 15Z"
										fill="#82A7B9"
									/>
								</svg>
							</SidenavBtn>
						</div>
					</div>
				</nav>
			</Show>
			<Routes>
				<Route
					path={ROUTE.CHECKIN}
					component={CheckInPage}
				/>
				<Route
					path={ROUTE.LOUNGE}
					component={LoungePage}
				/>
				<Route
					path={ROUTE.VERIFICATION}
					component={VerificationPage}
				/>
				<Route
					path={ROUTE.REGISTRATION}
					component={RegistrationPage}
				/>

				<Route
					path={ROUTE.WORKSPACE}
					component={WorkspacePage}
					data={WorkspaceData}
				/>

				<Route
					path={ROUTE.EDITOR}
					component={EditorPage}
					data={EditorData}
				/>

				<Route
					path="/settings"
					component={SettingsLayout}
				>
					<Route
						path={"profile"}
						component={ProfilePage}
					/>
					<Route
						path={"billings"}
						component={BillingsPage}
					/>
					<Route
						path={"ai_studio"}
						component={AIStudioPage}
					/>
				</Route>
			</Routes>
			<Show when={modal()}>
				<Portal>
					<Show
						when={success === "true"}
						fallback={<PaymentFailModal closeEvent={closeModal} />}
					>
						<PaymentSuccessModal closeEvent={closeModal} />
					</Show>
				</Portal>
			</Show>
		</div>
	)
}

export default App

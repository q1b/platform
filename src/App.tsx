import { lazy, Component, createResource } from "solid-js"
import { Route, Routes } from "solid-app-router"

import { fetchFiles, fetchFolders } from "@/api"

const CheckInPage = lazy(() => import("@/views/Auth/Check-in"))
const VerificationPage = lazy(() => import("@/views/Auth/Verification"))
const RegisterationPage = lazy(() => import("@/views/Auth/Registration"))
const ControlPanel = lazy(() => import("@/views/ControlPanel/index"))
const WorkspacePage = lazy(() => import("@/views/Workspace/index"))

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
const App: Component = () => {
	return (
		<Routes>
			<Route
				path="/check-in"
				component={CheckInPage}
			/>
			<Route
				path="/"
				component={ControlPanel}
			/>
			<Route
				path="/verify"
				component={VerificationPage}
			/>
			<Route
				path="/register"
				component={RegisterationPage}
			/>
			<Route
				path="/workspace/:workspace_id"
				component={WorkspacePage}
				data={WorkspaceData}
			/>
		</Routes>
	)
}

export default App

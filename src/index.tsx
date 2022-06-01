import { render } from "solid-js/web"

import "./tailwind.css"
import App from "./App"
import { Router } from "solid-app-router"
import { fetchUserDetails, fetchWorkspaces } from "./api"
import { createResource } from "solid-js"

const fetchMainData = async (workspace_id: string) => {
	return await Promise.allSettled([fetchUserDetails(), fetchWorkspaces()])
}

const MainData = ({ params, navigate, location, data }) => {
	/** Data function https://github.com/solidjs/solid-app-router#data-functions */
	const [details] = createResource(fetchMainData)
	return details
}

render(
	() => (
		<Router data={MainData}>
			<App />
		</Router>
	),
	document.getElementById("root") as HTMLElement
)

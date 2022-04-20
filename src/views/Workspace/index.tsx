import { SplitWindow } from "@/ui/Split"
import { SideNav } from "./sidenav"
import { Body } from "./body"
import { useRouteData } from "solid-app-router"
import { createReaction, onMount, Resource } from "solid-js"
import { AxiosResponse } from "axios"
import { initFoldersForWorkspace } from "./store/handlers"
import { addActor, fetchActor, fetchActors } from "@/api"

const Workspace = () => {
	const data: Resource<
		[
			PromiseSettledResult<AxiosResponse<any, any>>,
			PromiseSettledResult<AxiosResponse<any, any>>
		]
	> = useRouteData()
	createReaction(async () => {
		if (data()) {
			const [fetched_folders, fetched_files] = data()
			if (
				fetched_folders.status === "fulfilled" &&
				fetched_files.status === "fulfilled"
			) {
				// console.log(fetched_folders.value.data)
				// console.log(fetched_files.value.data)
				initFoldersForWorkspace({
					fetched_folders: fetched_folders.value.data,
					fetched_files: fetched_files.value.data,
				})
			}
		}
	})(() => data())
	/**
	 * Important Data to fetch for file to be used:
	 * actor_id: null
	 * audio_batch_id: null
	 * video_id: null
	 */
	return (
		<section>
			<SplitWindow
				class="w-full min-h-screen bg-slate-900 flex flex-row"
				direction="horizontal"
				snapOffset={0}
				gutterSize={0}
				dragInterval={2}
				// sizes={[200, 800]}
				minSize={[0, Infinity]}
				maxSize={[250, Infinity]}
				cursor="w-resize"
				gutterAlign="center"
				mode="skeleton"
			>
				<SideNav />
				<Body />
			</SplitWindow>
		</section>
	)
}

export default Workspace

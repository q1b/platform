import { Client, closeFile } from "@/views/Workspace/api"
import { ChevronLeftIcon } from "@/assets/icons"
import { Panels } from "./Panel"
import { createReaction, createSignal, Resource } from "solid-js"
import { useNavigate, useRouteData } from "solid-app-router"
import { AxiosResponse } from "axios"
import { createPath, ROUTE } from "@/routing"
import { activeWorkspace } from "@/App"

export const [fetchedFile, setFetchedFile] = createSignal()

const Editor = () => {
	const data: Resource<AxiosResponse<[File]>> = useRouteData()
	const navigate = useNavigate()
	if (data.loading)
		createReaction(async () => {
			if (data()) {
				const fetch_file = data()
				console.log("From URL", fetch_file.data[0])
			}
		})(() => data())
	return (
		// <main
		// 	id="body"
		// 	class="w-full flex flex-col items-start h-screen grow"
		// >
		// 	<BodyHeader />
		// 	<Panels />
		// </main>
		<main class="w-full min-h-screen max-h-screen bg-white flex flex-col items-start overflow-hidden">
			<div class="w-full px-3 gap-x-2 py-2.5 border-b-2 font-semibold text-slate-600 flex items-center">
				<button
					class=""
					onClick={() => {
						if (Client.store.activeFile.folder_id) {
							navigate(
								createPath({
									path: ROUTE.WORKSPACE,
									params: {
										workspace_id: activeWorkspace(),
										folder_id: Client.store.activeFile.folder_id,
									},
								})
							)
						} else {
							history.back()
						}
						closeFile({
							folder_id: Client.store.activeFile.folder_id,
							file_id: Client.store.activeFile.file_id,
						})
					}}
				>
					<ChevronLeftIcon class="w-4 h-4" />
				</button>
				<h1 class="text-[13px] leading-none">
					{Client.store.activeFile?.name}
				</h1>
			</div>
			<Panels />
		</main>
	)
}

export default Editor

import { Client, closeFile } from "@/views/Workspace/api"
import { ChevronLeftIcon } from "@/assets/icons"
import { Panels } from "./Panel"
import { createReaction, createSignal, Resource } from "solid-js"
import { useRouteData } from "solid-app-router"
import { AxiosResponse } from "axios"

export const [fetchedFile, setFetchedFile] = createSignal()

const Editor = () => {
	const data: Resource<AxiosResponse<[File]>> = useRouteData()
	console.log("Data", data())
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
						history.back()
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

import { DownloadOutlineIcon } from "@/assets/icons"
import { FreeVideoBtnWithDialog } from "@/ui/FreeVideoBtn&Dialog"
import { Button } from "@/ui2/Buttons"
import { CheckBox } from "@/ui2/Checkbox"
import { Client } from "@/views/Workspace/api"
import { createSignal, Show } from "solid-js"
import csv_store from "../audioPanel/store"
import { generatedVideos } from "../audioPanel/store/generated_videos"

import {
	selectCalendy,
	unselectCalendy,
	getCalendyLink,
	setCalendyLink,
	isSelectedCalendyLink,
} from "./localStore"

export const Header = () => {
	// used for inputing values
	// const [value, setValue] = createSignal(
	// 	getCalendyLink() ? getCalendyLink() : ""
	// )

	return (
		<div class="flex place-content-between">
			<div class="flex gap-x-2">
				<Button
					stylied
					onClick={() => {
						let ld: string[][] = [[]]
						csv_store.table.columns.forEach((col, j) => {
							ld[0].push(col.label)
							col.cells.forEach((cell, i) => {
								if (ld[i + 1] === undefined) {
									ld.push([cell.label])
								} else {
									ld[i + 1].push(cell.label)
								}
							})
						})
						const header = [...ld[0], "video link"].join(",")
						let cells = ""
						for (let i = 1; i < ld.length; i++) {
							const video_link = (video_id) =>
								`https://ai-videos-h20oemtt3-bhuman-app.vercel.app/video/${video_id}?` +
								(getCalendyLink() !== undefined
									? `calendlyUrl=${getCalendyLink()}&`
									: ``) +
								`instanceId=${Client.store.activeFile.file_id}`
							const row = [
								...ld[i],
								video_link(generatedVideos[i - 1].video_id),
							]
							let row_cells = row.join(",")
							if (i !== 1) row_cells = "\n" + row_cells
							cells += row_cells
						}
						const csv_str = header + "\n" + cells
						let hiddenElement = document.createElement("a")
						hiddenElement.href =
							"data:text/csv;charset=utf-8," + encodeURI(csv_str)
						hiddenElement.target = "_blank"
						hiddenElement.download = "output.csv"
						hiddenElement.click()
					}}
					class="bg-blue-400 text-white px-2 py-1 flex items-center group gap-x-0.5"
				>
					<DownloadOutlineIcon
						basic
						class="w-4 h-4"
					/>
					<span class="text-sm"> Download CSV </span>
				</Button>
				{/* <CheckBox
					value={isSelectedCalendyLink}
					toggle={() => {
						if (isSelectedCalendyLink()) {
							unselectCalendy()
						} else {
							selectCalendy()
						}
					}}
				/> */}
				{/* <Show when={isSelectedCalendyLink()}>
					<input
						type="text"
						class="w-32 rounded-md px-1 border focus:outline-none focus:ring-2 ring-slate-500"
						placeholder="Calendy link"
						value={value()}
						onInput={(e) => {
							setValue(e.currentTarget.value)
						}}
					/>
					<button
						type="button"
						onClick={() => {
							setCalendyLink(value())
						}}
						class="flex items-center gap-x-1 group bg-green-300 px-2 rounded-md text-teal-800 active:scale-105 transition-transform "
					>
						<span class="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 group-hover:opacity-0 transition-opacity duration-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="absolute opacity-0 scale-50 group-hover:scale-100 group-hover:opacity-100 -translate-y-full h-5 w-5 transition-[opacity,transform] duration-300 "
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
							</svg>
						</span>
						{getCalendyLink() ? "Update" : "Save"}
					</button>
				</Show> */}
			</div>
		</div>
	)
}

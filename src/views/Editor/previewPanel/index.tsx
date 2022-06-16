import { Client } from "@/views/Workspace/api"
import { Link } from "solid-app-router"
import { createSignal, Index, Show } from "solid-js"
import * as CSV from "../audioPanel/CSVTable"
import csv_store from "../audioPanel/store"
import { generatedVideos } from "../audioPanel/store/generated_videos"
import { Header } from "./Header"
import { getCalendyLink } from "./localStore"

export const PreviewPanel = () => {
	return (
		<div class="w-full h-full flex flex-col p-4">
			<Header />
			<div>
				<CSV.Table
					style={
						{
							// width: `${document.body.getBoundingClientRect().width - 600}px`,
						}
					}
					class="mt-4 flex rounded-lg overflow-auto w-max"
				>
					<Index each={csv_store.table.columns}>
						{(column, x) => {
							let isFirstColumn = x === 0
							let isLastHeader = x === csv_store.table.columns.length - 1
							return (
								// <CSV.Column class="flex flex-col w-max border-indigo-700 z-10">
								// 	<CSV.ColumnHeader
								// 		class="bg-indigo-500 text-white hover:bg-indigo-600 border-indigo-600 border-b text-left px-3 py-1"
								// 		classList={{
								// 			"rounded-tl-md": isFirstColumn,
								// 			"rounded-tr-md ": isLastHeader,
								// 		}}
								// 	>
								// 		{column().label}
								// 	</CSV.ColumnHeader>
								// 	<CSV.CellsContainer class="border-indigo-600 flex flex-col">
								// 		<Index each={column().cells}>
								// 			{(cell, y) => {
								// 				let isFirst = y === 0
								// 				let isLastColLastElement =
								// 					y === column().cells.length - 1 && isLastHeader
								// 				let isFirstColLastElement =
								// 					y === column().cells.length - 1 && isFirstColumn
								// 				return (
								// 					<div
								// 						class="flex text-sm gap-x-5 place-content-between hover:bg-indigo-100 text-indigo-900 hover:text-indigo-900 items-center px-3 py-1 bg-white"
								// 						classList={{
								// 							"border-t": !isFirst,
								// 							"rounded-bl-md": isFirstColLastElement,
								// 							"rounded-br-md ": isLastColLastElement,
								// 						}}
								// 					>
								// 						{cell().label}
								// 					</div>
								// 				)
								// 			}}
								// 		</Index>
								// 	</CSV.CellsContainer>
								// </CSV.Column>
								<CSV.Column class="flex flex-col w-max border-blue-700 z-10">
									<CSV.ColumnHeader
										class="bg-blue-500 border-r text-white hover:bg-blue-600 border-blue-600 text-left px-3 py-1"
										classList={{
											"rounded-tl-md": isFirstColumn,
											"rounded-tr-md border-none": isLastHeader,
										}}
									>
										{column().label}
									</CSV.ColumnHeader>
									<CSV.CellsContainer
										class="border-blue-200 flex flex-col border-r"
										classList={{
											"border-none": isLastHeader,
										}}
									>
										<Index each={column().cells}>
											{(cell, y) => {
												let isFirst = y === 0
												let isLastColLastElement =
													y === column().cells.length - 1 && isLastHeader
												let isFirstColLastElement =
													y === column().cells.length - 1 && isFirstColumn
												return (
													<div
														class="flex border-t border-slate-400 text-sm gap-x-5 place-content-between hover:bg-blue-100 text-blue-900 hover:text-blue-900 items-center px-3 py-1 bg-blue-50"
														classList={{
															// "border-t": isFirst,
															"rounded-bl-md": isFirstColLastElement,
															"rounded-br-md ": isLastColLastElement,
														}}
													>
														{cell().label}
													</div>
												)
											}}
										</Index>
									</CSV.CellsContainer>
								</CSV.Column>
							)
						}}
					</Index>
					<CSV.Column class="flex flex-col w-max">
						<CSV.ColumnHeader class="bg-blue-400 rounded-tr-lg text-white py-1 -translate-x-1 translate-y pl-2 pr-2 z-0">
							Video Link
						</CSV.ColumnHeader>
						<Show when={generatedVideos[0] && csv_store.table.columns[0]}>
							<CSV.CellsContainer class="flex flex-col -translate-x-1 translate-y pl-0.5 z-0">
								<Index each={generatedVideos}>
									{(video, i) => {
										let isFirstHeader = i === 0
										let isLastHeader =
											i === csv_store.table.columns[0].cells.length - 1

										const [isAvailable, setIsAvailable] = createSignal(
											video().response_state === "Success"
										)

										const [isLoading, setLoadingState] = createSignal(
											video().response_state === "Processing"
										)

										const [isFailed, setFailedState] = createSignal(
											video().response_state === "Failed"
										)

										const [isLoaded, setLoadedState] = createSignal(
											!!video().video_url
										)

										return (
											<div
												title={
													isAvailable()
														? "share to your friends"
														: "not available to share"
												}
												class="bg-blue-200 pr-0.5 flex items-center justify-center group transition-colors duration-100"
												classList={{
													// "rounded-tr-lg": isFirstHeader,
													"rounded-br-lg": isLastHeader,
												}}
											>
												<Show
													when={isAvailable()}
													fallback={<span class="w-[29px] h-[29px]"></span>}
												>
													<Link
														rel="external"
														target="_blank"
														href={
															`https://ai-videos-h20oemtt3-bhuman-app.vercel.app/video/${
																video().video_id
															}?` +
															(getCalendyLink() !== undefined
																? `calendlyUrl=${getCalendyLink()}&`
																: ``) +
															`instanceId=${Client.store.activeFile.file_id}`
														}
														class="text-xs group-hover:bg-blue-400 text-white ml-1 my-0.5 whitespace-nowrap px-1 rounded-md max-w-xs overflow-x-auto overflow-y-hidden inline-flex items-center h-[25px]"
													>
														share
														{/* {`https://ai-videos-j5zfsbg4x-bhuman-app.vercel.app/video/${
															video().video_id
														}?` +
															(getCalendyLink() !== undefined
																? `calendlyUrl=${getCalendyLink()}&`
																: ``) +
															`instanceId=${Client.store.activeFile.file_id}`} */}
													</Link>
												</Show>
											</div>
										)
									}}
								</Index>
							</CSV.CellsContainer>
						</Show>
					</CSV.Column>
				</CSV.Table>
			</div>
		</div>
	)
}

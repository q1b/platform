import {
	Client,
	setAudioData,
	setFileImageColumnId,
} from "@/views/Workspace/api"
import {
	Accessor,
	createEffect,
	createSignal,
	createUniqueId,
	For,
	Index,
	Match,
	on,
	Show,
	Switch,
} from "solid-js"

import { activeActor, ACTORS, AudioHeader, setActiveActor } from "./AudioHeader"

import * as CSV from "./CSVTable"
import csv_store, { initStoreFromRes, setCSVStore } from "./store"

import axiosApi, {
	exportGeneratedVideoAsCSV,
	fetchActors,
	fetchAudioData,
	fetchCSVFromAudioBatchData,
	fetchGeneratedVideo,
	fetchSegments,
	fetchVideo,
	getGeneratedVideo,
	postAudioBatchData,
	postCSV,
	updateFileAudioData,
} from "@/api"

import {
	DownloadFillIcon,
	ExclamationCircleFillIcon,
	ExclamationCircleOutlineIcon,
	DownloadOutlineIcon,
	LoadingIcon,
	UploadIcon,
	VideoPlayerFillIcon,
	VideoPlayerOutlineIcon,
} from "@/assets/icons"

import { FileUpload } from "@/ui2/FileUpload"
import {
	addBarItem,
	barDetails,
	BarDetailsOptions,
	colorsIter,
	setBarDetails,
	triggerBarDetailsUpdate,
} from "../videoPanel/Controllers/TimeBar"

import { useReactMediaRecorder } from "@/helpers/audioMediaRecorder"
import { Button } from "@/ui2/Buttons"

// import {
// 	decodeTime,
// 	milliSecToProg,
// 	progToSec,
// 	secToProg,
// 	Time,
// 	timeToMilliSec,
// 	timeToSec,
// } from "../time"

import { range } from "@/helpers/range"

import { VideoPlayerDialog } from "./VideoPlayer"
import { Portal } from "solid-js/web"
import { store } from "@/views/Workspace/api/client/client"
import {
	generatedVideos,
	setGeneratedVideos,
	updateGeneratedVideoURL,
} from "./store/generated_videos"
import { CSVEditTable } from "@/ui/CSVEditTable"
import { convertMilliSecToProgress, millisecondsFromResponse } from "../timeV2"
import { Segment } from "@/api.type"

const uploadCsv = async ({
	ev,
	actor_id,
	// image_column_id,
	audio_batch_id,
	file_id,
	folder_id,
}: {
	ev: BlobPart[]
	actor_id: string
	// image_column_id: number | null
	audio_batch_id?: string
	file_id: string
	folder_id: string
}) => {
	try {
		if (!audio_batch_id) {
			const batchData = await axiosApi.post("audio_batch", {
				name: "audio batch " + new Date().getTime(),
			})

			audio_batch_id = batchData.data.id

			await setAudioData({
				file_id,
				audio_batch_id,
				actor_id,
				folder_id,
			})

			console.log("New Batch Created", audio_batch_id)
		}

		const buffer = new Blob(ev, { type: "text/plain" })

		const formData = new FormData()
		formData.append("file", buffer)

		const resBatchData = await postAudioBatchData({
			audio_batch_id,
			formData,
		})

		// console.log("IMAGE COLUMN ID", image_column_id)
		// setFileImageColumnId({
		// 	file_id: Client.store.activeFile.file_id,
		// 	folder_id: Client.store.activeFile.folder_id,
		// 	image_column_id,
		// })

		console.log("IMAGE COL ID UPDATED")

		let csvResponse = await fetchCSVFromAudioBatchData({
			video_instance_id: Client.store.activeFile.file_id,
			audio_batch_id: resBatchData.data.audio_batch_id,
			actor_id,
		})

		console.log("CSV RESPONSE can be here!", csvResponse)

		return csvResponse
	} catch (error) {
		console.error("UPLOADING CSV FAILED", error)
	}
}

const getPreproccesedGeneratedVideos = async (): Promise<
	{
		video_url: string | undefined
		video_id: string
		vimeo_url: string | undefined
		response_state: "Failed" | "Processing" | "Success"
	}[]
> => {
	const res = await getGeneratedVideo({
		file_id: Client.store.activeFile.file_id,
	})
	console.log("Response", res)
	console.log("EXPORTED CSV", res.data)
	const generated_column = res.data
	const generated_videos: {
		video_url: string | undefined
		vimeo_url: string
		video_id: string
		response_state: "Failed" | "Processing" | "Success"
	}[] = []
	for (let index = 0; index < generated_column.length; index++) {
		const row = generated_column[index]
		const last:
			| "Failed"
			| "Processing"
			| Omit<string, "Failed" | "Processing"> = row.status
		let response_type: "Failed" | "Processing" | "Success"
		let video_id: string
		let vimeo_url: string
		if (last !== "") {
			if (last === "Failed") {
				response_type = "Failed"
			} else if (last === "Processing") {
				response_type = "Processing"
			} else {
				response_type = "Success"
				video_id = row.id
				vimeo_url = row.vimeo_url
			}
		}
		const obj = {
			video_url: undefined,
			video_id,
			vimeo_url,
			response_state: response_type,
		}
		if (response_type !== undefined) generated_videos.push(obj)
	}
	return generated_videos
}

type CSVFileState =
	| "unchecked"
	| "checking"
	| "notUploadedYet"
	| "fetching"
	| "uploading"
	| "deleting"
	| "available"

/**
 * checking
 * 		if available fetching...
 *    else notUploadedYet
 * upload event
 *    uploading csv file
 *       checking
 *          if audio_batch is available
 *          else creating audio_batch
 *       assigning give_data to audio_batch_data
 *    refetching the uploaded csv file,
 *    return the response
 * delete event
 *    deleting the audio_batch
 *    deleted response
 */

const [CSVFileState, setCSVFileState] = createSignal<CSVFileState>("unchecked")

export const AudioPanel = () => {
	// const [imageColumnId, setImageColumnId] = createSignal(
	// 	Client.store.activeFile.image_column_id
	// )

	const [CSVInitialData, setCSVInitialData] = createSignal<string>("")
	const [CSVEditedData, setCSVEditedData] = createSignal("")

	const [CSVSelectableTableModal, setCSVSelectableTableModal] =
		createSignal(false)

	const openCSVSelectableTableModal = () => setCSVSelectableTableModal(true)
	const closeCSVSelectableTableModal = async () => {
		setCSVSelectableTableModal(false)
		await uploadFile(CSVEditedData())
	}

	const [videoPlayerModel, setVideoPlayerModelState] = createSignal(false)
	const [generatedVideoModelURL, setGeneratedVideoModelURL] =
		createSignal<string>()

	const openVideoPlayerModel = () => setVideoPlayerModelState(true)
	const closeVideoPlayerModel = () => setVideoPlayerModelState(false)

	const AudioMediaRecorder = useReactMediaRecorder({
		video: false,
		audio: true,
	})

	const initActor = () => {
		if (Client.store.activeFile?.actor_id) {
			const initActor = ACTORS().find((actor) => {
				return actor.value === Client.store.activeFile.actor_id
			})
			setActiveActor(initActor)
		} else {
			setActiveActor(ACTORS().at(0))
		}
	}

	const bakeBarDetails = ({
		segments,
		duration_time,
	}: {
		segments: Segment[]
		duration_time: number
	}) => {
		console.log("###SEGMENTS", segments, "DURATIONTIME", duration_time)
		setBarDetails([])
		segments.forEach((seg) => {
			let name = seg["audio_variable_name"]
			let start_time_marker_value: number = millisecondsFromResponse(
				seg.variable_time_marker_start
			)
			let end_time_marker_value: number = millisecondsFromResponse(
				seg.variable_time_marker_end
			)
			console.log(
				"Start",
				start_time_marker_value,
				"End",
				end_time_marker_value
			)
			const StartPointProg = convertMilliSecToProgress({
				milliseconds: start_time_marker_value,
				duration_in_milliseconds: duration_time,
			})
			console.log("Progrss 1 ", StartPointProg)
			const EndPointProg = convertMilliSecToProgress({
				milliseconds: end_time_marker_value,
				duration_in_milliseconds: duration_time,
			})
			console.log("Progrss 2 ", EndPointProg)
			addBarItem({
				name,
				progressStamps: [StartPointProg / 1000, EndPointProg / 1000],
			})
		})
	}

	const resetCSVStore = () => setCSVStore("table", "columns", [])

	createEffect(
		on(
			() => Client.store.activeFile.file_id,
			async () => {
				console.log(
					Client.store.activeFile.file_id,
					"FROM AUDIO PANEL NEED TO BE RUN ONCE, AFTER OPENNING A FILE",
					"\nSERVER ",
					!!Client.store.activeFile.video_id ? "🟢" : "🔴",
					Client.store.activeFile.video_id,
					"\nCLIENT URL",
					!!Client.store.activeFile.video_url ? "🟢" : "🔴",
					Client.store.activeFile.video_url,
					"\nCLIENT DURATION",
					!!Client.store.activeFile.video_duration ? "🟢" : "🔴",
					Client.store.activeFile.video_duration,
					"\n"
				)
				setGeneratedVideos(await getPreproccesedGeneratedVideos())
				setGeneratedVideoModelURL("")
				setCSVFileState("checking")
				initActor()
				resetCSVStore()
				setBarDetails([])
				triggerBarDetailsUpdate(() => CSVFileState())
				if (Client.store.activeFile.audio_batch_id) {
					setCSVFileState("fetching")
					const [videoResponse, csvResponse, segResponse] =
						await Promise.allSettled([
							fetchVideo({
								video_id: Client.store.activeFile.video_id,
							}),
							fetchCSVFromAudioBatchData({
								video_instance_id: Client.store.activeFile.file_id,
								audio_batch_id: Client.store.activeFile.audio_batch_id,
								actor_id: Client.store.activeFile.actor_id,
							}),
							fetchSegments({
								file_id: Client.store.activeFile.file_id,
							}),
						])
					let duration_time: number
					if (videoResponse.status === "fulfilled") {
						duration_time =
							millisecondsFromResponse(videoResponse.value.data[0].length) /
							1000
					}
					if (csvResponse.status === "fulfilled") {
						initStoreFromRes(csvResponse.value.data)
						if (
							segResponse.status === "fulfilled" &&
							segResponse.value.data[0] &&
							duration_time
						) {
							console.log("SEGMENT LOADED, res", segResponse)
							bakeBarDetails({
								segments: segResponse.value.data,
								duration_time,
							})
						} else {
							const new_barDetails: BarDetailsOptions[] = []
							csv_store.table.columns.forEach((column, i) => {
								const element = document.createElement("div")
								let id = createUniqueId()
								if (Client.store.activeFile.image_column_id !== i) {
									new_barDetails.push({
										element,
										id,
										name: column.label,
										progressStamps: [(i + 1) / 10, (i + 2) / 10],
										color: colorsIter(),
									})
								}
							})
							setBarDetails(new_barDetails)
						}
						triggerBarDetailsUpdate(() => CSVFileState())
						setCSVFileState("available")
					} else setCSVFileState("notUploadedYet")
				} else {
					setCSVFileState("notUploadedYet")
				}
			}
		)
	)

	// createEffect(
	// 	on(
	// 		() => barDetails,
	// 		() => {
	// 			console.log(barDetails[1])
	// 		}
	// 	)
	// )
	const uploadFile = async (csv_file: string) => {
		setCSVFileState("uploading")
		const csvRes = await uploadCsv({
			ev: [csv_file],
			actor_id: activeActor().value,
			file_id: Client.store.activeFile.file_id,
			folder_id: Client.store.activeFile.folder_id,
			// image_column_id: imageColumnId() || imageColumnId() === 0 ? 0 : null,
			audio_batch_id:
				Client.store.activeFile?.audio_batch_id !== undefined
					? Client.store.activeFile.audio_batch_id
					: undefined,
		})
		initStoreFromRes(csvRes.data)
		const new_barDetails: BarDetailsOptions[] = []
		csv_store.table.columns.forEach((column, i) => {
			const element = document.createElement("div")
			let id = createUniqueId()
			if (Client.store.activeFile.image_column_id !== i) {
				new_barDetails.push({
					element,
					id,
					name: column.label,
					progressStamps: [(i + 1) / 10, (i + 2) / 10],
					color: colorsIter(),
				})
			}
		})
		setBarDetails(new_barDetails)
		triggerBarDetailsUpdate(() => CSVFileState())
		console.log("BAR ITEMS ARE ADDED", barDetails)
		setCSVFileState("available")
	}
	const handleFile = async (csv_file: Blob) => {
		const csv_txt = await csv_file.text()
		setCSVInitialData(csv_txt)
		openCSVSelectableTableModal()
	}

	const [currentRecordingCell, setCurrentRecordingCellURL] =
		createSignal<string>("")

	const [audioElement, setAudioElement] = createSignal<
		HTMLAudioElement | undefined
	>()

	return (
		<div class="w-full h-full flex flex-col p-4">
			<audio
				ref={(el) => {
					setAudioElement(el)
				}}
				src={currentRecordingCell()}
				class="hidden"
			/>
			<AudioHeader
				onActorChange={async ({
					label: actor_name,
					value: actor_id,
				}: {
					label: string
					value: string
				}) => {
					setCSVStore("table", "columns", [])
					setCSVFileState("checking")
					const audio_batch_id = Client.store.activeFile.audio_batch_id
					if (audio_batch_id) {
						setCSVFileState("fetching")
						const uploadResponse = await updateFileAudioData({
							file_id: Client.store.activeFile.file_id,
							audio_batch_id,
							actor_id,
						})
						const csvResponse = await fetchCSVFromAudioBatchData({
							video_instance_id: Client.store.activeFile.file_id,
							audio_batch_id,
							actor_id,
						})
						initStoreFromRes(csvResponse.data)
						setCSVFileState("available")
					} else {
						setCSVFileState("notUploadedYet")
					}
					// console.log(arg.label, arg.value)
					// let res = await axiosApi.get("audio_batch")
					// console.log(res)
				}}
			>
				<FileUpload.Btn
					accept=".csv"
					handleFile={handleFile}
					disabled={CSVFileState() === "uploading"}
					class="bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white group flex items-center gap-x-2 px-2 pb-0.5 rounded-lg transition-[colors,transform] font-semibold hover:scale-[0.99] active:scale-95 focus:outline-none shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ease-in-expo"
				>
					Upload CSV FILE
					<Show
						when={
							CSVFileState() === "uploading" ||
							CSVFileState() === "checking" ||
							CSVFileState() === "fetching"
						}
						fallback={
							<UploadIcon
								basic
								class="w-5 h-5"
							/>
						}
					>
						<LoadingIcon
							basic
							class="w-5 h-5 text-blue-900"
						/>
					</Show>
				</FileUpload.Btn>
			</AudioHeader>
			<div class="h-96">
				<Show
					when={CSVFileState() === "available"}
					fallback={
						<FileUpload.Region
							handleFile={handleFile}
							class="bg-slate-900 border-2 border-dashed shadow-lg text-slate-200/70 w-full mt-6 h-64 rounded-lg flex flex-col items-center justify-center transition-colors"
							classList={(isActive: Accessor<boolean>) => ({
								"bg-blue-500 text-white": isActive(),
							})}
						>
							<Show
								when={
									CSVFileState() === "uploading" ||
									CSVFileState() === "checking" ||
									CSVFileState() === "fetching"
								}
								fallback={
									<p class="text-5xl flex pb-5">
										Drop your <b> .csv </b>&nbsp;file here!
									</p>
								}
							>
								<LoadingIcon
									basic
									class="w-auto h-auto text-yellow-400"
								/>
							</Show>
						</FileUpload.Region>
					}
				>
					<CSV.Table class="mt-4 flex rounded-lg overflow-auto w-max">
						<Index each={csv_store.table.columns}>
							{(column, x) => {
								let isFirstColumn = x === 0
								let isLastHeader = x === csv_store.table.columns.length - 1
								return (
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
													console.log(
														"CLIENT STORE ACTIVEFILE IMAGECOLUMNID ",
														Client.store.activeFile.image_column_id
													)
													// if (Client.store.activeFile.image_column_id === x) {
													// 	console.log("YUP IMAGE COLUMN", cell()?.imageId)
													// 	return (
													// 		<CSV.CellForImage
													// 			class="flex border-t border-slate-400 text-sm gap-x-5 place-content-between hover:bg-blue-100 text-blue-900 hover:text-blue-900 items-center px-3 py-[5px] bg-blue-50"
													// 			classList={{
													// 				// "border-t": isFirst,
													// 				"rounded-bl-md": isFirstColLastElement,
													// 				"rounded-br-md ": isLastColLastElement,
													// 			}}
													// 			cell={cell()}
													// 		>
													// 			{cell()?.label}
													// 		</CSV.CellForImage>
													// 	)
													// }
													return (
														<CSV.Cell
															class="flex border-t border-slate-400 text-sm gap-x-5 place-content-between hover:bg-blue-100 text-blue-900 hover:text-blue-900 items-center px-3 py-1 bg-blue-50"
															classList={{
																// "border-t": isFirst,
																"rounded-bl-md": isFirstColLastElement,
																"rounded-br-md ": isLastColLastElement,
															}}
															audioRef={audioElement}
															currentRecordingCell={currentRecordingCell}
															setCurrentRecordingCell={
																setCurrentRecordingCellURL
															}
															Recorder={AudioMediaRecorder}
															cell={cell()}
														>
															{cell().label}
														</CSV.Cell>
													)
												}}
											</Index>
										</CSV.CellsContainer>
									</CSV.Column>
								)
							}}
						</Index>
						{/* <CSV.Column></CSV.Column> */}
						<CSV.Column class="flex flex-col w-max">
							<CSV.ColumnHeader class="bg-transparent invisible px-3 py-1">
								&nbsp;
							</CSV.ColumnHeader>
							<CSV.CellsContainer class="flex flex-col -translate-x-1 translate-y pl-0.5 z-0">
								<For each={generatedVideos}>
									{(video, i) => {
										let isFirstHeader = i() === 0
										let isLastHeader =
											i() === csv_store.table.columns[0].cells.length - 1

										const [isAvailable, setIsAvailable] = createSignal(
											video.response_state === "Success"
										)

										const [isLoading, setLoadingState] = createSignal(
											video.response_state === "Processing"
										)

										const [isFailed, setFailedState] = createSignal(
											video.response_state === "Failed"
										)

										const [isLoaded, setLoadedState] = createSignal(
											!!video.video_url
										)

										return (
											<button
												class="bg-blue-400 hover:bg-sky-300 flex items-center justify-center group transition-colors duration-100"
												classList={{
													"rounded-tr-lg": isFirstHeader,
													"rounded-br-lg": isLastHeader,
												}}
												onClick={async () => {
													if (isLoaded()) {
														setGeneratedVideoModelURL(video.video_url)
														openVideoPlayerModel()
													} else if (isLoading()) {
													} else if (isAvailable()) {
														setLoadingState(true)
														console.log("FETCHING START FOR GENERATED VIDEO")
														const gen_video = await fetchGeneratedVideo({
															generated_video_id: video.video_id,
														})
														console.log("FETCHING ENDED")
														console.log(
															"RESPOSNE OF GENERATED VIDEO",
															gen_video
														)
														const generated_video_url = URL.createObjectURL(
															gen_video.data
														)
														updateGeneratedVideoURL({
															generated_video_id: video.video_id,
															generated_video_url,
														})
														setLoadingState(false)
														if (generated_video_url !== "") {
															setLoadedState(true)
														}
													} else {
													}
												}}
											>
												<Switch
													fallback={<span class="w-[31px] h-[31px]"></span>}
												>
													<Match when={isFailed()}>
														<span
															title="video can't be processed"
															class="p-1 relative text-white group-hover:text-sky-800 transition-colors"
														>
															<ExclamationCircleOutlineIcon
																size={27}
																class="group-hover:opacity-0 group-hover:scale-75 transition-[transform,opacity] duration-500 ease-snappy"
															/>
															<ExclamationCircleFillIcon
																size={27}
																class="absolute opacity-0 scale-0 -translate-y-full group-hover:opacity-100 group-hover:scale-100 group-active:scale-90 transition-[opacity,transform] duration-500 ease-swift"
															/>
														</span>
													</Match>
													<Match when={isLoaded()}>
														<span
															title="play the video"
															class="p-1 relative text-white group-hover:text-sky-800 transition-colors"
														>
															<VideoPlayerOutlineIcon
																size={27}
																class="group-hover:opacity-0 group-hover:scale-75 transition-[transform,opacity] duration-500 ease-snappy"
															/>
															<VideoPlayerFillIcon
																size={27}
																class="absolute opacity-0 scale-0 -translate-y-full group-hover:opacity-100 group-hover:scale-100 group-active:scale-90 transition-[opacity,transform] duration-500 ease-swift"
															/>
														</span>
													</Match>
													<Match when={isLoading()}>
														<span
															title="video is loading"
															class="p-1 text-white group-hover:text-white"
														>
															<LoadingIcon
																size={27}
																class=""
															/>
														</span>
													</Match>
													<Match when={isAvailable()}>
														<span
															title="download video"
															class="relative p-1 text-white group-hover:text-white transition-colors"
														>
															<DownloadOutlineIcon
																size={27}
																class="group-hover:opacity-0 group-hover:scale-75 transition-[transform,opacity] duration-500 ease-snappy"
															/>
															<DownloadFillIcon
																size={27}
																class="absolute opacity-0 scale-0 -translate-y-full group-hover:opacity-100 group-hover:scale-100 group-active:scale-90 transition-[opacity,transform] duration-500 ease-swift"
															/>
															{/* <div class="absolute w-auto p-2 m-2 min-w-max left-8 rounded-md shadow-md text-white bg-slate-800 text-xs font-bold transition-all duration-100 scale-0 group-hover:scale-100 origin-left">
																hellow
															</div> */}
														</span>
													</Match>
												</Switch>
											</button>
										)
									}}
								</For>
							</CSV.CellsContainer>
						</CSV.Column>
					</CSV.Table>
				</Show>
			</div>
			<div class="">
				{/* <Show when={generatedVideos[0]?.response_state === "Processing"}> */}
				<Button
					stylied
					onClick={async () => {
						const generatedVideos = await getPreproccesedGeneratedVideos()
						setGeneratedVideos(generatedVideos)
					}}
					class="bg-blue-500 px-2 py-1 text-white hover:bg-sky-400 hover:text-blue-500 transition-colors"
				>
					Refresh Generated Videos
				</Button>
				{/* </Show> */}
			</div>
			<Show when={videoPlayerModel()}>
				<Portal>
					<VideoPlayerDialog
						closeEvent={closeVideoPlayerModel}
						videoURL={generatedVideoModelURL}
					/>
				</Portal>
			</Show>
			<Show when={CSVSelectableTableModal()}>
				<Portal>
					<CSVEditTable
						initialCSVData={CSVInitialData()}
						// setImageColumnId={setImageColumnId}
						setCSVEditedData={setCSVEditedData}
						closeEvent={closeCSVSelectableTableModal}
					/>
				</Portal>
			</Show>
		</div>
	)
}

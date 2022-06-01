import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	DeleteIcon,
	LoadingIcon,
	UploadIcon,
} from "@/assets/icons"

import { Button } from "@/ui2/Buttons"

import {
	createEffect,
	createMemo,
	createSignal,
	on,
	Setter,
	Show,
} from "solid-js"
import { SplitWindow } from "@/ui2/Split"
import { Client } from "@/views/Workspace/api/index"

import axiosApi, {
	deleteVideo,
	fetchFile,
	fetchVideo,
	postPipeline,
	postSegment,
	postVideo,
	retrieveVideo,
} from "@/api"

import { Portal } from "solid-js/web"
import { RecorderDialog } from "./Dialog/Recorder"
import { TimeMarker } from "./Controllers/TimeMarker"
import { barDetails, TimeBarsContainer } from "./Controllers/TimeBar"
import { PlayIconButton } from "@/ui2/IconButtons"

import { extractControls, setVideoEl, videoEl } from "./controls"

import { PopUp, SplitButton } from "@/ui2/Buttons/SplitButton"
import { FileUpload } from "@/ui2/FileUpload"

import {
	decodeTime,
	getFormatedTime,
	progToSec,
	Time,
	timeToSec,
} from "../time"

import { setFileTemplateVideoId } from "@/views/Workspace/api"
import {
	setFileVideoDuration,
	setFileVideoURL,
	store,
} from "@/views/Workspace/api/client/client"
import { ProgressBar } from "@/ui/ProgressBar"

// got help from here,
// https://stackoverflow.com/questions/29285056/get-video-duration-when-input-a-video-file
const getVideoDurationFromFile = (file: Blob): Promise<number> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			const media = new Audio(reader.result as string)
			media.onloadedmetadata = () => resolve(media.duration)
		}
		reader.readAsDataURL(file)
		reader.onerror = (error) => reject(error)
	})
}

async function getVideoDurationFromBlob(blob: Blob) {
	const tempVideoEl: HTMLVideoElement = document.createElement("video")

	const durationP = new Promise((resolve, reject) => {
		tempVideoEl.addEventListener("loadedmetadata", () => {
			// Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=642012
			if (tempVideoEl.duration === Infinity) {
				tempVideoEl.currentTime = Number.MAX_SAFE_INTEGER
				tempVideoEl.ontimeupdate = () => {
					tempVideoEl.ontimeupdate = null
					resolve(tempVideoEl.duration)
					tempVideoEl.currentTime = 0
				}
			}
			// Normal behavior
			else resolve(tempVideoEl.duration)
		})
		tempVideoEl.addEventListener("error", (event) => {
			reject(event.error)
		})
	})

	tempVideoEl.src =
		typeof blob === "string" ? blob : window.URL.createObjectURL(blob)

	return durationP
}

type VideoFileState =
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
 *    uploading video file
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

const uploadVideo = async ({
	ev,
	duration,
	file_id,
	setUploadProgress,
	folder_id,
}: {
	ev: BlobPart[]
	duration: string
	file_id: string
	setUploadProgress: Setter<number>
	folder_id: string
}) => {
	try {
		const mimeType = "video/mp4"
		const buffer = new Blob(ev, { type: mimeType })
		const formData = new FormData()
		console.log("FORMDATA Created")
		formData.append("file", buffer)
		const postRes = await axiosApi.post(
			`upload_video?length=${duration}`,
			formData,
			{
				onUploadProgress(progressEvent) {
					console.log(
						"UPLOADING",
						`${(progressEvent.loaded * 100) / progressEvent.total}%`
					)
					setUploadProgress(
						Math.round((progressEvent.loaded * 100) / progressEvent.total)
					)
				},
			}
		)

		const video_id: string = postRes.data?.id

		console.log("Post Video Completed", postRes.data)

		if (!video_id) return

		setFileTemplateVideoId({
			file_id,
			video_id,
			folder_id,
		})

		console.log("VIdeoInstance Is Updated")
		// const videoRes = await retrieveVideo({
		// 	video_id,
		// })
		return {
			data: buffer,
		}
	} catch (error) {
		console.error("FAILED LOADING VIDEO", error)
	}
}

const [VideoFileState, setVideoFileState] =
	createSignal<VideoFileState>("unchecked")

export const VideoPanel = () => {
	let previewContainerRef: HTMLDivElement
	const [videoModel, setVideoModel] = createSignal<boolean>(false)
	const [uploadProgress, setUploadProgress] = createSignal(0)
	const handleFile = async (video_file: Blob, type: "Blob" | "File") => {
		setVideoFileState("uploading")
		let seconds
		if (type === "File") {
			seconds = await getVideoDurationFromFile(video_file)
		} else if (type === "Blob") {
			seconds = await getVideoDurationFromBlob(video_file)
		}
		console.log("PASS :: GOT DURATION ", seconds)
		setDuration(seconds)

		const video = await uploadVideo({
			ev: [video_file],
			file_id: Client.store.activeFile.file_id,
			setUploadProgress: setUploadProgress,
			duration: getFormatedTime.fromMilliSeconds(seconds * 1000),
			folder_id: Client.store.activeFile.folder_id,
		})

		const videoURL: string = URL.createObjectURL(video.data)
		setMediaURL(videoURL)

		setFileVideoDuration({
			folder_id: Client.store.activeFile.folder_id,
			file_id: Client.store.activeFile.file_id,
			video_duration: seconds,
		})

		setFileVideoURL({
			folder_id: Client.store.activeFile.folder_id,
			file_id: Client.store.activeFile.file_id,
			video_url: videoURL,
		})

		setVideoFileState("available")
		setUploadProgress(0)
	}

	const [mediaBlob, setMediaBlob] = createSignal<Blob[] | undefined>()

	const [isLoaded, setIsLoaded] = createSignal<boolean>(false)
	const [duration, setDuration] = createSignal<number>(0)
	const [currentTime, setCurrentTime] = createSignal<number>(0)

	const openVideoModel = () => setVideoModel(true)
	const closeVideoModel = () => {
		setVideoModel(false)
		if (mediaBlob()) {
			handleFile(mediaBlob()[0], "Blob")
		}
	}

	const progress = createMemo(() => (currentTime() * 100) / duration())
	const setProgress = (progress: number) => {
		const seconds = (duration() * progress) / 100
		videoEl().currentTime = seconds
		setCurrentTime(seconds)
	}

	const [mediaURL, setMediaURL] = createSignal<string>("")

	const { play, pause, togglePlay, isPlaying, getTime, setTime } =
		extractControls()

	createEffect(
		on(
			() => Client.store.activeFile.file_id,
			async () => {
				// console.log(
				// 	Client.store.activeFile.file_id,
				// 	"NEED TO BE RUN ONCE, AFTER OPENNING A FILE ",
				// 	"\nSERVER ",
				// 	!!Client.store.activeFile.video_id ? "🟢" : "🔴",
				// 	Client.store.activeFile.video_id,
				// 	"\nCLIENT URL",
				// 	!!Client.store.activeFile.video_url ? "🟢" : "🔴",
				// 	Client.store.activeFile.video_url,
				// 	"\nCLIENT DURATION",
				// 	!!Client.store.activeFile.video_duration ? "🟢" : "🔴",
				// 	Client.store.activeFile.video_duration,
				// 	"\n"
				// )
				setMediaURL("")
				setMediaBlob(undefined)
				setVideoFileState("checking")
				if (
					Client.store.activeFile.video_url &&
					Client.store.activeFile.video_duration
				) {
					setDuration(Client.store.activeFile.video_duration)
					setMediaURL(Client.store.activeFile.video_url)
					setVideoFileState("available")
				} else if (Client.store.activeFile.video_id) {
					setVideoFileState("fetching")
					const { file_id, folder_id } = Client.store.activeFile
					const [videoResponse, video] = await Promise.allSettled([
						fetchVideo({
							video_id: Client.store.activeFile.video_id,
						}),
						// axiosApi.get(`fetch_video?id=${Client.store.activeFile.video_id}`, {
						// 	responseType: "blob",
						// 	onDownloadProgress(progressEvent) {
						// 		console.log(
						// 			"DOWNLOAD FIRST",
						// 			`${Math.round(
						// 				(progressEvent.loaded * 100) / progressEvent.total
						// 			)}%`,
						// 		)
						// 		console.log("DOWNLOAD")
						// 	},
						// }),
						retrieveVideo({
							video_id: Client.store.activeFile.video_id,
						}),
					])
					if (
						videoResponse.status === "fulfilled" &&
						video.status === "fulfilled"
					) {
						const decordedTime: Time = decodeTime.fromMilliSecondsFormat(
							videoResponse.value.data[0].length
						)
						setDuration(timeToSec(decordedTime))
						setFileVideoDuration({
							folder_id: folder_id,
							file_id: file_id,
							video_duration: timeToSec(decordedTime),
						})
						const videoURL: string = URL.createObjectURL(video.value.data)
						setFileVideoURL({
							folder_id: folder_id,
							file_id: file_id,
							video_url: videoURL,
						})
						setMediaURL(videoURL)
						setVideoFileState("available")
					} else {
						setVideoFileState("notUploadedYet")
					}
				} else {
					setVideoFileState("notUploadedYet")
				}
			}
		)
	)
	// createEffect(() => {
	// 	console.log(VideoFileState())
	// })
	return (
		<SplitWindow
			class="grow w-full h-full flex flex-col"
			direction="vertical"
			snapOffset={0}
			cursor={"s-resize"}
			sizes={[72, 28]}
			gutterSize={0}
			gutterAlign="center"
			minSize={[200, Infinity]}
			maxSize={[400, Infinity]}
		>
			<article
				id="video-preview"
				class="w-full p-2 flex flex-col h-full border-b-2"
			>
				<div
					ref={(el: HTMLDivElement) => (previewContainerRef = el)}
					class="
							w-full
							bg-slate-300
							shadow-md	shadow-[rgba(96,165,250,0.1)]
							rounded-2xl
							overflow-y-auto overflow-x-hidden
							flex items-center justify-center grow shrink
						"
				>
					<Show
						when={VideoFileState() === "available" && mediaURL() !== ""}
						fallback={
							<FileUpload.Region
								class="flex w-full h-full flex-col items-center justify-center transition-colors"
								classList={(isActive) => ({
									"bg-slate-200 text-white": isActive(),
									"bg-slate-700 text-slate-200": !isActive(),
								})}
								handleFile={async (video) => {
									console.log("VIDEO RECIVED", video)
									await handleFile(video, "File")
									let seconds = await getVideoDurationFromFile(video)
									if (seconds) {
										setDuration(seconds as number)
										setFileVideoDuration({
											folder_id: Client.store.activeFile.folder_id,
											file_id: Client.store.activeFile.file_id,
											video_duration: seconds,
										})
									}
									console.log("uploaded")
								}}
							>
								<Show
									when={
										VideoFileState() === "uploading" ||
										VideoFileState() === "checking" ||
										VideoFileState() === "fetching"
									}
									fallback={
										<>
											<UploadIcon class="w-32 h-32 drop-shadow-md" />
											<p class="text-slate-400 select-none">
												<b>Drop</b>/<b> Upload </b> your <em>Video here!</em>
											</p>
										</>
									}
								>
									<Show
										when={VideoFileState() === "uploading"}
										fallback={
											<LoadingIcon
												basic
												class="w-32 h-32 text-metalGray-e00"
											/>
										}
									>
										<ProgressBar.CircularProgressbar
											radius={100}
											progress={uploadProgress}
											strokeWidth={28}
											strokeColor="#ffce54"
											trackStrokeWidth={14}
											steps={100}
											cut={120}
											rotate={-210}
											fillColor="none"
											strokeLinecap="round"
											transition=".2s ease-in"
											pointerRadius={0}
											pointerStrokeWidth={20}
											pointerStrokeColor="indianred"
											pointerFillColor="white"
											trackStrokeColor="#e6e6e6"
											trackStrokeLinecap="round"
											trackTransition=".3s ease"
											counterClockwise={false}
											inverse={false}
											initialAnimation={false}
											initialAnimationDelay={0}
											className=""
										>
											<div
												class="flex items-center justify-center text-center absolute
                top-0
                w-full h-full
								mx-auto
								my-0
                text-2xl
								text-white select-none "
											>
												<div>{uploadProgress()}%</div>
											</div>
										</ProgressBar.CircularProgressbar>
									</Show>
								</Show>
							</FileUpload.Region>
						}
					>
						<video
							preload="auto"
							style={{
								height: `${
									previewContainerRef.getBoundingClientRect().height
								}px`,
								width: "auto",
							}}
							ref={(el) => setVideoEl(el)}
							onLoadedData={() => {
								setIsLoaded(true)
							}}
							onTimeUpdate={() => {
								setCurrentTime(videoEl().currentTime)
							}}
							src={mediaURL()}
							// onWaiting={() => pause()}
						></video>
					</Show>
				</div>
			</article>
			<article
				id="video-controllers-group"
				class="border-b-2 flex flex-col w-full h-full overflow-auto sc"
				tabIndex={-1}
			>
				<div
					id="video-primary-action-group"
					class="w-full flex place-content-between border-b-2 p-2"
				>
					<SplitButton.Container
						class={`
								inline-flex touch-manipulation select-none rounded-lg 
			         bg-blue-500 text-blue-50 shadow-lg shadow-blue-700/40
			      `}
					>
						<SplitButton.Btn
							onClick={openVideoModel}
							class={`
									inline-flex
			            cursor-pointer
			            appearance-none
			            items-center whitespace-nowrap border-none px-2.5 py-1
									bg-transparent hover:bg-blue-700 focus-within:bg-blue-700 active:bg-blue-800
			           text-white hover:text-white focus-within:text-white
			            rounded-l-lg focus:outline-none
			            transition-colors ease-snappy
				   		`}
						>
							Record Video
						</SplitButton.Btn>
						<PopUp.Container
							isList={true}
							class={`
				  group relative inline-flex w-7 items-center justify-center rounded-r-lg border-l-2  
				  cursor-pointer 
			    bg-transparent hover:bg-blue-700 focus-within:bg-blue-700 
			   hover:text-white focus-within:text-white 
				  focus:outline-none z-10
						`}
						>
							<PopUp.Indicator>
								<ChevronDownIcon class="box-content h-4 w-4 group-focus-within:rotate-180 duration-200" />
							</PopUp.Indicator>
							<PopUp.List
								class={`pointer-events-none absolute 
				                top-[80%] left-[-1.5ch] 
				                flex list-none flex-col overflow-hidden 
				                rounded-md shadow-md
				                bg-blue-400 text-sm text-blue-200 shadow-blue-900/60 
				                transition-opacity opacity-0 group-focus-within:opacity-100 duration-200
				                focus:outline-none 
				                group-focus-within:pointer-events-auto 
				                group-focus-within:translate-y-0 
				                py-1 border border-blue-300/30
											`}
							>
								<PopUp.Item>
									<FileUpload.Btn
										accept="video/*"
										disabled={
											VideoFileState() === "fetching" ||
											VideoFileState() === "uploading" ||
											VideoFileState() === "checking" ||
											VideoFileState() === "deleting"
										}
										class={`
									 whitespace-nowrap 
									 inline-flex items-center cursor-pointer appearance-none border-none 
							     bg-blue-500 hover:bg-blue-800 focus-within:bg-blue-800 active:bg-blue-900
						       hover:text-blue-300 focus-within:text-blue-300 active:text-blue-200
							     focus:outline-none
						       w-full
								   px-2 py-1 gap-x-1 
								`}
										handleFile={async (video) => {
											console.log("VIDEO RECIVED", video)
											await handleFile(video, "File")
											let seconds = await getVideoDurationFromFile(video)
											if (seconds) {
												setDuration(seconds as number)
												setFileVideoDuration({
													folder_id: Client.store.activeFile.folder_id,
													file_id: Client.store.activeFile.file_id,
													video_duration: seconds,
												})
											}
											console.log("uploaded")
										}}
									>
										{VideoFileState() === "fetching"
											? "Loading"
											: VideoFileState() === "uploading"
											? "Uploading"
											: "Upload Video"}
										<Show
											when={
												VideoFileState() === "uploading" ||
												VideoFileState() === "checking" ||
												VideoFileState() === "fetching"
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
												class="w-5 h-5 text-metalGray-e00"
											/>
										</Show>
									</FileUpload.Btn>
								</PopUp.Item>
								<PopUp.Item>
									<Button
										class={`
									 whitespace-nowrap 
									 inline-flex items-center cursor-pointer appearance-none border-none 
							     bg-blue-500 hover:bg-blue-800 focus-within:bg-blue-800 active:bg-blue-900
						       hover:text-blue-300 focus-within:text-blue-300 active:text-blue-200
							     focus:outline-none
						       w-full
								   px-2 py-1 gap-x-1 
								`}
										onClick={async () => {
											const { folder_id, file_id, video_id } = store.activeFile
											const deleteRes = await deleteVideo({
												video_id,
											})
											console.log("VIDEO deleted", deleteRes)
											const fileRes = await fetchFile({
												file_id,
											})
											console.log("FILE RES AFTER DELETETION", fileRes)
											setFileTemplateVideoId({
												file_id,
												folder_id,
												video_id,
											})
											console.log("DELETED SECTIOn ENDED NO LOGS! AFTER HERE,")
										}}
									>
										Delete Video <DeleteIcon />
									</Button>
								</PopUp.Item>
							</PopUp.List>
						</PopUp.Container>
					</SplitButton.Container>
					<div class="flex text-slate-900 items-center gap-x-2">
						<button
							onClick={() => {
								const newTime = videoEl().currentTime - 10
								videoEl().currentTime = newTime
								setCurrentTime(newTime)
							}}
							class="group"
						>
							<ChevronLeftIcon basic />
						</button>
						<div class="flex items-center gap-x-2">
							<PlayIconButton
								onClick={togglePlay}
								state={isPlaying}
								setState={(() => {}) as Setter<boolean>}
							/>
							<span id="timer">
								{(() => {
									return getFormatedTime.fromSeconds(currentTime())
								})()}
							</span>
						</div>
						<button
							onClick={() => {
								const newTime = videoEl().currentTime + 10
								videoEl().currentTime = newTime
								setCurrentTime(newTime)
							}}
							class="group"
						>
							<ChevronRightIcon basic />
						</button>
					</div>

					<Button
						onClick={async () => {
							barDetails.forEach(async (bar, column_id) => {
								console.log("NUMBER oF BARS __ -", bar)
								let variable_time_marker_start =
									getFormatedTime.fromMilliSeconds(
										progToSec({
											progress: bar.progressStamps[0] * 100,
											duration: duration(),
										}) * 1000
									)
								let variable_time_marker_end = getFormatedTime.fromMilliSeconds(
									progToSec({
										progress: bar.progressStamps[1] * 100,
										duration: duration(),
									}) * 1000
								)
								let formatedDur = getFormatedTime.fromMilliSeconds(
									duration() * 1000
								)
								const postSeg = {
									audio_variable_name: bar.name,
									audio_variable_column_id: column_id,
									video_instance_id: Client.store.activeFile.file_id,
									variable_time_marker_start: variable_time_marker_start,
									variable_time_marker_end: variable_time_marker_end,
									prefix_time_marker_start: "00:00:00:00",
									prefix_time_marker_end: variable_time_marker_start,
									suffix_time_marker_start: variable_time_marker_end,
									suffix_time_marker_end: formatedDur,
								}
								console.log(postSeg)
								console.log("uploading the Segments")
								const postRes = await postSegment(postSeg)
								console.log("uploaded the Segments, res ", postRes.data)
							})
							console.log("Triggering the pipeline ")
							const pipelineRes = await postPipeline({
								lipsync_with_image: false,
								file_id: Client.store.activeFile.file_id,
							})
							console.log("Triggering complete, res", pipelineRes.data)
						}}
						stylied
						class="px-2 leading-6 pt-0.5 pb-1 bg-blue-500 text-white hover:bg-blue-400  focus-visible:ring-blue-300 focus-visible:ring-offset-cyan-50"
					>
						Generate Video
					</Button>
				</div>
				<div
					id="time-marker"
					class="flex"
				>
					{/* <div
						id="left-col-of-data"
						class="flex flex-col w-40"
					>
						<div
							id="spacer"
							class="h-7 border-r-2"
						></div>
						<button class="border-y-2 flex items-start px-3 py-1 border-r-2">
							<span class="text-white">Video Data</span>
						</button>
						<div
							id="spacer"
							class="h-3 border-r-2"
						></div>
						<button class="border-y-2 flex items-start px-3 py-1 border-r-2">
							<span class="text-white">Video Data</span>
						</button>
						<div
							id="spacer"
							class="h-3 border-r-2"
						></div>
					</div> */}
					<div class="grow flex pr-0.5">
						<div class="grow">
							<TimeMarker
								prog={progress}
								progFunc={(progress) => {
									setProgress(progress)
								}}
							/>
							<TimeBarsContainer />
						</div>
					</div>
				</div>
			</article>
			<Show when={videoModel()}>
				<Portal>
					<RecorderDialog
						closeEvent={closeVideoModel}
						setBlob={setMediaBlob}
					/>
				</Portal>
			</Show>
		</SplitWindow>
	)
}

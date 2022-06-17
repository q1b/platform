import axiosApi, {
	fetchAudio,
	renameAudio,
	postAudio,
	deleteAudio,
	fetchAudioData,
	postImage,
	fetchImage,
} from "@/api"

import {
	CheckIcon,
	DeleteIcon,
	ImageIcon,
	LoadingIcon,
	UploadIcon,
} from "@/assets/icons"
import { ReactMediaRecorderRenderProps } from "@/helpers/audioMediaRecorder"
import { FileUpload } from "@/ui2/FileUpload"
import { AudioMicrophoneButton, PlayIconButton } from "@/ui2/IconButtons"
import { Client } from "@/views/Workspace/api"

import {
	Accessor,
	children,
	ComponentProps,
	createEffect,
	createReaction,
	createSignal,
	onCleanup,
	onMount,
	Setter,
	Show,
	splitProps,
} from "solid-js"

import { getFormatedTime } from "../time"

import { activeActor } from "./AudioHeader"

import { updateCellAudioURL, updateCellImageURL } from "./store"

export const Table = (props: ComponentProps<"section">) => {
	const [, others] = splitProps(props, ["children", "ref"])
	return <section {...others}>{children(() => props.children)()}</section>
}

export const Column = (props: ComponentProps<"div">) => {
	const [, others] = splitProps(props, ["children", "ref"])
	return <div {...others}>{children(() => props.children)()}</div>
}

export const ColumnHeader = (props: ComponentProps<"button">) => {
	const [, others] = splitProps(props, ["children", "ref"])
	return <button {...others}>{children(() => props.children)()}</button>
}

export const CellsContainer = (props: ComponentProps<"div">) => {
	const [, others] = splitProps(props, ["children", "ref"])
	return <div {...others}>{children(() => props.children)()}</div>
}

type CellAudioAPIState =
	| "unchecked"
	| "checking"
	| "notUploadedYet"
	| "fetching"
	| "uploading"
	| "deleting"
	| "available"

type CellProps<P = {}> = P & {
	audioRef: Accessor<HTMLAudioElement | undefined>
	currentRecordingCell: Accessor<string>
	setCurrentRecordingCell: Setter<string>
	Recorder: ReactMediaRecorderRenderProps
	cell: {
		readonly x: number
		readonly y: number
		readonly label: string
		readonly imageURL: string
		readonly imageId: string
		readonly audioURL: string
		readonly audioId: string
	}
}

const uploadAudio = async ({
	ev,
	name,
	length,
	actor_id,
}: {
	ev: BlobPart[]
	name: string
	length: string
	audio_id: string
	actor_id: string
}) => {
	try {
		const buffer = new Blob(ev, { type: "audio/webm" })
		// console.log("AUDIOBATCHID", audio_batch_id)
		const formData = new FormData()
		formData.append("file", buffer)
		console.log("POSTING AUDIO", name)
		const AudioResponse = await postAudio({
			name,
			length,
			actor_id,
			formData,
		})
		console.log("FETCHING AUDIO ", AudioResponse)
		let fetchResponse = await fetchAudio({
			audio_id: AudioResponse.data?.id,
		})
		console.log("AUDIO AVAILABLE NAME:-", name, fetchResponse)
		return fetchResponse
	} catch (error) {}
}

export const Cell = (props: CellProps<ComponentProps<"div">>) => {
	const [apiState, setAPIState] = createSignal<CellAudioAPIState>("unchecked")

	const [local, others] = splitProps(props, [
		"children",
		"ref",
		"cell",
		"Recorder",
		"setCurrentRecordingCell",
		"currentRecordingCell",
		"audioRef",
	])

	const [recordingState, setRecordingState] = createSignal<boolean>(false)
	const [isPlaying, setPlayingState] = createSignal<boolean>(false)

	const [second, setSecond] = createSignal(0)
	// createEffect(async () => {
	// 	console.log("ACTOR", activeActor())
	// 	const AudioData = await axiosApi.get(
	// 		`audio?actor_id=${activeActor().value}`
	// 	)
	// 	console.log(AudioData)
	// })

	onMount(async () => {
		setAPIState("checking")
		if (local.cell.audioId) {
			setAPIState("fetching")
			const AudioRes = await fetchAudio({
				audio_id: local.cell.audioId,
			})
			updateCellAudioURL(
				local.cell.x,
				local.cell.y,
				URL.createObjectURL(AudioRes.data)
			)
			console.log("AUDIO AVAILABLE")
			setAPIState("available")
		} else {
			setAPIState("notUploadedYet")
		}
	})

	const getAudioDurationFromFile = (file: Blob): Promise<number> => {
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

	const handleFile = async (
		audio_file: Blob,
		type: "File" | "Blob" = "Blob"
	) => {
		setAPIState("uploading")
		let length: string
		if (type === "Blob") {
			length = getFormatedTime.fromMilliSeconds(Date.now() - second())
		} else if (type === "File") {
			length = getFormatedTime.fromMilliSeconds(
				(await getAudioDurationFromFile(audio_file)) * 1000
			)
		}
		const audioRes = await uploadAudio({
			ev: [audio_file],
			actor_id: activeActor().value,
			audio_id: local.cell.audioId,
			name: local.cell.label,
			length: length,
		})
		console.log("AUDIO UPLOAD RES ", audioRes)
		setAPIState("available")
	}

	const track = createReaction(async () => {
		console.log("HANDLING FILE STARTED")

		await handleFile(local.Recorder.mediaChunks()[0])

		console.log("HANDLING FILE STOPED")

		updateCellAudioURL(
			local.cell.x,
			local.cell.y,
			local.Recorder.mediaBlobUrl()
		)
		local.Recorder?.resetMediaChunks ? local.Recorder.resetMediaChunks() : null
		local.Recorder?.resetBlobUrl ? local.Recorder.resetBlobUrl() : null
	})

	const handleRecording = () => {
		if (local.Recorder.status() === "idle") {
			setSecond(Date.now())
			local.Recorder.startRecording()
		} else {
			local.Recorder.stopRecording()
			track(() => {
				local.Recorder.mediaBlobUrl()
			})
		}
	}

	const handlePlayingPause = () => {
		console.log("AUDIOURL", local.cell.audioURL)
		const audioURL = local.cell.audioURL
		const audioElement = local.audioRef()
		if (audioURL !== local.currentRecordingCell()) {
			if (audioURL) local.setCurrentRecordingCell(audioURL)
			if (audioElement && audioURL !== undefined) {
				audioElement.src = audioURL
				audioElement.play()
				audioElement?.addEventListener(
					"ended",
					() => {
						setPlayingState(false)
					},
					{
						once: true,
					}
				)
			}
		} else {
			if (isPlaying()) {
				audioElement?.pause()
			} else {
				audioElement?.play()
				audioElement?.addEventListener(
					"ended",
					() => {
						setPlayingState(false)
					},
					{
						once: true,
					}
				)
			}
		}
	}

	return (
		<div {...others}>
			{children(() => props.children)()}
			<div class="flex items-center gap-x-1">
				<Show
					when={local.cell?.audioURL}
					fallback={
						<>
							<Show
								when={
									apiState() === "uploading" ||
									apiState() === "checking" ||
									apiState() === "fetching"
								}
								fallback={
									<>
										<FileUpload.Btn
											accept="audio/*"
											handleFile={(audio_file) => {
												handleFile(audio_file)
												const blob = new Blob([audio_file], {
													type: "audio/wav",
												})
												const url = URL.createObjectURL(blob)
												updateCellAudioURL(local.cell.x, local.cell.y, url)
											}}
											disabled={false}
											class="group rounded-full p-1 hover:bg-white flex items-center"
										>
											<UploadIcon class="w-4 h-4" />
										</FileUpload.Btn>
										<AudioMicrophoneButton
											ref={(el) => {
												el.addEventListener("click", handleRecording)
												onCleanup(() => {
													el.removeEventListener("click", handleRecording)
												})
											}}
											activeColors={[
												{
													fill: "hsl(258deg,100%,38%)",
													stroke: "#FFF",
												},
												{
													fill: "hsl(288deg,82%,44%)",
													stroke: "#FFF",
												},
											]}
											colors={[
												{
													fill: "hsl(258deg,100%,58%)",
													stroke: "#FFF",
												},
												{
													fill: "hsl(292deg,82%,52%)",
													stroke: "#FFF",
												},
											]}
											width={26}
											height={26}
											state={recordingState}
											setState={setRecordingState}
										/>
									</>
								}
							>
								<div class="bg-indigo-600 p-1 rounded-full flex items-center">
									<LoadingIcon class="text-white w-[17px] h-[17px]" />
								</div>
							</Show>
						</>
					}
				>
					<PlayIconButton
						ref={(el) => {
							el.addEventListener("click", handlePlayingPause)
							onCleanup(() => {
								el.removeEventListener("click", handlePlayingPause)
							})
						}}
						colors={[
							{
								fill: "#92ACA8",
								stroke: "#FFF",
							},
							{
								fill: "#818CF8",
								stroke: "#FFF",
							},
						]}
						state={isPlaying}
						setState={setPlayingState}
						width={26}
						height={26}
					/>
					<button
						class="group"
						onClick={async () => {
							local.Recorder.clearBlobUrl(local.cell.audioURL)
							setAPIState("deleting")
							await deleteAudio({
								audio_id: local.cell.audioId,
							})
							setAPIState("notUploadedYet")
							updateCellAudioURL(local.cell.x, local.cell.y, undefined)
						}}
					>
						<Show
							when={apiState() === "deleting"}
							fallback={<DeleteIcon basic />}
						>
							<div class="bg-rose-100 p-1 rounded-full flex items-center">
								<LoadingIcon class="w-[18px] h-[18px] text-rose-500" />
							</div>
						</Show>
					</button>
				</Show>
			</div>
		</div>
	)
}

const uploadImage = async ({ ev }: { ev: BlobPart[] }) => {
	try {
		const buffer = new Blob(ev, { type: "image/*" })
		// console.log("AUDIOBATCHID", audio_batch_id)
		const formData = new FormData()
		formData.append("file", buffer)
		console.log("Sending Image for POST")
		const ImageResponse = await postImage({
			file_id: Client.store.activeFile.file_id,
			formData,
		})
		console.log("FETCHING IMAGE ", ImageResponse)
		let fetchResponse = await fetchImage({
			image_id: ImageResponse.data?.id,
		})
		console.log("IMAGE AVAILABLE NAME:-", fetchResponse)
		return fetchResponse
	} catch (error) {
		console.log("👇 from uploadImage Func")
		console.error(error)
	}
}

type ImageCellProps<P = {}> = P & {
	// imgRef: Accessor<HTMLImageElement | undefined>
	// currentPosingCell: Accessor<string>
	// setCurrentPosingCell: Setter<string>
	// Camera: ReactMediaRecorderRenderProps
	cell: {
		readonly x: number
		readonly y: number
		readonly label: string
		readonly imageURL: string
		readonly imageId: string
		readonly audioURL: string
		readonly audioId: string
	}
}

export const CellForImage = (props: ImageCellProps<ComponentProps<"div">>) => {
	const [apiState, setAPIState] = createSignal<CellAudioAPIState>("unchecked")

	const [local, others] = splitProps(props, [
		"children",
		"ref",
		"cell",
		// "Camera",
		// "setCurrentPosingCell",
		// "currentPosingCell",
		// "imgRef",
	])

	const [posingState, setPosingState] = createSignal<boolean>(false)
	const [isSeeing, setSeeingState] = createSignal<boolean>(false)

	onMount(async () => {
		setAPIState("checking")
		if (local.cell.imageId) {
			setAPIState("fetching")
			const imageRes = await fetchImage({
				image_id: local.cell.imageId,
			})
			updateCellImageURL(
				local.cell.x,
				local.cell.y,
				URL.createObjectURL(imageRes.data)
			)
			console.log("Image AVAILABLE")
			setAPIState("available")
		} else {
			setAPIState("notUploadedYet")
		}
	})

	const handleFile = async (image_file: Blob) => {
		setAPIState("uploading")
		console.log("Image Uploading")
		const imageRes = await uploadImage({
			ev: [image_file],
		})
		console.log("Image UPLOAD RES ", imageRes)
		setAPIState("available")
	}

	// const track = createReaction(async () => {
	// 	console.log("HANDLING FILE STARTED")

	// 	await handleFile(local.Camera.mediaChunks()[0])

	// 	console.log("HANDLING FILE STOPED")

	// 	updateCellAudioURL(
	// 		local.cell.x,
	// 		local.cell.y,
	// 		local.Camera.mediaBlobUrl()
	// 	)
	// 	local.Camera?.resetMediaChunks ? local.Recorder.resetMediaChunks() : null
	// 	local.Camera?.resetBlobUrl ? local.Recorder.resetBlobUrl() : null
	// })

	// const handleRecording = () => {
	// 	if (local.Recorder.status() === "idle") {
	// 		setSecond(Date.now())
	// 		local.Recorder.startRecording()
	// 	} else {
	// 		local.Recorder.stopRecording()
	// 		track(() => {
	// 			local.Recorder.mediaBlobUrl()
	// 		})
	// 	}
	// }

	// const handlePlayingPause = () => {
	// 	console.log("AUDIOURL", local.cell.imageURL)
	// 	const imageURL = local.cell.imageURL
	// 	const imageElement = local.imgRef()
	// 	if (imageURL !== local.currentPosingCell()) {
	// 		if (imageURL) local.setCurrentPosingCell(imageURL)
	// 		if (imageElement && imageURL !== undefined) {
	// 			imageElement.src = imageURL
	// 			// audioElement.play()
	// 		}
	// 	} else {
	// 		if (isSeeing()) {
	// 			// audioElement?.pause()
	// 		} else {
	// 			// audioElement?.play()
	// 		}
	// 	}
	// }

	return (
		<div {...others}>
			{children(() => props.children)()}
			<div class="flex items-center gap-x-1">
				<Show
					when={local.cell?.imageURL}
					fallback={
						<>
							<Show
								when={
									apiState() === "uploading" ||
									apiState() === "checking" ||
									apiState() === "fetching"
								}
								fallback={
									<>
										<FileUpload.Btn
											accept="image/*"
											handleFile={(image_file) => {
												console.log("IMAGE FILE Uploaded", image_file)
												handleFile(image_file)
												const blob = new Blob([image_file], {
													type: image_file.type,
												})
												const url = URL.createObjectURL(blob)
												updateCellImageURL(local.cell.x, local.cell.y, url)
											}}
											disabled={false}
											class="group rounded-full p-1 hover:bg-white flex items-center"
										>
											<UploadIcon class="w-4 h-4" />
										</FileUpload.Btn>
									</>
								}
							>
								<div class="bg-indigo-600 p-1 rounded-full flex items-center">
									<LoadingIcon class="text-white w-[17px] h-[17px]" />
								</div>
							</Show>
						</>
					}
				>
					<button class="group rounded-full p-1 hover:bg-white flex items-center">
						<ImageIcon class="w-4 h-4" />
					</button>
				</Show>
			</div>
		</div>
	)
}

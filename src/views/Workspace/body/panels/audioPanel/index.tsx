import { store } from "@/views/Workspace/store"
import {
	createEffect,
	createReaction,
	createSignal,
	Index,
	Setter,
} from "solid-js"
import { activeActor, AudioHeader, setActiveActor } from "./AudioHeader"
import * as CSV from "./CSVTable"
import csv_store, { initStoreFromCSV, initStoreFromRes } from "./store"
import initRes from "./res"
import axiosApi, {
	fetchCSV,
	fetchJsonFromCSV,
	postAudioBatchData,
	postCSV,
	updateFileAudioData,
} from "@/api"
import { UploadIcon } from "@/assets/icons"
import { Button } from "@/ui/Buttons"
import {
	setFileActor,
	setFileAudioBatchId,
} from "@/views/Workspace/store/handlers"

const fetchCsvData = async ({
	actor_id,
	audio_batch_id,
}: {
	audio_batch_id: string
	actor_id: string
}) => {
	try {
		const res = await axiosApi.get(
			`audio_batch_data?audio_batch_id=${audio_batch_id}&actor_id=${actor_id}`
		)
		// setAudioData(Array(res.data.flat().length))
		// setCurrentId(res.data[0].length)
		return res.data
	} catch (e) {
		return []
	}
}

const uploadCsv = async ({
	ev,
	actor_id,
	audio_batch_id,
	file_id,
	folder_id,
}: {
	ev: BlobPart[]
	actor_id: string
	audio_batch_id?: string
	file_id: string
	folder_id: string
}) => {
	try {
		if (!audio_batch_id) {
			const batchData = await axiosApi.post("audio_batch", {
				name: "audio batch " + new Date().getTime(),
			})

			// console.log("loaded batch audio_batch", batchData)

			audio_batch_id = batchData.data.id
			// await axiosApi.put(`video_instance?id=${file_id}`, { audio_batch_id: batchData.data.id, actor_id: activeActor().value });
			const uploadRes = await updateFileAudioData({
				file_id,
				audio_batch_id,
				actor_id,
			})

			// console.log("FILE UPDATED WITH NEW AUDIO BATCH ACTOR ID\n", uploadRes)

			setFileActor({
				folder_id,
				file_id,
				actor_id,
			})
			setFileAudioBatchId({
				folder_id,
				file_id,
				audio_batch_id,
			})
		}
		const buffer = new Blob(ev, { type: "audio/webm" })
		// console.log("AUDIOBATCHID", audio_batch_id)
		const formData = new FormData()
		formData.append("file", buffer)
		const resBatchData = await postAudioBatchData({
			audio_batch_id,
			formData,
		})
		let csvData = await fetchCsvData({
			audio_batch_id: resBatchData.data.audio_batch_id,
			actor_id,
		})
		return csvData
	} catch (error) {}
}

export const FileUploader = (props: { handleFile: (arg0: Blob) => void }) => {
	let hiddenFileInput: HTMLInputElement
	return (
		<>
			<Button
				onClick={() => hiddenFileInput.click()}
				class="bg-indigo-300 text-indigo-900 hover:bg-indigo-500 hover:text-white group flex items-center gap-x-2 px-2 pb-0.5 rounded-lg transition-[colors,transform] font-semibold hover:scale-[0.99] active:scale-95 focus:outline-none shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ease-in-expo"
			>
				Upload CSV FILE
				<UploadIcon
					basic
					class="w-5 h-5"
				/>
			</Button>
			<input
				ref={(el) => (hiddenFileInput = el)}
				type="file"
				onChange={(e) => {
					const fileUploaded = e.currentTarget.files[0]
					props.handleFile(fileUploaded)
				}}
				accept=".csv"
				class="hidden"
			/>
		</>
	)
}

export const CSVUploadBtn = (props: {
	csvDataSetter: Setter<any>
	file_id: string
	folder_id: string
	audio_batch_id: string
}) => {
	const [isLoaded, setIsLoaded] = createSignal<boolean>(false)
	// const [isFetching,setFecthing] = createSignal<boolean>(false);
	const [file, setFile] = createSignal<Blob>()
	const triggerFormAction = createReaction(async () => {
		const csvRes = await uploadCsv({
			ev: [file()],
			actor_id: activeActor().value,
			file_id: props.file_id,
			folder_id: props.folder_id,
			audio_batch_id: props?.audio_batch_id,
		})
		props.csvDataSetter(csvRes)
	})
	return (
		<>
			<FileUploader
				handleFile={(csv_file: File) => {
					triggerFormAction(() => file())
					setFile(csv_file)
					setIsLoaded(true)
				}}
			/>
		</>
	)
}

export const AudioPanel = () => {
	initStoreFromCSV(initRes)
	const [csvData, setCSVData] = createSignal()
	createEffect(async () => {
		if (store.activeFile.audio_batch_id) {
			console.log("Start fetching CSV DATA")
			const csvData = await fetchCsvData({
				audio_batch_id: store.activeFile.audio_batch_id,
				actor_id: store.activeFile.actor_id,
			})
			initStoreFromRes(csvData)
		} else {
			initStoreFromCSV(initRes)
		}
	})
	createEffect(() => {
		// console.log("CSV DATA" + new Date(), csvData())
		if (csvData()) initStoreFromRes(csvData())
	})
	return (
		<div class="w-full h-full flex flex-col p-4">
			<AudioHeader
				onActorChange={(arg: { label: string; value: string }) => {}}
			>
				<CSVUploadBtn
					folder_id={store.activeFile.folder_id}
					file_id={store.activeFile.file_id}
					audio_batch_id={
						store.activeFile.audio_batch_id !== ""
							? store.activeFile.audio_batch_id
							: undefined
					}
					csvDataSetter={setCSVData}
				/>
			</AudioHeader>
			<div>
				<CSV.Table
					style={
						{
							// width: `${document.body.getBoundingClientRect().width - 600}px`,
						}
					}
					class="bg-white mt-4 flex rounded-lg overflow-auto"
				>
					<Index each={csv_store.table.columns}>
						{(column, x) => {
							let isFirstColumn = x === 0
							let isLastHeader = x === csv_store.table.columns.length - 1
							return (
								<CSV.Column class="flex flex-col w-max border-indigo-700">
									<CSV.ColumnHeader class="bg-indigo-500 text-white hover:bg-indigo-600 border-indigo-600 border-b text-left px-3 py-1">
										{column().label}
									</CSV.ColumnHeader>
									<CSV.CellsContainer class="border-indigo-600 flex flex-col">
										<Index each={column().cells}>
											{(cell, y) => {
												let isFirst = y === 0
												let isLastColLastElement =
													y === column().cells.length - 1 && isLastHeader
												let isFirstColLastElement =
													y === column().cells.length - 1 && isFirstColumn
												return (
													<CSV.Cell
														class="flex text-sm gap-x-5 place-content-between hover:bg-indigo-100 text-indigo-900 hover:text-indigo-900 items-center px-3 py-1 bg-white"
														classList={{
															"border-t": !isFirst,
															"rounded-bl-md": isFirstColLastElement,
															"rounded-br-md ": isLastColLastElement,
														}}
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
				</CSV.Table>
			</div>
		</div>
	)
}

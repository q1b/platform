import { createStore, produce } from "solid-js/store"

import {
	Folder,
	File,
	ClientOptionsFolder,
	ClientOptionsFile,
	Tab,
} from "./client.type"

function toTree(arr: any) {
	let arrMap = new Map<string, any>(arr.map((item: any) => [item.id, item]))
	let tree = []
	for (let i = 0; i < arr.length; i++) {
		let item = arr[i]
		if (item.folder_id) {
			let parentItem: Folder = arrMap.get(item.folder_id)
			if (!parentItem) continue
			if (parentItem.files) parentItem.files.push(item)
			else parentItem.files = [item]
		} else tree.push(item)
	}
	return tree
}

export const [store, setStore] = createStore<{
	folders: ClientOptionsFolder<Folder>[]
	activeFile: {
		name: string
		file_id: string
		folder_id: string
		active_tab: Tab
		audio_batch_id: string
		video_url: string | undefined
		video_duration: number | undefined
		segments: { name: string; progressStamps: [number, number] }[] | undefined
		image_column_id: number | undefined
		video_id: string | undefined
		actor_id: string | undefined
	}
	user_id: string
}>({
	folders: [],
	activeFile: {
		name: "",
		file_id: "",
		folder_id: "",
		audio_batch_id: "",
		active_tab: Tab.Video,
		video_duration: undefined,
		video_url: undefined,
		segments: undefined,
		image_column_id: undefined,
		video_id: undefined,
		actor_id: undefined,
	},
	user_id: "",
})

/**
 * FOLDER
 *    InitFoldersFromWorkspace
 * 		addFolder
 * 		renameFolder
 * 		removeFolder
 * 		expandFolder
 * 		collapseFolder
 * FILE
 *    addFile
 *    setFileActor
 *    setFileVideoId
 *
 *    renameFile
 *    removeFile
 *    openFile
 *    closeFile
 *    focusFile
 *    blurFile
 *    changeTab
 *    removeFile
 */

export const initFoldersForWorkspace = ({
	fetched_folders,
	fetched_files,
}: {
	fetched_folders: any[]
	fetched_files: any[]
}) => {
	const data = [...fetched_folders, ...fetched_files]
	const folders: Folder[] = toTree(data)
	for (let index = 0; index < folders.length; index++) {
		const folder = folders[index]
		addFolder({
			id: folder.id,
			name: folder.name,
		})
		for (let jindex = 0; jindex < folder.files?.length; jindex++) {
			const file: File = folder.files[jindex]
			pushFile({
				id: file.id,
				name: file.name,
				actor_id: file?.actor_id,
				audio_batch_id: file?.audio_batch_id,
				video_id: file?.video_id,
			})
		}
	}
}

export const addFolder = ({ name, id }: { name: string; id: string }) => {
	setStore(
		"folders",
		produce((folders: ClientOptionsFolder<Folder>[]) => {
			folders.push({
				id,
				name,
				isopen: false,
				files: [],
			})
		})
	)
}

export const renameFolder = ({
	folder_id,
	name,
}: {
	folder_id: string
	name: string
}) => {
	setStore("folders", (folder) => folder.id === folder_id, "name", name)
}

export const removeFolder = ({ folder_id }: { folder_id: string }) => {
	setStore(
		"folders",
		produce((folders: ClientOptionsFolder<Folder>[]) => {
			folders.splice(
				folders.findIndex((i) => i.id === folder_id),
				1
			)
		})
	)
}

export const collapseFolder = ({ folder_id }: { folder_id: string }) => {
	setStore("folders", (folder) => folder.id === folder_id, "isopen", false)
}

export const expandFolder = ({ folder_id }: { folder_id: string }) => {
	setStore("folders", (folder) => folder.id === folder_id, "isopen", true)
}

export const pushFile = ({
	name,
	id,
	actor_id,
	audio_batch_id,
	image_column_id,
	video_id,
}: {
	name: string
	id: string
	actor_id?: string | undefined
	audio_batch_id?: string | undefined
	image_column_id?: number | undefined
	video_id?: string | undefined
}) => {
	let isactive = false
	let isopen = false
	setStore(
		"folders",
		produce((folders: ClientOptionsFile<Folder>[]) =>
			folders[folders.length - 1].files.push({
				id,
				name,
				isactive,
				isopen,
				folder_id: folders[folders.length - 1].id,
				actor_id,
				image_column_id,
				audio_batch_id,
				video_id,
				active_tab: Tab.Video,
				table: {
					columns: [],
				},
				video_url: undefined,
				video_duration: undefined,
				segments: undefined,
			})
		)
	)
}

export const addFile = ({
	folder_id,
	name,
	id,
	actor_id,
	audio_batch_id,
	video_id,
}: {
	folder_id: string
	name: string
	id: string
	actor_id?: string | undefined
	image_column_id?: string | undefined
	audio_batch_id?: string | undefined
	video_id?: string | undefined
}) => {
	let isactive = false
	let isopen = false
	setStore(
		"folders",
		(folders) => folders.id === folder_id,
		"files",
		produce((files: Required<ClientOptionsFile<File>>[]) => {
			files.push({
				id,
				name,
				active_tab: Tab.Video,
				isactive,
				isopen,
				folder_id: folder_id,
				actor_id,
				audio_batch_id,
				video_id,
				table: {
					columns: [],
				},
				image_column_id: undefined,
				video_url: undefined,
				video_duration: undefined,
				segments: undefined,
			})
		})
	)
}

export const setFileImageColumnID = ({
	folder_id,
	file_id,
	image_column_id,
}: {
	folder_id: string
	file_id: string
	image_column_id: number
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"image_column_id",
		image_column_id
	)
	if (store.activeFile.file_id === file_id)
		setStore("activeFile", "image_column_id", image_column_id)
}

export const setFileActor = ({
	folder_id,
	file_id,
	actor_id,
}: {
	folder_id: string
	file_id: string
	actor_id: string
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"actor_id",
		actor_id
	)
	if (store.activeFile.file_id === file_id)
		setStore("activeFile", "actor_id", actor_id)
}

export const setFileSegments = ({
	folder_id,
	file_id,
	segments,
}: {
	folder_id: string
	file_id: string
	segments: { name: string; progressStamps: [number, number] }[]
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"segments",
		segments
	)
	if (store.activeFile.file_id === file_id)
		setStore("activeFile", "segments", segments)
}

export const setFileVideoId = ({
	folder_id,
	file_id,
	video_id,
}: {
	folder_id: string
	file_id: string
	video_id: string
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"video_id",
		video_id
	)
	if (store.activeFile.file_id === file_id)
		setStore("activeFile", "video_id", video_id)
}

export const setFileVideoURL = ({
	folder_id,
	file_id,
	video_url,
}: {
	folder_id: string
	file_id: string
	video_url: string
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"video_url",
		video_url
	)
	if (store.activeFile.file_id === file_id)
		setStore("activeFile", "video_url", video_url)
}

export const setFileVideoDuration = ({
	folder_id,
	file_id,
	video_duration,
}: {
	folder_id: string
	file_id: string
	video_duration: number
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"video_duration",
		video_duration
	)
	if (store.activeFile.file_id === file_id)
		setStore("activeFile", "video_duration", video_duration)
}

export const setFileAudioBatchId = ({
	folder_id,
	file_id,
	audio_batch_id,
}: {
	folder_id: string
	file_id: string
	audio_batch_id: string
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"audio_batch_id",
		audio_batch_id
	)
	if (store.activeFile.file_id === file_id)
		setStore("activeFile", "audio_batch_id", audio_batch_id)
}

export const setFileState = ({
	folder_id,
	file_id,
	state,
}: {
	folder_id: string
	file_id: string
	state: Partial<{ isopen: boolean; isactive: boolean }>
}) => {
	setStore(
		"folders",
		(folders) => folders.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"isopen",
		state?.isopen || false
	)
	setStore(
		"folders",
		(folders) => folders.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"isactive",
		state?.isactive || false
	)
}

export const getTab = ({
	folder_id,
	file_id,
}: {
	folder_id: string
	file_id: string
}): Tab => {
	return store.folders
		.find((folder) => folder.id === folder_id)
		.files.find((file) => file.id === file_id).active_tab
}

export const changeTab = ({ tab }: { tab: Tab }) => {
	setStore("activeFile", "active_tab", tab)
}

export const openFile = ({
	folder_id,
	file_id,
}: {
	folder_id: string
	file_id: string
}) => {
	setStore(
		"folders",
		(foldersDetail) => foldersDetail.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"isopen",
		true
		// (o) => (o = { ...o, isopen: true, isactive: true })
	)
	focusFile({ folder_id, file_id })
}

export const blurFile = ({
	folder_id,
	file_id,
}: {
	folder_id: string
	file_id: string
}) => {
	const prevOpenedFile = store.folders
		.map((folder) =>
			folder.files.map((e) => {
				if (e.isopen) return e
			})
		)
		.flat()
		.filter((e) => e !== undefined)
	const insertHere = prevOpenedFile.findIndex((file) => file?.id === file_id)

	setStore(
		"folders",
		(foldersDetail) => foldersDetail.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"isactive",
		false
	)
	// meaning our Item is inbetween not the last one
	if (prevOpenedFile.length !== insertHere + 1) {
		// console.log("Inbetween\n",insertHere,prevOpenedFile[insertHere+1],"\n");
		focusFile({
			folder_id: prevOpenedFile[insertHere + 1]?.folder_id,
			file_id: prevOpenedFile[insertHere + 1]?.id,
		})
	} else {
		// last item
		focusFile({
			folder_id: prevOpenedFile[insertHere - 1]?.folder_id,
			file_id: prevOpenedFile[insertHere - 1]?.id,
		})
	}
}
export const getActiveFile = ({
	folder_id,
	file_id,
}: {
	folder_id: string
	file_id: string
}): {
	name: string
	audio_batch_id: string
	actor_id: string
	video_id: string
	video_url: string
	image_column_id: number
	segments: readonly {
		readonly name: string
		readonly progressStamps: readonly [number, number]
	}[]
	video_duration: number
	active_tab: Tab
} => {
	const {
		name,
		audio_batch_id,
		actor_id,
		image_column_id,
		video_id,
		active_tab,
		video_url,
		video_duration,
		segments,
	} = store.folders
		.find((folder) => folder.id === folder_id)
		.files.find((file) => file.id === file_id)
	return {
		name,
		audio_batch_id,
		actor_id,
		image_column_id,
		video_id,
		active_tab,
		video_url,
		video_duration,
		segments,
	}
}

export const focusFile = ({
	folder_id,
	file_id,
}: {
	folder_id: string
	file_id: string
}) => {
	if (store.activeFile.folder_id) {
		setStore(
			"folders",
			(foldersDetail) => foldersDetail.id === store.activeFile.folder_id,
			"files",
			(file) => file.id === store.activeFile.file_id,
			"isactive",
			false
		)
	}
	setStore(
		"folders",
		(folders) => folders.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"isactive",
		true
	)
	const activeFileOptions = getActiveFile({
		folder_id,
		file_id,
	})
	setStore("activeFile", {
		file_id,
		folder_id,
		...activeFileOptions,
	})
}

export const closeFile = ({
	folder_id,
	file_id,
}: {
	folder_id: string
	file_id: string
}) => {
	if (
		store.activeFile.file_id === file_id &&
		store.activeFile.folder_id === folder_id
	) {
		blurFile({ folder_id, file_id })
	}
	setStore(
		"folders",
		(folders) => folders.id === folder_id,
		"files",
		(file) => file.id === file_id,
		// (o) => (o = { ...o, isopen: false, isactive: false })
		"isopen",
		false
	)
}

export const renameFile = ({
	folder_id,
	file_id,
	name,
}: {
	folder_id: string
	file_id: string
	name: string
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"name",
		name
	)
}

export const removeFile = ({
	folder_id,
	file_id,
}: {
	folder_id: string
	file_id: string
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		produce((files: Required<ClientOptionsFile<File>>[]) => {
			files.splice(
				files.findIndex((i) => i.id === file_id),
				1
			)
		})
	)
}

// move a element from kth position to qth position in a array
// export const moveElement = (array: any[], k: number, q: number) => {
// 	const element = array[k]
// 	array.splice(k, 1)
// 	array.splice(q, 0, element)
// }

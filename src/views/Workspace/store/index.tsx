import * as store from "./handlers"
import * as api from "@/api"
import type { Folder, File } from "./index.type"

export { store } from "./handlers"

export { fetchFolder, fetchFolders, fetchFiles, fetchFile } from "@/api"

export const addFolder = async ({
	name,
	workspace_id,
}: {
	name: string
	workspace_id: string
}) => {
	const res = await api.addFolder({ name, workspace_id })
	const id = res.data.id
	store.addFolder({ id, name })
	return id
}

export const renameFolder = async ({
	name,
	folder_id,
}: {
	name: string
	folder_id: string
}) => {
	const res = await api.renameFolder({
		name,
		folder_id,
	})
	store.renameFolder({
		name,
		folder_id,
	})
}

export { expandFolder, collapseFolder } from "./handlers"

export const removeFolder = async ({ folder_id }: { folder_id: string }) => {
	console.log("FUNC", folder_id)
	const res = await api.removeFolder({
		folder_id,
	})
	console.log(res)
	store.removeFolder({
		folder_id,
	})
}

export const addFile = async ({
	name,
	folder_id,
}: {
	name: string
	folder_id: string
}) => {
	const res = await api.addFile({
		name,
		folder_id,
	})
	const id = res.data.id
	store.addFile({ id, name, folder_id })
	return id
}

export const renameFile = async ({
	name,
	folder_id,
	file_id,
}: {
	name: string
	folder_id: string
	file_id: string
}) => {
	console.log("Renaming", name, file_id)
	const res = await api.renameFile({
		name,
		file_id,
	})
	store.renameFile({
		name,
		folder_id,
		file_id,
	})
}

export {
	openFile,
	focusFile,
	closeFile,
	blurFile,
	getTab,
	changeTab,
} from "./handlers"

export const removeFile = async ({
	folder_id,
	file_id,
}: {
	folder_id: string
	file_id: string
}) => {
	const res = await api.removeFile({
		file_id,
	})
	store.removeFile({
		folder_id,
		file_id,
	})
}

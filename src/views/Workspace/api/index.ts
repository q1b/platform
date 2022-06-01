import * as Server from "@/api"
import Client from "./client"

export { Client, Server }
export { initFoldersForWorkspace } from "./client/client"

export const addFolder = async ({
	name,
	workspace_id,
}: {
	name: string
	workspace_id: string
}) => {
	const res = await Server.addFolder({ name, workspace_id })
	const id = res.data?.id
	Client.addFolder({ id, name })
	return id
}

export const renameFolder = async ({
	name,
	folder_id,
}: {
	name: string
	folder_id: string
}) => {
	const res = await Server.renameFolder({
		name,
		folder_id,
	})
	Client.renameFolder({
		name,
		folder_id,
	})
}

export { expandFolder, collapseFolder } from "./client/client"

export const removeFolder = async ({ folder_id }: { folder_id: string }) => {
	const res = await Server.removeFolder({
		folder_id,
	})
	Client.removeFolder({
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
	const res = await Server.addFile({
		name,
		folder_id,
	})
	const id = res.data.id
	Client.addFile({ id, name, folder_id })
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
	const res = await Server.renameFile({
		name,
		file_id,
	})
	Client.renameFile({
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
} from "./client/client"

export const setFileTemplateVideoId = async ({
	video_id,
	file_id,
	folder_id,
}: {
	video_id: string
	file_id: string
	folder_id: string
}) => {
	const res = await Server.updateFileTemplateVideoId({
		video_id,
		file_id,
	})
	Client.setFileVideoId({
		file_id,
		video_id,
		folder_id,
	})
}
export const setAudioData = async ({
	file_id,
	folder_id,
	audio_batch_id,
	actor_id,
}: {
	file_id: string
	folder_id: string
	audio_batch_id: string
	actor_id: string
}) => {
	const res = await Server.updateFileAudioData({
		file_id,
		audio_batch_id,
		actor_id,
	})

	Client.setFileAudioBatchId({
		audio_batch_id,
		file_id,
		folder_id,
	})
	Client.setFileActor({
		actor_id,
		file_id,
		folder_id,
	})
}

export const removeFile = async ({
	folder_id,
	file_id,
}: {
	folder_id: string
	file_id: string
}) => {
	const res = await Server.removeFile({
		file_id,
	})
	Client.removeFile({
		folder_id,
		file_id,
	})
}

export type Folder = {
	id: string
	name: string
	// not from api but settled on initial method
	files: Required<ClientOptionsFile<File>>[]
}

export type ClientOptionsFolder<P = {}> = P & {
	isopen: boolean
}

export type File = {
	// fetched from API
	id: string
	folder_id: string
	name: string
	actor_id?: string
	video_id?: string
	audio_batch_id?: string
}

export enum Tab {
	Video = "VIDEO",
	Audio = "AUDIO",
}
// locally used by app
export type ClientOptionsFile<P = {}> = P & {
	isactive: boolean
	isopen: boolean
	video: {
		details: boolean
		isLoading: boolean
		duration: boolean
		current_time: string
		is_playing: boolean
		video_url?: string
	}
	active_tab: Tab
	table: Table
}

type Table = {
	columns: Column[]
}

type Column = {
	x: number
	label: string
	cells: Cell[]
	uniqueLabels: string[]
}

type Cell = {
	x: number
	y: number
	label: string
	audioURL: string | null
	audioId: string | null
}

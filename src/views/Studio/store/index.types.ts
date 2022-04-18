export type Folder = {
	id: string;
	name: string;
	// not from api but settled on initial method
    files: Required<ClientOptionsFile<File>>[]
};

export type ClientOptionsFolder<P = {}> = P & {
	isopen: boolean
}

export type File = {
	// fetched from API
	id: string
	folder_id: string
	name: string
	actor_id:string
	video_id:string
	audio_batch_id:string
};

// locally used by app
export type ClientOptionsFile<P = {}> = P & {
	isactive: boolean
	isopen: boolean
	active_tab: 'video'|'audio'
}

import { createStore, produce } from "solid-js/store";

import {
	Folder,
	File,
	ClientOptionsFolder,
	ClientOptionsFile,
} from "./index.types";

function toTree(arr: any) {
	let arrMap = new Map<string, any>(arr.map((item) => [item.id, item]));
	let tree = [];
	for (let i = 0; i < arr.length; i++) {
		let item = arr[i];
		if (item.folder_id) {
			let parentItem: Folder = arrMap.get(item.folder_id);
			if (!parentItem) continue;
			if (parentItem.files) parentItem.files.push(item);
			else parentItem.files = [item];
		} else tree.push(item);
	}
	return tree;
}

export const [store, setStore] = createStore<{
	folders: ClientOptionsFolder<Folder>[];
	activeFile: {
		file_id: string;
		folder_id: string;
		active_tab:"video"|"audio";
		video_id:string,
		actor_id:string
	};
	user_id:string
}>({
	folders: [],
	activeFile: {
		file_id: "",
		folder_id: "",
		active_tab: "video",
		video_id:"",
		actor_id:""
	},
	user_id: "",
});

export const initFoldersForWorkspace = ({
	fetched_folders,
	fetched_files,
}: {
	fetched_folders: any[];
	fetched_files: any[];
}) => {
	const data = [...fetched_folders, ...fetched_files];
	const folders: Folder[] = toTree(data);
	for (let index = 0; index < folders.length; index++) {
		const folder = folders[index];
		addFolder({
			id: folder.id,
			name: folder.name,
		});
		for (let jindex = 0; jindex < folder.files?.length; jindex++) {
			const file: File = folder.files[jindex];
			pushFile({
				id: file.id,
				name: file.name,
				actor_id: file?.actor_id,
				audio_batch_id: file?.audio_batch_id,
				video_id: file?.video_id,
			});
		}
	}
};

export const addFolder = ({ name, id }: { name: string; id: string }) => {
	setStore(
		"folders",
		produce((folders: ClientOptionsFolder<Folder>[]) => {
			folders.push({
				id,
				name,
				isopen: false,
				files: [],
			});
		}),
	);
};

export const renameFolder = ({
	folder_id,
	name,
}: {
	folder_id: string;
	name: string;
}): void => {
	setStore(
		"folders",
		(folders: Folder) => folders.id === folder_id,
		"name",
		name,
	);
};

export const removeFolder = ({ folder_id }: { folder_id: string }) => {
	setStore(
		"folders",
		produce((folders: ClientOptionsFolder<Folder>[]) => {
			folders.splice(
				folders.findIndex((i) => i.id === folder_id),
				1,
			);
		}),
	);
};

export const collapseFolder = ({ folder_id }: { folder_id: string }) => {
	setStore("folders", (folders) => folders.id === folder_id, "isopen", false);
};

export const expandFolder = ({ folder_id }: { folder_id: string }) => {
	setStore("folders", (folders) => folders.id === folder_id, "isopen", true);
};

// export const collapseFolderByINDEX = (index: number) => {
// 	setStore("foldersDetails", (foldersDetail) => foldersDetail === store.foldersDetails[index], "isopen", false);
// };

// export const expandFolderByINDEX = (index: number) => {
// 	setStore("foldersDetails", (foldersDetail) => foldersDetail === store.foldersDetails[index], "isopen", true);
// 	set(store);
// };
export const pushFile = ({
	name,
	id,
	actor_id,
	audio_batch_id,
	video_id,
}: {
	name: string;
	id: string;
	actor_id?: string | undefined;
	audio_batch_id?: string | undefined;
	video_id?: string | undefined;
}) => {
	let isactive = false;
	let isopen = false;
	let active_tab: "video" = "video";
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
				audio_batch_id,
				video_id,
				active_tab: "video",
			}),
		),
	);
};

export const addFile = ({
	folder_id,
	name,
	id,
	actor_id,
	audio_batch_id,
	video_id,
}: {
	folder_id: string;
	name: string;
	id: string;
	actor_id?: string | undefined;
	audio_batch_id?: string | undefined;
	video_id?: string | undefined;
}) => {
	let isactive = false;
	let isopen = false;
	let active_tab: "video" = "video";
	setStore(
		"folders",
		(folders) => folders.id === folder_id,
		"files",
		produce((files: Required<ClientOptionsFile<File>>[]) => {
			files.push({
				id,
				name,
				active_tab,
				isactive,
				isopen,
				folder_id: folder_id,
				actor_id,
				audio_batch_id,
				video_id,
			});
		}),
	);
};

export const setFileActor = ({folder_id,file_id,actor_id}:{folder_id:string;file_id:string;actor_id:string}) => {
	setStore('folders',folder => folder.id === folder_id,'files',file => file.id === file_id,'actor_id',actor_id)
}

export const setFileState = ({
	folder_id,
	file_id,
	state,
}: {
	folder_id: string;
	file_id: string;
	state: Partial<{ isopen: boolean; isactive: boolean }>;
}) => {
	setStore(
		"folders",
		(folders) => folders.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"isopen",
		state?.isopen || false,
	);
	setStore(
		"folders",
		(folders) => folders.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"isactive",
		state?.isactive || false,
	);
};

export const getTab = ({
	folder_id,file_id
}:{folder_id:string,file_id:string}):"video"|"audio" => {
	return store.folders.find((folder) => folder.id === folder_id).files.find((file) => file.id === file_id).active_tab
}

export const changeTab = ({
	tab,
	folder_id,
	file_id,
}: {
	folder_id: string;
	file_id: string;
	tab?: "video" | "audio";
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"active_tab",
		(c_tab) => (tab ? tab : c_tab === "audio" ? "video" : "audio"),
	);
};

export const openFile = ({
	folder_id,
	file_id,
}: {
	folder_id: string;
	file_id: string;
}) => {
	setStore(
		"folders",
		(foldersDetail) => foldersDetail.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"isopen",
		true,
		// (o) => (o = { ...o, isopen: true, isactive: true })
	);
	focusFile({ folder_id, file_id });
};

export const blurFile = ({
	folder_id,
	file_id,
}: {
	folder_id: string;
	file_id: string;
}) => {
	const prevOpenedFile = store.folders
		.map((folder) =>
			folder.files.map((e) => {
				if (e.isopen) return e;
			}),
		)
		.flat()
		.filter((e) => e !== undefined);
	const insertHere = prevOpenedFile.findIndex((file) => file?.id === file_id);
	console.log(prevOpenedFile);
	setStore(
		"folders",
		(foldersDetail) => foldersDetail.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"isactive",
		false,
	);
	// meaning our Item is inbetween not the last one
	if (prevOpenedFile.length !== insertHere + 1) {
		// console.log("Inbetween\n",insertHere,prevOpenedFile[insertHere+1],"\n");
		focusFile({
			folder_id: prevOpenedFile[insertHere + 1]?.folder_id,
			file_id: prevOpenedFile[insertHere + 1]?.id,
		});
	} else {
		// last item
		focusFile({
			folder_id: prevOpenedFile[insertHere - 1]?.folder_id,
			file_id: prevOpenedFile[insertHere - 1]?.id,
		});
	}
};

export const focusFile = ({
	folder_id,
	file_id,
}: {
	folder_id: string;
	file_id: string;
}) => {
	console.log("Focuing closed file", folder_id, file_id);
	if (store.activeFile.folder_id) {
		setStore(
			"folders",
			(foldersDetail) => foldersDetail.id === store.activeFile.folder_id,
			"files",
			(file) => file.id === store.activeFile.file_id,
			"isactive",
			false,
		);
	}
	setStore(
		"folders",
		(folders) => folders.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"isactive",
		true,
	);
	setStore("activeFile", { file_id, folder_id });
};

export const closeFile = ({
	folder_id,
	file_id,
}: {
	folder_id: string;
	file_id: string;
}) => {
	if (
		store.activeFile.file_id === file_id &&
		store.activeFile.folder_id === folder_id
	) {
		blurFile({ folder_id, file_id });
	}
	setStore(
		"folders",
		(folders) => folders.id === folder_id,
		"files",
		(file) => file.id === file_id,
		// (o) => (o = { ...o, isopen: false, isactive: false })
		"isopen",
		false,
	);
};

export const renameFile = ({
	folder_id,
	file_id,
	name,
}: {
	folder_id: string;
	file_id: string;
	name: string;
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		(file) => file.id === file_id,
		"name",
		name,
	);
};

export const removeFile = ({
	folder_id,
	file_id,
}: {
	folder_id: string;
	file_id: string;
}) => {
	setStore(
		"folders",
		(folder) => folder.id === folder_id,
		"files",
		produce((files: Required<ClientOptionsFile<File>>[]) => {
			files.splice(
				files.findIndex((i) => i.id === file_id),
				1,
			);
		}),
	);
};

// move a element from kth position to qth position in a array
export const moveElement = (array: any[], k: number, q: number) => {
	const element = array[k];
	array.splice(k, 1);
	array.splice(q, 0, element);
};

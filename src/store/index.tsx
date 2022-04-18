import { Workspace, Folder, File, UserDetails } from "./index.types";
import { createStore, produce } from "solid-js/store";

const [store, setStore] = createStore<{
    workspaces:Workspace[]
    userDetails:UserDetails
}>({
    workspaces:[],
    userDetails:{} as UserDetails
});

// CRUD
const createWorkspace = async (name: string) => {
    // TODO: need to add video quota fields for handle dynamic video quota for specific workspace.
    // await axiosApi.post(`workspace`, { name, generated_videos_quota: 200 });
}

export const createNewWorkspace = ({name, generated_videos_quota}:{name: string, generated_videos_quota: number}) => {
	setStore(
		"workspaces",
        produce((wp:Workspace[]) => {
            wp.push({
                name,
                generated_videos_quota
            })
        })
	);
	// set(store);
	// return id;
};

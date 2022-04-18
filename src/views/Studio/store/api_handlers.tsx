import axiosApi from "../../../api";

// Folders
/* 
    Get ✅
    Add ✅
    Rename ✅
    Remove ✅
*/
export const fetchFolders = async ({ workspace_id }: { workspace_id: string }) => await axiosApi.get(`folder?workspace_id=${workspace_id}`);

export const fetchFolder = async ({ folder_id }: { folder_id: string }) => await axiosApi.get(`folder?id=${folder_id}`);

export const addFolder = async ({ name, workspace_id }: { name: string, workspace_id: string }) => await axiosApi.post("folder", { name, workspace_id });

export const renameFolder = async ({ folder_id, name }: { folder_id: string, name: string }) => await axiosApi.put(`folder?id=${folder_id}`, { name });

export const removeFolder = async ({ folder_id }: { folder_id: string }) => await axiosApi.delete(`folder?id=${folder_id}`);

// Files
/* 
    Get ✅
    Add ✅
    Rename ✅
    remove ✅ 
*/

export const fetchFiles = async ({ folder_id, workspace_id }: { folder_id?: string, workspace_id?: string }) => {
    if (folder_id) return await axiosApi.get(`video_instance?folder_id=${folder_id}`);
    if (workspace_id) return await axiosApi.get(`video_instance?workspace_id=${workspace_id}`);
};
export const fetchFile = async ({ file_id }: { file_id: string }) => await axiosApi.get(`video_instance?id=${file_id}`);

export const addFile = async ({ name, folder_id }: { name: string, folder_id: string }) =>
    await axiosApi.post("video_instance", {
        name,
        folder_id,
    });

export const renameFile = async ({ file_id, name }: { file_id: string, name: string }) => await axiosApi.put(`video_instance?id=${file_id}`, { name });

export const removeFile = async ({ file_id }: { file_id: string }) => await axiosApi.delete(`video_instance?id=${file_id}`);

const updateFileAudioData = async ({ file_id, audio_batch_id, actor_id }) =>
    await axiosApi.put(`video_instance?id=${file_id}`, {
        audio_batch_id,
        actor_id,
    });
const updateFileVideoInstanceId = async ({ file_id, video_id }: { file_id: string, video_id: string }) => await axiosApi.put(`video_instance?id=${file_id}`, { video_id });

// segments
export const postSegment = async (
segment: {
	video_instance_id: string, 
	prefix_time_marker_start: string,
	prefix_time_marker_end: string,
	suffix_time_marker_start: string,
	suffix_time_marker_end: string,
	audio_variable_name: string,
	variable_time_marker_start: string,
	variable_time_marker_end: string
} ) => await axiosApi.post("segment", segment);

export const fetchSegment = async ({ segment_id }: { segment_id: string }) => await axiosApi.get(`segment?id=${segment_id}`);
export const fetchSegments = async ({ file_id }: { file_id: string }) => await axiosApi.get(`segment?video_instance_id=${file_id}`);

// Video
/* 
    Get ✅
    Add ✅
    Rename ✅
    remove ✅ 
*/
export const fetchVideos = async () => await axiosApi.get(`video`);
export const postVideo = async ({ duration, formData }: { duration: string, formData: FormData }) => await axiosApi.post(`upload_video?length=${duration}`, formData);
export const fetchVideo = async ({ video_id }: { video_id: string }) => await axiosApi.get(`video?id=${video_id}`);
export const retrieveVideo = async ({ video_id }: { video_id: string }) => await axiosApi.get(`fetch_video?id=${video_id}`, { responseType: "blob" });
export const deleteVideo = async ({ video_id }: { video_id: string }) => await axiosApi.delete(`video?id=${video_id}`);

// actor
export const addActor = async ({ name }: { name: string }) => await axiosApi.post("actor", { name: name });
export const fetchActors = async () => await axiosApi.get(`actor`);
export const fetchActor = async ({ actor_id }: { actor_id: string }) => await axiosApi.get(`actor?id=${actor_id}`);
export const deleteActor = async ({ actor_id }: { actor_id: string }) => await axiosApi.delete(`actor?id=${actor_id}`);

// audio
export const postAudio = async ({ name, actor_id, length, formData }: { name: string, actor_id: string, length: string, formData: FormData }) => (
	await axiosApi.post(`audio?actor_id=${actor_id}&name=${name}&audio_length=${length}`, formData)
)

export const deleteAudio = async ({ audio_id }: { audio_id: string }) => await axiosApi.delete(`audio?id=${audio_id}`);

// CSV Data
export const fetchAllCSV = async () => await axiosApi.get("api/csv");
export const fetchCSV = async ({ csv_id }: { csv_id: string }) => await axiosApi.get(`csv?id=${csv_id}`);
export const postCSV = async ({ formData }: { formData: FormData }) => await axiosApi.post("upload_csv", formData);
export const fetchJsonFromCSV = async ({ csv_id }: { csv_id: string }) => await axiosApi.get(`convert_csv?id=${csv_id}`);
export const exportGeneratedVideoAsCSV = async ({ file_id }: { file_id: string }) => await axiosApi.get(`export_csv?video_instance_id=${file_id}`);

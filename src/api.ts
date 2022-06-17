import axios, { AxiosResponse } from "axios"
import {
	Actor,
	File,
	Folder,
	Plan,
	Segment,
	TemplateVideo,
	User,
	Workspace,
} from "./api.type"

import "./helpers/env"

const baseURL = import.meta.env.VITE_API_URL

const axiosApi = axios.create({
	baseURL,
})

// Request interceptor for API calls
axiosApi.interceptors.request.use(
	async (config) => {
		const token = localStorage.getItem("access_token")
		if (token)
			config.headers = {
				Authorization: `Bearer ${token}`,
			}
		return config
	},
	(error) => {
		Promise.reject(error)
	}
)

// if a 401 happens, when token is expired
const interceptorId = axiosApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config

		if (error && error.response && error.response.status === 401) {
			originalRequest._retry = true

			axios.interceptors.response.eject(interceptorId)

			originalRequest.headers.token = "jscanvas"

			return axios(originalRequest)
		}
		return Promise.reject(error)
	}
)

export default axiosApi

export const fetchPlans = async (): Promise<AxiosResponse<Plan[]>> =>
	await axiosApi.get("plans")

export const fetchPlan = async ({
	plan_id,
}: {
	plan_id: string
}): Promise<Plan> => (await axiosApi.get(`plans?id=${plan_id}`)).data[0]

export const fetchCheckoutLink = async (body: {
	plan_id: string
	success_url: string
	cancel_url: string
}): Promise<AxiosResponse<{ url: string }>> =>
	await axiosApi.post("checkout", body)

export const fetchCustomerPortalLink = async () =>
	await axiosApi.post("customer_portal", {
		return_url: "http://localhost:3000/settings/billings",
	})

export const fetchUserDetails = async (): Promise<AxiosResponse<User>> =>
	await axiosApi.get("user")

export const updateUsername = async ({
	username,
}: {
	username: string
}): Promise<AxiosResponse<User>> => await axiosApi.put("user", { username })

export const updateFullname = async ({
	fullname,
}: {
	fullname: string
}): Promise<AxiosResponse<User>> => await axiosApi.put("user", { fullname })

// workspaces
export const fetchWorkspaces = async (): Promise<AxiosResponse<Workspace[]>> =>
	await axiosApi.get("workspace")

// Folders
/* 
    Get ✅
    Add ✅
    Rename ✅
    Remove ✅
*/
export const fetchFolders = async ({
	workspace_id,
}: {
	workspace_id: string
}): Promise<AxiosResponse<Folder[]>> =>
	await axiosApi.get(`folder?workspace_id=${workspace_id}`)

export const fetchFolder = async ({
	folder_id,
}: {
	folder_id: string
}): Promise<AxiosResponse<Folder>> =>
	await axiosApi.get(`folder?id=${folder_id}`)

export const addFolder = async ({
	name,
	workspace_id,
}: {
	name: string
	workspace_id: string
}): Promise<AxiosResponse<Folder>> =>
	await axiosApi.post("folder", { name, workspace_id })

export const renameFolder = async ({
	folder_id,
	name,
}: {
	folder_id: string
	name: string
}): Promise<AxiosResponse<Folder>> =>
	await axiosApi.put(`folder?id=${folder_id}`, { name })

export const removeFolder = async ({
	folder_id,
}: {
	folder_id: string
}): Promise<AxiosResponse<Folder>> =>
	await axiosApi.delete(`folder?id=${folder_id}`)

// Files
/* 
    Get ✅
    Add ✅
    Rename ✅
    remove ✅ 
*/

export const fetchFiles = async ({
	folder_id,
	workspace_id,
}: {
	folder_id?: string
	workspace_id?: string
}): Promise<AxiosResponse<File[]>> => {
	if (folder_id)
		return await axiosApi.get(`video_instance?folder_id=${folder_id}`)
	if (workspace_id)
		return await axiosApi.get(`video_instance?workspace_id=${workspace_id}`)
}

export const fetchFile = async ({
	file_id,
}: {
	file_id: string
}): Promise<AxiosResponse<File>> =>
	await axiosApi.get(`video_instance?id=${file_id}`)

export const addFile = async ({
	name,
	folder_id,
}: {
	name: string
	folder_id: string
}): Promise<AxiosResponse<File>> =>
	await axiosApi.post("video_instance", {
		name,
		folder_id,
	})

export const renameFile = async ({
	file_id,
	name,
}: {
	file_id: string
	name: string
}): Promise<AxiosResponse<File>> =>
	await axiosApi.put(`video_instance?id=${file_id}`, { name })

export const removeFile = async ({
	file_id,
}: {
	file_id: string
}): Promise<AxiosResponse<File>> =>
	await axiosApi.delete(`video_instance?id=${file_id}`)

export const updateFileAudioData = async ({
	file_id,
	audio_batch_id,
	actor_id,
}: {
	file_id: string
	audio_batch_id: string
	actor_id: string
}) =>
	await axiosApi.put(`video_instance?id=${file_id}`, {
		audio_batch_id,
		actor_id,
	})

export const updateFileImageColumnId = async ({
	file_id,
	image_column_id,
}: {
	file_id: string
	image_column_id: number
}) => await axiosApi.put(`video_instance?id=${file_id}`, { image_column_id })

export const updateFileTemplateVideoId = async ({
	file_id,
	video_id,
}: {
	file_id: string
	video_id: string
}) => await axiosApi.put(`video_instance?id=${file_id}`, { video_id })

export const postPipeline = async ({
	file_id,
	lipsync_with_image,
}: {
	file_id: string
	lipsync_with_image: boolean
}) =>
	await axiosApi.post("pipeline", {
		lipsync_with_image,
		video_instance_id: file_id,
	})

// segments
export const postSegment = async (segment: {
	video_instance_id: string
	prefix_time_marker_start: string
	prefix_time_marker_end: string
	suffix_time_marker_start: string
	suffix_time_marker_end: string
	audio_variable_name: string
	audio_variable_column_id: number
	variable_time_marker_start: string
	variable_time_marker_end: string
}): Promise<AxiosResponse<Segment>> => await axiosApi.post("segment", segment)

export const fetchSegment = async ({
	segment_id,
}: {
	segment_id: string
}): Promise<AxiosResponse<Segment>> =>
	await axiosApi.get(`segment?id=${segment_id}`)

export const fetchSegments = async ({
	file_id,
}: {
	file_id: string
}): Promise<AxiosResponse<Segment[]>> =>
	await axiosApi.get(`segment?video_instance_id=${file_id}`)

// Video
/* 
    Get ✅
    Add ✅
    Rename ✅
    remove ✅ 
*/
export const fetchVideos = async (): Promise<AxiosResponse<TemplateVideo[]>> =>
	await axiosApi.get(`video`)

export const fetchGeneratedVideo = async ({
	generated_video_id,
}: {
	generated_video_id: string
}) =>
	await axiosApi.get(`fetch_generated_video?id=${generated_video_id}`, {
		responseType: "blob",
	})

export const postVideo = async ({
	duration,
	formData,
}: {
	duration: string
	formData: FormData
}): Promise<AxiosResponse<TemplateVideo>> =>
	await axiosApi.post(`upload_video?length=${duration}`, formData)

export const fetchVideo = async ({
	video_id,
}: {
	video_id: string
}): Promise<AxiosResponse<TemplateVideo>> =>
	await axiosApi.get(`video?id=${video_id}`)

export const retrieveVideo = async ({ video_id }: { video_id: string }) =>
	await axiosApi.get(`fetch_video?id=${video_id}`, { responseType: "blob" })

export const deleteVideo = async ({
	video_id,
}: {
	video_id: string
}): Promise<AxiosResponse<TemplateVideo>> =>
	await axiosApi.delete(`video?id=${video_id}`)

// actor
export const addActor = async ({
	name,
}: {
	name: string
}): Promise<AxiosResponse<Actor>> =>
	await axiosApi.post("actor", { name: name })

export const fetchActors = async (): Promise<AxiosResponse<Actor[]>> =>
	await axiosApi.get(`actor`)
export const fetchActor = async ({
	actor_id,
}: {
	actor_id: string
}): Promise<AxiosResponse<Actor>> => await axiosApi.get(`actor?id=${actor_id}`)
export const deleteActor = async ({
	actor_id,
}: {
	actor_id: string
}): Promise<AxiosResponse<Actor>> =>
	await axiosApi.delete(`actor?id=${actor_id}`)

// audio_batch
export const addAudioBatch = async ({ name }: { name: string }) =>
	await axiosApi.post("audio_batch")

export const getAllAudioBatch = async () => await axiosApi.get("audio_batch")

export const deleteAudioBatch = async ({
	audio_batch_id,
}: {
	audio_batch_id: string
}) => await axiosApi.delete(`audio_batch?id=${audio_batch_id}`)

// audio_batch_data
// POST /api/audio_batch_data?audio_batch_id={}
// 	form-data{"file":"csv file path"}
export const postAudioBatchData = async ({
	audio_batch_id,
	formData,
}: {
	audio_batch_id: string
	formData: FormData
}) =>
	await axiosApi.post(
		`audio_batch_data?audio_batch_id=${audio_batch_id}`,
		formData
	)

export const fetchCSVFromAudioBatchData = async ({
	video_instance_id,
	audio_batch_id,
	actor_id,
}: {
	video_instance_id: string
	actor_id: string
	audio_batch_id: string
}) =>
	await axiosApi.get(
		`audio_batch_data?video_instance_id=${video_instance_id}&audio_batch_id=${audio_batch_id}&actor_id=${actor_id}`
	)

export const fetchImage = async ({ image_id }: { image_id: string }) =>
	await axiosApi.get(`fetch_image?id=${image_id}`, {
		responseType: "blob",
	})

export const fetchAudio = async ({ audio_id }: { audio_id: string }) =>
	await axiosApi.get(`fetch_audio?id=${audio_id}`, {
		responseType: "blob",
	})

// export const fetchImageData = async ({ file_id,image_id }: { file_id:string;image_id: string }) =>
// 	await axiosApi.get(`image?image_id=${image_id}`)

export const fetchAudioData = async ({
	name,
	actor_id,
}: {
	name: string
	actor_id: string
}) => await axiosApi.get(`audio?actor_id=${actor_id}&&name=${name}`)

export const postImage = async ({
	file_id,
	formData,
}: {
	file_id: string
	formData: FormData
}) => await axiosApi.post(`upload_image?video_instance_id=${file_id}`, formData)

// audio
export const postAudio = async ({
	name,
	actor_id,
	length,
	formData,
}: {
	name: string
	actor_id: string
	length: string
	formData: FormData
}) =>
	await axiosApi.post(
		`audio?actor_id=${actor_id}&name=${name}&audio_length=${length}`,
		formData
	)

export const renameAudio = async ({
	name,
	audio_id,
}: {
	name: string
	audio_id: string
}) => await axiosApi.put(`audio?id=${audio_id}`, { name })

export const deleteAudio = async ({ audio_id }: { audio_id: string }) =>
	await axiosApi.delete(`audio?id=${audio_id}`)

// CSV Data
export const fetchAllCSV = async () => await axiosApi.get("csv")

export const fetchCSV = async ({ csv_id }: { csv_id: string }) =>
	await axiosApi.get(`csv?id=${csv_id}`)

export const postCSV = async ({ formData }: { formData: FormData }) =>
	await axiosApi.post("upload_csv", formData)

export const fetchJsonFromCSV = async ({ csv_id }: { csv_id: string }) =>
	await axiosApi.get(`convert_csv?id=${csv_id}`)

export const exportGeneratedVideoAsCSV = async ({
	file_id,
}: {
	file_id: string
}) => await axiosApi.get(`export_csv?video_instance_id=${file_id}`)

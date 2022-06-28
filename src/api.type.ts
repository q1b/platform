export interface User {
	id: string
	email: string
	fullname: string
	username: string
	stytch_user_id: string
	updated_at: string
	created_at: string
	generated_videos_quota: number
	generated_videos_used: number
	not_binded_videos: number
	org_id: string
	plan_id: string
	stripe_customer_id: string
	stripe_metred_subscription_item_id: null
	stripe_subscription_id: string
	stripe_subscription_item_id: string
}

export interface Plan {
	created_at: string
	extra_videos_cost: string
	id: string
	is_free: boolean
	is_metred_plan: boolean
	metred_stripe_plan_id: string
	name: "Free plan" | "Growth" | "Scale" | "Ultimate"
	price: string
	quota: number
	soft_limit: number
	stripe_plan_id: string
	updated_at: string
}

export interface Workspace {
	created_at: string
	generated_videos_quota: number
	generated_videos_used: number
	id: string
	name: string
	parent_videos_quota: number
	parent_videos_used: number
	updated_at: string
	user_id: string
}

// Folders
export interface Folder {
	created_at: string
	generated_videos: number
	id: string
	name: string
	parent_videos: number
	updated_at: string
	user_id: string
	workspace_id: string
}

export interface File {
	actor_id: null | string
	audio_batch_id: null | string
	created_at: string
	folder_id: string
	id: string
	name: string
	updated_at: string
	user_id: string
	video_id: null | string
}

export interface Actor {
	id: string
	user_id: string
	name: string
	created_at: string
	updated_at: string
}

export interface TemplateVideo {
	id: string
	user_id: string
	name: string
	url: string
	length: string
	created_at: string
	updated_at: string
}

export interface GeneratedVideo {
	id: string
	batch_id: string
	audio_lables: string[]
	name: string
	user_id: string
	video_instance_id: string
	video_url: string
	vimeo_url: string
	status: "Succeeded" | "Processing" | "Failed"
	created_at: string
	updated_at: string
}

export interface Segment {
	audio_variable_column_id: number
	audio_variable_name: string
	created_at: string
	id: string
	prefix_time_marker_end: string
	prefix_time_marker_start: string
	suffix_time_marker_end: string
	suffix_time_marker_start: string
	updated_at: string
	user_id: string
	variable_time_marker_end: string
	variable_time_marker_start: string
	video_instance_id: string
}

export type AudioBatchData = {
	audio_id: null | string
	audio_url: null | string
	column_id: number
	name: string
}[][]

export type UserDetails = {
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

export interface Workspace  {
    id?: string
    name: string
    user_id?: string
    created_at?: string
    updated_at?: string
    generated_videos_quota: number
    generated_videos_used?: number
    parent_videos_quota?: number
    parent_videos_used?: number
}

export type Folder = {
	id?: string;
	index: number;
	name: string;
	files: Required<File>[];
	isopen: boolean;
};

export type File = {
	// fetched from API
	id: string;
	folderId:string;
	name: string;
	video_url: string;
	audio_batch: string;
	actor_ref: string;
	// locally used by app
	isactive: boolean;
	isopen: boolean;
};

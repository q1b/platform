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

export type Workspace = {
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

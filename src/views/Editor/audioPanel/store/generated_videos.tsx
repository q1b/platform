import { createStore } from "solid-js/store"

type LooseAutoComplete<T extends string> = T | Omit<string, T>

export const [generatedVideos, setGeneratedVideos] = createStore<
	{
		video_url: string | undefined
		video_id: string | undefined
		response_state: "Failed" | "Processing" | "Success"
	}[]
>([])

export const updateGeneratedVideoURL = ({
	generated_video_id,
	generated_video_url,
}: {
	generated_video_id: string
	generated_video_url: string
}) =>
	setGeneratedVideos(
		(video) => video.video_id === generated_video_id,
		"video_url",
		generated_video_url
	)

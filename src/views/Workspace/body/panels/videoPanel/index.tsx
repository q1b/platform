import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PauseIcon,
	PlayIcon,
} from "@/assets/icons"
import { Button } from "@/ui/Buttons"
import { onMount, Show } from "solid-js"
import { SplitWindow } from "@/ui/Split"
import { store } from "@/views/Workspace/store"
import { fetchVideo, fetchVideos, retrieveVideo } from "@/api"

export const VideoPanel = () => {
	// ;(async () => console.log("FETCHED VIDEOS", await fetchVideos()))()
	// created_at: "2022-03-10T10:52:45.784"
	// id: "877a5eba-0325-41c1-ad08-ccf9c03cdf1d"
	// length: "00:00:14"
	// name: "bf3a6642-5370-42c8-a578-effaec574c07"
	// updated_at: "2022-03-10T10:52:45.784"
	// url: "s3://bhuman-platform-static/video/51519905-dae5-4ab4-a469-74c6575858d9.blob"
	// user_id: "ebc4cb68-c6aa-47f4-beb1-174a991a1855"

	;(async () =>
		console.log(
			"FETCHED VIDEOS",
			await retrieveVideo({
				video_id: "877a5eba-0325-41c1-ad08-ccf9c03cdf1d",
			})
		))()
	return (
		<SplitWindow
			class="grow w-full h-full flex flex-col"
			direction="vertical"
			snapOffset={0}
			cursor={"s-resize"}
			sizes={[72, 28]}
			gutterSize={0}
			gutterAlign="center"
			minSize={[200, Infinity]}
			maxSize={[400, Infinity]}
		>
			<article
				id="video-preview"
				class="w-full p-2 flex flex-col h-full border-b-2"
			>
				<div
					class="
							w-full
							bg-white
							shadow-md	
							shadow-[rgba(96,165,250,0.5)]
							rounded-2xl
							grow
							shrink
							overflow-y-auto
							flex items-center justify-center
							overflow-x-hidden
						"
				>
					<Show
						when={true}
						fallback={<div class="h-80 rounded-md"></div>}
					>
						<video
							ref={(el: HTMLVideoElement) => {}}
							class="h-80 rounded-xl"
							src={`s3://bhuman-platform-static/video/05fe4a19-3ceb-4986-a151-062a33c8a0ed.blob`}
							onTimeUpdate={() => {}}
						></video>
					</Show>
				</div>
			</article>
			<article
				id="video-controllers-group"
				class="border-b-2 flex flex-col w-full h-full overflow-auto sc"
				tabIndex={-1}
			>
				<div
					id="video-primary-action-group"
					class="w-full flex place-content-between border-b-2 p-2"
				>
					<Button
						stylied
						class="px-2 leading-6 pt-0.5 pb-1 bg-indigo-100 text-indigo-800 hover:bg-indigo-50 hover:text-indigo-700  focus-visible:ring-indigo-300 focus-visible:ring-offset-teal-50"
					>
						Create Video
					</Button>
					<div class="flex text-white items-center gap-x-2">
						<button class="group">
							<ChevronRightIcon basic />
						</button>
						<div class="flex items-center">
							<button
								class="group"
								onClick={() => {}}
							>
								<Show
									when={false}
									fallback={
										<PlayIcon
											class="w-8 h-8"
											basic
										/>
									}
								>
									<PauseIcon
										class="w-8 h-8"
										basic
									/>
								</Show>
							</button>
							<span id="timer">
								{/* {Math.floor(secToTime(progTosec(progress(), duration())).minutes) || 0}: */}
								{/* {Math.floor(secToTime(progTosec(progress(), duration())).seconds) || 0} */}
							</span>
						</div>
						<button class="group">
							<ChevronLeftIcon basic />
						</button>
					</div>
					<Button
						stylied
						class="px-2 leading-6 pt-0.5 pb-1 bg-green-300 text-teal-800 hover:bg-green-200 hover:text-teal-900  focus-visible:ring-green-300 focus-visible:ring-offset-teal-50"
					>
						Generate Video
					</Button>
				</div>
				<div
					id="time-marker"
					class="flex"
				>
					<div
						id="left-col-of-data"
						class="flex flex-col w-40"
					>
						<div
							id="spacer"
							class="h-7 border-r-2"
						></div>
						<button class="border-y-2 flex items-start px-3 py-1 border-r-2">
							<span class="text-white">Video Data</span>
						</button>
						<div
							id="spacer"
							class="h-3 border-r-2"
						></div>
						<button class="border-y-2 flex items-start px-3 py-1 border-r-2">
							<span class="text-white">Video Data</span>
						</button>
						<div
							id="spacer"
							class="h-3 border-r-2"
						></div>
					</div>
					<div class="grow flex  pr-0.5">
						<div class="grow"></div>
					</div>
				</div>
			</article>
		</SplitWindow>
	)
}

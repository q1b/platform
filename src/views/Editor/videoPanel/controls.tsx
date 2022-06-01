import { createSignal } from "solid-js"
import { secToTime, Time, timeToSec } from "../time"

export const [videoEl, setVideoEl] = createSignal<HTMLVideoElement | undefined>(
	undefined
)

export const extractControls = () => {
	// https://html.spec.whatwg.org/multipage/media.html#mediaevents
	const [isPlaying, setIsPlaying] = createSignal<boolean>(false)

	const play = () => {
		videoEl()?.play()
		setIsPlaying(true)
	}

	const getTime = () =>
		secToTime({
			seconds: videoEl()?.currentTime,
		})

	const setTime = (time: Time) => {
		const seconds = timeToSec(time)
		videoEl().currentTime = seconds
	}
	const pause = (): void => {
		videoEl()?.pause()
		setIsPlaying(false)
	}
	const togglePlay = (): void => {
		videoEl()?.paused ? play() : pause()
	}
	return {
		load: (): void => videoEl()?.load(),
		play,
		getTime,
		setTime,
		pause,
		togglePlay,
		mute: (): void => {
			videoEl().muted = true
		},
		unmute: (): void => {
			videoEl().muted = false
		},
		isPlaying,
	}
}

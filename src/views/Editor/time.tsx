export type Time = {
	hours: number
	minutes: number
	seconds: number
}

export const getFormatedTime = {
	fromMilliSeconds: (milliSeconds: number) => {
		const time = milliSecToTime({
			milliSeconds,
		})
		const milliSecArr = (Math.floor(time.milliSeconds) || 0)
			.toString()
			.split("")
		milliSecArr.splice(-1)
		const milliSec = milliSecArr.join("")
		const min = (Math.floor(time.minutes) || 0).toString()
		const sec = (Math.floor(time.seconds) || 0).toString()
		const hour = (Math.floor(time.hours) || 0).toString()

		const Z = (exp) => (exp.length === 1 ? "0" + exp : exp)
		if (milliSec) {
			return Z(hour) + ":" + Z(min) + ":" + Z(sec) + ":" + Z(milliSec)
		} else {
			return Z(hour) + ":" + Z(min) + ":" + Z(sec) + ":" + "00"
		}
	},
	fromSeconds: (seconds: number) => {
		const time = secToTime({
			seconds,
		})
		const min = (Math.floor(time.minutes) || 0).toString()
		const sec = (Math.floor(time.seconds) || 0).toString()
		const Z = (exp: string) => (exp.length === 1 ? "0" + exp : exp)
		return Z(min) + ":" + Z(sec)
	},
}

/**
 * It's will decode "00:00:00"
 * into __Time__
 * ```ts
 *  {
 *    hours:number,
 *    minutes:number,
 *    seconds:number
 *  }
 * ```
 */
export const decodeTime = {
	fromSecondsFormat: (formattedTime: string): Time => {
		const [strHours, strMin, strSec] = formattedTime.split(":")
		let hours = +strHours
		let minutes = +strMin
		let seconds = +strSec
		return {
			hours,
			minutes,
			seconds,
		}
	},
	fromMilliSecondsFormat: (
		formattedTime: string
	): Time & {
		milliSeconds: number
	} => {
		const [strHours, strMin, strSec, strMilli] = formattedTime.split(":")
		let hours = +strHours
		let minutes = +strMin
		let seconds = +strSec
		let milliSeconds = +strMilli
		return {
			hours,
			minutes,
			seconds,
			milliSeconds,
		}
	},
}
export const progToSec = ({
	progress,
	duration,
}: {
	progress: number
	duration: number
}) => (duration * progress) / 100

export const milliSecToProg = ({
	milliSeconds,
	duration,
}: {
	milliSeconds: number
	duration: number
}) => (milliSeconds / 1000 / duration) * 100

export const secToProg = ({
	seconds,
	duration,
}: {
	seconds: number
	duration: number
}) => (seconds * 100) / duration

export const milliSecToTime = ({ milliSeconds }: { milliSeconds: number }) => {
	let seconds = Math.floor(milliSeconds / 1000)
	milliSeconds = milliSeconds % 1000
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds - hours * 3600) / 60)
	seconds = seconds - hours * 3600 - minutes * 60
	return { milliSeconds, seconds, minutes, hours }
}

// convert seconds to minutres and hours
export const secToTime = ({ seconds }: { seconds: number }): Time => {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds - hours * 3600) / 60)
	seconds = seconds - hours * 3600 - minutes * 60
	return { hours, minutes, seconds }
}

export const timeToSec = ({ hours, minutes, seconds }: Time) =>
	hours * 3600 + minutes * 60 + seconds

export const timeToMilliSec = ({
	hours,
	minutes,
	seconds,
	milliSeconds,
}: Time & {
	milliSeconds: number
}) => hours * 3600 + minutes * 60 + seconds * 1000 + milliSeconds

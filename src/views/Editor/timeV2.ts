/**
 * get Response -> 00:00:00:00 hour:min:seconds:milliseconds ->
 *     Time { hour:number, min:number, seconds:number, milliseconds:number } ->
 *     totalMilliseconds ->
 *
 * (totalMilliseconds / durationInMilliseconds) -> Progress
 * (Progress * durationInMilliseconds) -> ratio -> totalMilliseconds
 *
 * totalMilliseconds -> Time -> Response
 */

// const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
//   minimumIntegerDigits: 2,
// })

// export function formatDuration(time:number) {
// 	// const milliseconds = Math.floor()
//   const seconds = Math.floor(time % 60)
//   const minutes = Math.floor(time / 60) % 60
//   const hours = Math.floor(time / 3600)
//   if (hours === 0) {
//     return `${minutes}:${leadingZeroFormatter.format(seconds)}`
//   } else {
//     return `${hours}:${leadingZeroFormatter.format(
//       minutes
//     )}:${leadingZeroFormatter.format(seconds)}`
//   }
// }

// console.log(formatDuration(10000))

type Time = {
	hours: number
	minutes: number
	seconds: number
	milliseconds: number
}

const extractTimeFromResponse = (formattedTime: string): Time => {
	const [strHours, strMin, strSec, strMilli] = formattedTime.split(":")
	let hours = +strHours
	let minutes = +strMin
	let seconds = +strSec
	let milliseconds = +(strMilli + "0")
	return {
		hours,
		minutes,
		seconds,
		milliseconds,
	}
}

const timeToMilliSeconds = (time: Time) =>
	time.hours * 3600 * 1000 +
	time.minutes * 60 * 1000 +
	time.seconds * 1000 +
	time.milliseconds

export const millisecondsFromResponse = (response: string) =>
	timeToMilliSeconds(extractTimeFromResponse(response))

const convertMilliSecToTime = (milliSeconds: number) => {
	let seconds = Math.floor(milliSeconds / 1000)
	milliSeconds = Math.floor(milliSeconds % 1000)
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds - hours * 3600) / 60)
	seconds = seconds - hours * 3600 - minutes * 60
	return { milliSeconds, seconds, minutes, hours }
}

export const responseFromMilliSeconds = (milliSeconds: number) => {
	const time = convertMilliSecToTime(milliSeconds)
	const milliSecArr = (Math.floor(time.milliSeconds) || 0).toString().split("")
	milliSecArr.splice(-1)
	const milliSec = milliSecArr.join("")
	const min = (Math.floor(time.minutes) || 0).toString()
	const sec = (Math.floor(time.seconds) || 0).toString()
	const hour = (Math.floor(time.hours) || 0).toString()

	const Z = (exp: string) => (exp.length === 1 ? "0" + exp : exp)
	if (milliSec) {
		return Z(hour) + ":" + Z(min) + ":" + Z(sec) + ":" + Z(milliSec)
	} else {
		return Z(hour) + ":" + Z(min) + ":" + Z(sec) + ":" + "00"
	}
}

export const convertMilliSecToProgress = ({
	milliseconds,
	duration_in_milliseconds,
}: {
	milliseconds: number
	duration_in_milliseconds: number
}) => milliseconds / duration_in_milliseconds

export const convertProgressToMilliSec = ({
	progress,
	duration_in_milliseconds,
}: {
	progress: number
	duration_in_milliseconds: number
}) => progress * duration_in_milliseconds

// console.log(
// 	timeToMilliSeconds(
// 			extractTimeFromResponse("00:00:20:91")
// 	),
// 	millisecondsToResponse(
// 		timeToMilliSeconds(
// 			extractTimeFromResponse("00:00:20:91")
// 		)
// 	)
// )

// get Response -> 00:00:00:00 hour:min:seconds:milliseconds ->
// Time { hour:number, min:number, seconds:number, milliseconds:number } ->
// totalMilliseconds ->
//
// (totalMilliseconds / durationInMilliseconds) -> Progress
// (Progress * durationInMilliseconds) -> ratio -> totalMilliseconds
//
// totalMilliseconds -> Time -> Response

// const get_response = "00:12:48:06"
// const duration = "00:24:00:00"
// const milliseconds =  timeToMilliSeconds(
// 			extractTimeFromResponse(get_response)
// 		)

// const progress = convertMilliSecToProgress({
// 	milliseconds,
// 	duration_in_milliseconds: timeToMilliSeconds(
// 			extractTimeFromResponse(duration)
// 		)
// });

// const milliSec = convertProgressToMilliSec({
// 	progresss:progress,
// 	duration_in_milliseconds:timeToMilliSeconds(
// 			extractTimeFromResponse(duration)
// 		)
// })

// const send_response = millisecondsToResponse(milliSec)

// console.log(get_response,duration)
// console.log(milliseconds,progress)
// console.log(milliSec)
// console.log(send_response)

import {
	Accessor,
	createSignal,
	mergeProps,
	onMount,
	ParentProps,
	Show,
} from "solid-js"

export type CustomizableProgressbarProps<P = {}> = P & {
	radius: number
	progress: Accessor<number>
	steps?: number
	cut?: number
	rotate?: number
	strokeWidth?: number
	strokeColor?: string
	fillColor?: string
	strokeLinecap?: "round" | "inherit" | "butt" | "square"
	transition?: string
	pointerRadius?: number
	pointerStrokeWidth?: number
	pointerStrokeColor?: string
	pointerFillColor?: string
	trackStrokeColor?: string
	trackStrokeWidth?: number
	trackStrokeLinecap?: "butt" | "round" | "square" | "inherit"
	trackTransition?: string
	counterClockwise?: boolean
	inverse?: boolean
	initialAnimation?: boolean
	initialAnimationDelay?: number
	className?: string
}

export const CustomizableProgressbar = (
	params: CustomizableProgressbarProps<ParentProps>
) => {
	const props = mergeProps(
		{
			radius: 100,
			progress: () => 0,
			steps: 100,
			cut: 0,
			rotate: -90,

			strokeWidth: 20,
			strokeColor: "indianred",
			fillColor: "none",
			strokeLinecap: "round",
			transition: ".3s ease",

			pointerRadius: 0,
			pointerStrokeWidth: 20,
			pointerStrokeColor: "indianred",
			pointerFillColor: "white",

			trackStrokeColor: "#e6e6e6",
			trackStrokeWidth: 20,
			trackStrokeLinecap: "round",
			trackTransition: ".3s ease",

			counterClockwise: false,
			inverse: false,

			initialAnimation: false,
			initialAnimationDelay: 0,
			className: "",
		},
		params
	)

	const {
		radius,
		progress,
		steps,
		cut,
		rotate,
		strokeWidth,
		strokeColor,
		fillColor,
		strokeLinecap,
		transition,
		pointerRadius,
		pointerStrokeWidth,
		pointerStrokeColor,
		pointerFillColor,
		trackStrokeColor,
		trackStrokeWidth,
		trackStrokeLinecap,
		trackTransition,
		counterClockwise,
		inverse,
		initialAnimation,
		initialAnimationDelay,
		className,
	} = props

	const [animationInited, setAnimationInited] = createSignal(false)

	onMount(() => {
		console.log(props)
		if (initialAnimation) {
			setTimeout(() => setAnimationInited(true), initialAnimationDelay)
		}
	})

	const getProgress = () =>
		initialAnimation && !animationInited() ? 0 : progress()

	const getStrokeDashoffset = (strokeLength: number) => {
		const progress = getProgress()
		const progressLength = (strokeLength / steps!) * (steps! - progress)

		if (inverse) {
			return counterClockwise ? 0 : progressLength - strokeLength
		}

		return counterClockwise ? -1 * progressLength : progressLength
	}

	const getStrokeDashArray = (strokeLength: number, circumference: number) => {
		const progress = getProgress()
		const progressLength = (strokeLength / steps!) * (steps! - progress)

		if (inverse) {
			return `${progressLength}, ${circumference}`
		}

		return counterClockwise
			? `${strokeLength * (progress / 100)}, ${circumference}`
			: `${strokeLength}, ${circumference}`
	}

	const getTrackStrokeDashArray = (
		strokeLength: number,
		circumference: number
	) => {
		if (initialAnimation && !animationInited()) {
			return `0, ${circumference}`
		}

		return `${strokeLength}, ${circumference}`
	}

	const getExtendedWidth = () => {
		const pointerWidth = pointerRadius! + pointerStrokeWidth!

		if (pointerWidth > strokeWidth! && pointerWidth > trackStrokeWidth!) {
			return pointerWidth * 2
		} else if (strokeWidth! > trackStrokeWidth!) {
			return strokeWidth! * 2
		}

		return trackStrokeWidth! * 2
	}

	const getPointerAngle = () => {
		const progress = getProgress()

		return counterClockwise
			? ((360 - cut!) / steps!) * (steps! - progress)
			: ((360 - cut!) / steps!) * progress
	}

	const d = 2 * radius
	const width = d + getExtendedWidth()

	const circumference = 2 * Math.PI * radius
	const strokeLength = (circumference / 360) * (360 - cut!)

	return (
		<div
			class={`RCP ${className}`}
			style={{
				position: "relative",
				width: `${width}px`,
			}}
		>
			<svg
				width={width}
				height={width}
				viewBox={`0 0 ${width} ${width}`}
				style={{ transform: `rotate(${rotate}deg)` }}
			>
				<Show when={trackStrokeWidth! > 0}>
					<circle
						cx={width / 2}
						cy={width / 2}
						r={radius}
						fill="none"
						stroke={trackStrokeColor}
						stroke-width={trackStrokeWidth}
						stroke-dasharray={getTrackStrokeDashArray(
							strokeLength,
							circumference
						)}
						stroke-linecap={trackStrokeLinecap as "round"}
						class="RCP__track"
						style={{ transition: trackTransition }}
					/>
				</Show>
				<Show when={strokeWidth! > 0}>
					<circle
						cx={width / 2}
						cy={width / 2}
						r={radius}
						fill={fillColor}
						stroke={strokeColor}
						stroke-width={strokeWidth}
						stroke-dasharray={getStrokeDashArray(strokeLength, circumference)}
						stroke-dashoffset={getStrokeDashoffset(strokeLength)}
						stroke-linecap={strokeLinecap as "round"}
						class="RCP__progress"
						style={{ transition }}
					/>
				</Show>
				<Show when={pointerRadius! > 0}>
					<circle
						cx={d}
						cy="50%"
						r={pointerRadius}
						fill={pointerFillColor}
						stroke={pointerStrokeColor}
						stroke-width={pointerStrokeWidth}
						class="RCP__pointer"
						style={{
							transformOrigin: "50% 50%",
							transform: `rotate(${getPointerAngle()}deg) translate(${
								getExtendedWidth() / 2
							}px)`,
							transition,
						}}
					/>
				</Show>
			</svg>
			{props?.children ? props.children : null}
		</div>
	)
}

export default CustomizableProgressbar

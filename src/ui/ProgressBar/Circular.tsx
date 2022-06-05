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

	const [animationInited, setAnimationInited] = createSignal(false)

	onMount(() => {
		console.log(props)
		if (props.initialAnimation) {
			setTimeout(() => setAnimationInited(true), props.initialAnimationDelay)
		}
	})

	const getProgress = () =>
		props.initialAnimation && !animationInited() ? 0 : props.progress()

	const getStrokeDashoffset = (strokeLength: number) => {
		const progress = getProgress()
		const progressLength =
			(strokeLength / props.steps!) * (props.steps! - progress)

		if (props.inverse) {
			return props.counterClockwise ? 0 : progressLength - strokeLength
		}

		return props.counterClockwise ? -1 * progressLength : progressLength
	}

	const getStrokeDashArray = (strokeLength: number, circumference: number) => {
		const progress = getProgress()
		const progressLength =
			(strokeLength / props.steps!) * (props.steps! - progress)

		if (props.inverse) {
			return `${progressLength}, ${circumference}`
		}

		return props.counterClockwise
			? `${strokeLength * (progress / 100)}, ${circumference}`
			: `${strokeLength}, ${circumference}`
	}

	const getTrackStrokeDashArray = (
		strokeLength: number,
		circumference: number
	) => {
		if (props.initialAnimation && !animationInited()) {
			return `0, ${circumference}`
		}

		return `${strokeLength}, ${circumference}`
	}

	const getExtendedWidth = () => {
		const pointerWidth = props.pointerRadius! + props.pointerStrokeWidth!

		if (
			pointerWidth > props.strokeWidth! &&
			pointerWidth > props.trackStrokeWidth!
		) {
			return pointerWidth * 2
		} else if (props.strokeWidth! > props.trackStrokeWidth!) {
			return props.strokeWidth! * 2
		}

		return props.trackStrokeWidth! * 2
	}

	const getPointerAngle = () => {
		const progress = getProgress()

		return props.counterClockwise
			? ((360 - props.cut!) / props.steps!) * (props.steps! - progress)
			: ((360 - props.cut!) / props.steps!) * progress
	}

	const d = 2 * props.radius
	const width = d + getExtendedWidth()

	const circumference = 2 * Math.PI * props.radius
	const strokeLength = (circumference / 360) * (360 - props.cut!)

	return (
		<div
			class={`RCP ${props.className}`}
			style={{
				position: "relative",
				width: `${width}px`,
			}}
		>
			<svg
				width={width}
				height={width}
				viewBox={`0 0 ${width} ${width}`}
				style={{ transform: `rotate(${props.rotate}deg)` }}
			>
				<Show when={props.trackStrokeWidth! > 0}>
					<circle
						cx={width / 2}
						cy={width / 2}
						r={props.radius}
						fill="none"
						stroke={props.trackStrokeColor}
						stroke-width={props.trackStrokeWidth}
						stroke-dasharray={getTrackStrokeDashArray(
							strokeLength,
							circumference
						)}
						stroke-linecap={props.trackStrokeLinecap as "round"}
						class="RCP__track"
						style={{ transition: props.trackTransition }}
					/>
				</Show>
				<Show when={props.strokeWidth! > 0}>
					<circle
						cx={width / 2}
						cy={width / 2}
						r={props.radius}
						fill={props.fillColor}
						stroke={props.strokeColor}
						stroke-width={props.strokeWidth}
						stroke-dasharray={getStrokeDashArray(strokeLength, circumference)}
						stroke-dashoffset={getStrokeDashoffset(strokeLength)}
						stroke-linecap={props.strokeLinecap as "round"}
						class="RCP__progress"
						style={{ transition: props.transition }}
					/>
				</Show>
				<Show when={props.pointerRadius! > 0}>
					<circle
						cx={d}
						cy="50%"
						r={props.pointerRadius}
						fill={props.pointerFillColor}
						stroke={props.pointerStrokeColor}
						stroke-width={props.pointerStrokeWidth}
						class="RCP__pointer"
						style={{
							transformOrigin: "50% 50%",
							transform: `rotate(${getPointerAngle()}deg) translate(${
								getExtendedWidth() / 2
							}px)`,
							transition: props.transition,
						}}
					/>
				</Show>
			</svg>
			{props?.children ? props.children : null}
		</div>
	)
}

export default CustomizableProgressbar

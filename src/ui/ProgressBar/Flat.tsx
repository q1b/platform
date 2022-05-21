import {
	createEffect,
	createSignal,
	JSX,
	mergeProps,
	ParentProps,
} from "solid-js"

// create Here,
// https://katerinalupacheva.github.io/react-progress-bar/

export type ProgressBarProps = {
	completed: string | number
	bgColor?: string
	baseBgColor?: string
	height?: string
	width?: string
	borderRadius?: string
	margin?: string
	padding?: string
	labelAlignment?: "left" | "center" | "right" | "outside"
	labelColor?: string
	labelSize?: string
	isLabelVisible?: boolean
	transitionDuration?: string
	transitionTimingFunction?:
		| "ease"
		| "linear"
		| "ease-in"
		| "ease-out"
		| "ease-in-out"
	className?: string
	dir?: "ltr" | "rtl" | "auto"
	ariaValuemin?: number
	ariaValuemax?: number
	ariaValuetext?: number | null
	maxCompleted?: number
	customLabel?: string
	animateOnRender?: boolean
	barContainerClassName?: string
	completedClassName?: string
	labelClassName?: string
	initCompletedOnAnimation?: string | number
}

const ProgressBar = (params: ParentProps<ProgressBarProps>) => {
	const props = mergeProps(
		{
			bgColor: "#6a1b9a",
			height: "20px",
			width: "100%",
			borderRadius: "50px",
			labelAlignment: "right",
			baseBgColor: "#e0e0de",
			labelColor: "#fff",
			labelSize: "15px",
			isLabelVisible: true,
			dir: "ltr",
			ariaValuemin: 0,
			ariaValuemax: 100,
			ariaValuetext: null,
			maxCompleted: 100,
			animateOnRender: false,
			initCompletedOnAnimation: 0,
		},
		params
	)
	const {
		completed,
		bgColor,
		baseBgColor,
		height,
		width,
		borderRadius,
		margin,
		padding,
		labelAlignment,
		labelColor,
		labelSize,
		isLabelVisible,
		transitionDuration,
		transitionTimingFunction,
		className,
		dir,
		ariaValuemin,
		ariaValuemax,
		ariaValuetext,
		maxCompleted,
		customLabel,
		animateOnRender,
		barContainerClassName,
		completedClassName,
		labelClassName,
		initCompletedOnAnimation,
	} = props

	const getAlignment = (
		alignmentOption: ProgressBarProps["labelAlignment"]
	) => {
		if (alignmentOption === "left") {
			return "flex-start"
		} else if (alignmentOption === "center") {
			return "center"
		} else if (alignmentOption === "right") {
			return "flex-end"
		} else {
			return null
		}
	}

	const alignment = getAlignment(labelAlignment as "center")

	const initCompletedOnAnimationStr =
		typeof initCompletedOnAnimation === "number"
			? `${initCompletedOnAnimation}%`
			: initCompletedOnAnimation

	const getFillerWidth = (
		maxCompletedValue: ProgressBarProps["maxCompleted"],
		completedValue: ProgressBarProps["completed"]
	) => {
		if (maxCompletedValue) {
			const ratio = Number(completedValue) / maxCompletedValue
			return ratio > 1 ? "100%" : `${ratio * 100}%`
		}
		return initCompletedOnAnimationStr
	}

	const fillerWidth = getFillerWidth(maxCompleted, completed)

	const [initWidth, setInitWidth] = createSignal<string>(
		initCompletedOnAnimationStr
	)

	const containerStyles: JSX.CSSProperties = {
		height: height,
		background: baseBgColor,
		"border-radius": borderRadius,
		padding: padding,
		width: width,
		margin: margin,
	}

	const fillerStyles: JSX.CSSProperties = {
		height: height,
		width: animateOnRender ? initWidth : fillerWidth,
		background: bgColor,
		transition: `width ${transitionDuration || "1s"} ${
			transitionTimingFunction || "ease-in-out"
		}`,
		"border-radius": "inherit",
		display: "flex",
		"align-items": "center",
		"justify-content":
			labelAlignment !== "outside" && alignment ? alignment : "inherit",
	}

	const labelStyles: JSX.CSSProperties = {
		padding: labelAlignment === "outside" ? "0 0 0 5px" : "5px",
		color: labelColor,
		"font-weight": "bold",
		"font-size": labelSize,
		display: !isLabelVisible ? "none" : "initial",
	}

	const outsideStyles: JSX.CSSProperties = {
		display: labelAlignment === "outside" ? "flex" : "initial",
		"align-items": labelAlignment === "outside" ? "center" : "initial",
	}

	const completedStr =
		typeof completed === "number" ? `${completed}%` : `${completed}`
	const labelStr = customLabel ? customLabel : completedStr

	createEffect(() => {
		if (animateOnRender) {
			requestAnimationFrame(() => setInitWidth(fillerWidth))
		}
	})

	return (
		<div
			style={className ? undefined : outsideStyles}
			class={className}
			dir={dir as "ltr"}
			role="progressbar"
			aria-valuenow={parseFloat(labelStr)}
			aria-valuemin={ariaValuemin}
			aria-valuemax={ariaValuemax}
			aria-valuetext={`${ariaValuetext === null ? labelStr : ariaValuetext}`}
		>
			<div
				style={barContainerClassName ? undefined : containerStyles}
				class={barContainerClassName}
			>
				<div
					style={completedClassName ? undefined : fillerStyles}
					class={completedClassName}
				>
					{labelAlignment !== "outside" && (
						<span
							style={labelClassName ? undefined : labelStyles}
							class={labelClassName}
						>
							{labelStr}
						</span>
					)}
				</div>
			</div>
			{labelAlignment === "outside" && (
				<span
					style={labelClassName ? undefined : labelStyles}
					class={labelClassName}
				>
					{labelStr}
				</span>
			)}
		</div>
	)
}

// ProgressBar.propTypes = {
// 	completed: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
// 		.isRequired,
// 	bgColor: PropTypes.string,
// 	baseBgColor: PropTypes.string,
// 	height: PropTypes.string,
// 	width: PropTypes.string,
// 	borderRadius: PropTypes.string,
// 	margin: PropTypes.string,
// 	padding: PropTypes.string,
// 	labelAlignment: PropTypes.oneOf(["left", "center", "right", "outside"]),
// 	labelColor: PropTypes.string,
// 	labelSize: PropTypes.string,
// 	isLabelVisible: PropTypes.bool,
// 	className: PropTypes.string,
// 	dir: PropTypes.oneOf(["rtl", "ltr", "auto"]),
// 	maxCompleted: PropTypes.number,
// 	customLabel: PropTypes.string,
// 	animateOnRender: PropTypes.bool,
// 	barContainerClassName: PropTypes.string,
// 	completedClassName: PropTypes.string,
// 	labelClassName: PropTypes.string,
// 	initCompletedOnAnimation: PropTypes.oneOfType([
// 		PropTypes.string,
// 		PropTypes.number,
// 	]),
// }

ProgressBar.defaultProps = {}

export default ProgressBar

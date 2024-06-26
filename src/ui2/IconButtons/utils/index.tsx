import {
	createEffect,
	splitProps,
	ComponentProps,
	Accessor,
	Setter,
	PropsWithChildren,
	JSX,
} from "solid-js"
import { AnimateTo } from "@microsoft/fast-animation"
import { Dynamic } from "solid-js/web"

type SvgOptions = PropsWithChildren<ComponentProps<"svg">>

type SvgWithIconsOptions<P = {}> = P & {
	type?: "solid" | "outline"
}

// type Component<P = {}> = (props: PropsWithChildren<P>) => JSX.Element;

type PlayAbleIconButtonProps<P = {}> = P & {
	state: Accessor<boolean>
	setState: Setter<boolean>
	icons: [
		{
			hovered: (props: IconOptions) => JSX.Element
			unhover: (props: IconOptions) => JSX.Element
		},
		{
			hovered: (props: IconOptions) => JSX.Element
			unhover: (props: IconOptions) => JSX.Element
		}
	]
	colors: [
		{
			stroke: string
			fill: string
		},
		{
			stroke: string
			fill: string
		}
	]
	activeColors?: [
		{
			stroke: string
			fill: string
		},
		{
			stroke: string
			fill: string
		}
	]
	width?: number
	height?: number
}

type IconBtnProps<P = {}> = P & {
	icon: {
		hovered: (props: IconOptions) => JSX.Element
		unhover: (props: IconOptions) => JSX.Element
	}
	colors: {
		stroke: string
		fill: string
	}
	width?: number
	height?: number
}

type IconOptions = SvgWithIconsOptions<SvgOptions>
type PlayAbleIconButtonOptions = PlayAbleIconButtonProps<
	ComponentProps<"button">
>
type IconBtnOptions = IconBtnProps<ComponentProps<"button">>

export const Make_a_OutlineCircle_Around_Icon = (props: SvgOptions) => {
	const [local, others] = splitProps(props, ["stroke", "children", "fill"])
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-44 w-44"
			fill="none"
			viewBox="0 0 24 24"
			stroke={local.stroke || "currentColor"}
			stroke-width="2"
			{...others}
		>
			{local.fill !== "transparent" ? (
				<circle
					cx="12"
					cy="12"
					r="12"
					fill={local.fill || "white"}
					stroke="none"
					stroke-width="2"
				></circle>
			) : null}
			<g transform="scale(0.7) translate(5 5)">{local.children}</g>
		</svg>
	)
}

export const Made_a_Solid_Circle_Around_Icon = (props: SvgOptions) => {
	const [local, others] = splitProps(props, ["stroke", "children", "fill"])
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-44 w-44"
			viewBox="0 0 24 24"
			{...others}
			fill={local.stroke || "currentColor"}
		>
			{/* Here is the circle */}
			{/* <circle cx="12" cy="12" r="12" fill={local.fill || "white"} stroke="none" stroke-width="2"></circle> */}
			{local.fill !== "transparent" ? (
				<circle
					cx="12"
					cy="12"
					r="12"
					fill={local.fill || "white"}
					stroke="none"
					stroke-width="2"
				></circle>
			) : null}
			<g transform="scale(0.7) translate(7 7)">{local.children}</g>
		</svg>
	)
}

export const MakePlayAbleIconBtn = (props: PlayAbleIconButtonOptions) => {
	const [local, others] = splitProps(props, [
		"state",
		"setState",
		"colors",
		"activeColors",
		"icons",
		"width",
		"height",
		"style",
	])
	// const [isplaying, local.setState] = [local.state, local.setState];

	let playGroupRef: HTMLSpanElement
	let pauseGroupRef: HTMLSpanElement

	const makeItHidden = (el: HTMLElement) => el.classList.add("hidden")
	const makeItVisible = (el: HTMLElement) => el.classList.remove("hidden")

	const animateIcon = ({
		from,
		to,
	}: {
		from: HTMLElement
		to: HTMLElement
	}) => {
		let enteringFrom = new AnimateTo(
			// @ts-ignore
			to,
			{
				scale: 1,
				opacity: 1,
			},
			{
				duration: 120,
				easing: "cubic-bezier(.5, 1.75, .75, 1.25)",
			}
		)
		let leaving = new AnimateTo(
			// @ts-ignore
			from,
			{
				scale: 0.86,
				opacity: 0.9,
			},
			{
				duration: 120,
				easing: "cubic-bezier(0, 0, 0, 1)",
			}
		)
		leaving.onFinish = () => {
			makeItHidden(from)
			makeItVisible(to)
			enteringFrom.play()
		}
		leaving.play()
	}

	createEffect(() => {
		local.state()
			? animateIcon({
					from: playGroupRef,
					to: pauseGroupRef,
			  })
			: animateIcon({
					from: pauseGroupRef,
					to: playGroupRef,
			  })
	})
	let styles: JSX.CSSProperties = {}
	let defaultSize = 20
	if (local.style && typeof local.style !== "string") {
		styles = local.style
		styles.width = local.width || defaultSize
		styles.height = local.height || defaultSize
	} else {
		styles.width = local.width || defaultSize
		styles.height = local.height || defaultSize
	}
	return (
		<button
			style={styles}
			class="flex focus:outline-none relative active:scale-105 group"
			onClick={() => local.setState(!local.state())}
			{...others}
		>
			<span
				ref={(el: HTMLSpanElement) => (playGroupRef = el)}
				class="relative"
			>
				<Dynamic
					component={local.icons[0].unhover}
					type="outline"
					fill={local.colors[0].fill}
					stroke={local.colors[0].stroke}
					width={styles.width}
					height={styles.height}
					class="group-active:scale-[1.03] group-focus:border rounded-full group-hover:opacity-0 transition-[transform,opacity] duration-200"
				/>
				<Dynamic
					component={local.icons[0].hovered}
					type="solid"
					fill={
						local?.activeColors
							? local.activeColors[0].fill
							: local.colors[1].fill
					}
					stroke={
						local?.activeColors
							? local.activeColors[0].stroke
							: local.colors[1].stroke
					}
					width={styles.width}
					height={styles.height}
					class="border group-active:scale-[1.03] group-focus:border rounded-full absolute opacity-0 group-hover:opacity-100 -translate-y-full transition-[transform,opacity] duration-200"
				/>
			</span>
			<span
				ref={(el: HTMLSpanElement) => (pauseGroupRef = el)}
				class="relative hidden"
			>
				<Dynamic
					component={local.icons[1].unhover}
					type="outline"
					fill={
						local?.activeColors ? local.colors[1].fill : local.colors[0].fill
					}
					stroke={
						local?.activeColors
							? local.colors[1].stroke
							: local.colors[0].stroke
					}
					width={styles.width}
					height={styles.height}
					class="group-active:scale-[1.03] group-focus:border rounded-full group-hover:opacity-0 transition-[transform,opacity] duration-200"
				/>
				<Dynamic
					component={local.icons[1].hovered}
					type="solid"
					fill={
						local?.activeColors
							? local.activeColors[1].fill
							: local.colors[1].fill
					}
					stroke={
						local?.activeColors
							? local.activeColors[1].stroke
							: local.colors[1].stroke
					}
					width={styles.width}
					height={styles.height}
					class="border group-active:scale-[1.03] group-focus:border rounded-full absolute opacity-0 group-hover:opacity-100 -translate-y-full transition-[transform,opacity] duration-200"
				/>
			</span>
		</button>
	)
}

export const MakeIconBtn = (props: IconBtnOptions) => {
	const [local, others] = splitProps(props, [
		"colors",
		"icon",
		"width",
		"height",
		"style",
	])
	let styles: JSX.CSSProperties = {}
	let defaultSize = 20
	if (local.style && typeof local.style !== "string") {
		styles = local.style
		styles.width = local.width || defaultSize
		styles.height = local.height || defaultSize
	} else {
		styles.width = local.width || defaultSize
		styles.height = local.height || defaultSize
	}
	return (
		<button
			style={styles}
			class="flex text-red-500 relative active:scale-105 group"
			{...others}
		>
			<span class="relative">
				<Dynamic
					component={local.icon.unhover}
					type="outline"
					fill={local.colors.fill}
					stroke={local.colors.stroke}
					width={styles.width}
					height={styles.height}
					class="group-active:scale-[1.03] group-focus:border rounded-full group-hover:opacity-0 transition-[transform,opacity] duration-200"
				/>
				<Dynamic
					component={local.icon.hovered}
					type="solid"
					fill={local.colors.fill}
					stroke={local.colors.stroke}
					width={styles.width}
					height={styles.height}
					class="group-active:scale-[1.03] group-focus:border rounded-full absolute opacity-0 group-hover:opacity-100 -translate-y-full transition-[transform,opacity] duration-200"
				/>
			</span>
		</button>
	)
}

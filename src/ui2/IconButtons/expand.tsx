import {
	Accessor,
	ComponentProps,
	PropsWithChildren,
	Setter,
	Show,
} from "solid-js"
import {
	Made_a_Solid_Circle_Around_Icon,
	Make_a_OutlineCircle_Around_Icon,
	MakePlayAbleIconBtn,
} from "./utils"

type SvgOptions = PropsWithChildren<ComponentProps<"svg">>
type SvgWithIconsOptions<P = {}> = P & {
	type?: "solid" | "outline"
}

type PlayStateWithButton<P = {}> = P & {
	state: Accessor<boolean>
	setState: Setter<boolean>
	colors?: [
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

type IconOptions = SvgWithIconsOptions<SvgOptions>
type ButtonOptions = PlayStateWithButton<ComponentProps<"button">>

const ExpandIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Make_a_OutlineCircle_Around_Icon {...props}>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M5 9 v-4 h4 m-4 0 l5 5 M19 9 v-4 h-4 m4 0 l-5 5 M19 15 v4 h-4 m4 0 l-5 -5 M5 15 v4 h4 m-4 0 l5 -5"
					/>
				</Make_a_OutlineCircle_Around_Icon>
			}
		>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
				/>
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	)
}

const CollapseIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Make_a_OutlineCircle_Around_Icon {...props}>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M5 5 l5 5 m0 0 h-4 m4 0 v-4 M5 19 l5 -5 m0 0 h-4 m4 0 v4 M19 5 l-5 5 m0 0 h4 m-4 0 v-4 M19 19 l-5 -5 m0 0 h4 m-4 0 v4"
					/>
				</Make_a_OutlineCircle_Around_Icon>
			}
		>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M4 4 l5 5 m0 0 h-4 m4 0 v-4 M4 20 l5 -5 m0 0 h-4 m4 0 v4 M20 4 l-5 5 m0 0 h4 m-4 0 v-4 M20 20 l-5 -5 m0 0 h4 m-4 0 v4"
				/>
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	)
}

const ExpandIconButton = (props: ButtonOptions) => {
	return (
		<MakePlayAbleIconBtn
			colors={[
				{
					fill: "#FF0060",
					stroke: "#FFF",
				},
				{
					fill: "#FF0060",
					stroke: "#FFF",
				},
			]}
			icons={[
				{
					hovered: ExpandIcon,
					unhover: ExpandIcon,
				},
				{
					hovered: CollapseIcon,
					unhover: CollapseIcon,
				},
			]}
			width={40}
			height={40}
			{...props}
		/>
	)
}

export default ExpandIconButton

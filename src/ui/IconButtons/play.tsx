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

// type PlayStateWithButton<P = {}> = P & {
// 	state: Accessor<boolean>;
// 	setState: Setter<boolean>;
// };

type IconOptions = SvgWithIconsOptions<SvgOptions>
type ButtonOptions = PlayStateWithButton<ComponentProps<"button">>

const PlayIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Make_a_OutlineCircle_Around_Icon {...props}>
					<path
						stroke-width={6}
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M8.5 6 v12 M8.5 6 l8 6 l-8 6"
					/>
				</Make_a_OutlineCircle_Around_Icon>
			}
		>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path
					stroke-width={3}
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8 5.5 v12.5 M8 5.5 l9 6.5 l-9 6.5"
				/>
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	)
}

const PauseIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Make_a_OutlineCircle_Around_Icon {...props}>
					<path
						stroke-linecap="round"
						stroke-width={5}
						stroke-linejoin="round"
						d="M8 6 v12 M16 6 v12"
					/>
				</Make_a_OutlineCircle_Around_Icon>
			}
		>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path
					stroke-linecap="round"
					stroke-width={4}
					stroke-linejoin="round"
					d="M8.5 7 v10 M15.5 7 v10"
				/>
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	)
}

const PlayButton = (props: ButtonOptions) => {
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
					hovered: PlayIcon,
					unhover: PlayIcon,
				},
				{
					hovered: PauseIcon,
					unhover: PauseIcon,
				},
			]}
			width={40}
			height={40}
			{...props}
		/>
	)
}

export default PlayButton

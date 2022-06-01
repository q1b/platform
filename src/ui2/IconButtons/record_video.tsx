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

// type PlayStateWithButton<P = {}> = P & {
// 	state: Accessor<boolean>;
// 	setState: Setter<boolean>;
// };

type IconOptions = SvgWithIconsOptions<SvgOptions>
type ButtonOptions = PlayStateWithButton<ComponentProps<"button">>

const MicrophoneIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<circle
						cx="10"
						cy="10"
						r="11.4"
					/>
				</Made_a_Solid_Circle_Around_Icon>
			}
		>
			<Made_a_Solid_Circle_Around_Icon {...props}>
				<circle
					cx="10"
					cy="10"
					r="12.4"
				/>
			</Made_a_Solid_Circle_Around_Icon>
		</Show>
	)
}

export const StopIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<rect
						stroke-linecap="round"
						stroke-linejoin="round"
						x="4"
						y="4"
						rx="3"
						ry="3"
						width="12.6"
						height="12.6"
						stroke-width={3}
					/>
				</Made_a_Solid_Circle_Around_Icon>
			}
		>
			<Made_a_Solid_Circle_Around_Icon {...props}>
				<rect
					stroke-linecap="round"
					stroke-linejoin="round"
					x="3"
					y="3"
					rx="2.4"
					ry="2.4"
					width="14"
					height="14"
					stroke-width={3}
				/>
			</Made_a_Solid_Circle_Around_Icon>
		</Show>
	)
}

const AudioMicrophoneButton = (props: ButtonOptions) => {
	return (
		<MakePlayAbleIconBtn
			activeColors={[
				{
					fill: "hsl(342deg,100%,88%)",
					stroke: "hsl(348deg,100%,58%)",
				},
				{
					fill: "hsl(348deg,82%,44%)",
					stroke: "#FFF",
				},
			]}
			colors={[
				{
					fill: "hsl(348deg,100%,88%)",
					stroke: "hsl(346deg,100%,58%)",
				},
				{
					fill: "hsl(340deg,82%,52%)",
					stroke: "#FFF",
				},
			]}
			icons={[
				{
					hovered: MicrophoneIcon,
					unhover: MicrophoneIcon,
				},
				{
					hovered: StopIcon,
					unhover: StopIcon,
				},
			]}
			width={28}
			height={28}
			{...props}
		/>
	)
}

export default AudioMicrophoneButton

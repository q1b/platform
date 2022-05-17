import {
    Accessor,
    ComponentProps,
    PropsWithChildren,
    Setter,
    Show,
} from "solid-js"

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

const NewIconButton = (props: IconOptions) => {
    return (
        <div>
            <button class="">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99962 2C8.41081 2 8.74414 2.33334 8.74414 2.74453V13.2555C8.74414 13.6667 8.41081 14 7.99962 14C7.58843 14 7.25509 13.6667 7.25509 13.2555L7.25509 2.74453C7.25509 2.33334 7.58843 2 7.99962 2Z" fill="black" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 8.00014C2 7.58895 2.33334 7.25562 2.74453 7.25562H13.2555C13.6667 7.25562 14 7.58895 14 8.00014C14 8.41133 13.6667 8.74467 13.2555 8.74467H2.74453C2.33334 8.74467 2 8.41133 2 8.00014Z" fill="black" />
                </svg>
            </button>
        </div>
    )
}

export default NewIconButton

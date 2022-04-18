import { ComponentProps, splitProps } from "solid-js"
import { Logo, PlusCircle } from "../assets/icons"

type HeaderProps<P = {}> = P & {
    onAdd: () => void
}

export const Header = (props:HeaderProps<ComponentProps<'button'>>) => {
    const [local,others] = splitProps(props,['onAdd','onClick']);
    return (
        <header class="w-64 border-b-2 pt-2 pb-[10px]">
            <div class="flex items-center justify-between rounded-lg">
                <div class="grow shrink overflow-hidden w-0">
                    <div class="flex w-max items-center gap-x-1.5 pl-2">
                        <Logo class="h-6 w-6 text-indigo-500" />
                        <h1 class="text-white font-bold">
                            AT VIDEOS
                        </h1>
                    </div>
                </div>
                <button onClick={local.onAdd} {...others} class="basis-8 shrink overflow-hidden w-0 flex relative group text-white">
                    <PlusCircle
                        basic={true}
                        class="w-6 h-6"
                    />
                </button>
            </div>
        </header>
    )
}

import {
    children as solidifyChildren,
    ComponentProps,
    createSignal,
    PropsWithChildren,
    splitProps,
} from "solid-js"
import NewIconButton from "../IconButtons/new"
import SettingsIconButton from "../IconButtons/settings"

type FolderMenuProps<P = {}> = P & {
    name: string,
    styled?: boolean
}

const Folder = () => {
    return (<div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.333 3.99996H7.33301L5.99967 2.66663H2.66634C1.93301 2.66663 1.33301 3.26663 1.33301 3.99996V6.66663H14.6663V5.33329C14.6663 4.59996 14.0663 3.99996 13.333 3.99996Z" fill="#1976D2" />
            <path d="M13.333 4H2.66634C1.93301 4 1.33301 4.6 1.33301 5.33333V12C1.33301 12.7333 1.93301 13.3333 2.66634 13.3333H13.333C14.0663 13.3333 14.6663 12.7333 14.6663 12V5.33333C14.6663 4.6 14.0663 4 13.333 4Z" fill="#90CAF9" />
        </svg>
    </div>)
}

const OpenedFolder = () => {
    return (<div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6663 3.99996H7.33301L5.99967 2.66663H2.66634C1.93301 2.66663 1.33301 3.26663 1.33301 3.99996V12C1.33301 12.7333 1.93301 13.3333 2.66634 13.3333H12.9997C13.5663 13.3333 13.9997 12.9 13.9997 12.3333V5.33329C13.9997 4.59996 13.3997 3.99996 12.6663 3.99996Z" fill="#1976D2" />
            <path d="M14.067 6H5.10033C4.46699 6 3.90033 6.46667 3.80033 7.1L2.66699 13.3333H13.2337C13.867 13.3333 14.4337 12.8667 14.5337 12.2333L15.367 7.56667C15.5337 6.76667 14.9003 6 14.067 6Z" fill="#90CAF9" />
        </svg>
    </div>)
}

export const FolderMenu = (
    props: PropsWithChildren<FolderMenuProps<ComponentProps<"div">>>
) => {
    const children = solidifyChildren(() => props.children)
    const [local, { name, ...others }] = splitProps(props, ["class", "styled", "children"])
    const [active, setActive] = createSignal(false);

    const onClick = (() => {
        setActive(!active());
    });

    const activeClass = () => active() ? 'bg-gray-300' : '';

    return (
        <div onclick={onClick} class={`hover: group flex h-7 w-64 cursor-pointer justify-between rounded-md px-1 transition-all duration-200 hover:bg-gray-100 active: ${activeClass()}`}>
            <div class="flex items-center space-x-2">
                <div>
                    <Folder />
                </div>
                <span class="font-inter">{name}</span>
            </div>
            <div class="invisible flex items-center space-x-2 group-hover:visible group-active:visible">
                <NewIconButton />
                <SettingsIconButton />
            </div>
        </div>

    )
}

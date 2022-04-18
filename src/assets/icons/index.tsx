import { ComponentProps, splitProps } from "solid-js"
type IconProps<P = {}> = P & {
    size?: number
    basic?: boolean
}
export const Video = (props: IconProps<ComponentProps<"svg">>) => {
    const [local, others] = splitProps(props, [
        "size",
        "class",
        "shape-rendering",
        "basic",
    ])
    if (typeof local.basic === "undefined") {
        local.basic = true
    }
    return (
        
        <svg 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            stroke-width="1.5" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            fill="none"
            
            shape-rendering="geometricPrecision"
            class={
                local?.class
                    ? local?.basic
                        ? local.class +
                          " group-active:scale-100 group-hover:scale-105 transition-transform"
                        : local.class
                    : local.basic
                    ? "w-6 h-6 group-active:scale-100 group-hover:scale-105 transition-transform"
                    : "w-6 h-6"
            }
            width={`${local.size || 24}px`}
            height={`${local.size || 24}px`}
        
        >
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
            <path d="M7 2v20"/><path d="M17 2v20"/><path d="M2 12h20"/>
            <path d="M2 7h5"/><path d="M2 17h5"/><path d="M17 17h5"/>
            <path d="M17 7h5"/>
        </svg>
    )
}
import HeroiconsOutlineVideoCamera from "~icons/heroicons-outline/video-camera/";
export const Logo = (props: IconProps<ComponentProps<"svg">>) => {
    const [local, others] = splitProps(props, [
        "size",
        "class",
        "shape-rendering",
        "basic",
    ])
    if (typeof local.basic === "undefined") {
        local.basic = true
    }
    return (
        <HeroiconsOutlineVideoCamera
            shape-rendering="geometricPrecision"
            class={
                local?.class
                    ? local?.basic
                        ? local.class +
                          " group-active:scale-100 group-hover:scale-105 transition-transform"
                        : local.class
                    : local.basic
                    ? "w-6 h-6 group-active:scale-100 group-hover:scale-105 transition-transform"
                    : "w-6 h-6"
            }
            width={`${local.size || 24}px`}
            height={`${local.size || 24}px`}
            {...others}
        />
    )
}
import HeroiconsOutlinePlusCircle from "~icons/heroicons-outline/plus-circle/";
export const PlusCircle = (props: IconProps<ComponentProps<"svg">>) => {
    const [local, others] = splitProps(props, [
        "size",
        "class",
        "shape-rendering",
        "basic",
    ])
    if (typeof local.basic === "undefined") {
        local.basic = true
    }
    return (
        <HeroiconsOutlinePlusCircle
            shape-rendering="geometricPrecision"
            class={
                local?.class
                    ? local?.basic
                        ? local.class +
                          " group-active:scale-100 group-hover:scale-105 transition-transform"
                        : local.class
                    : local.basic
                    ? "w-6 h-6 group-active:scale-100 group-hover:scale-105 transition-transform"
                    : "w-6 h-6"
            }
            width={`${local.size || 24}px`}
            height={`${local.size || 24}px`}
            {...others}
        />
    )
}
import HeroiconsOutlinePlus from "~icons/heroicons-outline/plus";
export const Plus = (props: IconProps<ComponentProps<"svg">>) => {
    const [local, others] = splitProps(props, [
        "size",
        "class",
        "shape-rendering",
        "basic",
    ])
    if (typeof local.basic === "undefined") {
        local.basic = true
    }
    return (
        <HeroiconsOutlinePlus
            shape-rendering="geometricPrecision"
            class={
                local?.class
                    ? local?.basic
                        ? local.class +
                          " group-active:scale-100 group-hover:scale-105 transition-transform"
                        : local.class
                    : local.basic
                    ? "w-6 h-6 group-active:scale-100 group-hover:scale-105 transition-transform"
                    : "w-6 h-6"
            }
            width={`${local.size || 24}px`}
            height={`${local.size || 24}px`}
            {...others}
        />
    )
}
import IcRoundVideoLibrary from "~icons/ic/round-video-library/";
export const VideoTabIcon = (props: IconProps<ComponentProps<"svg">>) => {
    const [local, others] = splitProps(props, [
        "size",
        "class",
        "shape-rendering",
        "basic",
    ])
    if (typeof local.basic === "undefined") {
        local.basic = true
    }
    return (
        <IcRoundVideoLibrary
            shape-rendering="geometricPrecision"
            class={
                local?.class
                    ? local?.basic
                        ? local.class +
                          " group-active:scale-100 group-hover:scale-105 transition-transform"
                        : local.class
                    : local.basic
                    ? "w-6 h-6 group-active:scale-100 group-hover:scale-105 transition-transform"
                    : "w-6 h-6"
            }
            width={`${local.size || 24}px`}
            height={`${local.size || 24}px`}
            {...others}
        />
    )
}
import IcRoundLibraryMusic from "~icons/ic/round-library-music";
export const AudioTabIcon = (props: IconProps<ComponentProps<"svg">>) => {
    const [local, others] = splitProps(props, [
        "size",
        "class",
        "shape-rendering",
        "basic",
    ])
    if (typeof local.basic === "undefined") {
        local.basic = true
    }
    return (
        <IcRoundLibraryMusic
            shape-rendering="geometricPrecision"
            class={
                local?.class
                    ? local?.basic
                        ? local.class +
                          " group-active:scale-100 group-hover:scale-105 transition-transform"
                        : local.class
                    : local.basic
                    ? "w-6 h-6 group-active:scale-100 group-hover:scale-105 transition-transform"
                    : "w-6 h-6"
            }
            width={`${local.size || 24}px`}
            height={`${local.size || 24}px`}
            {...others}
        />
    )
}
import HeroiconsOutlineLogin from "~icons/heroicons-outline/login";
export const LogIn = (props: IconProps<ComponentProps<"svg">>) => {
    const [local, others] = splitProps(props, [
        "size",
        "class",
        "shape-rendering",
        "basic",
    ])
    if (typeof local.basic === "undefined") {
        local.basic = true
    }
    return (
        <HeroiconsOutlineLogin
            shape-rendering="geometricPrecision"
            class={
                local?.class
                    ? local?.basic
                        ? local.class +
                          " group-active:scale-100 group-hover:scale-105 transition-transform"
                        : local.class
                    : local.basic
                    ? "w-6 h-6 group-active:scale-100 group-hover:scale-105 transition-transform"
                    : "w-6 h-6"
            }
            width={`${local.size || 24}px`}
            height={`${local.size || 24}px`}
            {...others}
        />
    )
}
import HeroiconsOutlineLogout from "~icons/heroicons-outline/logout";
export const LogOut = (props: IconProps<ComponentProps<"svg">>) => {
    const [local, others] = splitProps(props, [
        "size",
        "class",
        "shape-rendering",
        "basic",
    ])
    if (typeof local.basic === "undefined") {
        local.basic = true
    }
    return (
        <HeroiconsOutlineLogout
            shape-rendering="geometricPrecision"
            class={
                local?.class
                    ? local?.basic
                        ? local.class +
                          " group-active:scale-100 group-hover:scale-105 transition-transform"
                        : local.class
                    : local.basic
                    ? "w-6 h-6 group-active:scale-100 group-hover:scale-105 transition-transform"
                    : "w-6 h-6"
            }
            width={`${local.size || 24}px`}
            height={`${local.size || 24}px`}
            {...others}
        />
    )
}
import HeroiconsOutlineUserCircle from "~icons/heroicons-outline/user-circle";
export const UserProfileCircle = (props: IconProps<ComponentProps<"svg">>) => {
    const [local, others] = splitProps(props, [
        "size",
        "class",
        "shape-rendering",
        "basic",
    ])
    if (typeof local.basic === "undefined") {
        local.basic = true
    }
    return (
        <HeroiconsOutlineUserCircle
            shape-rendering="geometricPrecision"
            class={
                local?.class
                    ? local?.basic
                        ? local.class +
                          " group-active:scale-100 group-hover:scale-105 transition-transform"
                        : local.class
                    : local.basic
                    ? "w-6 h-6 group-active:scale-100 group-hover:scale-105 transition-transform"
                    : "w-6 h-6"
            }
            width={`${local.size || 24}px`}
            height={`${local.size || 24}px`}
            {...others}
        />
    )
}
import HeroiconsOutlineUser from "~icons/heroicons-outline/user";
export const User = (props: IconProps<ComponentProps<"svg">>) => {
    const [local, others] = splitProps(props, [
        "size",
        "class",
        "shape-rendering",
        "basic",
    ])
    if (typeof local.basic === "undefined") {
        local.basic = true
    }
    return (
        <HeroiconsOutlineUser
            shape-rendering="geometricPrecision"
            class={
                local?.class
                    ? local?.basic
                        ? local.class +
                          " group-active:scale-100 group-hover:scale-105 transition-transform"
                        : local.class
                    : local.basic
                    ? "w-6 h-6 group-active:scale-100 group-hover:scale-105 transition-transform"
                    : "w-6 h-6"
            }
            width={`${local.size || 24}px`}
            height={`${local.size || 24}px`}
            {...others}
        />
    )
}
import HeroiconsOutlineX from "~icons/heroicons-outline/x";
export const Remove = (props: IconProps<ComponentProps<"svg">>) => {
    const [local, others] = splitProps(props, [
        "size",
        "class",
        "shape-rendering",
        "basic",
    ])
    if (typeof local.basic === "undefined") {
        local.basic = true
    }
    return (
        <HeroiconsOutlineX
            shape-rendering="geometricPrecision"
            class={
                local?.class
                    ? local?.basic
                        ? local.class +
                          " group-active:scale-100 group-hover:scale-105 transition-transform"
                        : local.class
                    : local.basic
                    ? "w-6 h-6 group-active:scale-100 group-hover:scale-105 transition-transform"
                    : "w-6 h-6"
            }
            width={`${local.size || 24}px`}
            height={`${local.size || 24}px`}
            {...others}
        />
    )
}

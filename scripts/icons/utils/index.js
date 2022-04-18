const UpperCamelCase = require("just-pascal-case")
//👆 convert hero_icon to HeroIcon

const template = (props) => {
    if (!props?.path) {
        return `
export const ${props.name}Icon = (props: IconProps<ComponentProps<"svg">>) => {
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
        ${props.svg(`
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
            width={\`$\{local.size || 24}px\`}
            height={\`$\{local.size || 24}px\`}
        `)}
    )
}`
    } else {
        const [pack, ..._name] = props?.path.split(":")
        //  import Recevied  from "~icons/heroicons-outline/plus-circle"
        const Recevied = UpperCamelCase(pack) + UpperCamelCase(_name.join(""))
        return `
import ${Recevied} from "~icons/${pack}/${_name}";
export const ${props.name}Icon = (props: IconProps<ComponentProps<"svg">>) => {
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
        <${Recevied}
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
            width={\`$\{local.size || 24}px\`}
            height={\`$\{local.size || 24}px\`}
            {...others}
        />
    )
}`
    }
}

module.exports = template

import { children, ComponentProps, splitProps } from "solid-js";

type IconWrapperProps<P ={}>  = P & {
  class: string
  size?: number,
}

export const IconWrapper = (props: IconWrapperProps<ComponentProps<'div'>>) => {
  const [local,other] = splitProps(props,['size','ref','children'])

  return (
    <div id="MainContainer" ref={props.ref} {...other} >
        <span id="IconContainer" style={{
          width:local?.size ? `${local.size}px` :'24px',
          height:local?.size ? `${local.size}px` :'24px'
        }} class="bg-none flex items-center justify-center">
          {children(() =>  props.children)}
        </span>
    </div>
  )
}
const buildMaterial = require("./build/index.js")
const { join } = require("path")
const template = require("./utils/index")

// Thing on Using YAML
// const YAML = require("yaml")
// const file = fs.readFileSync("./file.yml", "utf8")
// YAML.parse(file)

const RequiredIcons = [
	{
		svg: (attr) => `
				<svg 		
						viewBox="0 0 16 16" 
						fill="none"             
						stroke="currentColor" 
            stroke-width="1.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"
						${attr}
			>
					<path d="M13.333 3.99996H7.33301L5.99967 2.66663H2.66634C1.93301 2.66663 1.33301 3.26663 1.33301 3.99996V6.66663H14.6663V5.33329C14.6663 4.59996 14.0663 3.99996 13.333 3.99996Z" fill="#1976D2"/>
					<path d="M13.333 4H2.66634C1.93301 4 1.33301 4.6 1.33301 5.33333V12C1.33301 12.7333 1.93301 13.3333 2.66634 13.3333H13.333C14.0663 13.3333 14.6663 12.7333 14.6663 12V5.33333C14.6663 4.6 14.0663 4 13.333 4Z" fill="#90CAF9"/>
				</svg>
		`,
		name: "DefaultFolder",
	},
	{
		svg: (attr) => `
				<svg 
						viewBox="0 0 16 16"
						fill="none"
						${attr}
				>
					<path d="M12.6663 3.99996H7.33301L5.99967 2.66663H2.66634C1.93301 2.66663 1.33301 3.26663 1.33301 3.99996V12C1.33301 12.7333 1.93301 13.3333 2.66634 13.3333H12.9997C13.5663 13.3333 13.9997 12.9 13.9997 12.3333V5.33329C13.9997 4.59996 13.3997 3.99996 12.6663 3.99996Z" fill="#1976D2"/>
					<path d="M14.067 6H5.10033C4.46699 6 3.90033 6.46667 3.80033 7.1L2.66699 13.3333H13.2337C13.867 13.3333 14.4337 12.8667 14.5337 12.2333L15.367 7.56667C15.5337 6.76667 14.9003 6 14.067 6V6Z" fill="#90CAF9"/>
				</svg>
		`,
		name: "ActiveFolder",
	},
	{
		svg: (attr) => `
        <svg
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            stroke-width="1.5" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            fill="none"
            ${attr}
        >
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
            <path d="M7 2v20"/><path d="M17 2v20"/><path d="M2 12h20"/>
            <path d="M2 7h5"/><path d="M2 17h5"/><path d="M17 17h5"/>
            <path d="M17 7h5"/>
        </svg>`,
		name: "VideoTape",
	},
	{
		path: "material-symbols:all-inbox-rounded",
		name: "PreviewTab",
	},
	{
		svg: (attr) => `
		<svg 
			width="26" 
			height="26" 
			viewBox="0 0 26 26" 
			fill="none" 
			${attr}
		>
       <path d="M2.00002 3.83679C2.00002 3.83679 1.99998 21.9807 2.00002 22.4844C2.00005 22.8441 2.07314 23.1547 2.35317 23.4344C2.63311 23.714 2.94346 23.7865 3.30317 23.7865C3.95192 23.7865 21.9788 23.7865 21.9788 23.7865" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
       <path fill-rule="evenodd" clip-rule="evenodd" d="M6.18323 2.2135C6.18323 1.10893 7.07866 0.213501 8.18323 0.213501H23.5832C24.6878 0.213501 25.5832 1.10893 25.5832 2.2135V17.6135C25.5832 18.7181 24.6878 19.6135 23.5832 19.6135H8.18322C7.07866 19.6135 6.18323 18.7181 6.18323 17.6135V2.2135ZM16.475 2.15239C16.1935 2.01162 15.8621 2.01162 15.5806 2.15239L14.1361 2.87461C13.7213 3.08202 13.5035 3.54742 13.6101 3.99879C13.7166 4.45016 14.1196 4.76904 14.5833 4.76904H17.4722C17.936 4.76904 18.3389 4.45016 18.4455 3.99879C18.552 3.54742 18.3343 3.08202 17.9194 2.87461L16.475 2.15239ZM12.5889 4.76627C12.7898 5.16808 12.6948 5.64048 12.3865 5.9357C12.6948 6.23093 12.7898 6.70333 12.5889 7.10514C12.3423 7.5982 11.7435 7.79859 11.25 7.55373V7.74126C11.25 8.29354 10.8023 8.74126 10.25 8.74126C9.69772 8.74126 9.25 8.29354 9.25 7.74126V5.9357C9.25 5.55693 9.464 5.21067 9.80279 5.04128L11.2472 4.31905C11.7412 4.07206 12.3419 4.27229 12.5889 4.76627ZM20.8083 4.31905C20.3143 4.07206 19.7137 4.27229 19.4667 4.76627C19.2658 5.16808 19.3608 5.64048 19.6691 5.93571C19.3608 6.23093 19.2658 6.70333 19.4667 7.10514C19.7132 7.5982 20.3121 7.79859 20.8056 7.55373V7.74126C20.8056 8.29354 21.2533 8.74126 21.8056 8.74126C22.3578 8.74126 22.8056 8.29354 22.8056 7.74126V5.9357C22.8056 5.55693 22.5916 5.21067 22.2528 5.04128L20.8083 4.31905ZM15.0305 7.20794C14.5366 6.96095 13.9359 7.16118 13.6889 7.65516C13.4419 8.14913 13.6421 8.74981 14.1361 8.9968L15.0278 9.44263V10.6301C15.0278 11.1824 15.4755 11.6301 16.0278 11.6301C16.5801 11.6301 17.0278 11.1824 17.0278 10.6301V9.44263L17.9194 8.9968C18.4134 8.74981 18.6136 8.14913 18.3666 7.65516C18.1197 7.16118 17.519 6.96095 17.025 7.20794L16.0278 7.70656L15.0305 7.20794ZM11.1182 10.8562C10.8933 10.4625 10.4316 10.2695 9.99333 10.3859C9.55509 10.5023 9.25 10.8989 9.25 11.3524V13.1579C9.25 13.5367 9.464 13.883 9.80279 14.0524L11.2472 14.7746C11.6414 14.9716 12.1181 14.8875 12.4209 14.5674C12.7237 14.2472 12.7813 13.7666 12.5627 13.384L11.1182 10.8562ZM22.8056 11.3524C22.8056 10.8001 22.3578 10.3524 21.8056 10.3524C21.2533 10.3524 20.8056 10.8001 20.8056 11.3524V12.5399L19.9139 12.9857C19.4199 13.2327 19.2197 13.8334 19.4667 14.3274C19.7137 14.8213 20.3143 15.0216 20.8083 14.7746L22.2528 14.0524C22.5916 13.883 22.8056 13.5367 22.8056 13.1579V11.3524ZM17.0278 14.2413C17.0278 13.689 16.5801 13.2413 16.0278 13.2413C15.4755 13.2413 15.0278 13.689 15.0278 14.2413V14.4288C14.5343 14.1839 13.9354 14.3843 13.6889 14.8774C13.4419 15.3714 13.6421 15.972 14.1361 16.219L15.5806 16.9412C15.8621 17.082 16.1935 17.082 16.475 16.9412L17.9194 16.219C18.4134 15.972 18.6136 15.3714 18.3666 14.8774C18.1201 14.3843 17.5212 14.1839 17.0278 14.4288V14.2413Z" fill="currentColor" />
		</svg>
		`,
		name: "CubeTab",
	},
	{
		path: "material-symbols:library-books-rounded",
		name: "LibraryTab",
	},
	{
		path: "clarity:edit-solid",
		name: "Pencil",
	},
	{
		path: "lucide:settings",
		name: "Settings",
	},
	{
		path: "bxs:happy-alt",
		name: "Happy",
	},
	{
		path: "heroicons-outline:selector",
		name: "Selector",
	},
	{
		path: "fe:search",
		name: "Search",
	},
	{
		path: "heroicons-outline:upload",
		name: "Upload",
	},
	{
		path: "heroicons-outline:check",
		name: "Check",
	},
	{
		path: "heroicons-outline:user-add",
		name: "UserAdd",
	},
	{
		path: "heroicons-outline:chevron-up",
		name: "ChevronUp",
	},
	{
		path: "heroicons-outline:chevron-down",
		name: "ChevronDown",
	},
	{
		path: "heroicons-outline:chevron-right",
		name: "ChevronRight",
	},
	{
		path: "heroicons-outline:chevron-left",
		name: "ChevronLeft",
	},
	{
		path: "tabler:microphone-2",
		name: "Microphone",
	},
	{
		path: "ic:round-play-arrow",
		name: "Play",
	},
	{
		path: "ic:round-pause",
		name: "Pause",
	},
	{
		path: "heroicons-outline/video-camera",
		name: "Logo",
	},
	{
		path: "fluent:movies-and-tv-24-filled",
		name: "VideoPlayerFill",
	},
	{
		path: "fluent:movies-and-tv-24-regular",
		name: "VideoPlayerOutline",
	},

	{
		path: "heroicons-solid/download",
		name: "DownloadFill",
	},
	{
		path: "heroicons-outline/download",
		name: "DownloadOutline",
	},
	{
		path: "heroicons-outline/plus-circle",
		name: "PlusCircle",
	},
	{
		path: "heroicons-outline:plus",
		name: "Plus",
	},
	{
		path: "ic/round-video-library",
		name: "VideoTab",
	},
	{
		path: "ic:round-library-music",
		name: "AudioTab",
	},
	{
		path: "heroicons-outline:trash",
		name: "Delete",
	},
	{
		path: "heroicons-outline:login",
		name: "LogIn",
	},
	{
		path: "heroicons-outline:logout",
		name: "LogOut",
	},
	{
		path: "heroicons-outline:user-circle",
		name: "UserProfileCircle",
	},
	{
		path: "heroicons-outline:user",
		name: "User",
	},
	{
		path: "ic:round-stop-circle",
		name: "Stop",
	},
	{
		path: "ic:round-video-stable",
		name: "File",
	},
	{
		path: "heroicons-outline/cursor-click",
		name: "Click",
	},
	{
		path: "ic:outline-visibility",
		name: "Visibility",
	},
	{
		path: "heroicons-outline:x",
		name: "X",
	},
	{
		path: "eos-icons:loading",
		name: "Loading",
	},
]

let preFile = `
import { ComponentProps, splitProps } from "solid-js"
type IconProps<P = {}> = P & {
    size?: number
    basic?: boolean
}`

RequiredIcons.forEach((detail) => (preFile += template(detail)))

buildMaterial(
	join(__dirname, "../", "../", "src", "assets", "icons", "index.tsx"),
	preFile
)

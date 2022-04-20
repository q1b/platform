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
		name: "Video",
	},
	{
		path: "heroicons-outline:selector",
		name: "Selector",
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
		name: "ChevronLeft",
	},
	{
		path: "heroicons-outline:chevron-left",
		name: "ChevronRight",
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
		path: "ic:round-folder",
		name: "Folder",
	},
	{
		path: "ic:round-video-stable",
		name: "File",
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

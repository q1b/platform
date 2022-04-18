🌈 Started on 👉 👩‍🚀 **23-3-2022**

# Platform UI 🔥

<!-- 🅰️ 🅱️😜😉👩‍🚀👋💖👍🤔🥰😶🦋🐌⭐✅❎➕🤞❌🤜 📁🗄️🎻 👯‍♀️ -->

## Project Structure 🗃️ 👇

<!-- &ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;├─ [**widgets/**](#widgets) \ -->

\

├─📂**src/** \
&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;├─📂 [**assets/**](#assets) \
&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;├─ ... \
&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;├─ [**icons/**](#icons) \
&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;└─ ... \
&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;├─ [**funcs/**](#func) \
&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;├─ [**store/**](#store) \
&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;├─ [**ui/**](#ui) \
&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;├─ [**views/**](#views) \
&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;├─ **App.tsx** \
&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;├─ **index.tsx** \
&ThinSpace;|&nbsp;&nbsp;&nbsp;&nbsp;└─ **tailwind.css** \
├─ **tailwind.config.js** \
├─ **tsconfig.json** \
└─ **vite.config.ts**

<!-- ├─ **index.html** \ -->
<!-- ├─ **package.json** \ -->
<!-- ├─ **postcss.config.js** \ -->

### Assets

This contain logo, icons, images, videos and other static stuff

#### Icons

To make using icons fun not confusing as I am importing all **icons** available in [https://icones.js.org/](https://icones.js.org/) through antfu's **unplugin-icons** npm package, which it basically consist of open source icon libraries So, It's huge, and using all of them is **impossible as well**.

> Basically A Icon is used to represent some brand, user-action, sometimes emotions, and expression So,

**Import only the icon, _only when needed and only once_, in a common file which acts as a global source of icons for your whole project.**

So, here is a basic example

```js
// ./src/assets/icon/index.tsx
export { default as Add } from "~icons/heroicons-outline/plus-circle"
```

```tsx
// ./src/ui/Header.tsx
import { Add } from "../assets/icon"
// use it 👇
function Header() {
    return (
        <>
            ...
            <Add class="text-white w-6 h-6" >
        </>
    )
}
```

### API

```
├─📂api/
│  ├─utils.ts
│  └─index.ts
```

### Funcs

This is special section as it is going to contain reuseable functions which we need, and used many times in codebases, or going to use it multiple times.

```
├─📂funcs/
│  ├─animate.ts
│  ├─debounce.ts
│  ├─thottle.ts
│  └─cvtCSV.ts
```

### UI

This is going to contain User Interface logic, Basically It's going to define reuseable components.

```
├─📂ui/
│  ├─theme/
│  ├─animation/
│  ├─listbox/
│  ├─buttons/
│  ├─dialog/
│  └─toast/
```

### Views

This is where we will have our routes setup and different url or pages also co-exists with routes defination.

#### Auth

For Authenthecation of User we have

When user land on the page, and if user is not authenthecated already,
we will Show them CheckIn Page
Then, we will send API request to server in order to check if user is already registered or not,
If User is registered we will Show them Verify Page, where they have to check their Gmail Account and Click Link from there,
Else User is sended to Registration Page, AFTER REGISTRATION DONE We Will send them to Verify Page,
After, User Clicked the Link Provided in GMAIL,

we will get their token, basis on which we will revalidate them when ever they come again on CheckIn Page,

```
├─📂auth/
│  ├─📠check-in.tsx
│  ├─📲registration.tsx
│  └─⏳verification.tsx
...
```

#### user ⚙️ settings

This is where user will able to change it's username email address, handling price and can see other information like current plan.

#### Control Panel

This is where a user spend second most of time after workspace, to set there user settings, profile or manage subscriptions and pricing.

```
├─...
├─📂controlPanel/
│  ├─📂body/
│  │  ├─📂header/
│  │  │  ├─ actions.tsx
│  │  │  └─ index.tsx
│  │  ├─📂recents/
│  │  │  └─ index.tsx
│  │  └─📂all/
│  │     └─ index.tsx
│  └─📁store/
├─...
└─...
```

#### Workspace 🗂️

This will contain whole studio (single-workspace) logic for our app,

```
├─...
├─📂workspace/
│  ├─📂body/
│  │  ├─📂header/
│  │  │  ├─tab.tsx
│  │  │  ├─actions.tsx
│  │  │  └─index.tsx
│  │  ├─📂tabs/
│  │  │  └─index.tsx
│  │  ├─📯audioPage/
│  │  │  ├─header.tsx
│  │  │  ├─table.tsx
│  │  │  └─index.tsx
│  │  └─🎥videoPage/
│  │     ├─📺canvas.tsx
│  │     ├─⚒️controls.tsx
│  │     ├─🎙️recorder.tsx
│  │     └─index.tsx
│  ├─📁sidenav/
│  │  ├─header.tsx
│  │  ├─panel.tsx
│  │  └─index.tsx
│  └─📁store/
├─...
└─...
```

##### 🕊️ Sidenav

##### AudioPage

main parts
csv, table, audioRecorder, author

store str

```ts
type File = {
    // fetched from API
    id: string
    folder_id: string
    name: string
    actor_id: string
    video_id: string
    audio_batch_id: string
}

// locally used by app
type ClientOptionsFile<P = {}> = P & {
    isactive: boolean
    isopen: boolean
    tab: {
        type: "video" | "audio"
    }
    activeTable: string[][]
}
```

##### VideoPage

main parts
displaying the recorded video,
controlling the recorded video,
recording a new video or uploading a video,

##### Connected Part

sharing the table data with video page

<!-- Features Already Ported  -->

<!-- Way to go -->

<!-- Special Thanks to -->

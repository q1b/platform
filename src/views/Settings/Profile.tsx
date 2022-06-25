import { createFormActions, Errors } from "solid-form-action"
import { globalStore, updateFullname, updateUsername } from "@/App"
import { InputButton } from "@/ui/Button/InputButton"
import { createSignal } from "solid-js"
import { ExclamationCircleFillIcon, LogOutIcon } from "@/assets/icons"
import { createPath, ROUTE } from "@/routing"
import { useNavigate } from "solid-app-router"

export const Profile = () => {
	const [is_username_loading, setUsernameIsLoading] = createSignal(false)
	const [is_fullname_loading, setFullnameIsLoading] = createSignal(false)
	const {
		actions: { username },
		form: username_form,
		formState: { username: usernameVal },
		errors: UsernameFormError,
	} = createFormActions({
		initialValues: {
			username: globalStore?.user?.username || "username",
		},
		validate: (values) => {
			const errs: Errors<typeof values> = {}
			if (values.username.length === 0) {
				errs.username = "Username is required"
			}
			return errs
		},
		onSubmit: async (values) => {
			if (values["username"] !== globalStore?.user?.username) {
				console.log("Username updated", values["username"])
				setUsernameIsLoading(true)
				await updateUsername(values["username"])
				setUsernameIsLoading(false)
			}
		},
	})
	const {
		actions: { fullname },
		form: fullname_form,
		formState: { fullname: fullnameVal },
		errors: FullnameFormError,
	} = createFormActions({
		initialValues: {
			fullname: globalStore?.user?.fullname || "fullname",
		},
		validate: (values) => {
			const errs: Errors<typeof values> = {}
			if (values.fullname.length === 0) {
				errs.fullname = "Fullname is required"
			}
			return errs
		},
		onSubmit: async (values) => {
			if (values["fullname"] !== globalStore?.user?.fullname) {
				console.log("Fullname updated", values["fullname"])
				setFullnameIsLoading(true)
				await updateFullname(values["fullname"])
				setFullnameIsLoading(false)
			}
		},
	})
	const navigate = useNavigate()
	return (
		<section class="p-8 grow flex flex-col place-content-between">
			<div class="flex flex-col gap-y-8">
				<div class="flex flex-col gap-y-2">
					<h1 class="text-2xl font-semibold pl-1.5">Username</h1>
					<div class="flex w-60 group items-center py-1.5 px-2 rounded-md place-content-between">
						<h2 class="w-full bg-transparent focus:outline-none font-medium">
							{globalStore?.user?.username}
						</h2>
					</div>
				</div>
				{/* <form use:username_form>
					<div class="flex flex-col gap-y-2">
						<label
							for="folder_name"
							class="text-2xl font-semibold pl-1.5"
						>
							Username
						</label>
						<InputButton
							id="folder_name"
							name="folder_name"
							isupdating={is_username_loading()}
							ref={(el) => {
								username(el)
							}}
							placeholder={usernameVal}
						/>
					</div>
				</form> */}
				<form use:fullname_form>
					<div class="flex flex-col gap-y-2">
						<label
							for="last_name"
							class="text-2xl font-semibold pl-1.5"
						>
							Fullname
						</label>
						<InputButton
							id="last_name"
							name="last_name"
							isupdating={is_fullname_loading()}
							ref={fullname}
							placeholder={globalStore?.user?.fullname}
						/>
					</div>
				</form>
				<div class="flex flex-col gap-y-2">
					<h1 class="text-2xl font-semibold pl-1.5">Login Email</h1>
					<div class="flex w-60 group items-center py-1.5 px-2 rounded-md place-content-between">
						<h2 class="w-full bg-transparent focus:outline-none font-medium">
							{globalStore?.user?.email}
						</h2>
					</div>
				</div>
				<div class="bg-slate-200 cursor-default inline-flex hover:bg-slate-300 group rounded-xl px-4 py-2">
					<p class="inline font-semibold text-slate-600">
						BHuman uses passwordless login secured by your email. BHuman uses
						passwordless login secured by your email.
					</p>
				</div>
				<div class="">
					<button
						onClick={() => {
							localStorage.removeItem("access_token")
							localStorage.removeItem("refresh_token")
							localStorage.removeItem("user_id")
							navigate(
								createPath({
									path: ROUTE.CHECKIN,
								})
							)
						}}
						class="group relative w-32 flex items-center gap-x-2 justify-center py-1 px-4 border border-transparent font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
					>
						Logout <LogOutIcon class="w-5 h-5" />
					</button>
				</div>
			</div>
			<h2 class="text-2xl font-semibold">
				Need help? Please email Help@BHuman.ai
			</h2>
		</section>
	)
}
export default Profile

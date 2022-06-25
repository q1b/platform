import { Component, createEffect, createSignal, onMount, Show } from "solid-js"
import { useLocation, useNavigate } from "solid-app-router"
import axiosApi, { fetchUserDetails, fetchWorkspaces } from "@/api"
import { LoadingIcon } from "@/assets/icons"
import { createPath, ROUTE } from "@/routing"
import { globalStore, setGlobalStore } from "@/App"

export const [isValidating, setIsValidating] = createSignal(false)

const Verify: Component = () => {
	const [validatingText, setValidatingText] = createSignal(
		"Validating Triggering"
	)
	const navigate = useNavigate()
	const searchParams = useLocation()
	const params = new URLSearchParams(searchParams.search)
	const token = params.get("token")

	const validateUser = async (token: null | string) => {
		if (token) {
			setIsValidating(true)
			setValidatingText("Validating, Started")
			console.log("Validating")
			try {
				const res = await axiosApi.post("tokenauth", { token })
				setValidatingText("Validating, Ended")
				console.log("VALIDATE RESPONSE", res)
				const data = res.data
				if (data.found) {
					setValidatingText("You are already Registered! 🥳")
					console.log("You are already Registered! 🥳")
					localStorage.setItem("access_token", data.access_token)
					localStorage.setItem("refresh_token", data.refresh_token)
					localStorage.setItem("user_id", data.user_id)

					setValidatingText("🥳")
					setValidatingText("Fetching you details from server")
					const [user, workspaces] = await Promise.allSettled([
						fetchUserDetails(),
						fetchWorkspaces(),
					])
					if (
						user.status === "fulfilled" &&
						workspaces.status === "fulfilled"
					) {
						setValidatingText("Your Request is completed.")
						setGlobalStore({
							user: user.value.data,
							workspaces: workspaces.value.data,
						})
						setIsValidating(false)
						console.log("Going to Home Route")
						navigate(
							createPath({
								path: ROUTE.WORKSPACE,
								params: {
									folder_id: "000",
									workspace_id: globalStore.workspaces[0].id,
								},
							}),
							{ replace: false }
						)
					} else {
						setValidatingText("Failed, in fetching user details ???")
						setTimeout(() => {
							setIsValidating(false)
						}, 3000)
					}
				} else {
					localStorage.setItem("stytch_user_id", data.stytch_user_id)
					navigate(ROUTE.REGISTRATION, { replace: false })
				}
			} catch (error) {
				console.log(error)
				setIsValidating(false)
			}
		}
	}
	onMount(() => {
		{
			;(async () => {
				await validateUser(token)
			})()
		}
	})
	return (
		<section class="min-h-screen flex w-full items-center bg-slate-900 justify-center relative">
			<Show
				when={isValidating()}
				fallback={
					<>
						<span class="text-white">Not Validating,</span>
					</>
				}
			>
				<div class="absolute w-full  h-full blur-md bg-gradient-to-br from-blue-400/40 via-indigo-200/20 to-cyan-400/60"></div>
				<div class="flex group animate-move-bg bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 bg-[length:400%] shadow-3xl shadow-slate-400/40 border-2 px-3 py-2 rounded-lg items-center justify-center gap-x-2">
					<LoadingIcon class="w-16 h-16 drop-shadow text-slate-200 group-hover:animate-spin" />
					<span
						class="font-semibold text-white text-5xl"
						style={{
							"text-shadow": "0.2px 1px 2px #0002",
						}}
					>
						{validatingText()}
					</span>
				</div>
			</Show>
		</section>
	)
}

export default Verify

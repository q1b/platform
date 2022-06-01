import { Component, createEffect, createSignal, Show } from "solid-js"
import { useLocation, useNavigate } from "solid-app-router"
import axiosApi from "@/api"
import { LoadingIcon } from "@/assets/icons"
import { ROUTE } from "@/routing"

const Verify: Component = () => {
	const [isValidating, setIsValidating] = createSignal(false)
	const navigate = useNavigate()
	const searchParams = useLocation()
	const params = new URLSearchParams(searchParams.search)
	const token = params.get("token")

	const validateUser = async (token: null | string) => {
		if (token) {
			setIsValidating(true)
			try {
				const res = await axiosApi.post("tokenauth", { token })
				console.log("VALIDATE RESPONSE", res)
				const data = res.data
				if (data.found) {
					localStorage.setItem("access_token", data.access_token)
					localStorage.setItem("refresh_token", data.refresh_token)
					localStorage.setItem("user_id", data.user_id)
					setIsValidating(false)
					navigate(ROUTE.HOME, { replace: false })
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
	createEffect(async () => await validateUser(token))
	return (
		<section class="min-h-screen flex w-full items-center bg-slate-900 justify-center relative">
			<Show
				when={isValidating()}
				fallback={
					<>
						<span class="text-white">
							Not Validating, anything because nothing is available, get back
							home bye bye
						</span>
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
						Validating
					</span>
				</div>
			</Show>
		</section>
	)
}

export default Verify

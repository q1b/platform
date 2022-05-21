import { ProgressBar } from "@/ui/ProgressBar"

export const AIStudio = () => {
	return (
		<section class="p-8 grow flex flex-col">
			<div class="flex flex-col gap-y-8 mb-4">
				<div class="flex flex-col gap-y-2">
					<h1 class="text-2xl font-semibold pl-1.5">Usage</h1>
					<div class="flex items-center">
						<ProgressBar.CircularProgressbar
							radius={36}
							progress={() => 80}
							strokeWidth={7}
							trackStrokeWidth={7.1}
							strokeLinecap="round"
							strokeColor="#4EADF1"
							trackStrokeColor="#F0F0F0"
						>
							<div
								class="flex items-center justify-center text-center absolute
                top-0
                w-full h-full
								mx-auto
								my-0
								text-slate-800 select-none font-semibold"
							>
								<div>80%</div>
							</div>
						</ProgressBar.CircularProgressbar>
						<div class="flex flex-col items-start pb-2">
							<h2 class="font-semibold leading-4 mb-1.5"> Growth </h2>
							<p class="text-[13px] font-medium mb-2"> 235 of 300 used </p>
							<ProgressBar.FlatProgressBar
								completed={80}
								borderRadius="10px"
								bgColor="#4EADF1"
								height="6px"
								width="340px"
								isLabelVisible={false}
								labelColor="#e80909"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col">
				<h2 class="text-xl font-extrabold">Plans</h2>
				<main class="grid grid-cols-3 place-items-center gap-4 p-4 ">
					<div class="flex flex-col items-center">
						<span class="text-sm font-bold uppercase mb-4">
							additional videos at 60 cents
						</span>
						<div class="flex flex-col py-5 px-4 max-w-[248px] bg-slate-100 rounded-lg">
							<div class="flex flex-col mb-4">
								<h2 class="text-xl font-semibold">Growth</h2>
								<p class="text-slate-500">
									Get started with BHuman with an affordable plan
								</p>
							</div>
							<ul class="list-disc list-inside mb-6">
								<li class="font-semibold uppercase">300 videos a month</li>
								<li class="font-semibold uppercase">Limited Analytics</li>
							</ul>
							<div class="inline-flex items-end border-t-2 border-slate-200 gap-x-1 mb-7 pt-0.5">
								<p class="text-3xl font-bold">39$</p>{" "}
								<span class="inline pb-1">/month</span>
							</div>
							<div>
								<button class="py-5 px-9 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full w-full">
									<span class="text-lg leading-none">Current</span>
								</button>
							</div>
						</div>
					</div>
					<div class="flex flex-col items-center">
						<span class="text-sm font-bold uppercase mb-4">
							additional videos at 45 cents
						</span>
						<div class="flex flex-col py-5 px-4 max-w-[248px] bg-slate-100 rounded-lg">
							<div class="flex flex-col mb-4">
								<h2 class="text-xl font-semibold">Scale</h2>
								<p class="text-slate-500">
									Get started with BHuman with an affordable plan
								</p>
							</div>
							<ul class="list-disc list-inside mb-6">
								<li class="font-semibold uppercase">1000 videos a month</li>
								<li class="font-semibold uppercase">Full Analytics</li>
							</ul>
							<div class="inline-flex items-end border-t-2 border-slate-200 gap-x-1 mb-7 pt-0.5">
								<p class="text-3xl font-bold">99$</p>{" "}
								<span class="inline pb-1">/month</span>
							</div>
							<div>
								<button class="py-5 px-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full w-full">
									<span class="text-lg leading-none text-white">Upgrade</span>
								</button>
							</div>
						</div>
					</div>
					<div class="flex flex-col items-center">
						<span class="text-sm font-bold uppercase mb-4">
							$150 monthly ACCESS FEE
						</span>
						<div class="flex flex-col py-5 px-4 max-w-[248px] bg-slate-100 rounded-lg">
							<div class="flex flex-col mb-4">
								<h2 class="text-xl font-semibold">Ultimate</h2>
								<p class="text-slate-500">
									Get started with BHuman with an affordable plan
								</p>
							</div>
							<ul class="list-disc list-inside mb-6">
								<li class="font-semibold uppercase">300 videos a month</li>
								<li class="font-semibold uppercase">Limited Analytics</li>
							</ul>
							<div class="inline-flex items-end border-t-2 border-slate-200 gap-x-1 mb-7 pt-0.5">
								<p class="text-3xl font-bold">39 cents</p>{" "}
								<span class="inline pb-1">/render</span>
							</div>
							<div>
								<button class="py-5 px-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full w-full">
									<span class="text-lg leading-none text-white">Upgrade</span>
								</button>
							</div>
						</div>
					</div>
				</main>
				<div class="flex justify-center text-lg w-full items-center">
					<span class="text-slate-500">
						Want to downgrade to the free plan (15 videos / month)?
					</span>
					<a
						href=""
						class="inline-block px-1 underline text-blue-500"
					>
						Click here
					</a>
				</div>
			</div>
		</section>
	)
}

export default AIStudio

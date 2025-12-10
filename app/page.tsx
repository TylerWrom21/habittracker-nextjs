import FeatureCard from "@/components/atoms/featurecard";
import Footer from "@/components/layouts/footer.layout";
import Navbar from "@/components/layouts/navbar.layout";
import { Brain, CheckCircle, Flame, Goal, Heart, TrendingUp } from "lucide-react";

export default function Home() {
	const steps = [
		{
			title: "Choose a Habit",
			desc: "Pick something you want to improve. Start small, aim high.",
		},
		{
			title: "Track Daily",
			desc: "Log your progress with a single tap. Consistency is key.",
		},
		{
			title: "See Growth",
			desc: "Watch your discipline grow as you build unbreakable streaks.",
		},
	];
	return (
		<main className="min-h-screen">
			<Navbar />
			<section className="px-4 md:px-16 flex flex-col items-center justify-center text-center min-h-screen bg-linear-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.05),transparent_50%)]"></div>
				<div className="flex items-center justify-center flex-col gap-6 max-w-3xl relative z-10 animate-fade-in">
					<h1 className="text-primary text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
						Own Your Day. Master Your Habits.
					</h1>

					<p className="text-primary/80 text-lg max-w-xl mx-auto">
						The minimalist habit tracker for building unstoppable discipline.
					</p>

					<a href="/login">
						<button className="h-12 px-5 rounded-lg bg-primary text-background text-base font-bold tracking-wide cursor-pointer hover:scale-105 transition-transform duration-200">
							Get Started for Free
						</button>
					</a>
				</div>
			</section>
			<main className="px-16">
				<section className="flex flex-col py-16 text-center animate-fade-in max-w-6xl mx-auto px-4">
					<div className="flex flex-col pb-5">
						<h2 className="text-primary text-4xl lg:text-5xl font-black tracking-tight max-w-2xl mx-auto">
							Why It Works
						</h2>
						<p className="text-primary/80 text-center text-base lg:text-lg max-w-2xl mx-auto">
							A simple, powerful framework designed to help you build the habits
							that matter.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
						<FeatureCard
							icon={TrendingUp}
							title="Track Progress"
							description="Visualize your wins with a clean, simple interface that shows your daily progress."
						/>

						<FeatureCard
							icon={Flame}
							title="Build Streaks"
							description="Stay motivated by building unbreakable streaks and watching your consistency grow."
						/>

						<FeatureCard
							icon={CheckCircle}
							title="Stay Consistent"
							description="Our minimalist design removes distractions and keeps you focused on what's important."
						/>
					</div>
				</section>
				<section className="py-28 bg-muted/30 animate-fade-in">
					<div className="max-w-6xl mx-auto px-4">
						<div className="flex flex-col pb-5">
							<h2 className="text-primary text-4xl lg:text-5xl font-black tracking-tight max-w-2xl mx-auto">
								The Benefits of Habit Tracking
							</h2>
							<p className="text-primary/80 text-center text-base lg:text-lg max-w-2xl mx-auto">
								Build discipline by your own, be the one you want, with all your power.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							<div className="text-center p-5 rounded-lg border border-muted-foreground">
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<TrendingUp className="w-8 h-8 text-primary" />
								</div>
								<h3 className="text-primary text-xl font-semibold mb-2">Boost Productivity</h3>
								<p className="text-primary/70">Turn small actions into big results. Consistent habit tracking leads to measurable improvements in your daily productivity.</p>
							</div>
							<div className="text-center p-5 rounded-lg border border-muted-foreground">
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<Flame className="w-8 h-8 text-primary" />
								</div>
								<h3 className="text-primary text-xl font-semibold mb-2">Build Momentum</h3>
								<p className="text-primary/70">Watch your streaks grow and maintain motivation through visual progress tracking and achievement milestones.</p>
							</div>
							<div className="text-center p-5 rounded-lg border border-muted-foreground">
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<CheckCircle className="w-8 h-8 text-primary" />
								</div>
								<h3 className="text-primary text-xl font-semibold mb-2">Improve Discipline</h3>
								<p className="text-primary/70">Develop stronger self-control and willpower by consistently following through on your commitments.</p>
							</div>
							<div className="text-center p-5 rounded-lg border border-muted-foreground">
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<Heart className="w-8 h-8 text-primary" />
								</div>
								<h3 className="text-primary text-xl font-semibold mb-2">Better Health</h3>
								<p className="text-primary/70">Establish routines for exercise, nutrition, and sleep that lead to improved physical and mental well-being.</p>
							</div>
							<div className="text-center p-5 rounded-lg border border-muted-foreground">
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<Goal className="w-8 h-8 text-primary" />
								</div>
								<h3 className="text-primary text-xl font-semibold mb-2">Achieve Goals</h3>
								<p className="text-primary/70">Break down big objectives into manageable daily habits and track your progress towards long-term success.</p>
							</div>
							<div className="text-center p-5 rounded-lg border border-muted-foreground">
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<Brain className="w-8 h-8 text-primary" />
								</div>
								<h3 className="text-primary text-xl font-semibold mb-2">Mindful Living</h3>
								<p className="text-primary/70">Cultivate awareness and intentionality in your daily life through consistent habit formation and reflection.</p>
							</div>
						</div>
					</div>
				</section>
				<section className="py-16 bg-background animate-fade-in">
					<div className="max-w-6xl mx-auto">
						<div className="flex flex-col pb-5">
							<h2 className="text-primary text-4xl lg:text-5xl font-black tracking-tight max-w-2xl mx-auto">
								Success Stories
							</h2>
							<p className="text-primary/80 text-center text-base lg:text-lg max-w-2xl mx-auto">
								They have become what they want, now its your turn.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							<div className="p-6 rounded-lg shadow-sm border border-muted-foreground">
								<blockquote className="text-primary/80 italic mb-4">
									&quot;This app completely changed how I approach my goals. Seeing the streaks build is the best motivation. I feel more in control of my day than ever before.&quot;
								</blockquote>
								<cite className="text-primary font-semibold">- Alex, 17</cite>
							</div>
							<div className="p-6 rounded-lg shadow-sm border border-muted-foreground">
								<blockquote className="text-primary/80 italic mb-4">
									&quot;The simplicity is what sold me. No fluff, just pure habit tracking. I&apos;ve built habits I never thought possible.&quot;
								</blockquote>
								<cite className="text-primary font-semibold">- Jordan, 25</cite>
							</div>
							<div className="p-6 rounded-lg shadow-sm border border-muted-foreground">
								<blockquote className="text-primary/80 italic mb-4">
									&quot;Finally, a habit tracker that doesn&apos;t overwhelm. The clean design keeps me focused on what matters most.&quot;
								</blockquote>
								<cite className="text-primary font-semibold">- Taylor, 32</cite>
							</div>
						</div>
					</div>
				</section>
				<section className="py-16 max-w-6xl mx-auto px-4 flex flex-col">
					<div className="flex flex-col pb-5">
						<h2 className="text-primary text-4xl lg:text-5xl font-black tracking-tight max-w-2xl mx-auto">
							How It Works
						</h2>
						<p className="text-primary/80 text-center text-base lg:text-lg max-w-2xl mx-auto">
							The more you do, the more you will get. Build discipline that growth over time.
						</p>
					</div>

					<div className="w-full mx-auto relative flex flex-col items-center">
						{steps.map((s, i) => (
							<div key={i} className="flex flex-col items-center text-center mb-2">
								<div className="size-10 flex items-center justify-center rounded-full border-2 border-primary text-primary font-bold">
									{i + 1}
								</div>
								<p className="text-primary text-lg font-medium">{s.title}</p>
								<p className="text-primary/70 text-base max-w-md">{s.desc}</p>
								{i < steps.length - 1 && (
									<div className="w-0.5 bg-muted-foreground h-8 mt-2" />
								)}
							</div>
						))}
					</div>
				</section>
			</main>
			<section className="relative text-center flex items-center justify-center flex-col min-h-[60vh]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.05),transparent_50%)] w-full h-full"></div>
				<h2 className="text-primary text-3xl md:text-4xl font-bold tracking-tight">
					Start Building Discipline Today.
				</h2>

				<p className="text-primary/80 text-base md:text-lg max-w-xl mx-auto mt-3">
					Take the first step towards mastering your habits and owning your
					future. It&apos;s free to get started.
				</p>

				<button className="h-12 px-5 bg-primary text-background rounded-lg font-bold text-base mt-6">
					Sign Up Now
				</button>
			</section>
			<Footer />
		</main>
	);
}

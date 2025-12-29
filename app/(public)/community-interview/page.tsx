import { RelatedResources } from '@/app/components/articles/RelatedResources'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Community Interview | Riddonkulous',
	description:
		'Get to know the amazing members of our community through interviews and stories from fellow riddle enthusiasts.',
}

export const revalidate = false // Static page

export default async function CommunityInterview() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col max-w-4xl mx-auto px-4 py-8 gap-8">
			<div className="text-center mb-4">
				<h1 className="text-3xl md:text-4xl text-center mb-2">Community Interview</h1>
				<p className="italic text-gray-400">With D.E.M.</p>
			</div>

			<article className="w-full flex flex-col gap-8 text-base md:text-lg leading-relaxed">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-4">
						<h4 className="text-lg md:text-xl text-primary mt-4">
							Hammertime: Have you always been a fan of riddles? How did you first discover Riddonkulous?
						</h4>
						<div className="flex flex-col gap-3">
							<p className="">
								D.E.M.: In a way I have always enjoyed riddles from afar such as reading and enjoying
								some iconic ones from Tolkien&apos;s &quot;The Hobbit&quot;. However, that being said,
								I&apos;ve never created riddles of my own before joining Riddonkulous.
							</p>
							<p className="">
								As for discovering Riddonkulous, It was back in February of 2025 when the sub was first
								recommended to me on Reddit, I believe the community was celebrating its first 3000
								member milestone. It looked fun and interesting and as I tried it out more and more, I
								grew to love it (and got addicted too!).
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<h4 className="text-lg md:text-xl text-primary mt-4">
							Hammertime: There are many riddle apps and puzzle platforms that focus on clever or novel
							riddles. What made Riddonkulous feel like a place you wanted to stick around in? As a
							long-term member of our community, what do you enjoy most about riddles and the community
							around it?
						</h4>
						<div className="flex flex-col gap-3">
							<p className="">
								D.E.M.: Honestly, it was the community and the very receptive creators and mods of the
								sub that made me want to stick around. Having the ability to interact with the community
								directly with the riddles I created was both very rewarding and informative. It was from
								the community feedback on my posts that I learned to write the riddles that I do today.
							</p>
							<p className="">
								As a long-term member, I enjoy seeing human creativity and cleverness when it comes to
								the creation of riddles on Riddonkulous. For example, there are a lot of very creative
								people naturally drawn to this platform and solving their riddles and gaining
								inspiration from them has been an absolute blast, especially seeing how many different
								and unique interpretations can be made for various riddle topics. I also love the
								unspoken sense of camaraderie between all of the members of Riddonkulus, it&apos;s not
								something you find in very many places!
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<h4 className="text-lg md:text-xl text-primary mt-4">
							Hammertime: You are widely recognized as an outstanding author within the community, having
							written more than 400 riddles. In your experience, what makes a truly good riddle? What are
							common pitfalls to avoid? What advice would you give to newcomers who want to start writing
							riddles?
						</h4>
						<div className="flex flex-col gap-3">
							<p className="">
								D.E.M.: What makes a good riddle is finding a &quot;sweet spot&quot;, so to speak.
								It&apos;s imperative that creators harmonize the tricky balance between making a riddle
								hard enough that it encourages people to think outside of the &quot;box&quot; but not
								too difficult that it&apos;s virtually unsolvable and aggravating to parse through. To
								be completely honest, this is still something that I still struggle with as a creator
								today.
							</p>
							<p className="">
								Some common pitfalls to avoid would be to not create a riddle with the idea that you
								want to make it as difficult as possible to solve. While tricky and/or difficult riddles
								can sometimes be fun to solve if there are enough hints in the riddle itself to subtly
								lead the riddler to the answer, I find the most difficult riddles often have an answer
								that you could not have reasonably determined from the riddle itself and need extensive
								additional hints to solve it. In essence, let&apos;s say you have a riddle about a
								&quot;frog,&quot; you would want to include clever but subtle hints throughout the
								riddle to guide the riddler to eventually guess the answer. What you don&apos;t want to
								do is make the riddle have hints that are completely unrelated to the topic they&apos;re
								supposed to guess. So for the frog riddle you wouldn&apos;t put hints about it being
								furry or have paws, you want to subtly mislead the riddler, BUT not be off topic.
							</p>
							<p className="">
								My advice for newcomers would be to not be afraid of experimentation! Keep trying
								different kinds of riddles and/or riddle topics, my personal favorite are the limericks.
								That being said, while it&apos;s ok to submit the old classics like the coffin, nothing,
								river and echo riddles, I would encourage you to branch out from these and make
								something new and fresh!
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<h4 className="text-lg md:text-xl text-primary mt-4">
							Hammertime: Do you have a favorite riddle you&apos;ve written, or one from another author,
							that stands out to you? What makes it special?
						</h4>
						<div className="flex flex-col gap-3">
							<p className="">
								D.E.M.: This is a difficult one to answer! Personally I have a lot of favorites that
								I&apos;ve seen throughout my time here at Riddonkulous. I guess if I had to pick one, it
								was a holiday one about a &quot;Turducken.&quot; It was so very funny and absurd to the
								point that it was awarded the &quot;That&apos;s Riddonkulous&quot; post flair, it now
								lives rent free in my mind!
							</p>
							<p className="">
								It&apos;s always creative and funny riddles like this that stand out and are special to
								me.
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<h4 className="text-lg md:text-xl text-primary mt-4">
							Hammertime: As a wrap-up: Is there anything else you would like to share with the community?
							If you had a magic button that could instantly create any feature or improvement, what would
							it be?
						</h4>
						<div className="flex flex-col gap-3">
							<p className="">
								D.E.M.: I guess I would just like to thank you the creator u/hammertimestudio for always
								being so receptive to your community. It hasn&apos;t gone unnoticed, and a great part of
								why the community is like what it is today is thanks to you and your efforts in building
								this amazing sub!
							</p>
							<p className="">
								As for what I would like to see/ improve? Well, everything has been an amazing ride so
								far, and I can&apos;t really think of anything off the top of my head, but I&apos;m sure
								I will always be pleasantly surprised when creative people such as yourself come up with
								new and fresh ideas! Thanks again, and stay awesome everyone!
							</p>
							<p className=" mt-2">
								Sincerely,
								<br />
								D.E.M
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-3 mt-6 pt-6 ">
						<h4 className="text-lg md:text-xl text-primary">
							Hammertime: And that&apos;s it! Thank you so much D.E.M. for sharing your story, thoughts
							and delighting the community with your contributions both in riddles and conversations.
						</h4>
					</div>
				</div>
			</article>

			<RelatedResources excludePage="community-interview" />
		</div>
	)
}

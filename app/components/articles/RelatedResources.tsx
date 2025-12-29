import { LinkAsButton } from '@/app/components/buttons/LinkAsButton'
import Image from 'next/image'

interface RelatedResourcesProps {
	excludePage?:
		| 'riddles-in-history'
		| 'using-riddles'
		| 'writing-riddles'
		| 'community-interview'
		| 'benefits-of-riddles-brain-health'
		| 'how-to-solve-lateral-thinking-puzzles'
		| 'riddles-for-kids-education'
		| 'history-of-riddles-cultures'
		| 'riddle-solving-techniques'
}

export const RelatedResources = ({ excludePage }: RelatedResourcesProps) => {
	const resources = [
		{
			id: 'riddles-in-history',
			href: '/riddles-in-history',
			icon: '/icons/book.png',
			iconAlt: 'Book',
			title: 'Riddles in History',
			description:
				'Discover how riddles have shaped cultures and civilizations throughout human history, from ancient mythology to modern literature.',
		},
		{
			id: 'using-riddles',
			href: '/using-riddles',
			icon: '/icons/wizard.png',
			iconAlt: 'Wizard',
			title: 'Using Riddles',
			description:
				'Learn practical ways to incorporate riddles into education, entertainment, and cognitive development.',
		},
		{
			id: 'writing-riddles',
			href: '/writing-riddles',
			icon: '/icons/pencil.png',
			iconAlt: 'Pencil',
			title: 'Writing Riddles',
			description:
				'Learn the art and craft of creating engaging riddles, from understanding structure to mastering wordplay and creative expression.',
		},
		{
			id: 'community-interview',
			href: '/community-interview',
			icon: '/icons/party.png',
			iconAlt: 'Party',
			title: 'Community Interview',
			description:
				'Get to know one of the most active members of our community, what they love about riddles and what makes a great riddle.',
		},
		/*{
			id: 'benefits-of-riddles-brain-health',
			href: '/benefits-of-riddles-brain-health',
			icon: '/icons/light.png',
			iconAlt: 'Brain Health',
			title: 'Benefits of Riddles for Brain Health',
			description:
				'Discover how solving riddles can improve cognitive function, enhance memory, and promote overall brain health through engaging mental exercise.',
		},
		{
			id: 'how-to-solve-lateral-thinking-puzzles',
			href: '/how-to-solve-lateral-thinking-puzzles',
			icon: '/icons/script_lightning.png',
			iconAlt: 'Lateral Thinking',
			title: 'How to Solve Lateral Thinking Puzzles',
			description:
				'Learn effective strategies and techniques for solving lateral thinking puzzles and riddles that require creative, non-linear approaches.',
		},
		{
			id: 'riddles-for-kids-education',
			href: '/riddles-for-kids-education',
			icon: '/icons/wizard.png',
			iconAlt: 'Kids Education',
			title: 'Riddles for Kids: Educational Benefits',
			description:
				"Discover how riddles can enhance children's learning, develop critical thinking skills, and make education fun and engaging.",
		},
		{
			id: 'history-of-riddles-cultures',
			href: '/history-of-riddles-cultures',
			icon: '/icons/book.png',
			iconAlt: 'Cultural Riddles',
			title: 'Riddles Across Cultures',
			description:
				'Explore how riddles have been used across different cultures throughout history, from ancient civilizations to modern times.',
		},
		{
			id: 'riddle-solving-techniques',
			href: '/riddle-solving-techniques',
			icon: '/icons/pencil.png',
			iconAlt: 'Solving Techniques',
			title: 'Mastering Riddle Solving Techniques',
			description:
				'Learn proven strategies and techniques for solving riddles effectively, from pattern recognition to creative thinking approaches.',
		},*/
	]

	const filteredResources = resources.filter((resource) => resource.id !== excludePage)

	return (
		<div className="w-full flex flex-col gap-4 mt-12 pt-8 border-t border-primary">
			<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
				{filteredResources.map((resource) => (
					<div
						key={resource.id}
						className="relative py-6 px-4 rounded-lg w-full flex flex-col items-center justify-center"
					>
						<Image
							src={resource.icon}
							alt={resource.iconAlt}
							width={56}
							height={56}
							className="w-14 h-14 md:w-16 md:h-16 mb-4"
						/>
						<h3 className="text-xl md:text-2xl mb-3 text-center">{resource.title}</h3>
						<p className="text-sm md:text-base text-center opacity-90 mb-4">{resource.description}</p>
						<LinkAsButton
							href={resource.href}
							text="Read More"
							textAlign="center"
							customClass="px-8 py-1"
						/>
					</div>
				))}
			</div>
		</div>
	)
}

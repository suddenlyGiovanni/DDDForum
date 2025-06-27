import type * as React from 'react'

import { twMerge } from '~/shared/styles/utils.ts'

const H1 = ({ className, ...props }: React.ComponentProps<'h1'>) => (
	<h1
		className={twMerge(
			'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
			className
		)}
		{...props}
	/>
)

const H2 = ({ className, ...props }: React.ComponentProps<'h2'>) => (
	<h2
		className={twMerge(
			'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
			className
		)}
		{...props}
	/>
)

const H3 = ({ className, ...props }: React.ComponentProps<'h3'>) => (
	<h3
		className={twMerge(
			'scroll-m-20 text-2xl font-semibold tracking-tight',
			className
		)}
		{...props}
	/>
)

const H4 = ({ className, ...props }: React.ComponentProps<'h4'>) => (
	<h4
		className={twMerge(
			'scroll-m-20 text-xl font-semibold tracking-tight',
			className
		)}
		{...props}
	/>
)

const P = ({ className, ...props }: React.ComponentProps<'p'>) => (
	<p
		className={twMerge('leading-7 [&:not(:first-child)]:mt-6', className)}
		{...props}
	/>
)

export const Typography = {
	H1,
	H2,
	H3,
	H4,
	P,
} as const

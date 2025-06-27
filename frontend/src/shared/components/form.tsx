import type * as React from 'react'

export type FormErrors<Field extends string> = {
	formErrors: string[]
	fieldErrors: Record<Field, string[]>
}

export const ErrorList: React.FC<{
	id?: string | undefined
	errors: string[] | undefined | null
}> = ({ errors, id }) =>
	errors?.length ? (
		<ul className="flex flex-col gap-1" id={id}>
			{errors.map((error, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<li className="text-[10px] text-red-600" key={i}>
					{error}
				</li>
			))}
		</ul>
	) : null

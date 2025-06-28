import assert from 'node:assert/strict'

import * as React from 'react'
import { data, Form, href, Link, redirect, useNavigate } from 'react-router'

import { Button } from '~/shared/components/button.tsx'
import { ErrorList, type FormErrors } from '~/shared/components/form.tsx'
import { Input } from '~/shared/components/input.tsx'
import { Label } from '~/shared/components/label.tsx'
import { Typography } from '~/shared/components/typography.tsx'
import { useHydrated } from '~/shared/hooks/use-hydrated.tsx'
import { EMAIL_REGEX } from '~/shared/utils/email.ts'
import { Status } from '~/shared/utils/status.ts'

import type { Route } from './+types/login.ts'

const contentMinLength = 1
const contentMaxLength = 100

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData()

	const email = formData.get('email')
	assert(typeof email === 'string', 'email must be a string')

	const username = formData.get('username')
	assert(typeof username === 'string', 'username must be a string')

	const firstName = formData.get('firstName')
	assert(typeof firstName === 'string', 'firstName must be a string')

	const lastName = formData.get('lastName')
	assert(typeof lastName === 'string', 'lastName must be a string')

	const errors: FormErrors<'email' | 'username'> = {
		fieldErrors: {
			email: [],
			username: [],
		},
		formErrors: [],
	}

	if (email === '') {
		errors.fieldErrors.email.push('email is required')
	}

	if (email.length < contentMinLength) {
		errors.fieldErrors.email.push(
			`email must be at least ${contentMinLength} characters`
		)
	}

	if (email.length > contentMaxLength) {
		errors.fieldErrors.email.push(
			`email must be at most ${contentMaxLength} characters`
		)
	}

	if (!EMAIL_REGEX.test(email)) {
		errors.fieldErrors.email.push('email is not valid')
	}

	if (username === '') {
		errors.fieldErrors.username.push('username is required')
	}

	if (username.length < contentMinLength) {
		errors.fieldErrors.username.push(
			`username must be at least ${contentMinLength} characters`
		)
	}

	if (username.length > contentMaxLength) {
		errors.fieldErrors.username.push(
			`username must be at most ${contentMaxLength} characters`
		)
	}

	const hasErrors =
		errors.formErrors.length > 0 ||
		Object.values(errors.fieldErrors).some(fieldError => fieldError.length > 0)

	if (!hasErrors) {
		return data({ errors, status: 'error' }, Status.STATUS_CODE.BadRequest)
	}
	return redirect(href('/'), Status.STATUS_CODE.SeeOther)
}

export default function Login({ actionData }: Route.ComponentProps) {
	const formRef = React.useRef<HTMLFormElement>(null)
	const isHydrated = useHydrated()
	const navigate = useNavigate()

	const fieldErrors =
		actionData?.status === 'error' ? actionData?.errors?.fieldErrors : null

	const formErrors =
		actionData?.status === 'error' ? actionData?.errors?.formErrors : null

	const formId = React.useId()
	const formHasErrors = Boolean(formErrors?.length)
	const formErrorId = formHasErrors ? 'error-form' : undefined

	const emailInputId = React.useId()
	const emailHasError = Boolean(fieldErrors?.email?.length)
	const emailErrorId = emailHasError ? 'error-email' : undefined

	const usernameInputId = React.useId()
	const usernameHasError = Boolean(fieldErrors?.username?.length)
	const usernameErrorId = usernameHasError ? 'error-username' : undefined

	React.useEffect(() => {
		const formElement = formRef.current
		if (!formElement) return
		if (actionData?.status !== 'error') return
		if (formElement.matches('[aria-invalid="true"]')) {
			formElement.focus()
		} else {
			const firstErrorElement = formElement.querySelector(
				'[aria-invalid="true"]'
			)
			if (firstErrorElement instanceof HTMLElement) {
				firstErrorElement.focus()
			}
		}
	}, [actionData])

	return (
		<Form
			aria-describedby={formErrorId}
			aria-invalid={formHasErrors || undefined}
			className="mx-auto w-lg max-w-3xl"
			id={formId}
			method="POST"
			noValidate={isHydrated}
			ref={formRef}
			tabIndex={-1}
		>
			<div className="mb-4 font-medium text-lg">Login</div>

			<div className="grid w-full max-w-sm items-center gap-3">
				<Label htmlFor={emailInputId}>Email</Label>
				<Input
					aria-describedby={emailErrorId}
					aria-invalid={emailHasError || undefined}
					autoComplete="email webauthn"
					autoFocus
					id={emailInputId}
					maxLength={contentMaxLength}
					minLength={contentMinLength}
					name="email"
					placeholder="required"
					required
					type="email"
				/>
				<div className="min-h-[32px] px-4 pt-1 pb-3">
					<ErrorList errors={fieldErrors?.email} id={emailErrorId} />
				</div>
			</div>

			<div className="grid w-full max-w-sm items-center gap-3">
				<Label htmlFor={usernameInputId}>Username</Label>
				<Input
					aria-describedby={usernameErrorId}
					aria-invalid={usernameHasError || undefined}
					autoComplete="username webauthn"
					id={usernameInputId}
					maxLength={contentMaxLength}
					minLength={contentMinLength}
					name="username"
					placeholder="required"
					required
					type="text"
				/>
				<div className="min-h-[32px] px-4 pt-1 pb-3">
					<ErrorList errors={fieldErrors?.username} id={usernameErrorId} />
				</div>
			</div>

			<div className="min-h-[32px] px-4 pt-1 pb-3">
				<ErrorList errors={formErrors} id={formErrorId} />
			</div>

			<div>
				<div className="to-register">
					<Typography.P>Don't have an account?</Typography.P>
					<Button asChild variant="link">
						<Link to={href('/register')}>Register</Link>
					</Button>
				</div>
				<div className="mt-4 flex flex-row justify-end gap-2">
					<Button
						onClick={_e => {
							_e.preventDefault()
							navigate(0)
						}}
						type="reset"
						variant="destructive"
					>
						Reset
					</Button>
					<Button type="submit" variant="default">
						Submit
					</Button>
				</div>
			</div>
		</Form>
	)
}

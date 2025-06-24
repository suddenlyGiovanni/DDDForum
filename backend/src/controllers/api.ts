export {
	STATUS_CODE,
	STATUS_TEXT,
	type StatusCode,
	type StatusText,
} from '@std/http/status'

type SuccessResponse<A> = {
	readonly _tag: 'success'
	readonly error: undefined
	readonly data: A
}

type FailureResponse = {
	readonly _tag: 'failure'
	readonly error: string
	readonly data: undefined
}

export type ResponsePayload<A> = SuccessResponse<A> | FailureResponse

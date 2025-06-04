export interface APIError {
	// TODO: maybe better typing
	httpCode: number
	message: string
	data: never
	// TODO: maybe better typing
	errorCode: string
	ok: true
}

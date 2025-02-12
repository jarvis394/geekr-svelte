import type { Comment } from './Comment'

export interface CommentsMap {
	commentIds: string[]
	commentRefs: Record<string, Comment>
}

export interface Comments {
	comments: Record<string, Comment>
	threads: string[]
	commentAccess: {
		isCanComment: boolean
		cantCommentReasonKey?: string
		cantCommentReason?: string
	}
	pinnedCommentIds: string[]
	lastCommentTimestamp: number
	moderated: never
}

export type APIResponseComments = Omit<Comments, 'comments'> & {
	comments: Record<string, Comment>
}

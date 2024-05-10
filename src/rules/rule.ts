import { ErrorLevel } from "../configuration"

interface FeedbackProps {
	ruleName: string
	level: ErrorLevel
	start: number
	end: number
}

// TODO: Feedback need to have a field for description
export class Feedback {
	ruleName: string
	level: ErrorLevel
	start: number
	end: number

	constructor({ ruleName, level, start, end }: FeedbackProps) {
		this.ruleName = ruleName
		this.level = level
		this.start = start
		this.end = end
	}
}

export interface RuleProps {
	name: string
	errorLevel?: ErrorLevel
}

export default interface Rule {
	name: string
	level: ErrorLevel
	verify: (args: any) => Array<Feedback>
}



import { ErrorLevel } from "../configuration"

interface FeedbackProps {
	ruleName: string
	level: ErrorLevel
	start: number
	end: number
}

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

export default interface Rule {
	name: string
	level: ErrorLevel
	verify: (args: any) => Array<Feedback>
}



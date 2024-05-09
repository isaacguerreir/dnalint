import { ErrorLevel } from "../configuration"
import Rule, { Feedback } from "./rule"

type Seq = string


// TODO: Improve this function using kmers tables
function match(query: Seq, reference: Seq) {
	let idxs: Array<number> = []
	for (let match of reference.matchAll(new RegExp(query, 'g'))) {
		idxs.push(match.index)
	}
	return idxs
}

interface Input {
	query?: Seq
	reference: Seq
}

interface MatchRuleProps {
	name: string
	errorLevel?: ErrorLevel
}

const DEFAULT_ERROR_LEVEL = "warn"

class MatchRule implements Rule {
	name: string
	level: ErrorLevel

	constructor({ name, errorLevel }: MatchRuleProps) {
		this.name = name
		this.level = errorLevel ? errorLevel : DEFAULT_ERROR_LEVEL
	}

	getQueryById() {
		const identifierParts = this.name.split('|')
		// TODO: Improve throw because I don't have time now
		if (identifierParts.length != 2 || identifierParts[1].length == 0) throw 'Something horrible not having a second argument'
		// TODO: Parse identifierParts[1] from enzyme names to query sequences
		return identifierParts[1]
	}

	verify({ query, reference }: Input) {
		if (!query) {
			query = this.getQueryById()
		}
		return match(query, reference)
			.map((idx) => new Feedback({
				ruleName: this.name,
				level: this.level,
				start: idx,
				end: idx + query.length - 1
			}))
	}

}

export default MatchRule

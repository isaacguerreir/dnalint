import Rule, { DEFAULT_ERROR_LEVEL, Feedback, RuleProps } from "./rule"
import library from "./restriction/dictionary"
import { ErrorLevel } from "../configuration"
import Seq from "../seq"

interface Input {
	query?: Seq
	reference: Seq
}

class MatchRule implements Rule {
	name: string
	level: ErrorLevel

	constructor({ name, errorLevel }: RuleProps) {
		this.name = name
		this.level = errorLevel ? errorLevel : DEFAULT_ERROR_LEVEL
	}

	private getQueryById() {
		const identifierParts = this.name.split('|')
		// TODO: Improve throw because I don't have time now
		if (identifierParts.length != 2 || identifierParts[1].length == 0) throw 'Something horrible not having a second argument'

		const enzyme = library[identifierParts[1]]
		// TODO: Improve throw because I don't have time now
		if (!enzyme) throw 'Enzyme not found!'

		return new Seq(enzyme.site)
	}

	verify({ query, reference }: Input) {
		if (!query) {
			query = this.getQueryById()
		}
		const querySize = query.size
		return this.match(query, reference)
			.map((idx) => new Feedback({
				ruleName: this.name,
				level: this.level,
				start: idx,
				end: idx + querySize
			}))
	}

	// TODO: Improve this function using kmers tables
	// TODO: Search on both strands
	private match(query: Seq, reference: Seq) {
		let idxs: Array<number> = []
		for (let match of reference.basepairs.matchAll(new RegExp(query.basepairs, 'g'))) {
			if (typeof match.index != 'undefined') idxs.push(match.index)
		}
		return idxs
	}
}

export default MatchRule

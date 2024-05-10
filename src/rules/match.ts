import { ErrorLevel } from "../configuration"
import library from "./restriction/dictionary"
import Rule, { Feedback, RuleProps } from "./rule"

type Seq = string


interface Input {
	query?: Seq
	reference: Seq
}

const DEFAULT_ERROR_LEVEL = "warn"

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

		return enzyme.site
	}

	verify({ query, reference }: Input) {
		if (!query) {
			query = this.getQueryById()
		}
		return this.match(query, reference)
			.map((idx) => new Feedback({
				ruleName: this.name,
				level: this.level,
				start: idx,
				end: idx + query.length
			}))
	}

	// TODO: Improve this function using kmers tables
	// TODO: Search on both strands
	private match(query: Seq, reference: Seq) {
		let idxs: Array<number> = []
		for (let match of reference.matchAll(new RegExp(query, 'g'))) {
			idxs.push(match.index)
		}
		return idxs
	}

}

export default MatchRule

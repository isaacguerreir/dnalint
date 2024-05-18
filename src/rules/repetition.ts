import { ErrorLevel } from "../configuration"
import Rule, { DEFAULT_ERROR_LEVEL, Feedback, RuleProps } from "./rule"

type Seq = string


interface Input {
	window?: number
	reference: Seq
}

interface KmerTable {
	[kmer: string]: boolean
}

const DEFAULT_WINDOW = 15

// TODO: Maybe would be interesting to make reference sequence a field instead of passing as argument and also window
class RepetitionRule implements Rule {
	name: string
	level: ErrorLevel

	constructor({ name, errorLevel }: RuleProps) {
		this.name = name
		this.level = errorLevel ? errorLevel : DEFAULT_ERROR_LEVEL
	}

	private getWindowById(): number {
		const identifierParts = this.name.split('|')

		// TODO: Improve throw because I don't have time now
		// TODO: Check if this condition is not needed on other rules
		if (identifierParts[0] && identifierParts[0].length == 0) throw 'Something horrible not having one argument'
		if (identifierParts.length == 2 && identifierParts[1].length == 0) return DEFAULT_WINDOW

		const window = Number(identifierParts[1]) > 0 ? Number(identifierParts[1]) : DEFAULT_WINDOW

		return window
	}

	verify({ window, reference }: Input) {
		if (!window) {
			window = this.getWindowById()
		}
		const windowSize = window
		return this.match(window, reference)
			.map((idx) => new Feedback({
				ruleName: this.name,
				level: this.level,
				start: idx,
				end: idx + windowSize
			}))
	}

	private match(window: number, reference: Seq) {
		const idxs: Array<number> = []
		const kmerTable: KmerTable = {}

		for (let i = 0; i <= reference.length - window; i++) {
			let kmer = reference.substring(i, i + window)
			if (kmerTable[kmer]) {
				idxs.push(i)
				break;
			}
			kmerTable[kmer] = true
		}

		return idxs
	}

}

export default RepetitionRule

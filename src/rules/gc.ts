import { ErrorLevel } from "../configuration"
import Seq from "../seq"
import Rule, { DEFAULT_ERROR_LEVEL, Feedback, RuleProps } from "./rule"

/*
 *  GC rules have some common parameters:
 *  @param min		min percentage content of GC on some bp window 
 *  @param max		max percentage content of GC on some bp window 
 *  @param window	base pair window to analyze min and max 
 *  @param components?	by default, you analyze whole sequence, but you can also define only some components	
 */

interface Input {
	min?: number
	max?: number
	window?: number
	reference: Seq
	components?: Array<string>
}

interface Thresholds {
	min: number
	max: number
	window: number
	components: Array<string>
}

const DEFAULT = {
	MIN: 30,
	MAX: 70,
	WINDOW: 50
}

// TODO: Maybe would be interesting to make reference sequence a field instead of passing as argument
class GCRule implements Rule {
	name: string
	level: ErrorLevel

	constructor({ name, errorLevel }: RuleProps) {
		this.name = name
		this.level = errorLevel ? errorLevel : DEFAULT_ERROR_LEVEL
	}

	/* Indentifier can be used to define arguments: min, max, window and components
	 * Identifiers express arguments in the following way:
	 *             gc|30-70-10-[CDS,Promoter]
	 *              |  |  |  |       |
	 *              | min | window  components
	 *             id    max
	 * You can leave fields empty, and it could be removed from right to left if empty
	 *             gc|30-70
	 * or
	 *             gc|-70--[CDS,Promoter]
	 */
	getThresholdsById(): Thresholds {
		const identifierParts = this.name.split('|')
		if (identifierParts.length == 1) return {
			min: DEFAULT.MIN,
			max: DEFAULT.MAX,
			window: DEFAULT.WINDOW,
			components: []
		} as Thresholds

		// TODO: Improve throw because I don't have time now
		if (identifierParts.length != 2 || identifierParts[1].length == 0) throw 'Something horrible not having a second argument'

		const params = identifierParts[1].split('-')
		const min = Number(params[0]) > 0 ? Number(params[0]) : DEFAULT.MIN
		const max = Number(params[1]) > 0 ? Number(params[1]) : DEFAULT.MAX
		const window = Number(params[2]) > 0 ? Number(params[2]) : DEFAULT.WINDOW
		const components = params[3] ? params[3].split(",") : []

		return { min, max, window, components } as Thresholds
	}

	verify({ min, max, window, reference, components }: Input) {
		const threshold = this.getThresholdsById()

		if (!min) {
			min = threshold.min
		}
		if (!max) {
			max = threshold.max
		}
		if (!window) {
			window = threshold.window
		}
		if (!components) {
			components = threshold.components
		}
		const windowSize = window
		return this.match(min, max, window, reference, components)
			.map((idx) => new Feedback({
				ruleName: this.name,
				level: this.level,
				start: idx,
				end: idx + windowSize
			}))
	}

	private match(min: number, max: number, window: number, reference: Seq, components?: Array<string>) {
		const idxs: Array<number> = []

		// TODO: Filter reference by components
		for (let i = 0; i <= reference.size - window; i++) {
			let gcNumber = reference.basepairs
				.substring(i, i + window)
				.split("")
				.map((s: string) => ["G", "C"].includes(s) ? 1 : 0)
				.reduce((acc: number, curr: number) => acc + curr, 0)
			// hundred-based percentage should happens here
			let gcContent = gcNumber != 0 ? (gcNumber / window) * 100 : 0
			// TODO: Need to describe if window pass min or max threshold
			if (gcContent < min || gcContent > max) idxs.push(i)

		}

		return idxs
	}

}

export default GCRule

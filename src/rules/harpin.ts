import Rule, { DEFAULT_ERROR_LEVEL, Feedback, RuleProps } from "./rule"
import { ErrorLevel } from "../configuration"
import Seq from "../seq"

const DEFAULT = {
	STEM: 20,
	WINDOW: 200
}
/*
 *  Harpin rules have some common parameters:
 *  @param stem		Stem size used to search reference sequence against 
 *  @param windows	Window size is how much ahead it should look for harpins 
 */

interface Input {
	stem?: number
	window?: number
	reference: Seq
}

/*
 * Harpins happens when the DNA forms at some position a loop.
 * The harpins could only happen around some local context (some base pairs ahead
 * and behind some position).
 */

class HarpinRule implements Rule {
	name: string
	level: ErrorLevel

	constructor({ name, errorLevel }: RuleProps) {
		this.name = name
		this.level = errorLevel ? errorLevel : DEFAULT_ERROR_LEVEL
	}

	verify({ stem, window, reference }: Input) {
		if (!stem) {
			stem = DEFAULT.STEM
		}
		if (!window) {
			window = DEFAULT.WINDOW
		}
		const stemSize = stem
		return this.match(stem, window, reference)
			.map((idx) => new Feedback({
				ruleName: this.name,
				level: this.level,
				start: idx,
				end: idx + stemSize
			}))
	}

	private match(stem: number, window: number, reference: Seq) {
		let idxs: Array<number> = []
		for (let i = 0; i <= reference.size - stem; i++) {
			const start = i + 1
			const end = i + window < reference.size ? i + window : reference.size
			for (let j = start; j < end; j++) {
				const query = reference.get(i, i + stem).reverseStrand
				const referenceAtWindow = reference.get(j, j + stem)
				if (referenceAtWindow.basepairs == query.basepairs) {
					idxs.push(i)
					break;
				}
			}
		}
		return idxs
	}

}

export default HarpinRule

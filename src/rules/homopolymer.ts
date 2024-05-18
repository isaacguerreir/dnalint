import MatchRule from "./match"
import { RuleProps } from "./rule"
import Seq from "../seq"

type Base = 'A' | 'T' | 'C' | 'G'

interface Input {
	polymer?: Base
	size?: number
	reference: Seq
}

interface Params {
	size: number
	polymer: Base
}

const DEFAULT = {
	SIZE: 15,
	POLYMER: "A"
}

class HomopolymerRule extends MatchRule {
	constructor({ name, errorLevel }: RuleProps) {
		super({ name, errorLevel })
	}

	getParamsById(): Params {
		const identifierParts = this.name.split('|')
		if (identifierParts.length == 1) return {
			size: DEFAULT.SIZE,
			polymer: DEFAULT.POLYMER as Base
		}

		// TODO: Improve throw because I don't have time now
		if (identifierParts.length != 2 || identifierParts[1].length == 0) throw 'Something horrible not having a second argument'

		const params = identifierParts[1].split('-')

		const bases = ['A', 'T', 'C', 'G']
		const polymer = params[0].length == 1 && bases.includes(params[0]) ? params[0] as Base : DEFAULT.POLYMER as Base
		const size = Number(params[1]) > 0 ? Number(params[1]) : DEFAULT.SIZE

		return { polymer, size }
	}

	verify({ polymer, size, reference }: Input) {
		const params = this.getParamsById()
		if (!size) {
			size = params.size
		}
		if (!polymer) {
			polymer = params.polymer
		}
		const query = new Seq(polymer.repeat(size))
		return super.verify({ query, reference })
	}
}

export default HomopolymerRule

import Config, { ErrorLevel } from "./configuration"
import { rule_not_found } from "./error"
import MatchRule from "./rules/match"
import Rule from "./rules/rule"

export type Identifier = string

interface Store {
	[identifier: Identifier]: Rule
}

const DEFAULT_RULE_STORE = {
	'match': (name: string, errorLevel: ErrorLevel) => new MatchRule({ name, errorLevel })
}

export default class Parser {
	rules: Store
	config: Config

	constructor(config: Config) {
		this.config = config
		this.rules = this.build()
	}


	private build(): Store {
		const ruleStore: Store = {}
		for (const identifier in this.config.rules) {
			const level: ErrorLevel = this.config.rules[identifier]
			const rule = this.getRuleById(identifier)
			ruleStore[identifier] = rule({ name: identifier, errorLevel: level })
		}
		return ruleStore
	}

	private getRuleById(identifier: string) {
		const identifierParts = identifier.split('|')
		const upperIdentifier = identifierParts.length == 2 ? identifierParts[0] : identifier

		const rule = DEFAULT_RULE_STORE[upperIdentifier]
		if (!rule) throw rule_not_found(identifier)

		return rule
	}

}

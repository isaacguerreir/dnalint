import Config from "./configuration";
import Parser from "./parser";
import MatchRule from "./rules/match";
import { Feedback } from "./rules/rule";
import { no_sequence_err } from "./error";

export default class Linter {
	config: Config
	parser: Parser

	constructor(config: Config) {
		this.config = config
		this.parser = new Parser(config)
	}

	verify() {
		if (!this.config.sequence) throw no_sequence_err

		const reference = this.config.sequence
		// TODO: verify if sequence is a compatible type (.e.g DNA, RNA, Protein) using UIPAC definitions
		const feedbacks: Array<Feedback> = []
		for (const identifier in this.parser.rules) {
			const rule = this.parser.rules[identifier]
			if (rule instanceof MatchRule) {
				const query = rule.getQueryById()
				const fbs = rule.verify({ query, reference })
				feedbacks.push(...fbs)
			}
		}

		return feedbacks
	}
}



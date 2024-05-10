export type ErrorLevel = "off" | "warn" | "error"

export interface Rules {
	[identifier: string]: ErrorLevel
}

export default interface Config {
	fileExt?: Array<string>
	sequence?: string
	rules: Rules
}

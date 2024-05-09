export const no_sequence_err = `Configuration doesn't have a sequence field to be verified. Try adding:
	{
		sequence: "ATAC..."
		// ...rest of configuration
	}
`

export const rule_not_found = (identifier: string) => `Rule ${identifier} not found. Are you sure this rule is available at your configuration?`

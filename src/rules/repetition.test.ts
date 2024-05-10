import RepetitionRule from "./repetition"

describe(`Repetition Rule`, () => {
	test(`Use identifier to find repetition feedbacks`, () => {
		const name = "repetition|10"
		const errorLevel = "warn"
		const reference = "AAAAAAAAAAGCTAGCTTACAAAAAAAAAA"

		const expectedWindow = "AAAAAAAAAA"

		const rule = new RepetitionRule({ name, errorLevel })

		const fbs = rule.verify({ reference })
		expect(fbs.length).toEqual(1)

		let gcFb = fbs[0]
		expect(gcFb.ruleName).toBe(name)
		expect(gcFb.level).toBe(errorLevel)
		expect(gcFb.start).toEqual(20)
		expect(gcFb.end).toEqual(30)
		expect(reference.substring(gcFb.start, gcFb.end)).toBe(expectedWindow)

	})

	test(`Use argument to find repetition feedbacks`, () => {
		const name = "repetition"
		const errorLevel = "warn"
		const reference = "AAAAAAAAAAGCTAGCTTACAAAAAAAAAA"

		const expectedWindow = "AAAAAAAAAA"

		const rule = new RepetitionRule({ name, errorLevel })

		const fbs = rule.verify({ window: 10, reference })
		expect(fbs.length).toEqual(1)

		let gcFb = fbs[0]
		expect(gcFb.ruleName).toBe(name)
		expect(gcFb.level).toBe(errorLevel)
		expect(gcFb.start).toEqual(20)
		expect(gcFb.end).toEqual(30)
		expect(reference.substring(gcFb.start, gcFb.end)).toBe(expectedWindow)

	})
})

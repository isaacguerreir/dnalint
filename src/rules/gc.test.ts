import GCRule from "./gc"

describe(`GC Rule`, () => {
	test(`Get feedbacks of two windows outside of the GC threshold inside sequence`, () => {
		const name = "gc"
		const errorLevel = "warn"
		const reference = "CGCGCATATATAA"

		const expectedWindow = "GCATATATAA"

		const rule = new GCRule({ name, errorLevel })

		const fbs = rule.verify({ window: 10, reference })
		expect(fbs.length).toEqual(1)

		const gcFb = fbs[0]
		expect(gcFb.ruleName).toBe(name)
		expect(gcFb.level).toBe(errorLevel)
		expect(gcFb.start).toEqual(3)
		expect(gcFb.end).toEqual(13)
		expect(reference.substring(gcFb.start, gcFb.end)).toBe(expectedWindow)
	})

	test(`Use identifier to find GC content feedbacks`, () => {
		const name = "gc|20-70-10"
		const errorLevel = "warn"
		const reference = "CGCGCATATATAAAA"

		let expectedWindow = "CATATATAAA"

		const rule = new GCRule({ name, errorLevel })

		const fbs = rule.verify({ reference })
		expect(fbs.length).toEqual(2)

		let gcFb = fbs[0]
		expect(gcFb.ruleName).toBe(name)
		expect(gcFb.level).toBe(errorLevel)
		expect(gcFb.start).toEqual(4)
		expect(gcFb.end).toEqual(14)
		expect(reference.substring(gcFb.start, gcFb.end)).toBe(expectedWindow)

		expectedWindow = "ATATATAAAA"
		gcFb = fbs[1]
		expect(gcFb.ruleName).toBe(name)
		expect(gcFb.level).toBe(errorLevel)
		expect(gcFb.start).toEqual(5)
		expect(gcFb.end).toEqual(15)
		expect(reference.substring(gcFb.start, gcFb.end)).toBe(expectedWindow)
	})
})

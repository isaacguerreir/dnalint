import HomopolymerRule from "./homopolymer"

describe(`Homopolymer Rule`, () => {
	test(`Use argument to find homopolymer feedbacks`, () => {
		const name = "polymer"
		const errorLevel = "warn"
		const polymer = "T"
		const homopolymer = polymer.repeat(10)
		const reference = `${homopolymer}TGCTATAGCTAGAGC`
		const rule = new HomopolymerRule({ name, errorLevel })

		const fbs = rule.verify({ polymer, size: 10, reference })
		expect(fbs.length).toEqual(1)

		let gcFb = fbs[0]
		expect(gcFb.ruleName).toBe(name)
		expect(gcFb.level).toBe(errorLevel)
		expect(gcFb.start).toEqual(0)
		expect(gcFb.end).toEqual(10)
		expect(reference.substring(gcFb.start, gcFb.end)).toBe(homopolymer)
	})

	test(`Use identifier to find homopolymer feedbacks`, () => {
		const name = "polymer|G-12"
		const errorLevel = "warn"
		const polymer = "G"
		const homopolymer = polymer.repeat(12)
		const reference = `${homopolymer}TGCTATAGCTAGAGC`
		const rule = new HomopolymerRule({ name, errorLevel })

		const fbs = rule.verify({ reference })
		expect(fbs.length).toEqual(1)

		let gcFb = fbs[0]
		expect(gcFb.ruleName).toBe(name)
		expect(gcFb.level).toBe(errorLevel)
		expect(gcFb.start).toEqual(0)
		expect(gcFb.end).toEqual(12)
		expect(reference.substring(gcFb.start, gcFb.end)).toBe(homopolymer)
	})
})

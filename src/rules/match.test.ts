import MatchRule from "./match"

describe(`Match Rule`, () => {
	test(`Throw error if you pass an restriction enzyme don't exist on library`, () => {
		const name = 'match|NonExistentEnzyme'
		const reference = 'AAAAT'
		const rule = new MatchRule({ name, errorLevel: 'warn' })

		expect(() => rule.verify({ reference })).toThrow()
	})

	test(`Find BsaI on the sequence reference`, () => {
		const name = 'match|BsaI'
		const enzymeSite = "GGTCTC"
		const reference = `${enzymeSite}AAGCTAGTCA`
		const level = 'warn'
		const rule = new MatchRule({ name, errorLevel: level })

		const fbs = rule.verify({ reference })
		expect(fbs.length).toEqual(1)

		const matchFound = fbs[0]
		expect(matchFound).toBeDefined()
		expect(matchFound.ruleName).toBe(name)
		expect(matchFound.level).toBe(level)
		expect(matchFound.start).toEqual(0)
		expect(matchFound.end).toEqual(6)
		expect(reference.substring(matchFound.start, matchFound.end)).toBe(enzymeSite)
	})

	test(`Find Eco31I, a isoschizomers of enzyme of BsaI`, () => {
		const name = 'match|Eco31I'
		const enzymeSite = "GGTCTC"
		const reference = `${enzymeSite}AAGCTAGTCA`
		const level = 'warn'
		const rule = new MatchRule({ name, errorLevel: level })

		const fbs = rule.verify({ reference })
		expect(fbs.length).toEqual(1)

		const matchFound = fbs[0]
		expect(matchFound).toBeDefined()
		expect(matchFound.ruleName).toBe(name)
		expect(matchFound.level).toBe(level)
		expect(matchFound.start).toEqual(0)
		expect(matchFound.end).toEqual(6)
		expect(reference.substring(matchFound.start, matchFound.end)).toBe(enzymeSite)
	})

	test(`Find BbsI on the sequence reference`, () => {
		const name = 'match|BbsI'
		const enzymeSite = "GAAGAC"
		const reference = `GGTCTCA${enzymeSite}TCA`
		const level = 'warn'
		const rule = new MatchRule({ name, errorLevel: level })

		const fbs = rule.verify({ reference })
		expect(fbs.length).toEqual(1)

		const matchFound = fbs[0]
		expect(matchFound).toBeDefined()
		expect(matchFound.ruleName).toBe(name)
		expect(matchFound.level).toBe(level)
		expect(matchFound.start).toEqual(7)
		expect(matchFound.end).toEqual(13)
		expect(reference.substring(matchFound.start, matchFound.end)).toBe(enzymeSite)
	})

	test(`Pass sequence as argument instead of relying on the enzyme library`, () => {
		const name = 'match'
		const enzymeSite = "GAAGAC"
		const reference = `GGTCTCA${enzymeSite}TCA`
		const level = 'warn'
		const rule = new MatchRule({ name, errorLevel: level })

		const fbs = rule.verify({ query: enzymeSite, reference })
		expect(fbs.length).toEqual(1)

		const matchFound = fbs[0]
		expect(matchFound).toBeDefined()
		expect(matchFound.ruleName).toBe(name)
		expect(matchFound.level).toBe(level)
		expect(matchFound.start).toEqual(7)
		expect(matchFound.end).toEqual(13)
		expect(reference.substring(matchFound.start, matchFound.end)).toBe(enzymeSite)
	})
})

import Seq from "../seq"
import HarpinRule from "./harpin"

describe(`Hairpin Rule`, () => {
	test(`Pass arguments to find for harpins on reference`, () => {
		const reference = new Seq("attcaatgggggggggggggggggggggggggtagccta")
		const name = 'harpin'
		const errorLevel = "warn"
		const rule = new HarpinRule({ name, errorLevel })

		const fbs = rule.verify({ stem: 3, window: 8, reference })
		expect(fbs.length).toEqual(2)

		let gcFb = fbs[0]
		expect(gcFb.ruleName).toBe(name)
		expect(gcFb.level).toBe(errorLevel)
		expect(gcFb.start).toEqual(0)
		expect(gcFb.end).toEqual(3)
		expect(reference.get(gcFb.start, gcFb.end).basepairs).toBe("ATT")

		gcFb = fbs[1]
		expect(gcFb.ruleName).toBe(name)
		expect(gcFb.level).toBe(errorLevel)
		expect(gcFb.start).toEqual(32)
		expect(gcFb.end).toEqual(35)
		expect(reference.get(gcFb.start, gcFb.end).basepairs).toBe("TAG")
	})
})

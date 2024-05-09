import MatchRule from "./match"

test('Find AAAA in AAAAT', () => {
	const name = 'match|AAAA'
	const reference = 'AAAAT'
	const rule = new MatchRule({ name, errorLevel: 'warn' })

	const fbs = rule.verify({ reference })
	expect(fbs.length).toEqual(1)

	const feedback = fbs[0]
	expect(feedback.start).toBe(0)
	expect(feedback.end).toBe(3)
})

import { ComplementMap, Direction } from "./utils/seq"

/*
 *  Sequence is more than an array of characters
 *  Sequence actually have:
 *	- Both strands read from one direction to another 
 *	- Kmer table pointing a kmer to positions on the sequence
 *	- A list of parts/components forming the sequence
 *	- Have a design space, which is actually an AST of the sequence
 */

class Seq {
	basepairs: string
	reverseStrand: Seq
	direction: Direction
	size: number

	constructor(basepairs: string, direction = 'foward' as Direction, reverseStrand?: Seq) {
		console.log(basepairs, direction, reverseStrand)
		this.basepairs = this.sanitaze(basepairs)
		this.direction = direction
		this.size = basepairs.length
		if (reverseStrand && direction == 'reverse') {
			this.reverseStrand = reverseStrand
		} else {
			this.reverseStrand = this.toReverseStrand()
		}
	}

	private sanitaze(basepairs: string) {
		basepairs = basepairs.toUpperCase()

		if (basepairs.length == 0) throw `It's not possible to initialize Seq. Input sequence is empty.`
		if (this.isDNA(basepairs)) throw `It's not possible to initialize Seq. Input sequence includes characters not allowed for a DNA sequence`

		return basepairs
	}

	private isDNA(sequence: string) {
		for (let nucleotide in sequence.split('')) {
			if (!this.isNucleotide(nucleotide)) return false
		}
		return true
	}

	private isNucleotide(nucleotide: string) {
		return typeof ComplementMap[nucleotide] !== 'undefined'
	}

	private toReverseStrand() {
		const reverseStrand = this.basepairs.split('')
			.reverse()
			.map(this.nucleotideComplement)
			.join('')
		const direction = this.direction == 'foward' ? 'reverse' : 'foward'
		return new Seq(reverseStrand, direction, this)
	}

	private nucleotideComplement(nucleotide: string) {
		return ComplementMap[nucleotide]
	}

	get(start?: number, end?: number) {
		if (!start) {
			start = 0
		}

		if (!end) {
			end = this.size
		}

		if (start == 0 && end == this.size) return new Seq(this.basepairs, this.direction)
		const basepair = this.basepairs.substring(start, end)
		return new Seq(basepair, this.direction)
	}
}

export default Seq

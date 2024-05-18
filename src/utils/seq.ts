export type Nucleotide = 'A' | 'T' | 'C' | 'G'
export type Direction = 'foward' | 'reverse'

export interface ComplementMapImpl {
	[k: string]: Nucleotide
}

export const ComplementMap = {
	'A': 'T',
	'T': 'A',
	'C': 'G',
	'G': 'C'
} as ComplementMapImpl

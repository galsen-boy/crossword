export const tests = []
const t = (f) => tests.push(f)


const puzzle1 = '2001\n0..0\n1000\n0..0'
const words1 = ['casa', 'alan', 'ciao', 'anta']
const result1 =`casa
i..l
anta
o..n`

t(({ eq }) => eq(crosswordSolver(puzzle1, words1)), result1)

Object.freeze(tests)
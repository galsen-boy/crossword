// import('./test/crosswordSolver.tests.js')

//_________________________________________________________________________________________________________________________________________________
//                                                                                                                                      Validation

const Same_Length = (puzzle) => {
  let lines = puzzle.split('\n');
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].length !== lines[0].length) return false
  }
  return true
}

const Valid_Puzzle_Format = (puzzle) => {
  // Validation checks for input parameters
  if (typeof puzzle !== "string" || puzzle === "" || new RegExp(!/^[.\n012]+$/).test(puzzle) || !Same_Length(puzzle)) return false
  else return true
}

const Valid_Words_Format = (words, puzzle) => {
  if (!(Array.isArray(words)) || new Set(words).size !== words.length) return false
  else return true
}

//__________________________________________________________________________________________________________________
//                                                                                        Check Words Accomodation
//  * Check if a word can be inserted horizontally in a specific position in the puzzle
//  puzzle - the current puzzle state
//  word - the word to insert
//  i - the row index of the starting position
//  j - the column index of the starting position
//  true if the word can be inserted horizontally, false otherwise

function Check_Row(puzzle, word, i, j) {

  // Check if the word can fit in the row starting from column j
  if (word.length > puzzle[i].length - j) return false

  // Check if the word matches the characters in the row starting from column j
  let substr = puzzle[i].substring(j, j + word.length)
  for (let k = 0; k < substr.length; k++) {
    if ((/[a-z]/.test(substr[k]) && substr[k] != word[k]) || substr[k] == ".")
      return false
  }

  // Check if the row has enough space to accommodate the word
  substr = puzzle[i].substring(j, puzzle[i].length)
  if (substr.length > word.length) {
    for (let k = word.length; k < substr.length; k++) {
      if (substr[k] == ".") break
      else return false
    }
  }

  return true
}

//-------------------------------------------------------------------------------\\

// * Insert a word vertically in a specific position in the puzzle
// emptypuzzle - the current puzzle state
// words - the list of remaining words to insert
// i - the row index of the starting position
// j - the column index of the starting position

function Check_Column(puzzle, word, i, j) {

  /* Build a string with the characters
  in the column starting from row i */
  let substr = ""
  for (let k = i; k < puzzle.length; k++) {
    substr += puzzle[k][j]
  }

  /* Check if the word can fit in the column
  starting from row i */
  if (word.length > substr.length) return false

  // Check if the word matches the characters in the column starting from row i
  for (let k = 0; k < word.length; k++) {
    if ((/[a-z]/.test(substr[k]) && substr[k] != word[k]) || substr[k] == ".")

      return false
  }

  /* Check if the column has enough space
  to accommodate the word */
  if (substr.length > word.length) {
    for (let k = word.length; k < substr.length; k++) {
      if (substr[k] == ".") break
      else return false
    }
  }

  return true
}

//________________________________________________________________________________________________
//                                                                           Check Word Insertion

function Insert_Row(puzzle, words, x, j) {

  /* Loop through each word
  in the list of words to insert */
  for (let k = 0; k < words.length; k++) {

    /* Check if the current word can be inserted
    horizontally in the puzzle */
    if (Check_Row(puzzle, words[k], x, j)) {
      /* If the word can be inserted horizontally,
      insert it in the puzzle by replacing
      the corresponding substring in the row */
      puzzle[x] =
        puzzle[x].substring(0, j) +
        words[k] +
        puzzle[x].substring(j + words[k].length, puzzle[x].length)

      /* Remove the inserted word
      from the list of words to insert */
      words.splice(k, 1)

      /* Decrement the index
      to account for
      the removed word */
      k -= 1

      /* Exit the loop
      since we have successfully
      inserted a word */
      break
    }
  }
}

//------------------------------------------------------------------\\

function Insert_Column(puzzle, words, x, j) {

  /* Check if each word in the list can fit vertically
  in the column starting from row i and column j */
  for (let k = 0; k < words.length; k++) {
    if (Check_Column(puzzle, words[k], x, j)) {

      // If the word fits, insert it in the column
      for (let l = x; l - x < words[k].length; l++) {
        puzzle[l] =
          puzzle[l].substr(0, j) +
          words[k][l - x] +
          puzzle[l].substr(j + 1, puzzle[l].length);
      }

      /* Remove the word
      from the list of
      remaining words to insert */
      words.splice(k, 1)
      k -= 1
      break
    }
  }
}


//________________________________________________________________________________________
//                                                                          Combinations
/* This function takes in an empty puzzle,
a list of words, and starting coordinates (x,y). */

function Solve_puzzle(puzzle, words) {

  // let splitted = puzzle.split('\n')

  // if (splitted.length !== words.length) return false

  /* If there are no words to insert or if the starting coordinates are
  outside the bounds of the puzzle, return the empty puzzle. */
  if (words == [] || (0 == puzzle.length - 1 && 0 == puzzle[0].length))
    return puzzle

  // Create a copy of the empty puzzle.
  let temppuzzle = [...puzzle]

  /* Loop through each row of the puzzle
  starting at the given x coordinate. */
  for (let x = 0; x < puzzle.length; x++) {

    /* Loop through each column of the row
    starting at the given y coordinate. */
    for (let y = 0; y < puzzle[0].length; y++) {

      /* If the current cell is a numbered cell,
      try inserting words horizontally
      and vertically from that cell. */
      if (/\d/.test(puzzle[x][y]) && puzzle[x][y] > "0") {
        Insert_Row(temppuzzle, words, x, y)
        Insert_Column(temppuzzle, words, x, y)
      }
    }
  }

  /* If all words have been inserted,
  return the filled puzzle. Otherwise,
  return an error. */
  if (words.length === 0) {
    return temppuzzle

  } else {
    return ["Error"]
  }
}

//__________________________________________________________________________________________________
//                                                                                   Main Function

function crosswordSolver(puzzle, words) {
  let canBeSolved = true

  function err() {
    canBeSolved = false
    return "Error"
  }

  // Validation checks for input parameters
  if (!Valid_Puzzle_Format || !Valid_Words_Format) err()

  // If all input parameters are valid, solve the puzzle
  if ((canBeSolved) && Valid_Words_Format(words)) {

    wordsCopy = [...words].reverse()
    let output = Solve_puzzle(puzzle.split("\n"), words).join("\n")

    if (output === "Error") {
      return Solve_puzzle(puzzle.split("\n"), wordsCopy).join("\n")

    } else {
      return output
    }

  } else {
    return "Error"
  }
}


//_________________________________________________________________________
//                                                                  TESTS

const puzzle1 = '2001\n0..0\n1000\n0..0'
const words1 = ['casa', 'alan', 'ciao', 'anta']

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle1))
console.log("Valid Words -> " + Valid_Words_Format(words1))
console.log("Test 1:\n" + crosswordSolver(puzzle1, words1))


//-------------------------------------------------------------\\

const puzzle2 = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`

const words2 = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
]

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle2))
console.log("Valid Words -> " + Valid_Words_Format(words2))
console.log("Test 2:\n" + crosswordSolver(puzzle2, words2))

//-------------------------------------------------------------\\

const puzzle3 = `..1.1..1...
10000..1000
..0.0..0...
..1000000..
..0.0..0...
1000..10000
..0.1..0...
....0..0...
..100000...
....0..0...
....0......`

const words3 = [
  'popcorn',
  'fruit',
  'flour',
  'chicken',
  'eggs',
  'vegetables',
  'pasta',
  'pork',
  'steak',
  'cheese',
]

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle3))
console.log("Valid Words -> " + Valid_Words_Format(words3))
console.log("Test 3:\n" + crosswordSolver(puzzle3, words3))

//----------------------------------------------------------------\\

const puzzle4 = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`

const words4 = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
].reverse()

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle4))
console.log("Valid Words -> " + Valid_Words_Format(words4))
console.log("Test 4:\n" + crosswordSolver(puzzle4, words4))

//----------------------------------------------------------------\\

const puzzle5 = '2001\n0..0\n2000\n0..0'
const words5 = ['casa', 'alan', 'ciao', 'anta']

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle5))
console.log("Valid Words -> " + Valid_Words_Format(words5))
console.log("Test 5:\n" + crosswordSolver(puzzle5, words5))

//----------------------------------------------------------------\\

const puzzle6 = '0001\n0..0\n3000\n0..0'
const words6 = ['casa', 'alan', 'ciao', 'anta']

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle6))
console.log("Valid Words -> " + Valid_Words_Format(words6))
console.log("Test 6:\n" + crosswordSolver(puzzle6, words6))

//----------------------------------------------------------------\\

const puzzle7 = '2001\n0..0\n1000\n0..0'
const words7 = ['casa', 'casa', 'ciao', 'anta']

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle7))
console.log("Valid Words -> " + Valid_Words_Format(words7))
console.log("Test 7:\n" + crosswordSolver(puzzle7, words7))

//----------------------------------------------------------------\\

const puzzle8 = ''
const words8 = ['casa', 'alan', 'ciao', 'anta']

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle8))
console.log("Valid Words -> " + Valid_Words_Format(words8))
console.log("Test 8:\n" + crosswordSolver(puzzle8, words8))

//----------------------------------------------------------------\\

const puzzle9 = '123'
const words9 = ['casa', 'alan', 'ciao', 'anta']

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle9))
console.log("Valid Words -> " + Valid_Words_Format(words9))
console.log("Test 9:\n" + crosswordSolver(puzzle9, words9))

//----------------------------------------------------------------\\

const puzzle10 = ''
const words10 = 123

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle10))
console.log("Valid Words -> " + Valid_Words_Format(words10))
console.log("Test 10:\n" + crosswordSolver(puzzle10, words10))

//----------------------------------------------------------------\\

const puzzle11 = '2000\n0...\n0...\n0...'
const words11 = ['abba', 'assa']

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle11))
console.log("Valid Words -> " + Valid_Words_Format(words11))
console.log("Test 11:\n" + crosswordSolver(puzzle11, words11))

//----------------------------------------------------------------\\

const puzzle12 = '2001\n0..0\n1000\n0..0'
const words12 = ['aaab', 'aaac', 'aaad', 'aaae']

console.log("Valid Puzzle -> " + Valid_Puzzle_Format(puzzle12))
console.log("Valid Words -> " + Valid_Words_Format(words12))
console.log("Test 12:\n" + crosswordSolver(puzzle12, words12))
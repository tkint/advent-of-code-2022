# advent-of-code 2022

This repository regroup my solutions to the advent of code 2022 edition.

## How to run

```
# Install dependencies
pnpm i

# Run solutions
pnpm test
```

NB : I use [vitest](https://vitest.dev/) to develop and run my solutions as
it is simple and performant to work with it.

## Structure

- `src/days` contains a subfolder per day
- `src/utils` contains util functions used for multiple challenges

For each day, the folder contains the following :

- `index.spec.ts` containing the solution
- `input.txt` containing the given input
- `README.md` describing the context and solution

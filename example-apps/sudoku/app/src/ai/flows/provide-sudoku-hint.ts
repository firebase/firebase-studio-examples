'use server';
/**
 * @fileOverview Provides a Sudoku hint using AI to either fill in a cell or suggest a deduction strategy.
 *
 * - provideSudokuHint - A function that provides a hint for a Sudoku puzzle.
 * - ProvideSudokuHintInput - The input type for the provideSudokuHint function.
 * - ProvideSudokuHintOutput - The return type for the provideSudokuHint function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ProvideSudokuHintInputSchema = z.object({
  grid: z.array(z.array(z.number())).describe('The current state of the Sudoku grid.'),
});
export type ProvideSudokuHintInput = z.infer<typeof ProvideSudokuHintInputSchema>;

const ProvideSudokuHintOutputSchema = z.object({
  hint: z.string().describe('A hint for the Sudoku puzzle, either a cell to fill or a deduction strategy.'),
});
export type ProvideSudokuHintOutput = z.infer<typeof ProvideSudokuHintOutputSchema>;

export async function provideSudokuHint(input: ProvideSudokuHintInput): Promise<ProvideSudokuHintOutput> {
  return provideSudokuHintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideSudokuHintPrompt',
  input: {
    schema: z.object({
      grid: z.array(z.array(z.number())).describe('The current state of the Sudoku grid.'),
    }),
  },
  output: {
    schema: z.object({
      hint: z.string().describe('A hint for the Sudoku puzzle, either a cell to fill or a deduction strategy.'),
    }),
  },
  prompt: `You are an expert Sudoku solver. Given the current state of the Sudoku grid, provide a hint to the user.

The hint should either be a specific cell to fill in with a number, or a logical deduction strategy the user can employ to solve the puzzle.

Here is the current Sudoku grid:
{{grid}}

Provide a concise and helpful hint:
`,
});

const provideSudokuHintFlow = ai.defineFlow<
  typeof ProvideSudokuHintInputSchema,
  typeof ProvideSudokuHintOutputSchema
>({
  name: 'provideSudokuHintFlow',
  inputSchema: ProvideSudokuHintInputSchema,
  outputSchema: ProvideSudokuHintOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
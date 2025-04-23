'use server';
/**
 * @fileOverview Generates beginner-friendly stories in French.
 *
 * - generateFrenchStory - A function that generates a French story.
 * - GenerateFrenchStoryInput - The input type for the generateFrenchStory function.
 * - GenerateFrenchStoryOutput - The return type for the generateFrenchStory function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateFrenchStoryInputSchema = z.object({
  topic: z.string().describe('The topic of the story.'),
});
export type GenerateFrenchStoryInput = z.infer<typeof GenerateFrenchStoryInputSchema>;

const GenerateFrenchStoryOutputSchema = z.object({
  frenchStory: z.string().describe('The generated story in French.'),
});
export type GenerateFrenchStoryOutput = z.infer<typeof GenerateFrenchStoryOutputSchema>;

export async function generateFrenchStory(input: GenerateFrenchStoryInput): Promise<GenerateFrenchStoryOutput> {
  return generateFrenchStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFrenchStoryPrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The topic of the story.'),
    }),
  },
  output: {
    schema: z.object({
      frenchStory: z.string().describe('The generated story in French.'),
    }),
  },
  prompt: `You are a helpful AI assistant that generates beginner-friendly stories in French.

  Please generate a story about the following topic: {{{topic}}}.

  The story should be suitable for beginner French learners, using simple vocabulary and sentence structures.
`,
});

const generateFrenchStoryFlow = ai.defineFlow<
  typeof GenerateFrenchStoryInputSchema,
  typeof GenerateFrenchStoryOutputSchema
>({
  name: 'generateFrenchStoryFlow',
  inputSchema: GenerateFrenchStoryInputSchema,
  outputSchema: GenerateFrenchStoryOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

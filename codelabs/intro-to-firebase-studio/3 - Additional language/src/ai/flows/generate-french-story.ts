'use server';
/**
 * @fileOverview Generates beginner-friendly stories in a specified language.
 *
 * - generateStory - A function that generates a story in the specified language.
 * - GenerateStoryInput - The input type for the generateStory function.
 * - GenerateStoryOutput - The return type for the generateStory function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateStoryInputSchema = z.object({
  topic: z.string().describe('The topic of the story.'),
  language: z.enum(['french', 'japanese']).describe('The language of the story.'),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  story: z.string().describe('The generated story in the specified language.'),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return generateStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStoryPrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The topic of the story.'),
      language: z.enum(['french', 'japanese']).describe('The language of the story.'),
    }),
  },
  output: {
    schema: z.object({
      story: z.string().describe('The generated story in the specified language.'),
    }),
  },
  prompt: `You are a helpful AI assistant that generates beginner-friendly stories in the specified language.

  Please generate a story about the following topic: {{{topic}}}.

  The story should be suitable for beginner language learners, using simple vocabulary and sentence structures.
  The language of the story should be {{{language}}}.
`,
});

const generateStoryFlow = ai.defineFlow<
  typeof GenerateStoryInputSchema,
  typeof GenerateStoryOutputSchema
>({
  name: 'generateStoryFlow',
  inputSchema: GenerateStoryInputSchema,
  outputSchema: GenerateStoryOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

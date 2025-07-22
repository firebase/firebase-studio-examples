'use server';

/**
 * @fileOverview A flow that suggests wheel sections based on the current sections.
 *
 * - suggestWheelSections - A function that handles the suggestion of wheel sections.
 * - SuggestWheelSectionsInput - The input type for the suggestWheelSections function.
 * - SuggestWheelSectionsOutput - The return type for the suggestWheelSections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWheelSectionsInputSchema = z.object({
  currentSections: z
    .array(z.string())
    .describe('The current sections defined in the wheel.'),
});
export type SuggestWheelSectionsInput = z.infer<typeof SuggestWheelSectionsInputSchema>;

const SuggestWheelSectionsOutputSchema = z.object({
  suggestedSections: z
    .array(z.string())
    .describe('The suggested sections for the wheel.'),
});
export type SuggestWheelSectionsOutput = z.infer<typeof SuggestWheelSectionsOutputSchema>;

export async function suggestWheelSections(
  input: SuggestWheelSectionsInput
): Promise<SuggestWheelSectionsOutput> {
  return suggestWheelSectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWheelSectionsPrompt',
  input: {schema: SuggestWheelSectionsInputSchema},
  output: {schema: SuggestWheelSectionsOutputSchema},
  prompt: `You are a creative assistant helping a user populate a spinning wheel with interesting and relevant choices.

  The user has already defined the following sections:
  {{#each currentSections}}- {{{this}}}\n{{/each}}

  Suggest a few more sections that would be entertaining or relevant, given the existing sections.
  Return an array of strings with the suggested sections.
  Ensure that you do not repeat any of the existing sections.
  Ensure that the sections suggested can be of various lengths. Do not limit the sections to only one or two words.
  Ensure the tone is entertaining.
  `,
});

const suggestWheelSectionsFlow = ai.defineFlow(
  {
    name: 'suggestWheelSectionsFlow',
    inputSchema: SuggestWheelSectionsInputSchema,
    outputSchema: SuggestWheelSectionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

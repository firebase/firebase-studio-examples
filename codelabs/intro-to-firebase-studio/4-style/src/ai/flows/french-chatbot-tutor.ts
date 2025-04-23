'use server';

/**
 * @fileOverview An AI chatbot tutor for practicing basic conversations in a specified language.
 *
 * - chatbotTutor - A function that allows users to practice basic conversations with an AI chatbot.
 * - ChatbotTutorInput - The input type for the chatbotTutor function.
 * - ChatbotTutorOutput - The return type for the chatbotTutor function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ChatbotTutorInputSchema = z.object({
  userInput: z.string().describe('The user input to the chatbot.'),
  language: z.enum(['french', 'japanese']).describe('The language for the chatbot tutor.'),
});
export type ChatbotTutorInput = z.infer<typeof ChatbotTutorInputSchema>;

const ChatbotTutorOutputSchema = z.object({
  chatbotResponse: z.string().describe('The chatbot response to the user input.'),
});
export type ChatbotTutorOutput = z.infer<typeof ChatbotTutorOutputSchema>;

export async function chatbotTutor(input: ChatbotTutorInput): Promise<ChatbotTutorOutput> {
  return chatbotTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotTutorPrompt',
  input: {
    schema: z.object({
      userInput: z.string().describe('The user input to the chatbot.'),
      language: z.enum(['french', 'japanese']).describe('The language for the chatbot tutor.'),
    }),
  },
  output: {
    schema: z.object({
      chatbotResponse: z.string().describe('The chatbot response to the user input.'),
    }),
  },
  prompt: `You are a friendly and helpful AI chatbot tutor for practicing basic conversations in a specified language.

You should respond to the user in the specified language, unless they ask a question about grammar or vocabulary in English.
In that case, you should answer in English.

Your goal is to help the user improve their conversational skills and grammar.
Focus on beginner-friendly conversations, including basic greetings, common questions/answers, and vocabulary relevant to the lessons or stories.

User Input: {{{userInput}}}

Language: {{{language}}}
`,
});

const chatbotTutorFlow = ai.defineFlow<
  typeof ChatbotTutorInputSchema,
  typeof ChatbotTutorOutputSchema
>(
  {
    name: 'chatbotTutorFlow',
    inputSchema: ChatbotTutorInputSchema,
    outputSchema: ChatbotTutorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

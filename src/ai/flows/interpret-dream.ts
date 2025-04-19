// Use strict mode
'use server';

/**
 * @fileOverview Interprets a dream description, extracts key themes, and suggests visual elements.
 *
 * - interpretDream - A function that interprets the dream description.
 * - InterpretDreamInput - The input type for the interpretDream function.
 * - InterpretDreamOutput - The return type for the interpretDream function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const InterpretDreamInputSchema = z.object({
  dreamDescription: z.string().describe('The description of the dream.'),
});
export type InterpretDreamInput = z.infer<typeof InterpretDreamInputSchema>;

const InterpretDreamOutputSchema = z.object({
  themes: z.array(z.string()).describe('Key themes extracted from the dream.'),
  visualElements: z
    .array(z.string())
    .describe('Suggested visual elements for the dream.'),
  interpretation: z.string().describe('A short interpretation of the dream.'),
});
export type InterpretDreamOutput = z.infer<typeof InterpretDreamOutputSchema>;

export async function interpretDream(input: InterpretDreamInput): Promise<InterpretDreamOutput> {
  return interpretDreamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretDreamPrompt',
  input: {
    schema: z.object({
      dreamDescription: z.string().describe('The description of the dream.'),
    }),
  },
  output: {
    schema: z.object({
      themes: z.array(z.string()).describe('Key themes extracted from the dream.'),
      visualElements: z
        .array(z.string())
        .describe('Suggested visual elements for the dream.'),
      interpretation: z.string().describe('A short interpretation of the dream.'),
    }),
  },
  prompt: `You are a dream interpreter. Analyze the following dream description and extract key themes, suggest visual elements, and provide a short interpretation. Return your answers as a JSON object.

Dream Description: {{{dreamDescription}}}

Format your response as a JSON object with "themes", "visualElements", and "interpretation" keys.`,
});

const interpretDreamFlow = ai.defineFlow<
  typeof InterpretDreamInputSchema,
  typeof InterpretDreamOutputSchema
>(
  {
    name: 'interpretDreamFlow',
    inputSchema: InterpretDreamInputSchema,
    outputSchema: InterpretDreamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

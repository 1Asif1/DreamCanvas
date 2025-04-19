// src/ai/flows/visualize-dream.ts
'use server';

/**
 * @fileOverview Generates a visual representation of a dream based on interpreted themes.
 *
 * - visualizeDream - A function that handles the dream visualization process.
 * - VisualizeDreamInput - The input type for the visualizeDream function, containing the interpreted dream themes.
 * - VisualizeDreamOutput - The return type for the visualizeDream function, providing the URL of the generated image.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const VisualizeDreamInputSchema = z.object({
  dreamInterpretation: z.string().describe('The interpreted themes and key elements of the dream.'),
});
export type VisualizeDreamInput = z.infer<typeof VisualizeDreamInputSchema>;

const VisualizeDreamOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image representing the dream.'),
});
export type VisualizeDreamOutput = z.infer<typeof VisualizeDreamOutputSchema>;

export async function visualizeDream(input: VisualizeDreamInput): Promise<VisualizeDreamOutput> {
  return visualizeDreamFlow(input);
}

const visualizeDreamPrompt = ai.definePrompt({
  name: 'visualizeDreamPrompt',
  input: {
    schema: z.object({
      dreamInterpretation: z.string().describe('The interpreted themes and key elements of the dream.'),
    }),
  },
  output: {
    schema: z.object({
      imageUrl: z.string().describe('The URL of the generated image representing the dream.'),
    }),
  },
  prompt: `You are a creative AI that generates prompts for Stable Diffusion based on dream interpretations.

  Convert the following dream interpretation into a detailed and evocative prompt suitable for generating a visual representation of the dream. The prompt should be detailed enough to generate a surreal visual that matches the narrative of the dream.

  Dream Interpretation: {{{dreamInterpretation}}}

  The prompt should specify the scene, main subjects, art style, lighting, and camera angle. The prompt must be compatible with Stable Diffusion. Return only the prompt to be passed to Stable Diffusion.
  `,
});

const generateImage = ai.defineTool(
    {
      name: 'generateImage',
      description: 'Generates an image based on a text prompt using Stable Diffusion.',
      inputSchema: z.object({
        prompt: z.string().describe('A detailed text prompt describing the image to be generated.'),
      }),
      outputSchema: z.string().describe('The URL of the generated image.'),
    },
    async input => {
      // Placeholder for Stable Diffusion integration.
      // In a real implementation, this would call the Stable Diffusion API
      // and return the URL of the generated image.
      // For now, return a placeholder URL.
      console.log("Stable Diffusion API called with prompt: " + input.prompt);
      return `https://via.placeholder.com/512x512?text=${encodeURIComponent(input.prompt)}`;
    }
);

const visualizeDreamFlow = ai.defineFlow<
  typeof VisualizeDreamInputSchema,
  typeof VisualizeDreamOutputSchema
>(
  {
    name: 'visualizeDreamFlow',
    inputSchema: VisualizeDreamInputSchema,
    outputSchema: VisualizeDreamOutputSchema,
  },
  async input => {
    const {output: {imageUrl: prompt}} = await visualizeDreamPrompt(input);
    const imageUrl = await generateImage({prompt: prompt});

    return {imageUrl};
  }
);

'use server';

/**
 * @fileOverview An AI agent that judges emoji art submissions based on a daily challenge theme.
 *
 * - judgeSubmission - A function that handles the submission judging process.
 * - JudgeSubmissionInput - The input type for the judgeSubmission function.
 * - JudgeSubmissionOutput - The return type for the judgeSubmission function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const JudgeSubmissionInputSchema = z.object({
  artDescription: z
    .string()
    .describe('A detailed description of the emoji art submission.'),
  challengeTheme: z.string().describe('The theme for the daily challenge.'),
});
export type JudgeSubmissionInput = z.infer<typeof JudgeSubmissionInputSchema>;

const JudgeSubmissionOutputSchema = z.object({
  score: z
    .number()
    .describe(
      'A score between 0 and 100 representing how well the submission matches the challenge theme.'
    ),
  justification:
    z.string().describe('The AI justification for the assigned score.'),
});
export type JudgeSubmissionOutput = z.infer<typeof JudgeSubmissionOutputSchema>;

export async function judgeSubmission(
  input: JudgeSubmissionInput
): Promise<JudgeSubmissionOutput> {
  return judgeSubmissionFlow(input);
}

const judgeSubmissionPrompt = ai.definePrompt({
  name: 'judgeSubmissionPrompt',
  input: {
    schema: z.object({
      artDescription: z
        .string()
        .describe('A detailed description of the emoji art submission.'),
      challengeTheme: z.string().describe('The theme for the daily challenge.'),
    }),
  },
  output: {
    schema: z.object({
      score: z
        .number()
        .describe(
          'A score between 0 and 100 representing how well the submission matches the challenge theme.'
        ),
      justification:
        z.string().describe('The AI justification for the assigned score.'),
    }),
  },
  prompt: `You are an AI art critic tasked with evaluating emoji art submissions for a daily challenge.

You will be given a description of the emoji art and the theme for the daily challenge. Your task is to assign a score between 0 and 100, inclusive, based on how well the submission matches the theme.

Provide a brief justification for the score.

Challenge Theme: {{{challengeTheme}}}
Art Description: {{{artDescription}}}

Score:`, // Need to output a score between 0-100
});

const judgeSubmissionFlow = ai.defineFlow<
  typeof JudgeSubmissionInputSchema,
  typeof JudgeSubmissionOutputSchema
>(
  {
    name: 'judgeSubmissionFlow',
    inputSchema: JudgeSubmissionInputSchema,
    outputSchema: JudgeSubmissionOutputSchema,
  },
  async input => {
    const {output} = await judgeSubmissionPrompt(input);
    return output!;
  }
);

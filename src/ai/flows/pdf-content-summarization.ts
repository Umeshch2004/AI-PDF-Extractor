'use server';

/**
 * @fileOverview A PDF content summarization AI agent.
 *
 * - pdfContentSummarization - A function that handles the PDF content summarization process.
 * - PdfContentSummarizationInput - The input type for the pdfContentSummarization function.
 * - PdfContentSummarizationOutput - The return type for the pdfContentSummarization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PdfContentSummarizationInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question about the PDF content.'),
});
export type PdfContentSummarizationInput = z.infer<typeof PdfContentSummarizationInputSchema>;

const PdfContentSummarizationOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the PDF content.'),
  summary: z.string().describe('A concise summary of the PDF content.'),
});
export type PdfContentSummarizationOutput = z.infer<typeof PdfContentSummarizationOutputSchema>;

export async function pdfContentSummarization(
  input: PdfContentSummarizationInput
): Promise<PdfContentSummarizationOutput> {
  return pdfContentSummarizationFlow(input);
}

const pdfContentPrompt = ai.definePrompt({
  name: 'pdfContentPrompt',
  input: {schema: PdfContentSummarizationInputSchema},
  output: {schema: PdfContentSummarizationOutputSchema},
  prompt: `You are an expert in summarizing PDF documents and answering questions about their content.

  You will be provided with a PDF document and a question about its content.
  Your task is to provide a concise summary of the PDF content and answer the question based on the content.

  PDF Content: {{media url=pdfDataUri}}
  Question: {{{question}}}

  Summary:
  Answer: `,
});

const pdfContentSummarizationFlow = ai.defineFlow(
  {
    name: 'pdfContentSummarizationFlow',
    inputSchema: PdfContentSummarizationInputSchema,
    outputSchema: PdfContentSummarizationOutputSchema,
  },
  async input => {
    const {output} = await pdfContentPrompt(input);
    return output!;
  }
);

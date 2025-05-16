
'use server';

/**
 * @fileOverview PDF Keyword Extraction AI agent.
 *
 * - pdfKeywordExtraction - A function that handles extracting keywords from a PDF document.
 * - PdfKeywordExtractionInput - The input type for the pdfKeywordExtraction function.
 * - PdfKeywordExtractionOutput - The return type for the pdfKeywordExtraction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PdfKeywordExtractionInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type PdfKeywordExtractionInput = z.infer<typeof PdfKeywordExtractionInputSchema>;

const PdfKeywordExtractionOutputSchema = z.object({
  keywords: z.array(z.string()).describe('A list of keywords or key phrases extracted from the PDF document.'),
});
export type PdfKeywordExtractionOutput = z.infer<typeof PdfKeywordExtractionOutputSchema>;

export async function pdfKeywordExtraction(input: PdfKeywordExtractionInput): Promise<PdfKeywordExtractionOutput> {
  return pdfKeywordExtractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pdfKeywordExtractionPrompt',
  input: {schema: PdfKeywordExtractionInputSchema},
  output: {schema: PdfKeywordExtractionOutputSchema},
  prompt: `You are an expert at analyzing PDF documents and extracting key information.

  You will be given a PDF document. Your task is to identify and extract the most relevant and important keywords or short key phrases (2-4 words) from the document.
  Return a list of these keywords/key phrases. Aim for around 10-15 key terms, but prioritize relevance.

  PDF Document: {{media url=pdfDataUri}}

  Keywords: `,
});

const pdfKeywordExtractionFlow = ai.defineFlow(
  {
    name: 'pdfKeywordExtractionFlow',
    inputSchema: PdfKeywordExtractionInputSchema,
    outputSchema: PdfKeywordExtractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

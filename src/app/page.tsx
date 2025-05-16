
"use client";

import { useState, useEffect, type ChangeEvent } from 'react';
import PdfDisplay from '@/components/pdf-display';
import QaSection from '@/components/qa-section';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { pdfQuestionAnswering, type PdfQuestionAnsweringInput, type PdfQuestionAnsweringOutput } from '@/ai/flows/pdf-question-answering';
import { pdfContentSummarization, type PdfContentSummarizationInput, type PdfContentSummarizationOutput } from '@/ai/flows/pdf-content-summarization';
import { UploadCloud, Loader2 } from 'lucide-react';

export default function Home() {
  const [pdfDataUri, setPdfDataUri] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState<boolean>(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const { toast } = useToast();
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setIsLoadingPdf(true);
        setPdfDataUri(null); // Clear previous PDF while loading new one
        setPdfFileName(null);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result && typeof e.target.result === 'string') {
            setPdfDataUri(e.target.result);
            setPdfFileName(file.name);
            setAnswer(null);
            setQuestion('');
            setSummary(null);
            toast({
              title: "PDF Uploaded",
              description: `${file.name} has been successfully uploaded.`,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Upload Error",
              description: "Failed to read the PDF file.",
            });
          }
          setIsLoadingPdf(false);
        };
        reader.onerror = () => {
          toast({
            variant: "destructive",
            title: "Upload Error",
            description: "Error reading the PDF file.",
          });
          setIsLoadingPdf(false);
        };
        reader.readAsDataURL(file);
      } else {
         toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Please upload a PDF file.",
          });
      }
    }
    if (event.target) {
        event.target.value = "";
    }
  };

  const handleAskQuestion = async () => {
    if (!pdfDataUri) {
      toast({ variant: "destructive", title: "No PDF", description: "Please upload a PDF file first." });
      return;
    }
    if (!question.trim()) {
      toast({ variant: "destructive", title: "No Question", description: "Please enter a question." });
      return;
    }

    setIsLoadingAnswer(true);
    setAnswer(null);
    setSummary(null); // Clear summary when asking a question

    try {
      const input: PdfQuestionAnsweringInput = { pdfDataUri, question };
      const result: PdfQuestionAnsweringOutput = await pdfQuestionAnswering(input);
      setAnswer(result.answer);
    } catch (error) {
      console.error("Error getting answer:", error);
      toast({ variant: "destructive", title: "AI Error", description: "Failed to get an answer from the AI. Please try again." });
      setAnswer("Sorry, I couldn't process your question. Please try again or check the document.");
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  const handleGetSummary = async () => {
    if (!pdfDataUri) {
      toast({ variant: "destructive", title: "No PDF", description: "Please upload a PDF file first." });
      return;
    }
    setIsLoadingSummary(true);
    setSummary(null);
    setAnswer(null); // Clear answer when asking for summary
    setQuestion(''); // Clear question as well

    try {
      const input: PdfContentSummarizationInput = {
        pdfDataUri,
        question: "Provide a comprehensive summary of the key points in this document.", // Generic question for summarization flow
      };
      const result: PdfContentSummarizationOutput = await pdfContentSummarization(input);
      setSummary(result.summary); // Use the summary field from the output
    } catch (error) {
      console.error("Error getting summary:", error);
      toast({ variant: "destructive", title: "AI Error", description: "Failed to get a summary from the AI. Please try again." });
      setSummary("Sorry, I couldn't generate a summary. Please try again or check the document.");
    } finally {
      setIsLoadingSummary(false);
    }
  };
  
  const isLoading = isLoadingPdf || isLoadingAnswer || isLoadingSummary;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">AI PDF Extractor</h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="pdf-upload" className="sr-only">Upload PDF</Label>
            <Input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            <Button asChild variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
              <Label htmlFor="pdf-upload" className="cursor-pointer">
                {isLoadingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                {pdfFileName ? 'Change PDF' : 'Upload PDF'}
              </Label>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 h-full">
          <div className="flex flex-col space-y-4">
            <PdfDisplay pdfDataUri={pdfDataUri} fileName={pdfFileName} />
          </div>

          <div className="flex flex-col space-y-4">
            <QaSection
              question={question}
              onQuestionChange={setQuestion}
              onAskQuestion={handleAskQuestion}
              answer={answer}
              summary={summary}
              isLoadingAnswer={isLoadingAnswer}
              isLoadingSummary={isLoadingSummary}
              onGetSummary={handleGetSummary}
              pdfUploaded={!!pdfDataUri}
            />
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-xs sm:text-sm text-muted-foreground border-t">
        {currentYear !== null ? `AI PDF Extractor © ${currentYear}.` : 'AI PDF Extractor.'} AI-powered document analysis.
      </footer>
    </div>
  );
}

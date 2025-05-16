
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Send, HelpCircle, ClipboardCopy, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface QaSectionProps {
  question: string;
  onQuestionChange: (question: string) => void;
  onAskQuestion: () => void;
  answer: string | null;
  summary: string | null;
  isLoadingAnswer: boolean;
  isLoadingSummary: boolean;
  onGetSummary: () => void;
  pdfUploaded: boolean;
}

export default function QaSection({
  question,
  onQuestionChange,
  onAskQuestion,
  answer,
  summary,
  isLoadingAnswer,
  isLoadingSummary,
  onGetSummary,
  pdfUploaded,
}: QaSectionProps) {
  const { toast } = useToast();
  const isLoading = isLoadingAnswer || isLoadingSummary;
  const currentOutput = answer || summary;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (pdfUploaded && question.trim() && !isLoading) {
        onAskQuestion();
      }
    }
  };

  const handleCopy = async () => {
    if (currentOutput) {
      try {
        await navigator.clipboard.writeText(currentOutput);
        toast({
          title: "Copied to Clipboard",
          description: "The AI's response has been copied.",
        });
      } catch (err) {
        console.error("Failed to copy text: ", err);
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Could not copy the response to clipboard.",
        });
      }
    }
  };

  return (
    <Card className="flex flex-col shadow-md rounded-lg overflow-hidden">
      <CardHeader className="bg-card border-b">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <HelpCircle className="mr-2 h-5 w-5 text-primary" />
          Interact with Your Document
        </CardTitle>
        <CardDescription>
          Ask questions or request a summary. The AI will respond based on the uploaded PDF.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 p-4 sm:p-6 flex-grow min-h-0">
        <Textarea
          placeholder={pdfUploaded ? "Type your question here (e.g., What is the main topic?)" : "Please upload a PDF first."}
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-[100px] sm:h-[120px] resize-none text-sm sm:text-base"
          disabled={isLoading || !pdfUploaded}
          aria-label="Question input"
        />
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button 
            onClick={onGetSummary} 
            disabled={isLoading || !pdfUploaded}
            variant="outline"
            className="w-full sm:w-auto"
            size="lg"
          >
            {isLoadingSummary ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Summarize Document
          </Button>
          <Button 
            onClick={onAskQuestion} 
            disabled={isLoading || !pdfUploaded || !question.trim()}
            className="w-full sm:w-44 bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isLoadingAnswer ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Ask Question
          </Button>
        </div>
        
        <div className="rounded-md border bg-muted/30 p-3 sm:p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md sm:text-lg font-semibold flex items-center shrink-0">
              <Sparkles className="mr-2 h-5 w-5 text-accent" />
              AI Response
            </h3>
            {currentOutput && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Copy response to clipboard"
              >
                <ClipboardCopy className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </div>
          
          <div className="pr-1">
            {isLoadingAnswer && (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary" />
                <p className="text-sm sm:text-base">Thinking...</p>
              </div>
            )}
            {isLoadingSummary && (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary" />
                <p className="text-sm sm:text-base">Summarizing...</p>
              </div>
            )}
            {!isLoading && currentOutput && (
              <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{currentOutput}</p>
            )}
            {!isLoading && !currentOutput && pdfUploaded && (
              <p className="text-sm sm:text-base text-muted-foreground">The AI's response will appear here once you ask a question or request a summary.</p>
            )}
            {!isLoading && !currentOutput && !pdfUploaded && (
               <p className="text-sm sm:text-base text-muted-foreground">Upload a PDF and interact with it to see the response here.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

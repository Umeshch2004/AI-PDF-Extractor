
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Send, HelpCircle, ClipboardCopy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface QaSectionProps {
  question: string;
  onQuestionChange: (question: string) => void;
  onAskQuestion: () => void;
  answer: string | null;
  isLoading: boolean;
  pdfUploaded: boolean;
}

export default function QaSection({
  question,
  onQuestionChange,
  onAskQuestion,
  answer,
  isLoading,
  pdfUploaded,
}: QaSectionProps) {
  const { toast } = useToast();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (pdfUploaded && question.trim() && !isLoading) {
        onAskQuestion();
      }
    }
  };

  const handleCopy = async () => {
    if (answer) {
      try {
        await navigator.clipboard.writeText(answer);
        toast({
          title: "Copied to Clipboard",
          description: "The AI's answer has been copied.",
        });
      } catch (err) {
        console.error("Failed to copy text: ", err);
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Could not copy the answer to clipboard.",
        });
      }
    }
  };

  return (
    <Card className="flex flex-col shadow-md rounded-lg">
      <CardHeader className="bg-card border-b">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <HelpCircle className="mr-2 h-5 w-5 text-primary" />
          Ask Your Document
        </CardTitle>
        <CardDescription>
          Enter your question below. The AI will answer based on the uploaded PDF.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 p-4 sm:p-6">
        <Textarea
          placeholder={pdfUploaded ? "Type your question here (e.g., What is the main topic?)" : "Please upload a PDF first."}
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-[100px] sm:h-[120px] resize-none text-sm sm:text-base"
          disabled={isLoading || !pdfUploaded}
          aria-label="Question input"
        />
        <Button 
          onClick={onAskQuestion} 
          disabled={isLoading || !pdfUploaded || !question.trim()}
          className="w-full sm:w-44 sm:self-end bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Ask Question
        </Button>
        
        <div className="rounded-md border bg-muted/30 p-3 sm:p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md sm:text-lg font-semibold flex items-center flex-shrink-0">
              <Sparkles className="mr-2 h-5 w-5 text-accent" />
              AI Answer
            </h3>
            {answer && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Copy answer to clipboard"
              >
                <ClipboardCopy className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </div>
          
          <div className="pr-1">
            {isLoading && (
              <div className="flex items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary" />
                <p className="text-sm sm:text-base">Thinking...</p>
              </div>
            )}
            {!isLoading && answer && (
              <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{answer}</p>
            )}
            {!isLoading && !answer && pdfUploaded && (
              <p className="text-sm sm:text-base text-muted-foreground">The AI's answer will appear here once you ask a question.</p>
            )}
            {!isLoading && !answer && !pdfUploaded && (
               <p className="text-sm sm:text-base text-muted-foreground">Upload a PDF and ask a question to see the answer here.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

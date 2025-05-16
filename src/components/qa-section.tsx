
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Send, HelpCircle, ClipboardCopy, FileText, Tags } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface QaSectionProps {
  question: string;
  onQuestionChange: (question: string) => void;
  onAskQuestion: () => void;
  answer: string | null;
  summary: string | null;
  keywords: string[] | null;
  isLoadingAnswer: boolean;
  isLoadingSummary: boolean;
  isLoadingKeywords: boolean;
  onGetSummary: () => void;
  onExtractKeywords: () => void;
  pdfUploaded: boolean;
}

export default function QaSection({
  question,
  onQuestionChange,
  onAskQuestion,
  answer,
  summary,
  keywords,
  isLoadingAnswer,
  isLoadingSummary,
  isLoadingKeywords,
  onGetSummary,
  onExtractKeywords,
  pdfUploaded,
}: QaSectionProps) {
  const { toast } = useToast();
  const isLoading = isLoadingAnswer || isLoadingSummary || isLoadingKeywords;
  
  let currentOutput: string | string[] | null = null;
  let outputType: 'answer' | 'summary' | 'keywords' | null = null;
  let outputTitle = "AI Response";

  if (answer) {
    currentOutput = answer;
    outputType = 'answer';
    outputTitle = "AI Answer";
  } else if (summary) {
    currentOutput = summary;
    outputType = 'summary';
    outputTitle = "Summary";
  } else if (keywords) {
    currentOutput = keywords;
    outputType = 'keywords';
    outputTitle = "Extracted Keywords";
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (pdfUploaded && question.trim() && !isLoadingAnswer) { // Only trigger for ask question on enter
        onAskQuestion();
      }
    }
  };

  const handleCopy = async () => {
    if (currentOutput) {
      let textToCopy = "";
      if (Array.isArray(currentOutput)) {
        textToCopy = currentOutput.join(", ");
      } else {
        textToCopy = currentOutput;
      }
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: "Copied to Clipboard",
          description: `The AI's ${outputType || 'response'} has been copied.`,
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
    <Card className="flex flex-col shadow-md rounded-lg overflow-hidden h-full">
      <CardHeader className="bg-card border-b">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <HelpCircle className="mr-2 h-5 w-5 text-primary" />
          Interact with Your Document
        </CardTitle>
        <CardDescription>
          Ask questions, request a summary, or extract keywords. The AI will respond based on the uploaded PDF.
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
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-2">
          <Button 
            onClick={onExtractKeywords} 
            disabled={isLoading || !pdfUploaded}
            variant="outline"
            className="w-full sm:w-auto"
            size="lg"
          >
            {isLoadingKeywords ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Tags className="mr-2 h-4 w-4" />
            )}
            Extract Keywords
          </Button>
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
        
        <div className="rounded-md border bg-muted/30 p-3 sm:p-4 flex flex-col"> {/* Removed flex-grow and min-h-0 */}
          <div className="flex justify-between items-center mb-2 shrink-0">
            <h3 className="text-md sm:text-lg font-semibold flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-accent" />
              {outputTitle}
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
          
          <div className="overflow-y-auto pr-1"> {/* Removed flex-1, min-h-0, max-h-96. Let content define height. */}
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
             {isLoadingKeywords && (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary" />
                <p className="text-sm sm:text-base">Extracting Keywords...</p>
              </div>
            )}
            {!isLoading && currentOutput && outputType === 'answer' && (
              <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{currentOutput}</p>
            )}
            {!isLoading && currentOutput && outputType === 'summary' && (
              <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{currentOutput}</p>
            )}
            {!isLoading && currentOutput && outputType === 'keywords' && Array.isArray(currentOutput) && (
              <div className="flex flex-wrap gap-2">
                {currentOutput.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
            {!isLoading && !currentOutput && pdfUploaded && (
              <p className="text-sm sm:text-base text-muted-foreground">The AI's response will appear here once you ask a question, request a summary, or extract keywords.</p>
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


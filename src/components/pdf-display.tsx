
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, FileSearch2 } from 'lucide-react'; // Changed Wind to FileSearch2

interface PdfDisplayProps {
  pdfDataUri: string | null;
  fileName: string | null;
}

export default function PdfDisplay({ pdfDataUri, fileName }: PdfDisplayProps) {
  return (
    <Card className="flex-grow flex flex-col h-full shadow-md rounded-lg overflow-hidden">
      <CardHeader className="bg-card border-b">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          {fileName || "Document Viewer"}
        </CardTitle>
        {fileName && <CardDescription>Content of {fileName}</CardDescription>}
         {!fileName && <CardDescription>Upload a PDF to see its content.</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        {pdfDataUri ? (
          <object
            data={pdfDataUri}
            type="application/pdf"
            className="w-full h-full border-0"
            aria-label={fileName || "PDF Document Viewer"}
          >
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
              <p className="text-md sm:text-lg font-medium">PDF preview not available.</p>
              <p className="text-xs sm:text-sm">Your browser may not support displaying this PDF inline, or there was an issue loading it.</p>
              {fileName && <p className="text-xs sm:text-sm mt-2">You can try downloading and opening "{fileName}" directly.</p>}
            </div>
          </object>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
            <FileSearch2 className="w-12 h-12 sm:w-16 sm:h-16 mb-4 text-primary/70" /> {/* Changed icon */}
            <p className="text-md sm:text-lg font-medium">No PDF loaded</p>
            <p className="text-xs sm:text-sm">Please upload a PDF document to view its content and interact with it.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

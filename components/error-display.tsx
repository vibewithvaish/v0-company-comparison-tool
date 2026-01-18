"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <Card className="border-destructive/50 bg-destructive/10 animate-in fade-in-0 shake duration-300">
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">Error</p>
            <p className="text-sm text-destructive/80 mt-1">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

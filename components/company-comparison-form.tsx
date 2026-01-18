"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Loader2, ArrowRight } from "lucide-react";

interface CompanyComparisonFormProps {
  onCompare: (company1: string, company2: string) => Promise<void>;
  isLoading: boolean;
}

export function CompanyComparisonForm({
  onCompare,
  isLoading,
}: CompanyComparisonFormProps) {
  const [company1, setCompany1] = useState("");
  const [company2, setCompany2] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company1.trim() || !company2.trim()) return;
    await onCompare(company1, company2);
  };

  const isFormValid = company1.trim() && company2.trim();

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Compare Companies
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter two company names to get an AI-powered comparison analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company1" className="flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                Company Name 1
              </Label>
              <Input
                id="company1"
                placeholder="e.g., Apple"
                value={company1}
                onChange={(e) => setCompany1(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-background/50 transition-all duration-200 focus:bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company2" className="flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                Company Name 2
              </Label>
              <Input
                id="company2"
                placeholder="e.g., Microsoft"
                value={company2}
                onChange={(e) => setCompany2(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-background/50 transition-all duration-200 focus:bg-background"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full h-12 text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Compare
                <ArrowRight className="size-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

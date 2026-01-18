"use client";

import { useState } from "react";
import { CompanyComparisonForm } from "@/components/company-comparison-form";
import { ComparisonResult } from "@/components/comparison-result";
import { ErrorDisplay } from "@/components/error-display";
import { Zap } from "lucide-react";

interface CompareResponse {
  success: boolean;
  data?: string;
  error?: string;
}

async function fetchComparison(company1: string, company2: string): Promise<CompareResponse> {
  const response = await fetch("/api/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company1, company2 }),
  });
  return response.json();
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [comparedCompanies, setComparedCompanies] = useState<{
    company1: string;
    company2: string;
  } | null>(null);

  const handleCompare = async (company1: string, company2: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setComparedCompanies({ company1, company2 });

    try {
      const response = await fetchComparison(company1, company2);

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || "An unexpected error occurred");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />

        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-12">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-2 mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary">
              <Zap className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">CompareAI</span>
          </div>

          {/* Hero Copy */}
          <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-top-4 duration-500 delay-100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-4">
              AI-Powered Company
              <br />
              <span className="text-muted-foreground">Comparison Tool</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Get instant, comprehensive comparisons of any two companies using
              GPT-4o-mini. Analyze market position, financials, and competitive
              advantages.
            </p>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <CompanyComparisonForm
              onCompare={handleCompare}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        {error && (
          <div className="mt-8">
            <ErrorDisplay message={error} />
          </div>
        )}

        {result && comparedCompanies && (
          <div className="mt-8">
            <ComparisonResult
              result={result}
              company1={comparedCompanies.company1}
              company2={comparedCompanies.company2}
            />
          </div>
        )}

        {/* Feature Highlights */}
        {!result && !error && !isLoading && (
          <div className="mt-16 grid gap-6 md:grid-cols-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
            <FeatureCard
              title="Comprehensive Analysis"
              description="Get detailed insights on market position, financials, and competitive advantages."
            />
            <FeatureCard
              title="Powered by GPT-4o-mini"
              description="Leverages OpenAI's latest model for accurate and nuanced comparisons."
            />
            <FeatureCard
              title="Tabular KPIs"
              description="View key indicators in an easy-to-read table format with clear winners highlighted."
            />
          </div>
        )}
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-border transition-colors duration-300">
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

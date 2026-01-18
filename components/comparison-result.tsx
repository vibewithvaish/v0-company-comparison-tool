"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Building2, Trophy } from "lucide-react";

interface ComparisonResultProps {
  result: string;
  company1: string;
  company2: string;
}

export function ComparisonResult({
  result,
  company1,
  company2,
}: ComparisonResultProps) {
  const sections = parseResultIntoSections(result);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-accent/20">
            <Sparkles className="size-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">
              AI Comparison Results
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3" />
                {company1}
              </span>
              <span className="text-muted-foreground">vs</span>
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3" />
                {company2}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="animate-in fade-in-0 slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {section.title && (
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  {section.title.toLowerCase().includes("winner") ||
                  section.title.toLowerCase().includes("key performance") ? (
                    <Trophy className="size-4 text-accent" />
                  ) : null}
                  {section.title}
                </h3>
              )}
              {section.table ? (
                <ComparisonTable table={section.table} />
              ) : (
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {renderContent(section.content)}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface TableData {
  headers: string[];
  rows: string[][];
}

function ComparisonTable({ table }: { table: TableData }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary/50">
            {table.headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold text-foreground border-b border-border/50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-4 py-3 ${
                    cellIndex === 0
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  } ${
                    cell.toLowerCase().includes("winner") ||
                    (cellIndex === row.length - 1 &&
                      table.headers[cellIndex]?.toLowerCase() === "winner")
                      ? "text-accent font-semibold"
                      : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderContent(content: string) {
  // Handle bullet points and formatting
  return content.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return (
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-accent">•</span>
          <span>{trimmed.substring(2)}</span>
        </div>
      );
    }
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return (
        <span key={i} className="font-semibold text-foreground block">
          {trimmed.slice(2, -2)}
        </span>
      );
    }
    return line ? (
      <span key={i} className="block">
        {line}
      </span>
    ) : (
      <br key={i} />
    );
  });
}

interface Section {
  title?: string;
  content: string;
  table?: TableData;
}

function parseTable(lines: string[]): TableData | null {
  // Find table rows (lines with |)
  const tableLines = lines.filter(
    (line) => line.includes("|") && !line.match(/^\|[-\s|]+\|$/)
  );

  if (tableLines.length < 2) return null;

  const parseRow = (line: string): string[] => {
    return line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);
  };

  const headers = parseRow(tableLines[0]);
  const rows = tableLines.slice(1).map(parseRow);

  // Filter out rows that don't match header length
  const validRows = rows.filter((row) => row.length === headers.length);

  if (headers.length === 0 || validRows.length === 0) return null;

  return { headers, rows: validRows };
}

function parseResultIntoSections(result: string): Section[] {
  const sections: Section[] = [];
  const lines = result.split("\n");
  let currentSection: Section | null = null;
  let currentLines: string[] = [];

  const finalizeSection = () => {
    if (currentSection) {
      // Check if section contains a table
      const tableData = parseTable(currentLines);
      if (tableData) {
        currentSection.table = tableData;
        // Remove table lines from content
        currentSection.content = currentLines
          .filter((line) => !line.includes("|"))
          .join("\n")
          .trim();
      } else {
        currentSection.content = currentLines.join("\n").trim();
      }
      if (currentSection.content || currentSection.table) {
        sections.push(currentSection);
      }
    }
  };

  for (const line of lines) {
    // Check if line is a heading (## or **)
    const headingMatch = line.match(/^##\s*(.+)$/);
    const boldHeadingMatch = line.match(/^\*\*(.+?)\*\*$/);

    if (headingMatch || boldHeadingMatch) {
      finalizeSection();
      currentSection = {
        title: (headingMatch?.[1] || boldHeadingMatch?.[1])
          .replace(/\*\*/g, "")
          .trim(),
        content: "",
      };
      currentLines = [];
    } else if (currentSection) {
      currentLines.push(line);
    } else if (line.trim()) {
      // Content before any heading
      currentSection = { content: "" };
      currentLines = [line];
    }
  }

  finalizeSection();

  return sections;
}

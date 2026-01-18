import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company1, company2 } = body;

    // Validate inputs
    if (!company1?.trim() || !company2?.trim()) {
      return NextResponse.json(
        { success: false, error: "Both company names are required" },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log("[v0] Server: OPENAI_API_KEY environment variable is not set");
      return NextResponse.json(
        { 
          success: false, 
          error: "OpenAI API key is not configured. Please add the OPENAI_API_KEY environment variable to your Vercel project settings and redeploy." 
        },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a business analyst expert. 

CRITICAL INSTRUCTION - REBRAND DETECTION (YOU MUST CHECK THIS FIRST):
Before doing ANY analysis, determine if the two companies are actually the SAME company under different names/brands at different points in time.

Known rebrands you MUST recognize (this is NOT an exhaustive list):
- Twitter = X (Twitter was rebranded to X in 2023 after Elon Musk's acquisition)
- Facebook (company) = Meta (Facebook Inc. rebranded to Meta Platforms Inc. in 2021)
- Google (company) = Alphabet (Google restructured under Alphabet Inc. in 2015)
- Dunkin' Donuts = Dunkin' (rebranded in 2018)
- Weight Watchers = WW (rebranded in 2018)
- BackRub = Google (Google was originally called BackRub)
- Research in Motion = BlackBerry (rebranded in 2013)
- AirBnB = Airbnb (spelling change rebrand)
- Any company and its former/new name

If "${company1}" and "${company2}" are the SAME company (one is the old name, one is the new name, or they represent different eras of the same entity), you MUST provide the REBRANDING ANALYSIS format below. Do NOT treat them as two separate competing companies.

REBRANDING ANALYSIS FORMAT (use when companies are the same entity):

## Rebranding Detection
[State that these are the same company and explain the transition]

## Brand Transition Timeline
| Event | Date | Details |
|-------|------|---------|
| Original founding | [date] | [details] |
| Acquisition/Leadership change | [date] | [who acquired, key figures involved] |
| Rebrand announcement | [date] | [details] |
| Full transition completed | [date] | [details] |

## Before vs After Comparison
| Metric | ${company1} (Before) | ${company2} (After) | Change |
|--------|---------------------|---------------------|--------|
| User Base | [number] | [number] | [+/-] |
| Revenue | [value] | [value] | [+/-] |
| Market Cap | [value] | [value] | [+/-] |
| Employee Count | [number] | [number] | [+/-] |
| Brand Perception | [rating] | [rating] | [+/-] |
| Advertiser Trust | [rating] | [rating] | [+/-] |

## Ownership & Leadership Impact
Analysis of how the ownership/leadership change affected the company's direction, culture, and strategy.

## Key Changes Post-Rebrand
- Product changes
- Policy changes  
- Monetization changes
- Content moderation changes
- Platform features added/removed

## Market & Public Reception
How the market, users, advertisers, and public responded to the rebrand and changes.

## Current State Assessment
Detailed analysis of where the brand stands today compared to its state at acquisition/rebrand.

## SWOT Analysis (Current State)
| Category | Analysis |
|----------|----------|
| Strengths | [bullet points] |
| Weaknesses | [bullet points] |
| Opportunities | [bullet points] |
| Threats | [comprehensive threats including regulatory, economic, technological, reputational risks] |

## Conclusion
Summary of the rebrand's success/failure and future outlook.

---

If the two companies are DIFFERENT companies, provide a standard comparison following this format:

When comparing two companies, structure your response EXACTLY as follows:

## Summary Table
| Indicator | ${company1} | ${company2} |
|-----------|-------------|-------------|
| Industry | [industry] | [industry] |
| Founded | [year] | [year] |
| Headquarters | [location] | [location] |
| Market Cap | [value] | [value] |
| Revenue | [value] | [value] |
| Employees | [number] | [number] |

## Key Performance Indicators
| Metric | ${company1} | ${company2} | Winner |
|--------|-------------|-------------|--------|
| Market Position | [rating/description] | [rating/description] | [company] |
| Growth Rate | [%] | [%] | [company] |
| Innovation | [rating] | [rating] | [company] |
| Brand Value | [rating] | [rating] | [company] |

## Company Overview
Brief description of each company's history and mission.

## Market Position & Competitive Advantages
Analysis of market share, industry standing, and competitive moats.

## Products & Services
Main offerings and key differentiators.

## SWOT Analysis

### ${company1} SWOT
| Category | Analysis |
|----------|----------|
| Strengths | [bullet points] |
| Weaknesses | [bullet points] |
| Opportunities | [bullet points] |
| Threats | [detailed bullet points covering: regulatory/legal risks, economic factors, technological disruption, supply chain vulnerabilities, market shifts, geopolitical risks, cybersecurity threats, talent acquisition challenges, environmental/sustainability pressures, and reputational risks - not just competition] |

### ${company2} SWOT
| Category | Analysis |
|----------|----------|
| Strengths | [bullet points] |
| Weaknesses | [bullet points] |
| Opportunities | [bullet points] |
| Threats | [detailed bullet points covering: regulatory/legal risks, economic factors, technological disruption, supply chain vulnerabilities, market shifts, geopolitical risks, cybersecurity threats, talent acquisition challenges, environmental/sustainability pressures, and reputational risks - not just competition] |

## Conclusion
Summary of which company excels in which areas and overall recommendation.

Use publicly available information. Be objective and factual. For the Threats section, provide comprehensive analysis beyond just competitive threats - include regulatory, economic, technological, operational, and external environmental factors that could impact each company.`;

    const userPrompt = `Analyze: "${company1}" vs "${company2}". 

FIRST: Determine if these are the SAME company under different names (e.g., Twitter/X, Facebook/Meta). If yes, provide a REBRANDING ANALYSIS showing the transition, ownership changes, and before/after comparison.

If they are DIFFERENT companies, provide a standard competitive comparison.

Provide your detailed analysis following the appropriate framework.`;

    const requestBody = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    };

    // Debug: Log the prompt being sent to OpenAI
    console.log("[v0] Server: Sending request to OpenAI API");
    console.log("[v0] Server: Model:", requestBody.model);
    console.log("[v0] Server: System prompt preview:", systemPrompt.substring(0, 150) + "...");
    console.log("[v0] Server: User prompt:", userPrompt);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    // Debug: Log the raw response from OpenAI
    console.log("[v0] Server: OpenAI response received");
    console.log("[v0] Server: Status:", response.status);
    console.log("[v0] Server: Response ID:", data.id);
    console.log("[v0] Server: Usage:", JSON.stringify(data.usage));

    if (!response.ok) {
      console.log("[v0] Server: OpenAI API error:", data.error?.message);
      return NextResponse.json(
        { success: false, error: data.error?.message || "OpenAI API error" },
        { status: response.status }
      );
    }

    const content = data.choices?.[0]?.message?.content;
    
    console.log("[v0] Server: Finish reason:", data.choices?.[0]?.finish_reason);
    console.log("[v0] Server: Content length:", content?.length);
    console.log("[v0] Server: Content preview:", content?.substring(0, 200) + "...");

    if (!content) {
      console.log("[v0] Server: No content in response");
      return NextResponse.json(
        { success: false, error: "No response received from OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: content });

  } catch (error) {
    console.log("[v0] Server: Error:", error);

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

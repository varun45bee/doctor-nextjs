/**
 * RAG Semantic Retriever for Clinic Knowledge
 * Performs fast keyword, n-gram, and BM25-like scoring over verified documents.
 */

import { CLINIC_KNOWLEDGE_DOCUMENTS, type KnowledgeDocument } from "./knowledgeBase.ts";

export interface RetrievalResult {
  document: KnowledgeDocument;
  score: number;
  matchedKeywords: string[];
}

/**
 * Tokenizes text into normalized stems/terms for matching
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Retrieves the most relevant clinic knowledge documents for a given query.
 * @param query User's query string
 * @param limit Maximum number of documents to return (default: 2)
 * @param minScore Minimum relevance threshold to avoid irrelevant noise
 */
export function retrieveClinicKnowledge(
  query: string,
  limit: number = 2,
  minScore: number = 1.5
): RetrievalResult[] {
  if (!query || typeof query !== "string") return [];

  const queryTerms = tokenize(query);
  const queryLower = query.toLowerCase();

  if (queryTerms.length === 0) return [];

  const results: RetrievalResult[] = [];

  for (const doc of CLINIC_KNOWLEDGE_DOCUMENTS) {
    let score = 0;
    const matchedKeywords: string[] = [];

    // 1. Exact multi-word keyword phrase match (Highest weight)
    for (const kw of doc.keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 3.5;
        matchedKeywords.push(kw);
      }
    }

    // 2. Individual term overlap in keywords
    const docKwTerms = doc.keywords.flatMap((k) => tokenize(k));
    for (const term of queryTerms) {
      if (docKwTerms.includes(term)) {
        score += 1.2;
      }
    }

    // 3. Term overlap in document title
    const titleTerms = tokenize(doc.title);
    for (const term of queryTerms) {
      if (titleTerms.includes(term)) {
        score += 1.5;
      }
    }

    // 4. Term frequency in content body
    const contentTerms = tokenize(doc.content);
    let contentHits = 0;
    for (const term of queryTerms) {
      if (contentTerms.includes(term)) {
        contentHits++;
      }
    }
    score += Math.min(contentHits * 0.4, 2.0);

    if (score >= minScore) {
      results.push({
        document: doc,
        score,
        matchedKeywords: Array.from(new Set(matchedKeywords)),
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}

/**
 * Formats retrieved knowledge documents for injection into the LLM system prompt.
 */
export function formatRetrievedKnowledgeForPrompt(query: string): string {
  const matches = retrieveClinicKnowledge(query, 2, 2.0);

  if (matches.length === 0) {
    return "";
  }

  const sections = matches.map((m, idx) => {
    return `[SOURCE ${idx + 1}: ${m.document.title}]\n${m.document.content}`;
  });

  return `\n============================================================\nVERIFIED CLINIC KNOWLEDGE (GROUND TRUTH):\nUse the following verified facts to answer the user's question accurately. Do not invent contradictory policies or details.\n\n${sections.join("\n\n")}\n============================================================\n`;
}

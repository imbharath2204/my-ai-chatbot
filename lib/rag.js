import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function loadDocs() {
  const files = await fs.readdir('docs');
  const docs = [];

  for (const file of files) {
    const text = await fs.readFile(path.join('docs', file), 'utf8');
    docs.push({ file, text });
  }

  return docs;
}

export async function embedText(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });

  return response.data[0].embedding;
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export async function buildContext(query) {
  const docs = await loadDocs();
  const queryVec = await embedText(query);

  const scored = [];
  for (const doc of docs) {
    const docVec = await embedText(doc.text);
    scored.push({ ...doc, score: cosineSimilarity(queryVec, docVec) });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((d) => `FILE: ${d.file}\n${d.text}`)
    .join('\n\n');
}
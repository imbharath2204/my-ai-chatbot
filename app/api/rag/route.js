import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildContext } from '../../../lib/rag';

const openai = new OpenAI();

export async function POST(req) {
  try {
    const { message } = await req.json();
    const context = await buildContext(message);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Answer only from the provided context. If the answer is missing, say you do not know.'
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${message}`
        }
      ]
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'RAG route failed.' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Answer using only general knowledge.' },
        { role: 'user', content: message }
      ]
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'LLM route failed.' }, { status: 500 });
  }
}
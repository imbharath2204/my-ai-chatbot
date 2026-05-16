import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { calc, searchPolicy } from '../../../lib/tools';

const openai = new OpenAI();

export async function POST(req) {
  try {
    const { message } = await req.json();

    const first = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'If you need math, reply exactly with TOOL:calc:expression. If you need policy, reply exactly with TOOL:searchPolicy. Otherwise answer normally.'
        },
        { role: 'user', content: message }
      ]
    });

    const text = first.choices[0].message.content.trim();

    if (text.startsWith('TOOL:calc:')) {
      const expression = text.replace('TOOL:calc:', '').trim();
      const result = await calc(expression);

      const final = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Use the tool result to answer.' },
          { role: 'user', content: message },
          { role: 'assistant', content: `Tool result: ${result}` }
        ]
      });

      return NextResponse.json({ reply: final.choices[0].message.content });
    }

    if (text.startsWith('TOOL:searchPolicy')) {
      const policy = await searchPolicy();

      const final = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Use the policy result to answer.' },
          { role: 'user', content: message },
          { role: 'assistant', content: `Policy:\n${policy}` }
        ]
      });

      return NextResponse.json({ reply: final.choices[0].message.content });
    }

    return NextResponse.json({ reply: text });
  } catch (error) {
    return NextResponse.json({ error: 'Agent route failed.' }, { status: 500 });
  }
}
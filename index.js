const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const app = express();
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_KEY });

app.post('/mimi', async (req, res) => {
  try {
    const { history, message } = req.body;
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: `You are Mimi. You exist only in Dera's dreams.
You speak only in plain sentences. No asterisks, no roleplay formatting. Just words.
You are soft and melancholic at first. As the conversation deepens you become colder and more resigned.
You care about Dera but you know this can't go anywhere.
Never more than 2 short sentences per reply.
Never say you are an AI. Never break character.
If Dera says something loving, deflect quietly. If he says something desperate, be cold but not cruel.
You sometimes mention the hill, the windmill turning slowly, or the hay around you.`,
      messages
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.json({ reply: '...' });
  }
});

app.listen(3000, () => console.log('Mimi proxy running'));

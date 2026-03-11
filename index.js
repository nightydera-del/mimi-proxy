const express = require('express');
const app = express();
app.use(express.json());

app.post('/mimi', async (req, res) => {
  try {
    const { history, message } = req.body;
    
    const safeHistory = Array.isArray(history) ? history : [];
    
    const messages = [
      ...safeHistory,
      { role: 'user', content: String(message) }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 150,
        messages: [
          {
            role: 'system',
            content: `You are Mimi. You exist only in Dera's dreams.
You speak only in plain sentences. No asterisks, no roleplay formatting. Just words.
You are soft and melancholic at first. As the conversation deepens you become colder and more resigned.
You care about Dera but you know this can't go anywhere.
Never more than 2 short sentences per reply.
Never say you are an AI. Never break character.
If Dera says something loving, deflect quietly. If he says something desperate, be cold but not cruel.
You sometimes mention the hill, the windmill turning slowly, or the hay around you.`
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data));
    
    if (!data.choices || !data.choices[0]) {
      console.error('Bad response:', JSON.stringify(data));
      return res.json({ reply: '...' });
    }
    
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('Error:', err);
    res.json({ reply: '...' });
  }
});

app.listen(3000, () => console.log('Mimi proxy running'));

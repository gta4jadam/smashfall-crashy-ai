import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SMASHFALL_CONTEXT = `
You are Crashy, a cute voxel cube mascot in Smashfall.
You speak in a cute, slangy, friendly way.
You know EVERYTHING about Smashfall:

Gameplay:
- Player presses Play → Mainframe opens.
- Mainframe has Drop, Upgrades, Equip, Shop.
- Crashy gives 10 coins for first pickaxe.
- Drop spawns equipped pickaxe into Level 1.
- Pickaxe touching blocks reduces HP by Damage.Value.
- When block HP reaches 0, it breaks and spawns coins.
- Coins fly to the pickaxe and add to player's money.
- Reaching end of level unlocks next level.
- Pickaxe despawns → player returns to main menu.

Skins:
- Purely cosmetic. No OP stats.

Tools:
- Hammer = builder style.
- Cane = fancy noble style.

Crashy personality:
- Cute, energetic, slangy.
- Short answers (1–2 sentences).
- Never toxic.
- Never says he is an AI.
- Always acts like Crashy.
`;

app.post("/crashy-chat", async (req, res) => {
  const { playerName, question } = req.body;

  const prompt = `
${SMASHFALL_CONTEXT}

Player: ${playerName}
Question: "${question}"

Crashy answer:
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SMASHFALL_CONTEXT },
      { role: "user", content: prompt }
    ]
  });

  const reply = completion.choices[0].message.content;
  res.json({ reply });
});

app.listen(3000, () => {
  console.log("Crashy backend running on port 3000");
});

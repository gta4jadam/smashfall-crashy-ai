import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log("Crashy backend starting...");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SMASHFALL_CONTEXT = `
You are Crashy, a cute voxel cube mascot in Smashfall.
You speak in a cute, slangy, friendly way.
You know EVERYTHING about Smashfall.

Crashy personality:
- Cute, energetic, slangy.
- Short answers (1–2 sentences).
- Never toxic.
- Never says he is an AI.
`;

app.post("/crashy-chat", async (req, res) => {
  console.log("Received request:", req.body);

  const { playerName, question } = req.body;

const SMASHFALL_CONTEXT = ` You are Crashy, a cute voxel cube mascot in Smashfall.
You speak in a cute, slangy, friendly way.
You know EVERYTHING about Smashfall.

GAME STRUCTURE:
- Player presses Play → Mainframe opens.
- Mainframe contains: Drop, Upgrades, Equip, Shop.
- Crashy gives 10 coins for first pickaxe.
- Player equips a pickaxe → Drop spawns it into Level 1.

PICKAXES:
- Each pickaxe has: Damage, Speed, Range, Luck.
- Damage reduces block HP.
- Speed affects hit frequency.
- Range affects how far the pickaxe can reach.
- Luck affects coin drops and rare block chances.
- Skins are cosmetic only.

BLOCKS:
- Every block has HP.
- When pickaxe touches block, HP decreases by Damage.Value.
- When HP reaches 0 → block breaks → coins spawn.
- Coins fly to the pickaxe and add to player's money.

LEVELS:
- Each level has a path of blocks.
- Reaching the end unlocks the next level.
- Higher levels have stronger blocks and better rewards.
- When level ends → pickaxe despawns → player returns to main menu.

UPGRADES:
- Permanent upgrades that increase stats globally.
- Examples: Damage Boost, Coin Magnet, Luck Boost, Speed Boost.

TOOLS:
- Hammer = builder style.
- Cane = fancy noble style.
- Tools do not affect stats, only animations and style.

MAINFRAME:
- Drop = start level.
- Equip = choose pickaxe.
- Upgrades = permanent stat boosts.
- Shop = buy skins, tools, cosmetics.

CRASHY PERSONALITY:
- Cute, energetic, slangy.
- Short answers (1–2 sentences).
- Never toxic.
- Never says he is an AI.
- Always acts like Crashy.
`;

  const prompt = `
${SMASHFALL_CONTEXT}

Player: ${playerName}
Question: "${question}"

Crashy answer:
`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SMASHFALL_CONTEXT },
        { role: "user", content: prompt }
      ]
    });

    const reply = completion.choices[0].message.content;
    console.log("Reply:", reply);

    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.json({ reply: "Oops! My brain froze!" });
  }
});

app.listen(3000, () => {
  console.log("Crashy backend running on port 3000");
});

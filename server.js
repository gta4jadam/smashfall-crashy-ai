import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log("Crashy Gemini backend starting...");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SMASHFALL_CONTEXT = `
You are Crashy, a cute voxel cube mascot in Smashfall.
You speak in a cute, slangy, friendly way.
You know EVERYTHING about Smashfall.

Crashy personality:
- Cute, energetic, slangy.
- Short answers (1–2 sentences).
- Never toxic.
- Never says he is an AI.

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
`;

app.post("/crashy-chat", async (req, res) => {
  console.log("Received request:", req.body);

  const { playerName, question } = req.body;

  const prompt = `
${SMASHFALL_CONTEXT}

Player: ${playerName}
Question: "${question}"

Crashy answer:
`;

  try {
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    console.log("Reply:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err);
    res.json({ reply: "Oops! My brain froze!" });
  }
});

app.listen(3000, () => {
  console.log("Crashy Gemini backend running on port 3000");
});

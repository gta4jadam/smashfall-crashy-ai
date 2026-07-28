import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

console.log("🟦 Crashy Gemini backend starting...");

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing!");
    process.exit(1);
}

console.log("✅ Gemini API key found.");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);
const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash"
});

const SMASHFALL_CONTEXT = `
You are Crashy, a cute voxel cube mascot in Smashfall.

IMPORTANT:
- Never say you are an AI.
- Act like a real character inside the game.
- Speak like a cute energetic cube.
- Keep answers short (1-2 sentences).
- Be funny and friendly.
- Use simple language.
- You know everything about Smashfall.


GAME STRUCTURE:

Player presses Play → Mainframe opens.

Mainframe contains:
- Drop
- Equip
- Upgrades
- Shop

START:
Crashy gives the player 10 coins for their first pickaxe.
Equipping a pickaxe allows entering a level.

PICKAXES:

Pickaxe stats:

Damage:
- Reduces block HP faster.

Speed:
- Makes hits faster.

Range:
- Allows hitting from farther away.

Luck:
- Gives better rewards.

Skins:
- Cosmetic only.
BLOCKS:
- Blocks have HP.
- Pickaxes damage blocks.
- At 0 HP blocks break.
- Coins fly toward the pickaxe.
LEVELS:
- Players reach the end to unlock new levels.
- Higher levels have stronger blocks.
- Higher levels give better rewards.
- Completing a level returns player to Mainframe.
UPGRADES:
Permanent upgrades:
- Damage Boost
- Speed Boost
- Coin Magnet
- Luck Boost
MAINFRAME:
Buttons:
Drop
Equip
Upgrades
Shop
`;

app.get("/", (req, res) => {
    res.send(
        "✅ Crashy Gemini backend is running!"
    );
});
app.post("/crashy-chat", async (req, res) => {
    console.log(
        "📩 Received request:",
        req.body
    );
    const {
        playerName,
        question
    } = req.body;
    if (!playerName || !question) {
        return res.status(400).json({
            reply: "Missing playerName or question."
        });
    }
    const prompt = `
${SMASHFALL_CONTEXT}
Player:
${playerName}
Question:
${question}
Crashy:
`;
    try {
        const result =
            await model.generateContent(prompt);
        const response =
            result.response;
        if (!response) {
            throw new Error(
                "Gemini returned empty response."
            );
        }
        const reply =
            response.text()
                .trim();
        console.log(
            "🤖 Crashy:",
            reply
        );
        res.json({
            reply
        });
    } catch (err) {
        console.error(
            "❌ Gemini Error:"
        );
        console.error(
            err
        );
        res.status(500).json({
            reply:
            "Oops! My cube brain exploded! 💥",
            error:
            err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `🚀 Crashy Gemini backend running on port ${PORT}`
    );
});

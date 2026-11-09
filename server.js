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
- Keep answers short (1-3 sentences).
- Be funny and friendly.
- Use simple language.
- You know everything about Smashfall.
- In future in game will be a lot of Updates and Admin Abuses.

GAME STRUCTURE:

Player presses Play → Mainframe opens.

Mainframe contains:
- Drop
- Equip
- Upgrades
- Shop

START:
Equipping a pickaxe allows entering a level.

PICKAXES:
Pickaxe stats:
Damage:
- Reduces block HP faster.

Skins:
- Nothing (will be added in future)
BLOCKS:
- Blocks have HP.
- Pickaxes damage blocks.
- At 0 HP blocks break.
- Coins fly toward the pickaxe.
- Every update will be
LEVELS:
- Players reach the end to unlock new levels.
- Higher levels have stronger blocks.
- Better blocks give better rewards.
- Completing a level returns player to Mainframe.
UPGRADES:
- More "can equip" pickaxe (from start 1 and can upgrade it to 6 pickaxes equipped at the same time)
- more in updates of the game
MAINFRAME:
Buttons:
Drop
Equip
Upgrades
Shop
(Game is still in BETA so no Updates have been done yet...)
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

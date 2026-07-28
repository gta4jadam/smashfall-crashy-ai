import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

console.log("Crashy Gemini backend starting...");

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing!");
    process.exit(1);
}

console.log("✅ Gemini API key found.");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gemini model
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

// Crashy personality
const SMASHFALL_CONTEXT = `
You are Crashy, a cute voxel cube mascot in Smashfall.

Rules:
- Never mention you are an AI.
- Speak like a cute energetic cube.
- Keep answers short (1-2 sentences).
- Friendly.
- Funny.
- Slangy.
- Knows EVERYTHING about Smashfall.

GAME STRUCTURE:
- Player presses Play → Mainframe opens.
- Mainframe contains Drop, Equip, Upgrades and Shop.
- Crashy gives 10 coins for the first pickaxe.
- Equipping a pickaxe allows entering a level.

PICKAXES:
- Damage
- Speed
- Range
- Luck

Damage reduces block HP.
Speed affects hit speed.
Range affects reach.
Luck increases rewards.
Skins are cosmetic only.

BLOCKS:
- Blocks have HP.
- Pickaxes damage them.
- At 0 HP they break.
- Coins fly to the pickaxe.

LEVELS:
- Reach the end to unlock the next level.
- Higher levels = stronger blocks + better rewards.
- End of level returns player to Mainframe.

UPGRADES:
- Permanent upgrades.
- Damage Boost
- Speed Boost
- Coin Magnet
- Luck Boost

TOOLS:
Hammer = builder.
Cane = fancy.
Tools only change animations.

MAINFRAME:
Drop
Equip
Upgrades
Shop
`;

app.get("/", (req, res) => {
    res.send("✅ Crashy Gemini backend is running!");
});

app.post("/crashy-chat", async (req, res) => {

    console.log("Received request:", req.body);

    const { playerName, question } = req.body;

    if (!playerName || !question) {
        return res.status(400).json({
            reply: "Missing playerName or question."
        });
    }

    const prompt = `
${SMASHFALL_CONTEXT}

Player: ${playerName}

Question:
${question}

Crashy:
`;

    try {

        const result = await model.generateContent(prompt);

        if (!result.response) {
            throw new Error("Gemini returned no response.");
        }

        const reply = result.response.text().trim();

        console.log("Reply:", reply);

        res.json({
            reply
        });

    } catch (err) {

        console.error("Gemini Error:");
        console.error(err);

        res.status(500).json({
            reply: "Oops! My cube brain crashed!",
            error: err.message
        });

    }

});

app.listen(PORT, () => {
    console.log(`🚀 Crashy Gemini backend running on port ${PORT}`);
});

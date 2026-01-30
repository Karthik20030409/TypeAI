const express = require("express");
const { getRandomSentence, applyDifficulty } = require("../utils/WordGenerator");

const router = express.Router();

router.get("/generate", async (req, res) => {
  try {
    const level = req.query.level || "easy";

    const sentence = await getRandomSentence();
    const finalText = applyDifficulty(sentence, level);

    res.json({
      success: true,
      level,
      text: finalText,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to generate text",
    });
  }
});

module.exports = router;

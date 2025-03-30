const express = require("express");
const router = express.Router();
const { sendEmail } = require("../services/emailService");

router.post("/send", async (req, res) => {
    const { email, code } = req.body;
    const result = await sendEmail(email, code);
    res.json(result);
});

module.exports = router;
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const otpStore = {}; // ✅ Temporary store for OTPs

// ✅ Route to Send OTP
app.post("/send-otp", async (req, res) => {
    const { phoneNumber } = req.body; 

    if (!phoneNumber) {
        return res.status(400).json({ success: false, message: "Phone number is required!" });
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[phoneNumber] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Store OTP for 5 minutes

        await client.messages.create({
            body: `Your OTP code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber 
        });

        res.status(200).json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
    }
});

// ✅ Route to Verify OTP
app.post("/verify-otp", (req, res) => {
    const { phoneNumber, enteredOtp } = req.body;

    if (!phoneNumber || !enteredOtp) {
        return res.status(400).json({ success: false, message: "Phone number and OTP are required!" });
    }

    const otpData = otpStore[phoneNumber];

    if (!otpData) {
        return res.status(400).json({ success: false, message: "No OTP sent to this number!" });
    }

    if (Date.now() > otpData.expiresAt) {
        return res.status(400).json({ success: false, message: "OTP expired! Please request a new one." });
    }

    if (otpData.otp !== parseInt(enteredOtp, 10)) {
        return res.status(400).json({ success: false, message: "Invalid OTP. Try again!" });
    }

    delete otpStore[phoneNumber]; // ✅ Remove OTP after successful verification
    res.status(200).json({ success: true, message: "OTP verified successfully!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

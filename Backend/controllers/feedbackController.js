const nodemailer = require("nodemailer");
const Feedback = require("../models/Feedback");

// Feedback Email Handler
exports.sendFeedback = async (req, res) => {
  const { name, email, rating, like, improve } = req.body;

  if (!improve || !improve.trim()) {
    return res.status(400).json({ message: "Improvement field is required" });
  }

  // Save to database
  try {
    await Feedback.create({
      name: name || "Anonymous",
      email: email || "",
      rating: rating ? Number(rating) : undefined,
      like: like || "",
      improve,
    });
  } catch (dbErr) {
    console.error("❌ Failed to save feedback to DB:", dbErr);
    // Don't block the response — still try to send email
  }

  // Setup transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email content
  const feedbackHtml = `
    <h2>📩 New Feedback Received</h2>
    <p><strong>Name:</strong> ${name || "Anonymous"}</p>
    <p><strong>Email:</strong> ${email || "Not provided"}</p>
    <p><strong>Rating:</strong> ${rating || "N/A"}</p>
    <p><strong>Liked:</strong> ${like || "N/A"}</p>
    <p><strong>Suggestions to Improve:</strong> ${improve || "N/A"}</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "guptajhansi23@gmail.com",
      subject: "📝 New Feedback from BuyNBlast",
      html: feedbackHtml,
    });

    console.log("📨 Feedback email sent successfully.");
    res.status(200).json({ message: "Feedback sent successfully!" });
  } catch (err) {
    console.error("❌ Email sending error:", err);
    // Feedback was already saved to DB, so return success
    res.status(200).json({ message: "Feedback saved successfully!" });
  }
};

// Get all feedback (admin only)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

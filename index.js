const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  const msg = {
    to,
    from: process.env.FROM_EMAIL, // Must be a verified sender
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('SendGrid email service is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

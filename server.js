// =================================================================
// 1. IMPORT NECESSARY PACKAGES
// =================================================================
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// =================================================================
// 2. SETUP EXPRESS APP AND MIDDLEWARE
// =================================================================
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =================================================================
// 3. CONFIGURE NODEMAILER (REUSABLE FOR ALL ROUTES)
// =================================================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

// =================================================================
// 4. DEFINE API ROUTES (ENDPOINTS)
// =================================================================

// --- ROUTE 1: FOR THE FREE COUNSELLING FORM ---
// This route is already working perfectly. No changes needed here.
app.post('/submit-form', async (req, res) => {
    console.log('Counselling form data received:', req.body);
    const { fullName, address, email, countryCode, phone, studyDestination, level, proficiencyTest } = req.body;

    if (!fullName || !email || !phone || !studyDestination) {
        return res.status(400).send('Missing required fields.');
    }

    const mailOptions = {
        from: `"Enquiry Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        replyTo: email,
        subject: `Free Counselling Inquiry from ${fullName}`,
        html: `<h2>New Free Counselling Inquiry</h2><p>Details:</p><ul><li><strong>Full Name:</strong> ${fullName}</li><li><strong>Email:</strong> ${email}</li><li><strong>Address:</strong> ${address}</li><li><strong>Phone:</strong> ${countryCode} ${phone}</li><li><strong>Destination:</strong> ${studyDestination}</li><li><strong>Level:</strong> ${level}</li><li><strong>Test:</strong> ${proficiencyTest}</li></ul>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Thank you! Your inquiry has been sent successfully.');
    } catch (error) {
        console.error('Error sending counselling email:', error);
        res.status(500).send('An error occurred while sending your message. Please try again.');
    }
});


// --- ROUTE 2: FOR THE NEW CONTACT US FORM ---
// This is the new block of code you are adding.
app.post('/send-contact-email', async (req, res) => {
    console.log('Contact form data received:', req.body);

    // Destructure data from the contact form
    const { firstName, lastName, email, subject, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
        return res.status(400).send('Please fill out all required fields.');
    }

    // Create the email content for the contact form
    const mailOptions = {
        from: `"Enquiry Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        replyTo: email, // Set the "reply-to" to the user's email
        subject: `Contact Form Message: ${subject}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p>From: <strong>${firstName} ${lastName}</strong></p>
            <p>Email: <strong>${email}</strong></p>
            <hr>
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
        `,
    };

    // Send the email using the same transporter
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Message sent successfully! Thank you for reaching out.');
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).send('An error occurred while sending your message.');
    }
});


// =================================================================
// 5. START THE SERVER
// =================================================================
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});

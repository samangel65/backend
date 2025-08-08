// =================================================================
// 1. IMPORT PACKAGES
// =================================================================
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer'); // <-- 1. IMPORT MULTER
require('dotenv').config();

// =================================================================
// 2. SETUP EXPRESS APP
// =================================================================
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer(); // <-- 2. INITIALIZE MULTER

// Use built-in Express body parsers for JSON and URL-encoded data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =================================================================
// 3. CONFIGURE NODEMAILER (REUSABLE)
// =================================================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

// =================================================================
// 4. API ROUTES (ENDPOINTS)
// =================================================================

// --- ROUTE 1: FOR THE "START NOW" (FREE COUNSELLING) FORM ---
// <-- 3. ADD "upload.none()" MIDDLEWARE
app.post('/submit-form', upload.none(), async (req, res) => {
    console.log('Counselling form data received:', req.body); // This will now work correctly

    const { fullName, address, email, countryCode, phone, studyDestination, level, proficiencyTest } = req.body;
    if (!fullName || !email || !phone) { return res.status(400).send('Missing required fields.'); }
    const mailOptions = {
        from: `"Enquiry Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        replyTo: email,
        subject: `Free Counselling Inquiry from ${fullName}`,
        html: `<h2>New Free Counselling Inquiry</h2><ul><li><strong>Full Name:</strong> ${fullName}</li><li><strong>Email:</strong> ${email}</li><li><strong>Address:</strong> ${address}</li><li><strong>Phone:</strong> ${countryCode} ${phone}</li><li><strong>Destination:</strong> ${studyDestination}</li><li><strong>Level:</strong> ${level}</li><li><strong>Test:</strong> ${proficiencyTest}</li></ul>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Thank you! Your inquiry has been sent successfully.');
    } catch (error) {
        console.error('Error sending counselling email:', error);
        res.status(500).send('An error occurred while sending your message.');
    }
});

// --- ROUTE 2: FOR THE "CONTACT US" FORM ---
// <-- 3. ADD "upload.none()" MIDDLEWARE
app.post('/send-contact-email', upload.none(), async (req, res) => {
    console.log('Contact form data received:', req.body);

    const { firstName, lastName, email, subject, message } = req.body;
    if (!firstName || !email || !subject || !message) { return res.status(400).send('Missing required fields.'); }
    const mailOptions = {
        from: `"Enquiry Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        replyTo: email,
        subject: `Contact Form Message: ${subject}`,
        html: `<h2>New Contact Form Submission</h2><p>From: <strong>${firstName} ${lastName}</strong></p><p>Email: <strong>${email}</strong></p><hr><h3>Message:</h3><p style="white-space: pre-wrap;">${message}</p>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Message sent successfully! Thank you for reaching out.');
    } catch (error)
    {
        console.error('Error sending contact email:', error);
        res.status(500).send('An error occurred while sending your message.');
    }
});

// --- ROUTE 3: FOR THE NEW BOOKING FORM (WITH CALENDAR) ---
// <-- 3. ADD "upload.none()" MIDDLEWARE
app.post('/book-counselling', upload.none(), async (req, res) => {
    console.log('Booking form data received:', req.body);

    const { fullName, emailAddress, phoneNumber, studyDestination, selectedDate, selectedTime, timezone } = req.body;
    if (!fullName || !emailAddress || !phoneNumber || !selectedDate || !selectedTime) {
        return res.status(400).send('Missing required fields from booking form.');
    }
    const mailOptions = {
        from: `"Booking Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        replyTo: emailAddress,
        subject: `New Online Counselling Booking from ${fullName}`,
        html: `
            <h2>New Online Counselling Booking Request</h2>
            <p>You have received a new booking with the following details:</p>
            <ul>
                <li><strong>Full Name:</strong> ${fullName}</li>
                <li><strong>Email:</strong> ${emailAddress}</li>
                <li><strong>Phone Number:</strong> ${phoneNumber}</li>
                <li><strong>Preferred Destination:</strong> ${studyDestination}</li>
                <li><strong>Booking Date:</strong> ${selectedDate}</li>
                <li><strong>Booking Time:</strong> ${selectedTime}</li>
                <li><strong>Client Timezone:</strong> ${timezone}</li>
            </ul>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Booking successful! We will be in touch shortly.');
    } catch (error) {
        console.error('Error sending booking email:', error);
        res.status(500).send('An error occurred while confirming your booking.');
    }
});

// =================================================================
// 5. START THE SERVER
// =================================================================
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});

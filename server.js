// =================================================================
// 1. IMPORT NECESSARY PACKAGES
// =================================================================
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser'); // You had this in your package.json, so let's use it
require('dotenv').config(); // Allows us to use environment variables from a .env file

// =================================================================
// 2. SETUP EXPRESS APP AND MIDDLEWARE
// =================================================================
const app = express();
const PORT = process.env.PORT || 3000; // Use port from hosting service or 3000 locally

// Middleware should be declared only ONCE at the top
app.use(cors()); // Allows your frontend to communicate with this backend
app.use(bodyParser.urlencoded({ extended: true })); // Helps parse data from your HTML form
app.use(bodyParser.json()); // Helps parse data if it's sent as JSON

// =================================================================
// 3. CONFIGURE NODEMAILER (EMAIL SENDER)
// =================================================================
// We create the transporter object once and reuse it in all our routes.
// IMPORTANT: For this to work, you must set these environment variables in Render.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail "App Password"
    },
});

// =================================================================
// 4. DEFINE API ROUTES (ENDPOINTS)
// =================================================================

// --- THIS IS THE ENDPOINT FOR YOUR COUNSELLING FORM ---
app.post('/submit-form', async (req, res) => {
    console.log('Counselling form data received:', req.body);

    // Destructure the data from your specific form
    const {
        fullName,
        address,
        email,
        countryCode,
        phone,
        studyDestination,
        level,
        proficiencyTest,
    } = req.body;

    // Basic validation
    if (!fullName || !email || !phone || !studyDestination) {
        return res.status(400).send('Missing required fields.');
    }

    // Define the email content
    const mailOptions = {
        from: `"Enquiry Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL, // The email where you want to receive the form data
        replyTo: email, // This makes it easy to reply directly to the user
        subject: `Free Counselling Inquiry from ${fullName}`,
        html: `
            <h2>New Free Counselling Inquiry</h2>
            <p>You have received a new inquiry with the following details:</p>
            <ul>
                <li><strong>Full Name:</strong> ${fullName}</li>
                <li><strong>Email Address:</strong> ${email}</li>
                <li><strong>Address:</strong> ${address}</li>
                <li><strong>Phone Number:</strong> ${countryCode} ${phone}</li>
                <li><strong>Planning to Study In:</strong> ${studyDestination}</li>
                <li><strong>Interested Level:</strong> ${level}</li>
                <li><strong>Proficiency Test:</strong> ${proficiencyTest}</li>
            </ul>
        `,
    };

    // Send the email and respond to the frontend
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        // You can redirect to a thank-you page or just send a success message
        res.status(200).send('Thank you! Your inquiry has been sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('An error occurred while sending your message. Please try again.');
    }
});


// =================================================================
// 5. START THE SERVER
// =================================================================
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});

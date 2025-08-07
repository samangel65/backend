// server.js

// 1. Import necessary packages
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // To use environment variables from .env file

// 2. Setup Express App
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Allow the server to understand JSON data

// 4. Create an API endpoint for booking
app.post('/book-counselling', async (req, res) => {
    // Destructure the data from the request body
    const { fullName, emailAddress, phoneNumber, studyDestination, selectedDate, selectedTime, timezone } = req.body;

    // Basic validation
    if (!fullName || !emailAddress || !selectedDate || !selectedTime) {
        return res.status(400).send('Missing required fields.');
    }

    // 5. Configure Nodemailer to send email
    // IMPORTANT: Use environment variables for your email credentials
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or your email provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Use a Gmail "App Password" here, not your regular password
        },
    });

    // 6. Define the email content
    const mailOptions = {
        from: `"Nexus Enquiry Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL, // Your email where you want to receive enquiries
        subject: `New Counselling Booking from ${fullName}`,
        html: `
            <h2>New Counselling Request</h2>
            <p>You have received a new booking request with the following details:</p>
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

    // 7. Send the email and respond to the frontend
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Booking successful! We will be in touch shortly.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('An error occurred while sending the message. Please try again.');
    }
});

// 3. Middleware (already there)
app.use(cors());
app.use(express.json());

// --- YOUR EXISTING /book-counselling ENDPOINT STAYS HERE ---
app.post('/book-counselling', async (req, res) => {
    // ... all the code for the counselling form is here ...
    // ... NO CHANGES NEEDED IN THIS BLOCK ...
    const { fullName, emailAddress, phoneNumber, studyDestination, selectedDate, selectedTime, timezone } = req.body;
    if (!fullName || !emailAddress || !selectedDate || !selectedTime) {
        return res.status(400).send('Missing required fields.');
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: `"Nexus Enquiry Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: `New Counselling Booking from ${fullName}`,
        html: `
            <h2>New Counselling Request</h2>
            <p>You have received a new booking request with the following details:</p>
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
        console.error('Error sending email:', error);
        res.status(500).send('An error occurred while sending the message. Please try again.');
    }
});


// --- ADD THIS NEW ENDPOINT FOR THE CONTACT FORM ---
app.post('/send-contact-email', async (req, res) => {
    // Destructure data from the contact form
    const { firstName, lastName, email, subject, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
        return res.status(400).send('Please fill out all required fields.');
    }

    // Use the same Nodemailer transporter configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Create the email content for the contact form submission
    const mailOptions = {
        from: `"${firstName} ${lastName}" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        replyTo: email, // Set the "reply-to" to the user's email
        subject: `Contact Form: ${subject}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p>You have received a new message from your website's contact form:</p>
            <ul>
                <li><strong>From:</strong> ${firstName} ${lastName}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Subject:</strong> ${subject}</li>
            </ul>
            <hr>
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
        `,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Message sent successfully! Thank you for reaching out.');
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).send('An error occurred while sending your message.');
    }
});


// 8. Start the server (already there)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
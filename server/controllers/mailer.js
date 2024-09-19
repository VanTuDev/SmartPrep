import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import ENV from '../config.js';

// Cấu hình cho Nodemailer
let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true cho cổng 465, false cho các cổng khác
    auth: {
        user: ENV.EMAIL, // tài khoản email được tạo từ Ethereal
        pass: ENV.PASSWORD, // mật khẩu cho tài khoản Ethereal
    }
};

// Tạo transporter cho Nodemailer
let transporter = nodemailer.createTransport(nodeConfig);

// Tạo Mailgen để tạo nội dung email
let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
});

/**
 * Hàm gửi email đăng ký
 * @param req - Yêu cầu từ client
 * @param res - Phản hồi đến client
 */
export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    // Kiểm tra giá trị email
    if (!userEmail) {
        return res.status(400).send({ error: "Email is required." });
    }

    // Tạo nội dung email
    var email = {
        body: {
            name: username,
            intro: text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    var emailBody = MailGenerator.generate(email);

    // Tạo thông điệp email
    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    };

    // Gửi email
    try {
        await transporter.sendMail(message);
        return res.status(200).send({ msg: "You should receive an email from us." });
    } catch (error) {
        console.error("Error sending email:", error); // In ra lỗi để kiểm tra
        return res.status(500).send({ error: `Failed to send email: ${error.message}` });
    }
};

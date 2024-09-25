import UserModel from '../models/User.model.js'; // Ensure the correct path
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { EMAILJS_CONFIG } from '../config.js';
import otpGenerator from 'otp-generator';
import emailjs from 'emailjs-com'; // EmailJS for sending OTP

/** Đăng ký người dùng */
export async function register(req, res) {
   const { username, password, email, phone, role } = req.body;

   try {
      // Kiểm tra email đã tồn tại
      const existEmail = await UserModel.findOne({ email });
      if (existEmail) return res.status(400).send({ error: "Email already in use." });

      // Kiểm tra username đã tồn tại
      const existUsername = await UserModel.findOne({ username });
      if (existUsername) return res.status(400).send({ error: "Username already in use." });

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({ username, password: hashedPassword, email, phone, role });
      await user.save();

      return res.status(201).send({ msg: "User registered successfully!" });
   } catch (error) {
      return res.status(500).send({ error: "Error during registration." });
   }
}

/** Đăng nhập người dùng */
export async function login(req, res) {
   const { username, password } = req.body;

   try {
      const user = await UserModel.findOne({ username });
      if (!user) return res.status(404).send({ error: "Username not found." });

      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) return res.status(400).send({ error: "Incorrect password." });

      const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res.status(200).send({ msg: "Login successful!", token });
   } catch (error) {
      return res.status(500).send({ error: "Login error." });
   }
}

/** Gửi OTP qua email */
export const generateOTP = async (req, res) => {
   const { email } = req.body;

   if (!email) return res.status(400).send({ error: "Email is required." });

   const user = await UserModel.findOne({ email });
   if (!user) return res.status(404).send({ error: "User not found." });

   const otp = otpGenerator.generate(6, { digits: true });
   req.app.locals.OTP = otp; // Lưu OTP vào bộ nhớ tạm thời

   // Gửi OTP qua EmailJS
   const templateParams = {
      to_email: email,
      otp: otp,
      to_name: user.username,
   };

   emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams, EMAILJS_CONFIG.USER_ID)
      .then(() => {
         return res.status(200).send({ msg: "OTP sent to your email." });
      })
      .catch(error => {
         console.error("Error sending OTP:", error);
         return res.status(500).send({ error: "Error sending OTP." });
      });
};

/** Xác minh OTP */
export const verifyOTP = async (req, res) => {
   const { code } = req.body;

   if (req.app.locals.OTP && req.app.locals.OTP === code) {
      req.app.locals.resetSession = true; // Bắt đầu phiên reset mật khẩu
      return res.status(200).send({ msg: 'OTP verified successfully!' });
   }
   return res.status(400).send({ error: 'Invalid OTP' });
};

/** Reset mật khẩu */
export const resetPassword = async (req, res) => {
   if (!req.app.locals.resetSession) return res.status(440).send({ error: 'Session expired!' });

   const { email, password } = req.body;
   const user = await UserModel.findOne({ email });
   if (!user) return res.status(404).send({ error: 'User not found.' });

   user.password = await bcrypt.hash(password, 10);
   await user.save();
   req.app.locals.resetSession = false; // Kết thúc phiên reset
   return res.status(200).send({ msg: 'Password reset successfully!' });
};

/** Tạo phiên reset mật khẩu */
export const createResetSession = (req, res) => {
   if (req.app.locals.resetSession) {
      return res.status(200).send({ flag: req.app.locals.resetSession });
   }
   return res.status(440).send({ error: "Session expired!" });
};

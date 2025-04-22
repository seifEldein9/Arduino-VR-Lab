import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/TraditionalUser.js'; 
import nodemailer from 'nodemailer';
import crypto from 'crypto';  

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'winwininsurance2@gmail.com',  
    pass: 'ucdl ydtp rifa ityb',   
  },
});

const sendEmail = async (email, code) => {
  const mailOptions = {
    from: 'winwininsurance2@gmail.com',   
    to: email,
    subject: 'إعادة تعيين كلمة المرور',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
        <h2 style="text-align: center; color: #4CAF50;">إعادة تعيين كلمة المرور</h2>
        <p>مرحبًا،</p>
        <p>لقد طلبت إعادة تعيين كلمة المرور لحسابك.</p>
        <p style="text-align: center; font-size: 18px; color: #555;">
          رمز إعادة تعيين كلمة المرور الخاص بك هو:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; background-color: #f8f8f8; padding: 10px 20px; font-size: 20px; font-weight: bold; color: #333; border: 1px solid #ddd; border-radius: 5px;">
            ${code}
          </span>
        </div>
        <p>يرجى استخدام هذا الرمز في غضون ساعة واحدة لتحديث كلمة المرور الخاصة بك.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 14px; text-align: center; color: #888;">
          إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('تم إرسال البريد الإلكتروني بنجاح');
  } catch (error) {
    console.error('حدث خطأ أثناء إرسال البريد الإلكتروني:', error);
  }
};

 router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "كلمة المرور مطلوبة" });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    return res.status(400).json({ message: "المستخدم موجود بالفعل" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  await user.save();
  res.status(201).json({ message: "تم إنشاء الحساب بنجاح" });
});

 router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ message: "البريد الإلكتروني أو رقم الهاتف وكلمة المرور مطلوبان" });
  }

   const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!user) {
    return res.status(400).json({ message: "المستخدم غير موجود" });
  }

   const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "كلمة المرور غير صحيحة" });
  }

   const token = jwt.sign(
    { userId: user._id, name: user.name, email: user.email , phone: user.phone },
    'secret_key',
    { expiresIn: '1h' }
  );

   res.status(200).json({
    message: "تم تسجيل الدخول بنجاح",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
});
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  
  if (!token) {
    return res.status(401).json({ message: "التوكن غير موجود" });
  }

  jwt.verify(token, 'secret_key', async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "التوكن غير صالح" });
    }
    req.userId = decoded.userId;   
    next();
  });
};

 router.get('/profile', verifyToken, async (req, res) => {
  try {
     const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

     res.status(200).json({
      message: "تم العثور على بيانات المستخدم",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: "حدث خطأ أثناء استرجاع البيانات" });
  }
});






router.put('/update-profile', verifyToken, async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "جميع الحقول مطلوبة" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;

    await user.save();
    res.status(200).json({ message: "تم تحديث بيانات الحساب بنجاح", user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث الحساب" });
  }
});



router.put('/change-password', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "كلمة المرور القديمة والجديدة مطلوبة" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

     const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "كلمة المرور القديمة غير صحيحة" });
    }

     const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: "حدث خطأ أثناء تغيير كلمة المرور" });
  }
});
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

     const resetCode = Math.floor(1000 + Math.random() * 9000);  
    const expiryTime = Date.now() + 3600000;  

     user.resetPasswordCode = resetCode.toString();  
    user.resetPasswordExpires = expiryTime;

     await user.save();

     await sendEmail(user.email, resetCode);

    res.status(200).json({ message: 'تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' });
  } catch (error) {
    console.error('Error in /forgot-password:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء معالجة الطلب' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

   const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'المستخدم غير موجود' });
  }

   if (user.resetPasswordCode !== resetCode || user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: 'الرمز غير صحيح أو منتهي الصلاحية' });
  }

   const hashedPassword = await bcrypt.hash(newPassword, 10);

   user.password = hashedPassword;
  user.resetPasswordCode = undefined;   
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'تم تغيير كلمة المرور بنجاح' });
});

router.post('/verify-reset-code', async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    console.log('Reset Code in DB:', user.resetPasswordCode);
    console.log('Reset Code Expiry:', user.resetPasswordExpires);
    console.log('Reset Code from Request:', resetCode);

     if (
      !user.resetPasswordCode ||
      user.resetPasswordCode !== resetCode ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: 'الرمز غير صحيح أو منتهي الصلاحية' });
    }

    res.status(200).json({ message: 'الرمز صحيح' });
  } catch (error) {
    console.error('Error in /verify-reset-code:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء التحقق من الرمز' });
  }
});
 router.get('/userss', async (req, res) => {
  try {
     const users = await User.find({}, { password: 0 });  
    res.status(200).json({ message: 'تم جلب جميع المستخدمين بنجاح', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المستخدمين' });
  }
});



export default router;

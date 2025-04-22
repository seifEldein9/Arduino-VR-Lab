import express from "express";
import productrequest from "../models/productrequest.js"; // تأكد من المسار الصحيح

const router = express.Router();

// إنشاء طلب منتج جديد
router.post("/add", async (req, res) => {
  try {
    const { name, email, phone, ProductTitle, Productprice } = req.body;

    // التحقق من القيم المطلوبة

    // إضافة الطلب بدون التحقق من التكرار
    const newRequest = new productrequest({
      name,
      email,
      phone,
      ProductTitle,
      Productprice,
    });

    // حفظ الطلب في قاعدة البيانات
    await newRequest.save();

    res
      .status(201)
      .json({ message: "Product request added successfully", newRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// جلب جميع الطلبات
router.get("/", async (req, res) => {
  try {
    const requests = await productrequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;

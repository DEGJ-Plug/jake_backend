const Product = require("../models/product.model");
const cloudinary = require("../../utils/cloudinary");

const addProduct = async (req, res) => {
  const { userId } = req.user;
  const { productName, productDescription, quantity, price } = req.body;
  const { image1, image2, image3, image4 } = req.files;
  try {
    if (!productName || !productDescription || !quantity || !price)
      throw new Error(
        "product name, description, quantity, price are required"
      );
    if (!req.files) throw new Error("Four (4) images must be added!");

    const [resultImg1, resultImg2, resultImg3, resultImg4] = await Promise.all([
      cloudinary.uploader.upload(image1[0].path),
      cloudinary.uploader.upload(image2[0].path),
      cloudinary.uploader.upload(image3[0].path),
      cloudinary.uploader.upload(image4[0].path),
    ]);

    const newProduct = await Product.create({
      productName,
      productDescription,
      quantity,
      price,
      img1: resultImg1.secure_url,
      img1PublicId: resultImg1.public_id,
      img2: resultImg2.secure_url,
      img2PublicId: resultImg2.public_id,
      img3: resultImg3.secure_url,
      img3PublicId: resultImg3.public_id,
      img4: resultImg4.secure_url,
      img4PublicId: resultImg4.public_id,
      userId,
    });

    return res
      .status(201)
      .json({ message: "product added successfully", newProduct });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = addProduct;

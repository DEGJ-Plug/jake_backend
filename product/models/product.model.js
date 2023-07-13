const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      enum: ["electronics", "cosmetics", "clothing", "furniture", "others"],
    },
    img1: {
      type: String,
      required: true,
    },
    img1PublicId: {
      type: String,
      required: true,
    },
    img2: {
      type: String,
      required: true,
    },
    img2PublicId: {
      type: String,
      required: true,
    },
    img3: {
      type: String,
      required: true,
    },
    img3PublicId: {
      type: String,
      required: true,
    },
    img4: {
      type: String,
      required: true,
    },
    img4PublicId: {
      type: String,
      required: true,
    },
    like: {
      type: Boolean,
      default: false,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    logisticsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

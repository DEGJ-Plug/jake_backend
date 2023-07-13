const { Router } = require('express');
const upload = require('../../utils/multer');
const validToken = require('../../user/middlewares/tokenCookie');
const {
  addProduct,
  getProducts,
  getProduct,
  getProductByGenre,
} = require('../controllers/product.controller');
const sellerAuth = require('../../user/middlewares/sellerAuth');

const productRouter = Router();

productRouter.post(
  '/new',
  validToken,
  sellerAuth,
  upload.fields([
    { name: 'image1' },
    { name: 'image2' },
    { name: 'image3' },
    { name: 'image4' },
  ]),
  addProduct,
);

productRouter.get('/all', getProducts);
productRouter.get('/one/:id', getProduct);
productRouter.get('/all/:genre', getProductByGenre);

module.exports = productRouter;

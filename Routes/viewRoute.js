const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

// const CSP = 'Content-Security-Policy';
// const POLICY =
//   "connect-src 'self' http://127.0.0.1:3000/api/v1/users/login;" +
//   "base-uri 'self';block-all-mixed-content ;" +
//   "font-src 'self' https: data:;" +
//   "frame-ancestors 'self';" +
//   "img-src http://localhost:3000 'self' blob: data:;" +
//   "object-src 'none';" +
//   "script-src https: cdn.jsdelivr.net cdnjs.cloudflare.com api.mapbox.com 'self' blob: ;" +
//   "script-src-elem https: cdn.jsdelivr.net cdnjs.cloudflare.com js.stripe.com 'self' blob: ;" +
//   "script-src-attr 'none';" +
//   "style-src 'self' https: 'unsafe-inline';" +
//   'upgrade-insecure-requests';

// const router = express.Router();

// router.use((req, res, next) => {
//   res.setHeader(CSP, POLICY);
//   next();
// });

const router = express.Router();

// Rendering Page From The Browser

router.use(authController.isLoggedIn);
// router.use;

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;

var express = require('express');
var router = express.Router();

const userController = require("../controllers/user.controllers");
const controller = require("../controllers/review.controllers");

router.get('/all', controller.showAll);

router.get('/create', userController.isAuthenticated, controller.showCreate);

router.get('/view/:id', controller.showSolo)

router.post('/', userController.isAuthenticated, controller.createReview);

router.get('/popular',controller.showPopular)
module.exports = router;

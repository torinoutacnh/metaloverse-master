const router = require("express").Router();
const auth = require("../middleware/auth");
const priceCtrl = require("../controllers/priceCtrl");

router.get("/price", priceCtrl.getPrice);

router.post("/setprice", priceCtrl.setPrice);

module.exports = router;

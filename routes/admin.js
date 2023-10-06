const express = require('express');
const router = express.Router();
const {adminAuth} = require('../Auth/auth')
const registerController = require('../controllers/adminControllers/registerController')
const dataController = require("../controllers/adminControllers/dataController")
const actionController = require('../controllers/adminControllers/actionController')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST LOGIN. */
router.post('/login',registerController.login)

/* GET DASHBOARD DATA. */
router.get('/dashboardData',adminAuth,dataController.dashboardData)

/* GET USER DATA. */
router.get('/allusers',adminAuth,dataController.allusers)

/* GET USER DATA. */
router.get('/allposts',adminAuth,dataController.allposts)

/* GET BLOCK USER. */
router.get('/blockuser/:id',adminAuth,actionController.blockUser)

/* GET DELETE POST. */
router.get('/deletepost/:id',adminAuth,actionController.deletePost)

/* GET VISITORS INFO. */
router.get('/visitors',adminAuth,dataController.visitors)

module.exports = router;

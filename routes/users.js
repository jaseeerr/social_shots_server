var express = require('express');
var router = express.Router();
const actionController = require('../controllers/userControllers/actionController')
const dataController = require('../controllers/userControllers/dataController')
const verificationController = require('../controllers/userControllers/verificationController')
const userProfileController = require('../controllers/userControllers/userProfileController')
const registerController = require('../controllers/userControllers/registerController')
const auth = require('../Auth/auth')




/* POST SIGN UP. */
router.post('/signup',registerController.signup)

/* POST LOGIN. */
router.post('/login',registerController.login)

/* POST GOOGLE LOGIN. */
router.post('/glogin',registerController.glogin)

/* GET CHECK USERNAME. */
router.get('/checkusername/:id',userProfileController.checkUsername)

/* POST FORGOT PASSWORD. */
router.post('/forgotPassword',verificationController.forgotPassword) 

/* POST SENT MAIL FOR PASSWORD CHANGE. */
router.post('/resetPassword',userProfileController.resetPassword) 

/* GET VERIFY EMAIL. */
router.get('/verifyuser/:id',verificationController.verifyuser)

/* GET UPDATE LINK EMAIL. */
router.get('/verifyemail/:id',verificationController.verifyemail)

/* GET SENT OTP. */
router.get('/sentotp/:id',auth.userAuth,verificationController.sentOtp)

/* GET VERIFY OTP. */
router.get('/verifyotp',auth.userAuth,verificationController.verifyOtp)

/* GET SUGGESTED. */
router.get('/suggested',auth.userAuth,dataController.newUsers)

/* GET USERDATA. */
router.get('/profile/:id',auth.userAuth,dataController.getUserdata)

/* GET MY DATA. */
router.get('/myData',auth.userAuth,dataController.myData)

/* GET MY POSTS. */
router.get('/posts/:id',auth.userAuth,dataController.getMyPosts)


/* GET ONE POST. */
router.get('/getOnePost/:id',auth.userAuth,dataController.getOnePost)


/* GET UPDATE DP. */
router.get('/updatedp/:id',auth.userAuth,userProfileController.updateDp)

/* GET UPDATE USERNAME. */
router.get('/updateusername/:id',auth.userAuth,userProfileController.updateUsername)

/* GET UPDATE EMAIL. */
router.get('/update_email/:id',auth.userAuth,userProfileController.updateEmail)

/* GET UPDATE BIO. */
router.get('/updatebio/:id',auth.userAuth,userProfileController.updatebio)

/* GET UPDATE AC TYPE. */
router.get('/updateactype/:id',auth.userAuth,userProfileController.updateactype)

/* GET FOLLOW. */
router.get('/follow/:id',auth.userAuth,actionController.follow)

/* GET UNFOLLOW. */
router.get('/unfollow/:id',auth.userAuth,actionController.unfollow)

/* GET SEARCH USERNAME. */
router.get('/search',auth.userAuth,actionController.search)

/* GET ALL POSTS. */
router.get('/allPosts',auth.userAuth,dataController.getAllPosts)


/* POST UPLOAD NEW POST. */
router.post('/uploadpost',auth.userAuth,actionController.uploadPost)

/* GET REPORT POST. */
router.get('/report/:id',auth.userAuth,actionController.reportPost)

/* GET DELETE POST. */
router.get('/deletepost/:id',auth.userAuth,actionController.deletePost)

/* GET DELETE POST. */
router.get('/myfeed',auth.userAuth,dataController.myFeed)

/* GET LIKE POST. */
router.get('/like/:id',auth.userAuth,actionController.likePost)

/* GET UNLIKE POST. */
router.get('/unlike/:id',auth.userAuth,actionController.unlikePost)

/* POST VIEW SHORTLIST. */
router.post('/shortlist',auth.userAuth,dataController.shortList)

/* POST VIEW SHORTLIST. */
router.post('/shortlist1',auth.userAuth,dataController.shortList1)

/* POST ADD NEW COMMENT. */
router.post('/comment',auth.userAuth,actionController.comment)

/* POST DELETE COMMENT. */
router.post('/deletecomment',auth.userAuth,actionController.deletecomment) 

/* GET CHAT LIST. */
router.get('/chatlist',auth.userAuth,dataController.getChatList) 

/* GET CHAT. */
router.get('/getChat/:id',auth.userAuth,dataController.getChat) 

/* GET CHAT LIST. */
router.get('/reportAccount/:id',auth.userAuth,userProfileController.reportAccount) 





module.exports = router;

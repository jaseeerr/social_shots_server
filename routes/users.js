var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const auth = require('../Auth/auth')


/* GET HOME PAGE. */
router.get('/test',userController.test)

/* GET HOME PAGE. */
router.get('/',userController.home)


/* POST SIGN UP. */
router.post('/signup',userController.signup)

/* POST LOGIN. */
router.post('/login',userController.login)

/* POST GOOGLE LOGIN. */
router.post('/glogin',userController.glogin)

/* GET CHECK USERNAME. */
router.get('/checkusername/:id',userController.checkUsername)



/* GET VERIFY EMAIL. */
router.get('/verifyuser/:id',userController.verifyuser)

/* GET UPDATE LINK EMAIL. */
router.get('/verifyemail/:id',userController.verifyemail)

/* GET SENT OTP. */
router.get('/sentotp/:id',auth.userAuth,userController.sentOtp)

/* GET VERIFY OTP. */
router.get('/verifyotp',auth.userAuth,userController.verifyOtp)

/* GET USERDATA. */
router.get('/profile/:id',auth.userAuth,userController.getUserdata)

/* GET MY DATA. */
router.get('/myData',auth.userAuth,userController.myData)

/* GET MY POSTS. */
router.get('/posts/:id',auth.userAuth,userController.getMyPosts)


/* GET ONE POST. */
router.get('/getOnePost/:id',auth.userAuth,userController.getOnePost)


/* GET UPDATE DP. */
router.get('/updatedp/:id',auth.userAuth,userController.updateDp)

/* GET UPDATE USERNAME. */
router.get('/updateusername/:id',auth.userAuth,userController.updateUsername)

/* GET UPDATE EMAIL. */
router.get('/update_email/:id',auth.userAuth,userController.updateEmail)

/* GET UPDATE BIO. */
router.get('/updatebio/:id',auth.userAuth,userController.updatebio)

/* GET UPDATE AC TYPE. */
router.get('/updateactype/:id',auth.userAuth,userController.updateactype)

/* GET FOLLOW. */
router.get('/follow/:id',auth.userAuth,userController.follow)

/* GET UNFOLLOW. */
router.get('/unfollow/:id',auth.userAuth,userController.unfollow)

/* GET SEARCH USERNAME. */
router.get('/search',auth.userAuth,userController.search)

/* GET ALL POSTS. */
router.get('/allPosts',auth.userAuth,userController.getAllPosts)


/* POST UPLOAD NEW POST. */
router.post('/uploadpost',auth.userAuth,userController.uploadPost)

/* GET REPORT POST. */
router.get('/report/:id',auth.userAuth,userController.reportPost)

/* GET DELETE POST. */
router.get('/deletepost/:id',auth.userAuth,userController.deletePost)

/* GET DELETE POST. */
router.get('/myfeed',auth.userAuth,userController.myFeed)

/* GET LIKE POST. */
router.get('/like/:id',auth.userAuth,userController.likePost)

/* GET UNLIKE POST. */
router.get('/unlike/:id',auth.userAuth,userController.unlikePost)

/* POST VIEW SHORTLIST. */
router.post('/shortlist',auth.userAuth,userController.shortList)

/* POST VIEW SHORTLIST. */
router.post('/shortlist1',auth.userAuth,userController.shortList1)

/* POST VIEW SHORTLIST. */
router.post('/comment',auth.userAuth,userController.comment)

/* POST VIEW SHORTLIST. */
router.post('/deletecomment',auth.userAuth,userController.deletecomment)




module.exports = router;

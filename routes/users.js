var express = require('express');
var router = express.Router();
const actionController = require('../controllers/userControllers/actionController')
const dataController = require('../controllers/userControllers/dataController')
const verificationController = require('../controllers/userControllers/verificationController')
const userProfileController = require('../controllers/userControllers/userProfileController')
const registerController = require('../controllers/userControllers/registerController')
const auth = require('../Auth/auth')



/* GET TEST */
router.post('/test101',registerController.test)

/* POST USERINFO */
router.post('/visitors',dataController.visitors)

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

/* POST DELETE EXPIRED STORIES. */
router.post('/expiredstories',auth.userAuth,actionController.expiredstories)

/* GET ADD STORY VIEW. */
router.get('/storyview/:id',auth.userAuth,actionController.storyview)

/* GET FOLLOW. */
router.get('/follow/:id',auth.userAuth,actionController.follow)

/* GET Accept Request. */
router.get('/accept/:id',auth.userAuth,actionController.acceptRequest)

/* GET Decline Request. */
router.get('/decline/:id',auth.userAuth,actionController.declineRequest)

/* GET UNFOLLOW. */
router.get('/unfollow/:id',auth.userAuth,actionController.unfollow)

/* GET SEARCH USERNAME. */
router.get('/search',auth.userAuth,actionController.search)

/* GET ALL POSTS. */
router.get('/allPosts',auth.userAuth,dataController.getAllPosts)

/* GET STORIES. */
router.get('/getstories',auth.userAuth,dataController.getStories)

/* POST UPLOAD NEW POST. */
router.post('/uploadpost',auth.userAuth,actionController.uploadPost)

/* POST UPLOAD NEW STORY. */
router.post('/uploadstory',auth.userAuth,actionController.uploadStory)

/* GET REPORT POST. */
router.get('/report/:id',auth.userAuth,actionController.reportPost)

/* GET NOTIFY COUNT. */
router.get('/notifyCount',auth.userAuth,dataController.notifyCount)

/* GET Message COUNT. */
router.get('/messageCount',auth.userAuth,dataController.messageCount)

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

/* POST MESSAGE SEEN. */
router.post('/mark-messages-as-seen',auth.userAuth,actionController.markSeen) 

/* GET NOTIFICATION. */
router.get('/getNotification',auth.userAuth,dataController.getNotification) 





module.exports = router;

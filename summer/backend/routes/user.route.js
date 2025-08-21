
import express from "express";
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register, getFollowers, getFollowing, searchUsers } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.get('/:id/followers', getFollowers);

// Route to get following of a user
router.get('/:id/following', getFollowing);
router.get('/search', searchUsers);


export default router;

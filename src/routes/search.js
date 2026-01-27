import express from "express";
import { explorePosts, searchUser } from "../controllers/searchController";

const router = express.Router();

router.get("/users", searchUser);
router.get("/explore", explorePosts);

export default router;

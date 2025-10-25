import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  toggleLike,
  updatePost,
} from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.route("/").post(verifyToken, createPost);
postRouter.route("/").get(verifyToken, getAllPosts);
postRouter.route("/:id").get(verifyToken, getPostById);
postRouter.route("/:id").put(verifyToken, updatePost);
postRouter.route("/:id").delete(verifyToken, deletePost);
postRouter.route("/:id/like").post(verifyToken, toggleLike);

export default postRouter;

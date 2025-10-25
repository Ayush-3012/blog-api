import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createComment,
  deleteComment,
  getCommentByPost,
  updateComment,
} from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.route("/").post(verifyToken, createComment);
commentRouter.route("/posts/:postId").get(verifyToken, getCommentByPost);
commentRouter.route("/:id").put(verifyToken, updateComment);
commentRouter.route("/:id").delete(verifyToken, deleteComment);

export default commentRouter;

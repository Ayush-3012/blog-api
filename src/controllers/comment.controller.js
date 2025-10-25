import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";

export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    if (!content || !postId || typeof content !== "string")
      return res.status(404).json({ message: "Missing Data" });

    const foundPost = await Post.findById(postId);
    if (!foundPost) return res.status(404).json({ message: "Post not found" });

    const newComment = new Comment({
      content,
      author: req.userId,
      post: foundPost._id,
    });

    await newComment.save();
    return res
      .status(201)
      .json({ message: "Comment created", comment: newComment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCommentByPost = async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.postId);
    if (!foundPost) return res.status(404).json({ message: "Post not found" });

    const allComments = await Comment.find({ post: foundPost._id });
    return res.status(200).json(allComments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const foundComment = await Comment.findById(req.params.id);
    if (!foundComment)
      return res.status(404).json({ message: "Comment not found" });

    const userId = req.userId;
    if (foundComment.author.toString() !== userId.toString())
      return res
        .status(401)
        .json({ message: "Not authorized to update comment" });

    const { content } = req.body;
    if (!content)
      return res.status(404).json({ message: "Comment is missing" });

    await Comment.findByIdAndUpdate(
      foundComment._id,
      { content },
      { new: true }
    );
    return res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const foundComment = await Comment.findById(req.params.id);
    if (!foundComment)
      return res.status(404).json({ message: "Comment not found" });

    const userId = req.userId;
    if (foundComment.author.toString() !== userId.toString())
      return res
        .status(401)
        .json({ message: "Not authorized to delete comment" });

    await Comment.findByIdAndDelete(foundComment._id);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

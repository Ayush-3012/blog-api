import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (
      !title ||
      !content ||
      !tags ||
      !Array.isArray(tags) ||
      tags.length === 0
    )
      return res.status(404).json({ message: "Missing fields" });

    const newPost = new Post({
      title,
      content,
      tags,
      author: req.userId,
    });

    await newPost.save();
    return res.status(201).json({ message: "Post Created Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({}).populate("author", "name email");
    return res.status(200).json(allPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id);
    if (!foundPost) return res.status(404).json({ message: "Post not found" });

    return res.status(200).json({ message: "Found Post", foundPost });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id);
    if (!foundPost) return res.status(404).json({ message: "Post not found" });

    const userId = req.userId;
    if (foundPost.author.toString() !== userId.toString())
      return res
        .status(401)
        .json({ message: "Not authorized to update the post" });

    const updates = req.body;
    await Post.findByIdAndUpdate(foundPost._id, updates);

    return res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id);
    if (!foundPost) return res.status(404).json({ message: "Post not found" });

    const userId = req.userId;
    const foundUser = await User.findById(userId);
    const isAdmin = foundUser.role === "admin";

    if (!isAdmin && foundPost.author.toString() !== userId.toString())
      return res
        .status(401)
        .json({ message: "Not authorized to delete this task" });

    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id);
    if (!foundPost) return res.status(404).json({ message: "Post not found" });

    const userId = req.userId;
    const isLiked = foundPost.likes.some((id) => id.toString() === userId);
    isLiked ? foundPost.likes.pull(userId) : foundPost.likes.push(userId);

    await foundPost.save();
    return res.status(200).json({
      message: isLiked ? "Disliked" : "Liked",
      likesCount: foundPost.likes.count,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

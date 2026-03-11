const Post = require("../model/post.model");
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");

exports.createPost = async (req, res) => {
  try {
    const { title, category, excerpt, content, author, image } = req.body;
    if (!title || !category || !excerpt || !content || !author || !image) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const upload = await cloudinary.uploader.upload(image, {
      folder: "blog_posts",
    });
    const post = await Post.create({
      title,
      slug: slugify(title, { lower: true }),
      category,
      excerpt,
      content,
      author,
      image: {
        url: upload.secure_url,
        public_id: upload.public_id,
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("CREATE POST ERROR:", err); 
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL POSTS ================= */
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET SINGLE POST ================= */
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE POST ================= */
exports.updatePost = async (req, res) => {
  try {
    const { title, category, excerpt, content, author, image } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ✅ Update image if new base64 image is sent
    if (image) {
      await cloudinary.uploader.destroy(post.image.public_id);

      const upload = await cloudinary.uploader.upload(image, {
        folder: "blog_posts",
      });

      post.image = {
        url: upload.secure_url,
        public_id: upload.public_id,
      };
    }

    post.title = title;
    post.slug = slugify(title, { lower: true });
    post.category = category;
    post.excerpt = excerpt;
    post.content = content;

    // ✅ author string update
    post.author = author;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE POST ================= */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await cloudinary.uploader.destroy(post.image.public_id);
    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

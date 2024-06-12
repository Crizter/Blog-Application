import Blog from "../models/blog.models.js";
import express from "express";
import {
  getAllBlogs,
  singleBlog,
  getSingleBlog,
  deleteBlog,
  createBlog,
  updateBlog,
} from "../controllers/blog.js";
const router = express.Router();

// Create a new blog post
router.get("/create", (req, res) => {
  res.render("../views/createBlog.ejs", { title: "Create Blog" });
});
router.post("/create", createBlog);

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await getAllBlogs(); // Call the function to get all blogs
    res.render("../views/allBlogs.ejs", { blogs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Define the route handler for getting a single blog post
router.get("/:id", async (req, res) => {
  try {
    const blog = await singleBlog(req, res);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.render("../views/singleBlog.ejs", { title: blog.title, blog });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get single  blog post for update
router.get('/:id/update', async(req,res) => { 
    try {
        console.log('Fetching the blog with id : ', req.params.id);
        await getSingleBlog(req,res);
    } catch (error) {
        console.error("Error fetching blogs: ", error); 
        res.status(500).send('Internal Server Error');
    }
})
// Route to handle the update blog post
router.post("/:id/update", async(req,res) => { 
    try {
        console.log('Updating the blog with id : ', req.params.id);
        await updateBlog(req,res);
    } catch (error) {     
        console.error('Error updating blog:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete the blog post
router.delete('/:id', async(req,res) =>{ 
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if(!blog) {
      return res.status(404).send('Blog not found');
    }
    res.redirect('/blogs');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting the blog post');
  }
})
export default router;

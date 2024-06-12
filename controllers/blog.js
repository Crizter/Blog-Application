import express from "express";
import Blog from "../models/blog.models.js";


// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(); // Use find() to get all blogs
    // res.render('allBlogs', { title: 'All Blogs', blogs });
    return blogs;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Get a single blog
const singleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      // If the blog is not found, send a 404 response immediately
      return res.status(404).send("Blog not found");
    }
    // If the blog is found, return the blog
    return blog;
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    await blog.remove();
    res.status(200).json("Blog removed successfully");
  } catch (error) {
    console.error(error);
    res.status(404).send("Blog not found");
  }
};

// Create a blog
const createBlog = async (req, res) => {
  try {
    const { title, description, content } = req.body;
    // Check if all fields are filled
    if (
      req.body.title === null ||
      req.body.description === null ||
      req.body.content === null
    ) {
      res.status(400).json({ message: "All fields are required" });
    }

    const blog = new Blog({ title, description, content });
    await blog.save();
    // Redirect to the allBlogs page
    res.redirect("/blogs");
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Update a blog
 const updateBlog = async (req, res) => {
    try {
      const { title, description, content } = req.body;
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).send("Blog not found");
      }
      blog.title = title;
      blog.description = description;
      blog.content = content;
      await blog.save();
      res.render('../views/singleBlog.ejs', {title: blog.title, blog});
    } catch (error) {
      console.error(error);
      res.status(400).send("Error updating blog");
    }
  };
  
// get a single blog for updating
export const getSingleBlog = async (req,res) => { 
    
    try {
        console.log('getSingleBlog: req.params.id =', req.params.id);
        const blog = await  Blog.findById(req.params.id);
        if(!blog) {
            return res.status(404).send('Blog not found');
        }
        res.render('../views/updateBlog.ejs', {title : 'Update Blog', blog});
    } catch (error) {
        console.error('Error in getSingleBlog:', error);
        res.status(500).send('Internal Server Error');
    }
    

}

export { getAllBlogs, singleBlog, deleteBlog, createBlog, updateBlog };

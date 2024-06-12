// Import the necessary modules and dependencies for testing
const request = require('supertest');
const app = require('../app'); // Assuming this is your main Express app file
const Blog = require('../models/blog.models');

describe('PUT /blog/:id', () => {
  it('should update the blog post and return the updated post', async () => {
    // Create a new blog post
    const newBlog = new Blog({
      title: 'Test Blog',
      content: 'This is a test blog post',
    });
    await newBlog.save();

    // Make a PUT request to update the blog post
    const response = await request(app)
      .put(`/blog/${newBlog._id}`)
      .send({ title: 'Updated Test Blog' });

    // Assert the response status code and the updated blog post
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Test Blog');
  });

  it('should return 404 if the blog post is not found', async () => {
    // Make a PUT request with an invalid blog post ID
    const response = await request(app)
      .put('/blog/invalid-id')
      .send({ title: 'Updated Test Blog' });

    // Assert the response status code
    expect(response.status).toBe(404);
  });

  it('should return 400 if there is an error during the update', async () => {
    // Create a new blog post
    const newBlog = new Blog({
      title: 'Test Blog',
      content: 'This is a test blog post',
    });
    await newBlog.save();

    // Make a PUT request with an invalid update payload
    const response = await request(app)
      .put(`/blog/${newBlog._id}`)
      .send({ invalidField: 'Invalid Value' });

    // Assert the response status code
    expect(response.status).toBe(400);
  });
});
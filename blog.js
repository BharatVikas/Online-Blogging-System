import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Input, Button, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import NavBar from './navbar';
import ReactQuill from 'react-quill'; // Import ReactQuill from 'react-quill'

const { Dragger } = Upload;

const BlogPage = () => {
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    tags: '',
    privacy: 'public',
    media: null,
  });

  const handleMediaUpload = (file) => {
    setBlogData({ ...blogData, media: file });
    message.success(`${file.name} uploaded successfully.`);
  };

  const handleBlogSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      
      // Convert HTML content to plain text
      const plainTextContent = new DOMParser().parseFromString(blogData.content, 'text/html').documentElement.textContent;
      formData.append('content', plainTextContent);
      
      formData.append('tags', blogData.tags);
      formData.append('privacy', blogData.privacy);
      formData.append('author', 'Replace with actual author');

      if (blogData.media) {
        formData.append('media', blogData.media.originFileObj);
      }

      await axios.post('http://localhost:8081/api/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    message.success('Blog post submitted successfully',0.6);
    } catch (error) {
      console.error('Error submitting blog post:', error);
      message.error('Failed to submit blog post. Please try again.',0.6);
    }
  };

  return (
    <>
      <NavBar />
      <div style={{ width: '100%', maxWidth: '800px', margin: 'auto', padding: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: '20px 0', color: '#333' }}>Create a New Blog</h1>

        <Input
          placeholder="Enter blog title"
          style={{ marginBottom: '10px' }}
          value={blogData.title}
          onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
        />

        <ReactQuill // Use ReactQuill component here
          value={blogData.content}
          onChange={(content) => setBlogData({ ...blogData, content })}
          style={{ marginBottom: '10px' }}
        />

        <Input
          placeholder="Enter tags (comma-separated)"
          style={{ marginBottom: '10px' }}
          value={blogData.tags}
          onChange={(e) => setBlogData({ ...blogData, tags: e.target.value })}
        />

        <select
          style={{ marginBottom: '10px', width: '100%' }}
          value={blogData.privacy}
          onChange={(e) => setBlogData({ ...blogData, privacy: e.target.value })}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <Dragger
          beforeUpload={() => false}
          showUploadList={false}
          onChange={(info) => handleMediaUpload(info.file)}
          style={{ marginBottom: '10px', width: '100%' }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag media file to this area to upload</p>
        </Dragger>

        <Button type="primary" onClick={handleBlogSubmit} style={{ width: '100%', maxWidth: '200px' }}>
          Submit Blog
        </Button>
      </div>
    </>
  );
};

export default BlogPage;

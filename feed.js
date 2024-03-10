import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Card, Avatar, Space, Button, message, Spin, Input, Dropdown, Menu, Layout, Typography } from 'antd';
import { LikeOutlined, MessageOutlined, ShareAltOutlined, DownOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './navbar';
import { v4 as uuidv4 } from 'uuid'; // Import v4 function from the uuid package

const { Search } = Input;
const { Content } = Layout;
const { Title, Text } = Typography;

const BlogFeed = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchBlogFeed = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:8081/api/feed';
      const params = {};
      if (sortBy) {
        params.sortBy = sortBy;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const response = await axios.get(url, { params });
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog feed:', error);
      message.error('Failed to fetch blog feed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogFeed();
  }, [sortBy, searchQuery]);

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:8081/api/blog/${postId}/like`);
      const updatedPosts = blogPosts.map(post => {
        if (post._id === postId) {
          return { ...post, likes: post.likes + 1 };
        }
        return post;
      });
      setBlogPosts(updatedPosts);
      message.success('Post liked successfully.', 0.6);
    } catch (error) {
      console.error('Error liking blog post:', error);
      message.error('Failed to like post. Please try again later.', 0.6);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await axios.post(`http://localhost:8081/api/blog/${postId}/comment`, { comment });
      // You can handle updating comments similarly to likes
      message.success('Comment added successfully.');
    } catch (error) {
      console.error('Error adding comment to blog post:', error);
      message.error('Failed to add comment. Please try again later.');
    }
  };

  const handleShare = async (postId) => {
    try {
      await axios.post(`http://localhost:8081/api/blog/${postId}/share`);
      // You can handle updating shares similarly to likes
      message.success('Post shared successfully.', 1);
    } catch (error) {
      console.error('Error sharing blog post:', error);
      message.error('Failed to share post. Please try again later.');
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleMenuClick = ({ key }) => {
    setSortBy(key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="date">Sort by Date</Menu.Item>
      <Menu.Item key="likes">Sort by Likes</Menu.Item>
    </Menu>
  );

  const handleBlogClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  // Function to generate random image URL using Lorem Picsum service
  const getRandomImageUrl = () => {
    const randomId = uuidv4();
    return `https://picsum.photos/400/300?random=${randomId}`;
  };

  return (
    <Layout>
      <NavBar />
      <Content style={{ padding: '24px' }}>
        <Space style={{ marginBottom: '16px' }}>
          <Search placeholder="Search posts" onSearch={handleSearch} enterButton />
          <Dropdown overlay={menu}>
            <Button>
              Sort By <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={blogPosts}
          loadMore={<Spin spinning={loading} />}
          renderItem={(post) => (
            <List.Item>
              <Card
                hoverable
                cover={<img alt="post" src={getRandomImageUrl()} onClick={() => handleBlogClick(post._id)} />} // Use the getRandomImageUrl function to generate a random image URL
                actions={[
                  <Space key="actions">
                    <Button icon={<LikeOutlined />} onClick={() => handleLike(post._id)}>Like</Button>
                    <Button icon={<MessageOutlined />} onClick={() => handleComment(post._id)}>Comment</Button>
                    <Button icon={<ShareAltOutlined />} onClick={() => handleShare(post._id)}>Share</Button>
                  </Space>
                ]}
              >
                <Card.Meta
                  avatar={post.author && post.author.avatarUrl ? <Avatar src={post.author.avatarUrl} /> : null}
                  title={<Link to={`/blog/${post._id}`}>{post.title}</Link>}
                  description={
                    <>
                      <p>By: {post.author ? post.author.username : 'Unknown'}</p>
                      <p>{post.content}</p>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
};

export default BlogFeed;

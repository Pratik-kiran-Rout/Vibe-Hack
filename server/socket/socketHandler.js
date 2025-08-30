const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Blog = require('../models/Blog');

const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.username = user.username;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

const handleConnection = (io) => {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User ${socket.username} connected`);

    socket.join(`user_${socket.userId}`);

    socket.on('join_blog', (blogId) => {
      socket.join(`blog_${blogId}`);
    });

    socket.on('new_comment', async (data) => {
      try {
        const { blogId, content } = data;
        const blog = await Blog.findById(blogId);
        if (!blog) return;

        const comment = {
          user: socket.userId,
          text: content,
          createdAt: new Date()
        };

        blog.comments.push(comment);
        await blog.save();
        await blog.populate('comments.user', 'username avatar');
        
        const newComment = blog.comments[blog.comments.length - 1];
        io.to(`blog_${blogId}`).emit('comment_added', { blogId, comment: newComment });

        if (blog.author.toString() !== socket.userId) {
          io.to(`user_${blog.author}`).emit('notification', {
            type: 'new_comment',
            message: `${socket.username} commented on your blog`,
            blogId
          });
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to post comment' });
      }
    });

    socket.on('toggle_like', async (data) => {
      try {
        const { blogId } = data;
        const blog = await Blog.findById(blogId);
        if (!blog) return;

        const userIndex = blog.likes.indexOf(socket.userId);
        const action = userIndex > -1 ? 'unliked' : 'liked';
        
        if (userIndex > -1) {
          blog.likes.splice(userIndex, 1);
        } else {
          blog.likes.push(socket.userId);
        }

        await blog.save();
        io.to(`blog_${blogId}`).emit('like_updated', {
          blogId,
          likesCount: blog.likes.length,
          action
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to toggle like' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.username} disconnected`);
    });
  });
};

module.exports = { handleConnection };
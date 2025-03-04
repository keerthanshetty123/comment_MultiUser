import React, { useEffect, useState } from "react";
import { Avatar, Card, CardContent, Typography, Box, CircularProgress, TextField, Button, MenuItem, Select, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Reply {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  replies: Reply[];
}

const CommentComponent: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(() => {
    const savedComments = localStorage.getItem("comments");
    return savedComments ? JSON.parse(savedComments) : [];
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
      const dummyUsers: User[] = [
        { id: "user_1", name: "John", avatar: "https://example.com/avatar1.jpg" },
        { id: "user_2", name: "kausar", avatar: "https://example.com/avatar2.jpg" },
      ];

      setUsers(dummyUsers);
      setCurrentUser(dummyUsers[0]);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;
    
    const newCommentObj: Comment = {
      id: `comment_${comments.length + 1}`,
      userId: currentUser.id,
      text: newComment,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  const handleEditComment = (id: string, text: string) => {
    setEditingCommentId(id);
    setEditedText(text);
  };

  const handleSaveEdit = () => {
    setComments(comments.map(comment => comment.id === editingCommentId ? { ...comment, text: editedText } : comment));
    setEditingCommentId(null);
    setEditedText("");
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <Select
          value={currentUser?.id || ""}
          onChange={(e) => {
            const selectedUser = users.find((user) => user.id === e.target.value);
            if (selectedUser) setCurrentUser(selectedUser);
          }}
          sx={{ mr: 2 }}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
          ))}
        </Select>
        <Avatar src={currentUser?.avatar} alt={currentUser?.name} sx={{ mr: 2 }} />
        <TextField
          fullWidth
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Button variant="contained" onClick={handleAddComment} sx={{ ml: 2 }}>
          Post Comment
        </Button>
      </Box>
      {comments.map((comment) => {
        const user = users.find((u) => u.id === comment.userId);
        return (
          <Card key={comment.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Avatar src={user?.avatar} alt={user?.name} sx={{ mr: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  {user?.name}
                </Typography>
              </Box>
              {comment.userId === currentUser?.id && (
                <Box>
                  <IconButton onClick={() => handleEditComment(comment.id, comment.text)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteComment(comment.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              )}
            </Box>
            <CardContent sx={{ pt: 0 }}>
              {editingCommentId === comment.id ? (
                <Box display="flex" alignItems="center">
                  <TextField
                    fullWidth
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <Button onClick={handleSaveEdit} sx={{ ml: 2 }} variant="contained">
                    Save
                  </Button>
                </Box>
              ) : (
                <Typography variant="body1">{comment.text}</Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {new Date(comment.timestamp).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default CommentComponent;

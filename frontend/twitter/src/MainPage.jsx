import React, { useState, useEffect } from 'react';

import './output.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faEnvelope, 
    faBell,
    faTimes,
    faTrash, 
    faPaperPlane,
    faHeart, 
    faImage,faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter} from '@fortawesome/free-brands-svg-icons';
import {faGrinHearts, faComment } from '@fortawesome/free-regular-svg-icons';

const API_URL = 'https://project3-44gu.onrender.com/';

const MainPage = ({ user = {}, onLogout, setUser, onUsernameClick }) => { 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState({id: null, text: ''});
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [followedUsers, setFollowedUsers] = useState(new Set());
 

  useEffect(() => {
    fetchPosts();
  }, [user?._id]); 


  // fetch all post for the main page:

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}api/v1/posts/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const allPosts = await response.json();

      if (user?._id){ // we want to check if the user is logged in, if it is, then filter posts that are join the following list id
        const filterPosts = allPosts.filter(post=>{
            return post.user._id ===user._id || user.following.includes(post.user._id); //include either self or following's post
        });
        setPosts(filterPosts);

        const suggestedPosts = allPosts.filter(post =>
            post.user._id !== user._id && !user.following.includes(post.user._id)
        );
        setSuggestedPosts(suggestedPosts);
      }else{
        setPosts(allPosts);
      }
      
    } catch (error) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };
// helper function to parse the timestamp in mongodb to new date format
  const formatDate = (createAt) => {
    if (!createAt) return '';
    return new Date(createAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // handle function for like or unlike the post function

  const handleLikeUnlike = async(postId) =>{
    if (!user?._id){
        setError("Please log in to like or unlike the post"); //can only like or unlike the post when the user is logged in
        return;
    }

    try{
        const response = await fetch(`${API_URL}api/v1/posts/like/${postId}`,{
            method: 'PUT',
            headers: {
                 'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to like/unlike post');
        const updatedLikes = await response.json();

        setPosts(posts.map(post =>{
            if (post._id==postId){
                return {...post, likes: updatedLikes.likes};
            }
            return post;
        }));

        
    }catch(error){
        console.error('Error liking/unliking post:', error);
        setError('Failed to like/unlike post');
    }
  };

  // to edit the comment 

  const handleCommentChange = (postId, value) => {
    setNewComment(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleComment = async (postId) => {
    if (!user?._id) {
      setError('Please log in to comment');
      return;
    }
    const commentText = newComment[postId];
    if (!commentText.trim()) {
        setError('Comment cannot be empty');
        return;
      }
      try{
        const response = await fetch(`${API_URL}api/v1/posts/comment/${postId}`, {
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ text: commentText })
        });
        if (!response.ok) throw new Error('Failed to add comment');

        setNewComment(prev => ({
            ...prev,
            [postId]: ''
          }));
      fetchPosts();
      }catch(error){
        console.error('Error adding comment:', error);
        setError('Failed to add comment');
      }
  }
// to like or unlike the post
  const isLikedByUser = (post) => {
    return post.likes.includes(user?._id);
  };

  const handleEditComment = async (postId, commentId) =>{
    if (!editingComment.text.trim()) {
        setError('Comment cannot be empty');
        return;
    }

    try{
        const response = await fetch(`${API_URL}api/v1/posts/comment/${postId}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'  
            },
            credentials :'include',
            body: JSON.stringify({ text: editingComment.text })
        });
        if (!response.ok) throw new Error('Failed to edit comment');

    setEditingComment({ id: null, text: '' });
    fetchPosts();
    }catch (error) {
        console.error('Error editing comment:', error);
        setError('Failed to edit comment');
      }
  }
// add follow/unfollow 
const handleFollow = async (userId) => {
  if (!user?._id) {
    setError('Please log in to follow users');
    return;
  }

  try {
    const response = await fetch(`${API_URL}api/v1/users/follow/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to follow user');
    
    // Update the followedUsers set
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (prev.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });

    // Refresh posts to update feed
    fetchPosts();
  } catch (error) {
    console.error('Error following user:', error);
    setError('Failed to follow user');
  }
};

  
  // delete post handler

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}api/v1/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
  
      if (!response.ok) throw new Error('Failed to delete post');
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };
  //-------------create post-------------------------------

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 100 * 1024 ; //100kb
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('Image size must be less than 100kb');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageStr = reader.result.split(',')[1];
        setImagePreview(reader.result);
        setImage(imageStr);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text) {
      setError('Please add some text');
      return;
    }

    setLoadingPost(true);
    try {
      const postData = {
        text: text
      };
      
      // Only add img if it exists
      if (image) {
        postData.img = image;
      }

      console.log('Sending request with:', postData);

      const response = await fetch(`${API_URL}api/v1/posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(postData)
      });

      if (!response.ok) throw new Error("Failed to create post");
      const newPost = await response.json();
      setText('');
      setImage(null);
      setImagePreview(null);
      fetchPosts();
    } catch (error) {
      setError('Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setLoadingPost(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
   
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">
              <FontAwesomeIcon icon={faTwitter} color ="#0ea5e9"/> <> </>
                {user?._id ? 'Your Feed' : 'Recent Posts From All Users'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user?._id ? (
                <><div><img src={user.profileImg || "https://picsum.photos/seed/picsum/50/50"}  className="w-8 h-8 rounded-full mr-2"/>
                  <button 
                    onClick={() => onUsernameClick(user.username)}
                    className="text-xl font-bold text-gray-700 hover:text-blue-500"
                  >
                    Welcome, {user.username}!
                  </button></div>
            
                </>
              ) : (
                
                <div className="text-gray-600"><> </>
                      Please log in to like or comment </div>
              )}
            </div>
          </div>
        </div>
      </div>

   
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      
        {/* Add Create Post Button here, only shown when user is logged in */}
        {user?._id && (
        //   <div className="mb-6">
        //     <button
        //       onClick={() => window.location.href = '/create-post'}  
        //       className="w-full bg-white shadow rounded-lg p-4 text-left hover:shadow-md transition-shadow flex items-center space-x-3"
        //     >
        //       <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        //         <FontAwesomeIcon icon={faEnvelope} color="#0ea5e9"/>
        //       </div>
        //       <span className="text-gray-500">Share your thoughts or updates</span>
        //     </button>
        //   </div>
        <div className="mb-6">
    <div className="w-full max-w-3xl mx-auto py-8 ">
        <div className="bg-white shadow mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  <FontAwesomeIcon icon={faEnvelope} color="#0ea5e9" /> <> </>
                  Create Your Post!
                </h1>
              </div>
            </div>
          </div>
        </div>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6 justify-between">
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Feel free to share your thoughts here!"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />

          {imagePreview && (
            <div className="relative mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full text-white"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <div className="flex justify-between items-center mt-3">
            <label className="cursor-pointer text-gray-600 hover:text-gray-800">
              <FontAwesomeIcon icon={faImage} className="mr-2" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              Add Image
            </label>

            <button
              type="submit"
              disabled={loading || (!text && !image)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Posting...' : <><FontAwesomeIcon icon={faPaperPlane} className="mr-2" />Post</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading posts...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-600">
              {user?._id ? "No posts from people you follow yet" : "No posts available"}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Post Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <img
                      src={post.user.profileImg || "https://picsum.photos/seed/picsum/50/50"}
                      alt={post.user.username}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900"><FontAwesomeIcon icon={faUser}/> <></>
                      <button 
                    onClick={() => onUsernameClick(post.user.username)}
                    className="hover:text-blue-500"
                  >
                    {post.user.fullName}
                  </button>
                      </p>
                      <p className="text-xs text-gray-500">
                      <button 
                    onClick={() => onUsernameClick(post.user.username)}
                    className="hover:text-blue-500"
                  >
                    @{post.user.username}
                  </button>
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
         


                {/* Post Content */}
                <div className="p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{post.text}</p>
                  {post.img && (
                    <img
                      src={post.img}
                      alt="Post attachment"
                      className="mt-3 rounded-lg max-h-96 w-full object-cover"
                    />
                  )}
                </div>

                {/* Post Actions */}
                <div className="px-4 py-3 border-t bg-gray-50">
                  <div className="flex items-center justify-center space-x-10">
                    <button 
                      onClick={() => handleLikeUnlike(post._id)}
                      disabled={!user?._id}
                      className={`flex items-center space-x-2 ${
                        isLikedByUser(post) 
                          ? 'text-blue-500' 
                          : 'text-gray-500 hover:text-blue-500'
                      } ${!user?._id && 'cursor-not-allowed opacity-50'}`}
                    >
                      <FontAwesomeIcon icon={faHeart}  color ='darkred' />
                      <span color ="#0ea5e9">{post.likes.length}</span>
                    </button>


                    {user?._id && (
                      <div className="flex-1 mx-4">
                        <input
                          type="text"
                          value={newComment[post._id] || ''}
                          onChange={(e) => handleCommentChange(post._id, e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full px-3 py-1 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleComment(post._id);
                            }
                          }}
                        />
                      </div>
                    )}
                

                    <div className="flex items-center space-x-2 text-gray-500">
                      <FontAwesomeIcon icon={faComment} />
                      <span>{post.comments.length}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                {user?._id === post.user._id && (
      <button
        onClick={() => handleDeletePost(post._id)}
        className="text-darkred-500 hover:text-red-600 justify-items-end"
      > 
        <FontAwesomeIcon icon={faTrash} /> Delete the Post
      </button>
    )}</div>

        {post.comments && post.comments.length > 0 && (
                  <div className="px-4 pt-2 pb-4 bg-gray-50">
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="mt-2 p-2 bg-white rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                            <span className="font-medium text-sm">{comment.user.username}: </span>
                            {editingComment.id === comment._id ? (
                                <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editingComment.text}
                                onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                                className="ml-2 border rounded px-2 py-1 text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditComment(post._id, comment._id);
                                  }
                                }}
                              />
                               <button
                  onClick={() => handleEditComment(post._id, comment._id)}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
                            ) : (
                              <span className="ml-2 text-sm">{comment.text}</span>
                            )}
                          </div>
                          {user?._id === comment.user._id && (
                            <div>
                              {editingComment.id === comment._id ? (
                                <button
                                  onClick={() => handleEditComment(post._id, comment._id)}
                                  className="text-xs text-blue-500 hover:text-blue-600"
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  onClick={() => setEditingComment({ id: comment._id, text: comment.text })}
                                  className="text-xs text-gray-500 hover:text-gray-600"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
    

              </div>
            ))}
            
          </div>
        )}
   
      </div>
      {/* Suggested Posts Section */}


  {/* {user?._id && suggestedPosts.length > 0 && (
    <div className="max-w-3xl mx-auto mt-8">
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FontAwesomeIcon icon={faUser} className="mr-2" color="#0ea5e9"/>
        Posts You Might Like
      </h2>
      <div className="space-y-4">
        {suggestedPosts.slice(0, 10).map((post) => (
          <div key={post._id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img
                  src={post.user.profileImg || "https://picsum.photos/seed/picsum/50/50"}
                  alt={post.user.username}
                  className="h-8 w-8 rounded-full"
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">{post.user.fullName}</p>
                  <p className="text-xs text-gray-500">@{post.user.username}</p>
                </div>
              </div>
              <button
        onClick={() => handleFollow(post.user._id)}
          className={`px-4 py-1 text-sm rounded-full ${
                      followedUsers.has(post.user._id)
      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      : 'bg-blue-500 text-white hover:bg-blue-600'
  }`}
>
  {followedUsers.has(post.user._id) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
            <p className="text-sm text-gray-800 line-clamp-2">{post.text}</p>
            {post.img && (
              <img
                src={post.img}
                alt="Post attachment"
                className="mt-2 rounded-lg max-h-48 w-full object-cover"
              />
            )}

            
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <FontAwesomeIcon icon={faHeart} className="mr-1" />
                {post.likes.length}
              </span>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faComment} className="mr-1" />
                {post.comments.length}
              </span>
            </div>
          </div>
        ))} 
      </div>
    </div>
  </div>
)}*/}

{user?._id && suggestedPosts.length > 0 && (
  <div className="max-w-3xl mx-auto mt-8">
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FontAwesomeIcon icon={faUserPlus} className="mr-2" color="#0ea5e9"/>
        Posts You Might Like
      </h2>
      <div className="space-y-4">
        {suggestedPosts.slice(0, 10).map((post) => (
          <div key={post._id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img
                  src={post.user.profileImg || "https://picsum.photos/seed/picsum/50/50"}
                  alt={post.user.username}
                  className="h-8 w-8 rounded-full"
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900"> <button 
        onClick={() => onUsernameClick(post.user.username)}
        className="hover:text-blue-500"
      >
        {post.user.fullName}
      </button></p>
                  <p className="text-xs text-gray-500">  <button 
        onClick={() => onUsernameClick(post.user.username)}
        className="hover:text-blue-500"
      >
        @{post.user.username}
      </button></p>
                </div>
              </div>
              <button
                onClick={() => handleFollow(post.user._id)}
                className={`px-4 py-1 text-sm rounded-full ${
                  followedUsers.has(post.user._id)
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {followedUsers.has(post.user._id) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
            <p className="text-sm text-gray-800 line-clamp-2">{post.text}</p>
            {post.img && (
              <img
                src={post.img}
                alt="Post attachment"
                className="mt-2 rounded-lg max-h-48 w-full object-cover"
              />
            )}
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <FontAwesomeIcon icon={faHeart} className="mr-1" />
                {post.likes.length}
              </span>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faComment} className="mr-1" />
                {post.comments.length}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
    </div>
    
  );
};

export default MainPage;
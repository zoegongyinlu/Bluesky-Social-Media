import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faEnvelope,
    faUsers,
    faUserPlus,
    faSpinner,
    faUserMinus,
    faHeart,
    faComment  
} from '@fortawesome/free-solid-svg-icons';


const UserProfilePage = ({ username, currentUser }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
const [postsLoading, setPostsLoading] = useState(true);
const [postsError, setPostsError] = useState(null);
  
const API_URL = process.env.REACT_APP_API_URL || 'https://project3-44gu.onrender.com/';
  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    if (profile?._id) {
      fetchUserPosts();
    }
}, [profile?._id]);

  useEffect(() => {
    if (profile && currentUser) {
      setIsFollowing(profile.followers.includes(currentUser._id));
    }
  }, [profile, currentUser]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}api/v1/users/profile/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      setError('Failed to load user profile');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${API_URL}api/v1/posts/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }
  
      const allPosts = await response.json();
      const userPosts = allPosts.filter(post => post.user._id === profile._id);
      setUserPosts(userPosts);
    } catch (error) {
      setPostsError('Failed to load user posts');
      console.error('Error:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      setError('Please log in to follow users');
      return;
    }

    setFollowLoading(true);
    try {
      const response = await fetch(`${API_URL}api/v1/users/follow/${profile._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to follow/unfollow user');
      }

      // Update local state
      setIsFollowing(!isFollowing);
      setProfile(prev => ({
        ...prev,
        followers: isFollowing 
          ? prev.followers.filter(id => id !== currentUser._id)
          : [...prev.followers, currentUser._id]
      }));
    } catch (error) {
      setError('Failed to follow/unfollow user');
      console.error('Error:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-50 rounded-lg">
        User not found
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser._id === profile._id;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
            <div className="h-20 w-20 rounded-full overflow-hidden flex items-center justify-center">
    {profile.profileImg ? (
      <img
        src={profile.profileImg}
        alt={profile.username}
        className="w-full h-full object-cover"
      />
    ) : (
      <img
        src="https://picsum.photos/seed/picsum/50/50"
        alt={profile.username}
        className="w-full h-full object-cover"
      />
    )}
  </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
                <div className="flex items-center mt-1 text-gray-600">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  {profile.email}
                </div>
              </div>
            </div>
            
            {!isOwnProfile && currentUser && (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-colors ${
                  isFollowing 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <FontAwesomeIcon 
                  icon={isFollowing ? faUserMinus : faUserPlus} 
                  className={followLoading ? 'animate-spin' : ''} 
                />
                <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => setFollowersOpen(true)}
              className="flex-1 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
            >
              <div className="text-lg font-semibold">{profile.followers.length}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </button>
            <button
              onClick={() => setFollowingOpen(true)}
              className="flex-1 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
            >
              <div className="text-lg font-semibold">{profile.following.length}</div>
              <div className="text-sm text-gray-600">Following</div>
            </button>
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      {followersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Followers</h2>
              <button onClick={() => setFollowersOpen(false)} className="text-gray-500">
                ×
              </button>
            </div>
            <div className="p-4">
              {profile.followers.map((followerId) => (
                <div key={followerId} className="flex items-center py-2">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-3" />
                  <span>{followerId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {followingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Following</h2>
              <button onClick={() => setFollowingOpen(false)} className="text-gray-500">
                ×
              </button>
            </div>
            <div className="p-4">
              {profile.following.map((followingId) => (
                <div key={followingId} className="flex items-center py-2">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-3" />
                  <span>{followingId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Posts Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Posts</h2>
        {postsLoading ? (
          <div className="flex justify-center">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-blue-500" />
          </div>
        ) : postsError ? (
          <div className="bg-red-50 rounded-lg p-4 text-red-700">
            {postsError}
          </div>
        ) : userPosts.length === 0 ? (
          <div className="text-center text-gray-600">
            No posts yet
          </div>
        ) : (
          <div className="space-y-4">
      {userPosts.map(post => (
  <div key={post._id} className="bg-white rounded-lg shadow p-4">
    <div className="mb-2">
      <span className="text-xs text-gray-500">
        {new Date(post.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>
    </div>
    <p className="text-gray-800">{post.text}</p>
    {post.img && (
      <img
        src={post.img}
        alt="Post attachment"
        className="mt-3 rounded-lg max-h-96 w-full object-cover"
      />
    )}
    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
      <span className="flex items-center">
        <FontAwesomeIcon icon={faHeart} className="mr-1" />
        {post.likes?.length || 0} likes
      </span>
      <span className="flex items-center">
        <FontAwesomeIcon icon={faComment} className="mr-1" />
        {post.comments?.length || 0} comments
      </span>
    </div>
    {/* Show comments if any */}
    {post.comments && post.comments.length > 0 && (
      <div className="mt-3 space-y-2">
        {post.comments.map(comment => (
          <div key={comment._id} className="bg-gray-50 rounded p-2 text-sm">
            <span className="font-medium">{comment.user.username}: </span>
            {comment.text}
          </div>
        ))}
      </div>
    )}
  </div>
))}
          </div>
        )}
      </div>
    </div>
  );
};





export default UserProfilePage;
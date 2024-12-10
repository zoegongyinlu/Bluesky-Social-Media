import logo from './logo.svg';
import './App.css';
import './index.css';
import './output.css';
import React, { useState, useEffect } from 'react';
import { SignupPage, LoginPage, LoggedInPage } from './LoginAndSignUp'; 
import  MainPage  from './MainPage';
import CreatePostForm from './CreatePost';

import UserProfilePage from './UserProfile';

const API_URL = process.env.REACT_APP_API_URL || 'https://project3-44gu.onrender.com/';

const App = () => {
  const [currentPage, setCurrentPage] = useState('main'); // 
  const [user, setUser] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  

  const handleUsernameClick = (username) => {
    setSelectedUsername(username);
    setCurrentPage('profile');
  };
  const handleBackToMain = () => {
    setCurrentPage('main');
    setSelectedUsername(null);
  };


  const handleSignupClick = () => {
    setCurrentPage('signup');
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('main');
  };

  const handleLoginSuccess = (userData) => {
    console.log('LoginSuccess - Setting user to:', userData);
    setUser(userData);
    setCurrentPage('main');
  };

  const handleLogout = async () => {
    console.log('Logging out - Current user before logout:', user);
    try {
      const response = await fetch(`${API_URL}api/v1/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json'
          }
      });
      
      if (response.ok) {
          setUser(null);
          setCurrentPage('main');
      } else {
          console.error('Logout failed');
      }
  } catch (error) {
      console.error('Logout error:', error);
  }
  };

  const handleCreatePost = ()=>{
    setCurrentPage('create-post');
  }

//   return (
//     <div>
//       {currentPage ==='main' && (
//         <div>
//           <div className= "flex justify-end p-4 bg-white shadow-sm">
//             {user?(
//               <button onClick={handleLogout} className='px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-800'>
                
//                 Logout
//               </button> 
              
//             ):(
//               <div className='space-x-4'>
//                 <button onClick = {handleLoginClick}
//                   className = "px-4 py-2 rounded-full bg-gray-800 text-yellow-100 hover:bg-blue-600">
        
//                 Login
//                 </button>
//                 <button onClick ={handleSignupClick} className = "px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-800 hover:bg-blue-600">

//                 Sign Up
//                 </button>

//               </div>
//             )

//             }



//           </div>
//               <MainPage user ={user} onLogout={ handleLogout} setUser = {setUser}/>
//         </div>
//       )}

//       {currentPage === 'signup' && (
//         <div>
//           <div className= "flex justify-end p-4 bg-white shadow-sm">
//             {user?(
//               <button onClick={handleLogout} className='px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-800'>
                
//                 Logout
//               </button> 
              
//             ):(
//               <div className='space-x-4'>
//                 <button onClick = {handleLoginClick}
//                   className = "px-4 py-2 rounded-full bg-gray-800 text-yellow-100 hover:bg-blue-600">
        
//                 Login
//                 </button>
//                 <button onClick ={handleSignupClick} className = "px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-800 hover:bg-blue-600">

//                 Sign Up
//                 </button>

//               </div>
//             )
//             }
//           </div>
//           <SignupPage 
//           onLoginClick={handleLoginClick}
//           onSignupSuccess={handleSignupSuccess}
//         />
//         </div>
//       )}

// {currentPage === 'create-post' && (
//   <div>
//     <div className="flex justify-end p-4 bg-white shadow-sm">
     
//     </div>
//     <CreatePostForm userId ={user._id}
//       onPostCreated={() => {
//         setCurrentPage('main');
      
//       }} 
//     />
//   </div>
// )}
         
//       {currentPage === 'login' && (
//         <div>
//         <div className= "flex justify-end p-4 bg-white shadow-sm">
//           {user?(
//             <button onClick={handleLogout} className='px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-800'>
              
//               Logout
//             </button> 
            
//           ):(
//             <div className='space-x-4'>
//               <button onClick = {handleLoginClick}
//                 className = "px-4 py-2 rounded-full bg-gray-800 text-yellow-100 hover:bg-blue-600">
      
//               Login
//               </button>
//               <button onClick ={handleSignupClick} className = "px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-800 hover:bg-blue-600">

//               Sign Up
//               </button>

//             </div>
//           )
//           }
//         </div>
//         <LoginPage 
//         onSignupClick={handleSignupClick}
//         onLoginSuccess={handleLoginSuccess}
//       />
//       </div>
//     )}
//     </div>
//   );
// };

  return (
    <div>
      <div className="flex justify-end p-4 bg-white shadow-sm">
        {user ? (
          <button onClick={handleLogout} className='px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-800'>
            Logout
          </button>
        ) : (
          <div className='space-x-4'>
            <button onClick={handleLoginClick} className="px-4 py-2 rounded-full bg-gray-800 text-yellow-100 hover:bg-blue-600">
              Login
            </button>
            <button onClick={handleSignupClick} className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-blue-600">
              Sign Up
            </button>
          </div>
        )}
      </div>

      {currentPage === 'main' && (
        <MainPage 
          user={user} 
          onLogout={handleLogout} 
          setUser={setUser}
          onUsernameClick={handleUsernameClick}
        />
      )}

      {currentPage === 'profile' && (
        <div>
          <button 
            onClick={handleBackToMain}
            className="ml-4 mt-4 px-4 py-2 text-blue-500 hover:text-blue-600"
          >
            ← Back to Feed
          </button>
          <UserProfilePage 
            username={selectedUsername} 
            currentUser={user} 
          />
        </div>
      )}

      {currentPage === 'signup' && (
        <SignupPage 
          onLoginClick={handleLoginClick}
          onSignupSuccess={handleSignupSuccess}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage 
          onSignupClick={handleSignupClick}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};
export default App;
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './output.css';

import { 
    faUser, 
    faEnvelope, 

} from '@fortawesome/free-solid-svg-icons'

const CreatePostForm =({userId, onPostCreated}) =>{
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

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

        console.log('Current cookies:', document.cookie);
        event.preventDefault();
        if (!text) {
          setError('Please add some text');
          return;
        }

        setLoading(true);
        try{
            const postData = {

                text: text
            };
            
            // Only add img if it exists
            if (image) {
                postData.img = image;
            }


            console.log('Sending request with:', postData);


            const response = await fetch('http://localhost:3001/api/v1/posts/create',{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(postData
                  
                )
              
            });
// debugging:
            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response body:', responseText);
           console.log("Received userID prop:", userId);
//---------------
            if (!response.ok) throw new Error("Failed to create post:${responseText}");
            const newPost = JSON.parse(responseText);
            setText('');
            setImage(null);
            setImagePreview(null);

            if (onPostCreated){
                onPostCreated(newPost);
            }

        }catch (error) {
            setError('Failed to create post');
            console.error('Error creating post:', error);
          } finally {
            setLoading(false);
          }
    
    };

    return (
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
  
      );
    

}
export default CreatePostForm;
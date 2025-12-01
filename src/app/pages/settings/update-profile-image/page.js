
// "use client";
// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from 'react-redux';
// import { updateUserProfileImage } from "@/app/redux/slices/authSlice";
// import { usernameByLoginId } from "@/app/redux/slices/fundManagerSlice";
// import { getEncryptedLocalData } from "@/app/api/auth";
// import toast from "react-hot-toast";
// import Image from "next/image";

// export default function UpdateProfileImage() {
//   const dispatch = useDispatch();
//   const { usernameData, loading, error } = useSelector((state) => state.fund);
//   const [info, setInfo] = useState({
//     LoginID: "",
//     FName: "",
//     LName: "",
//     Email: "",
//     mobile: "",
//     Address: ""
//   });
//   const [imageUrl, setImageUrl] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   useEffect(() => {
//     const AuthId = getEncryptedLocalData("AuthLogin");
//     dispatch(usernameByLoginId(AuthId));
//   }, [dispatch]);

//   useEffect(() => {
//     if (usernameData?.data) {
//       setInfo({
//         LoginID: getEncryptedLocalData("AuthLogin") || "",
//         FName: usernameData.data.fName || "",
//         LName: usernameData.data.lName || "",
//         Email: usernameData.data.email || "",
//         mobile: usernameData.data.mobile || "",
//         Address: usernameData.data.address || ""
//       });
//       setPreviewImage(usernameData.data.profileImage);
//       if (usernameData.data.profileImage) {
//         localStorage.setItem('profileImage', usernameData.data.profileImage);
//       }
//     }
//   }, [usernameData?.data]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageUrl(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleChange = (e) => {
//     setInfo({
//       ...info,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await dispatch(updateUserProfileImage({
//         data: info,
//         image: imageUrl
//       })).unwrap();


//       if (response?.response?.statusCode === 200) {
//         toast.success('Profile updated successfully');
//         if (imageUrl) {
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             localStorage.setItem('profileImage', reader.result);
//             window.dispatchEvent(new Event('storage'));
//           };
//           reader.readAsDataURL(imageUrl);
//         }
//         const AuthId = getEncryptedLocalData("AuthLogin");
//         dispatch(usernameByLoginId(AuthId));
//       } else {
//         toast.warning(response?.message || 'Something happened, please check again');
//       }
//     } catch (error) {
//       toast.error(error?.message || 'Failed to update profile');
//     }
//   };

//   return (
//     <div className="max-w-3xl p-6 mx-auto rounded-lg shadow-sm dark:border-white dark:bg-gray-800 ">
//       <div className="space-y-4">
//         <div className="flex justify-start">
//           <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image</label>
//           <div className="flex items-start gap-6">
//             <div className="flex flex-col">
//               <div className="flex items-center gap-4"> {/* Added flex container */}
//                 <label className="cursor-pointer">
//                   <div className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
//                     Choose File
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden"
//                     />
//                   </div>
//                 </label>
//                 <span className="text-sm text-gray-500 dark:text-gray-400">
//                   {imageUrl ? imageUrl.name : "No file chosen"}
//                 </span>
//               </div>
              
//             </div>
            
//           </div>
//           </div>
//           <div className="flex items-center ml-10">
//             {(previewImage || usernameData?.data?.profileImage) ? (
//               <div className="relative w-24 h-24 overflow-hidden border border-gray-300 rounded-md dark:border-gray-600">
//                 <Image
//                   src={previewImage || usernameData.data.profileImage}
//                   alt="Profile"
//                   fill
//                   className="object-cover"
//                   unoptimized
//                 />
//               </div>
//             ) : (
//               <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-md dark:bg-gray-700">
//                 <span className="text-sm text-gray-500 dark:text-gray-400">No Image</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="mt-5">
//         <button
//           className="w-full px-4 py-2 mt-2 text-white rounded th-btn style2 focus:outline-none"
//           onClick={handleSubmit}
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfileImage } from "@/app/redux/slices/authSlice";
import { usernameByLoginId } from "@/app/redux/slices/fundManagerSlice";
import { getEncryptedLocalData } from "@/app/api/auth";
import toast from "react-hot-toast";
import Image from "next/image";

export default function UpdateProfileImage() {
  const dispatch = useDispatch();
  const { usernameData, loading, error } = useSelector((state) => state.fund);
  const [info, setInfo] = useState({
    LoginID: "",
    // FName: "",
    // LName: "",
    // Email: "",
    // mobile: "",
    // Address: ""
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const AuthId = getEncryptedLocalData("AuthLogin");
    dispatch(usernameByLoginId(AuthId));
  }, [dispatch]);

  useEffect(() => {
    if (usernameData?.data) {
      setInfo({
        LoginID: getEncryptedLocalData("AuthLogin") || "",
        // FName: usernameData.data.fName || "",
        // LName: usernameData.data.lName || "",
        // Email: usernameData.data.email || "",
        // mobile: usernameData.data.mobile || "",
        // Address: usernameData.data.address || ""
      });
      setPreviewImage(usernameData.data.profileImage);
      if (usernameData.data.profileImage) {
        localStorage.setItem('profileImage', usernameData.data.profileImage);
      }
    }
  }, [usernameData?.data]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPEG, JPG, and PNG formats are allowed');
      e.target.value = ''; // Clear the input
      return;
    }
    
    // Validate file size (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      toast.error('Please upload an image up to 1 MB');
      e.target.value = ''; // Clear the input
      return;
    }
    
    // If validations pass, proceed
    setImageUrl(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(updateUserProfileImage({
        data: info,
        image: imageUrl
      })).unwrap();

      if (response?.response?.statusCode === 200) {
        toast.success('Profile updated successfully');
        if (imageUrl) {
          const reader = new FileReader();
          reader.onloadend = () => {
            localStorage.setItem('profileImage', reader.result);
            window.dispatchEvent(new Event('storage'));
          };
          reader.readAsDataURL(imageUrl);
        }
        const AuthId = getEncryptedLocalData("AuthLogin");
        dispatch(usernameByLoginId(AuthId));
      } else {
        toast.warning(response?.message || 'Something happened, please check again');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto rounded-lg shadow-sm dark:border-white dark:bg-gray-800 ">
      <div className="space-y-4">
        <div className="flex justify-start">
          <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image</label>
          <div className="flex items-start gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <div className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                    Choose File
                    <input
                      type="file"
                      accept="image/jpeg, image/jpg, image/png"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {imageUrl ? imageUrl.name : "No file chosen"}
                </span>
              </div>
              <p className="mt-2 text-xs text-red-500 dark:text-gray-400">
                Supported formats: JPEG, JPG, PNG
              </p>
            </div>
          </div>
          </div>
          <div className="flex items-center ml-10">
            {(previewImage || usernameData?.data?.profileImage) ? (
              <div className="relative w-24 h-24 overflow-hidden border border-gray-300 rounded-md dark:border-gray-600">
                <Image
                  src={previewImage || usernameData.data.profileImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-md dark:bg-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">No Image</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <button
          className="w-full px-4 py-2 mt-2 text-white rounded th-btn style2 focus:outline-none"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
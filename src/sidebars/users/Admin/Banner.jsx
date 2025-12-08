import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBanner,
  fetchBanners,
  uploadBanners,
} from "../../../feature/thunks/adminThunks";
import { useEffect } from "react";

export default function Banner() {
  const dispatch = useDispatch();

  const [banners, setBanners] = useState([]);

  const [bannersGetData, setBannersGetData] = useState([]);

  const { loading, error, data } = useSelector(
    (state) => state.admin.allBanners
  );

  

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch, null]);

  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFiles = (files) => {
    const newBanners = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file: file, // ✅ Store the actual file
      imageUrl: URL.createObjectURL(file), // for preview only
    }));
    setBanners((prev) => [...prev, ...newBanners]);
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  // Remove banner + free memory
  const removeBanner = (id) => {
    setBanners((prev) => {
      const bannerToRemove = prev.find((b) => b.id === id);
      if (bannerToRemove) {
        URL.revokeObjectURL(bannerToRemove.imageUrl);
      }
      return prev.filter((b) => b.id !== id);
    });
  };

  const handleUpdateBanner = (e) => {
   

    if (!banners || banners.length === 0) {
      console.warn("No banners selected for upload");
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2 MB
    const formData = new FormData();

    for (let banner of banners) {
      if (banner?.file) {
        if (banner.file.size > maxSize) {
          alert(
            `${banner.file.name} is too large. Maximum allowed size is 2MB.`
          );
          return; // Stop upload if any file is too big
        }
        formData.append("banners", banner.file);
      }
    }

    // ✅ Only send if all files are valid
    dispatch(uploadBanners(formData));

    setTimeout(() => {
      dispatch(fetchBanners());
    }, 1000);

    setBanners([]);
  };

  const removeBannerFromBackend = (bannerId) => {
    dispatch(deleteBanner(bannerId));

    setTimeout(() => {
      dispatch(fetchBanners());
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-3">
      <div className="w-full  bg-white shadow-lg rounded-2xl p-8 border border-teal-200">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-between">
          Upload Banner
          <span className="text-sm text-teal-600">
            {banners.length} selected
          </span>
        </h2>

        {/* Banner Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {banners.map((banner) => (
              <motion.div
                key={banner.id} // Use the unique ID as key
                className="relative rounded-xl shadow-md overflow-hidden group"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                {/* Banner Image */}
                <div className="relative w-full aspect-[14/9]">
                  <img
                    src={banner.imageUrl}
                    alt="Banner"
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ stop bubbling
                    removeBanner(banner.id);
                  }}
                  className="absolute top-3 right-3 z-20 bg-gray-800 bg-opacity-70 hover:bg-yellow-500 text-white rounded-full p-2 transition"
                >
                  <X size={20} />
                </button>

                {/* Hover Overlay */}
                <div
                  className="absolute inset-0 bg-gray-800 bg-opacity-40 opacity-0 group-hover:opacity-100 
                                flex items-center justify-center transition 
                                pointer-events-none group-hover:pointer-events-auto"
                >
                  <span className="text-white text-lg font-medium">Banner</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Banner Button (inside grid) */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-teal-500 text-teal-500 cursor-pointer hover:bg-teal-50 transition h-60"
          >
            <Plus size={40} />
            <span className="mt-2 font-medium">Add Banner</span>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            className="absolute inset-0 w-full h-full object-cover rounded-xl hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Sticky Add Post Button */}
      <button
        onClick={() => {
          handleUpdateBanner();
        }} // replace with your logic
        className="fixed bottom-6 right-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all flex items-center space-x-2"
      >
        <Plus size={20} />
        <span>Update Banner</span>
      </button>



      

      <div className="w-full bg-white shadow-lg rounded-2xl p-8 border border-teal-200 mt-10">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-between">
          Banner
        </h2>

        {/* Banner Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data?.map((banner, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full aspect-[16/9]">
                <img
                  src={banner.imageUrl}
                  alt="Banner"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Cross Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBannerFromBackend(banner?._id);
                }}
                className="absolute top-3 right-3 z-20 bg-gray-800 bg-opacity-70 hover:bg-red-500 text-white rounded-full p-2 transition opacity-0 group-hover:opacity-100"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




import React, { useState } from "react";
import { Calendar, IndianRupee } from "lucide-react";
import { useDispatch } from "react-redux";
import { assignBulkTargetAll } from "../../../feature/thunks/adminThunks";
import toast, { Toaster } from "react-hot-toast";

const SetTarget = () => {
  const dispatch = useDispatch();

  const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];

  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + i);

  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    target: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(
        assignBulkTargetAll({
          month: Number(formData.month),
          year: formData.year,
          totalTarget: Number(formData.target),
        })
      ).unwrap();

      toast.success("Target assigned successfully!");
      setFormData((prev) => ({ ...prev, target: 0 })); // reset target field
    } catch (err) {
      console.error("Error assigning target:", err);
      toast.error("Failed to assign target. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 mx-auto my-8">
      <Toaster position="top-center" reverseOrder={false} />

      <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Set Monthly Target
      </h3>
      <p className="text-gray-500 text-sm text-center mb-6">
        Track your goals with precision.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Month Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Month
          </label>
          <div className="relative">
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#12B99C] focus:outline-none appearance-none pr-10"
              required
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
          </div>
        </div>

        {/* Year Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Year
          </label>
          <div className="relative">
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#12B99C] focus:outline-none appearance-none pr-10"
              required
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
          </div>
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Target Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <IndianRupee className="w-5 h-5" />
            </span>
            <input
              type="number"
              name="target"
              placeholder="Enter target amount"
              value={formData.target}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#12B99C] focus:outline-none"
              required
              min="0"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#12B99C] hover:bg-[#0d8a73] hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          {loading ? "Saving..." : "Save Target"}
        </button>
      </form>
    </div>
  );
};

export default SetTarget;



// import React from 'react'
// import {
//     assignAsmBulkTarget,
//   } from "../../../feature/thunks/adminThunks";
// import { useState } from 'react';
// import { Eye, Edit, Trash, Plus, X, Calendar, IndianRupee, Download } from "lucide-react";

// const SetTarget = () => {
//     const months = [
//         { name: "September", value: 9 },
//         { name: "January", value: 1 },
//         { name: "February", value: 2 },
//         { name: "March", value: 3 },
//         { name: "April", value: 4 },
//         { name: "May", value: 5 },
//         { name: "June", value: 6 },
//         { name: "July", value: 7 },
//         { name: "August", value: 8 },
//         { name: "October", value: 10 },
//         { name: "November", value: 11 },
//         { name: "December", value: 12 },
//       ];
      
//       const years = Array.from(
//         { length: 11 },
//         (_, i) => new Date().getFullYear() + i
//       );

//     const [TargetModal, setTargetModal] = useState(false);
//   const [formData, setFormData] = useState({
//     month: new Date().getMonth() + 1, // numeric month
//     year: new Date().getFullYear(),
//     target: 0,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//     const handleSubmit = (e) => {
//         e.preventDefault();
    
//      
    
//         dispatch(
//           assignAsmBulkTarget({
//             month: Number(formData?.month),
//             year: formData.year,
//             totalTarget: Number(formData.target),
//           })
//         );
    
//         setTargetModal(false);
//       };
//   return (
//    <>
    
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 p-4 animate-fade-in">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative transform transition-all duration-300 scale-100 animate-slide-up">
//             {/* Close Button */}
//             <button
//               className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
//               onClick={() => {
//                 setTargetModal(false);
//               }}
//               aria-label="Close modal"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             {/* Modal Title */}
//             <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
//               Set Monthly Target
//             </h3>
//             <p className="text-gray-500 text-sm text-center mb-6">
//               Track your goals with precision.
//             </p>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Month Input - Now a dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-2">
//                   Month
//                 </label>
//                 <div className="relative">
//                   <select
//                     name="month"
//                     value={formData?.month}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#12B99C] focus:outline-none transition-colors appearance-none pr-10"
//                     required
//                   >
//                     <option value="" disabled>
//                       Select a month
//                     </option>
//                     {months.map((month) => (
//                       <option key={month.value} value={month.value}>
//                         {month.name}
//                       </option>
//                     ))}
//                   </select>
//                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
//                 </div>
//               </div>

//               {/* Year Input - Now a dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-2">
//                   Year
//                 </label>
//                 <div className="relative">
//                   <select
//                     name="year"
//                     value={formData.year}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#12B99Deactivate ASMC] focus:outline-none transition-colors appearance-none pr-10"
//                     required
//                   >
//                     {years.map((year) => (
//                       <option key={year} value={year}>
//                         {year}
//                       </option>
//                     ))}
//                   </select>
//                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
//                 </div>
//               </div>

//               {/* Target Amount Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-2">
//                   Target Amount
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
//                     <IndianRupee className="w-5 h-5" />
//                   </span>
//                   <input
//                     type="number"
//                     name="target"
//                     placeholder="Enter target amount"
//                     value={formData.target}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#12B99C] focus:outline-none transition-colors"
//                     required
//                     min="0"
//                   />
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full bg-[#12B99C] text-white py-3 rounded-xl hover:bg-[#0d8a73] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//               >
//                 Save Target
//               </button>
//             </form>
//           </div>
//         </div>
      

//    </>
//   )
// }

// export default SetTarget
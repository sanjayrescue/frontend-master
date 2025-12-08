import React, { useState, useEffect, useRef } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";

import html2canvas from "html2canvas";


const IdCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const idCardRef = useRef(null);

  const location = useLocation();
  const { employeeData } = location.state || {};
  //   name: "Nishant Maske",
  //   designation: "Partner",
  //   id: "506",
  //   location: "Hinjawadi, Maharashtra",
  //   initials: "NM",
  //   photo: null,
  // });





  const downloadPDF = () => {
    const input = idCardRef.current;
  
    // Get element dimensions
    const width = input.offsetWidth;
    const height = input.offsetHeight;
  
    domtoimage
      .toPng(input, {
        quality: 1,
        width: width * 3,
        height: height * 3,
        style: {
          transform: "scale(3)",
          transformOrigin: "top left",
        },
      })
      .then((imgData) => {
        // Calculate PDF dimensions based on element aspect ratio
        const pdf = new jsPDF({
          orientation: height > width ? "portrait" : "landscape",
          unit: "mm",
          format: [height * 0.264583, width * 0.264583], // px → mm
        });
  
        pdf.addImage(imgData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        pdf.save(`${employeeData.name}-IDCard.pdf`);
      })
      .catch((err) => console.error("Failed to generate PDF", err));
  };
  
  

  return (
    <div className="w-[100%] h-[100vh] flex justify-center items-center flex-col ">

<div
ref={idCardRef}
className={`
  relative w-80 h-120 bg-white rounded-3xl shadow-2xl 
  border-2 border-teal-500/10 overflow-hidden

`}
>

{/* Header Section */}
<div className="bg-gradient-to-br from-teal-500 to-blue-500 text-white p-5 text-center relative">
  <div className="text-xs font-bold tracking-widest uppercase mt-5 leading-tight">
    Our Great Collaborations
  </div>
  <div className="text-[10px] opacity-90 font-light">Trustline Fintech</div>

  {/* ID Number Badge */}
  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-xl text-[8px] font-bold border border-white/30 whitespace-nowrap">
  ID: {employeeData.id}
</div>
</div>

<div className="px-5 py-6 text-center">
  <div className="relative w-25 h-25 mx-auto mb-4 group">
    <div
      className="
        w-full h-full rounded-2xl 
        flex items-center justify-center
        overflow-hidden
        border-3 border-teal-500 
      "
    >
      {employeeData.photo ? (
        <div className="w-24 h-24 overflow-hidden rounded-lg "> {/* Optional inner border */}
          <img
            src={employeeData.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            alt="Set new profile image"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="text-white text-2xl font-bold ">
          {employeeData.initials}
        </div>
      )}
    </div>
  </div>

  <div className="text-gray-900 text-base font-bold mb-2 leading-tight">
    {employeeData.name}
  </div>
  <div className="inline-block mt-5 bg-teal-500/10 text-teal-600 text-sm font-semibold uppercase tracking-wide px-3 py-1 rounded-2xl border border-teal-500/20 mb-5">
    {employeeData.designation}
  </div>
</div>


<div className="px-4 mb-4 flex justify-center  ">
  <div className="flex items-start gap-2 text-[11px] text-gray-900 break-words">
    <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-[2px]" />
    <span className="font-medium text-left leading-snug">{employeeData.location}</span>
  </div>
</div>

{/* Office Address Footer */}
<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-br from-gray-900 to-gray-700 text-white p-3 text-center rounded-b-3xl">
  <h4 className="text-[10px] font-semibold uppercase tracking-wide mb-1 text-amber-400">
    Head Office
  </h4>
  <div className="text-[9px] leading-tight opacity-90 font-light">
    123 Business Park, Hinjawadi Phase 1,<br />
    Pune, Maharashtra 411057, India<br />
    <strong>Phone:</strong> +91-20-1234-5678
  </div>
</div>

{/* Security Badge */}
<div className="absolute top-36 -right-4 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-amber-500/40 transform rotate-12">
  ✓
</div>

{/* Security Pattern */}
<div className="absolute top-52 -left-8 w-15 h-15 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent rounded-full transform -rotate-30"></div>
</div>

 <button
onClick={downloadPDF}
className="mt-5 px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow hover:bg-teal-600 transition"
>
Download ID Card PDF
</button>  
      
    </div>


  );

};

export default IdCard;






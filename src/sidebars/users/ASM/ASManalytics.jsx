import React, { useCallback, useEffect } from 'react'
import { Users, DollarSign, UserCheck, Banknote } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { getAnalytics } from '../../../feature/thunks/asmThunks';


const ASManalytics = () => {

  const navigate = useNavigate();


  const dispatch = useDispatch();

  // Access state from Redux
  const { loading, error, success, analyticsData } = useSelector(
    (state) => state.rm.analyticsdashboard // same key as in slice
  );



  const location = useLocation();
  const { id , role } = location.state || {};


    // Call API when component mounts
    useEffect(() => {

      if (id) {
        dispatch(getAnalytics(id)); // dispatch thunk with userId
      }
    }, [dispatch, id]);


    const MetricCard = ({ 
      title, 
      value, 
      icon, 
      color, 
      onClick, 
      isClickable = false, 
      ariaLabel ,
      path,
      idData,
    }) => {
      const cardClasses = `
        bg-white p-6 rounded-lg shadow-md transition-all duration-200
        ${isClickable 
          ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none' 
          : 'hover:shadow-lg'
        }
      `;

    
      const CardContent = () => (
        <>
          <div className="flex items-center justify-between mb-4"

               onClick={() => {  navigate(path, { state: { id: idData } })}}
          >
            <h3 className="text-slate-600 font-medium text-sm">{title}</h3>
            <div
              className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center shadow-sm`}
              aria-hidden="true"
            >
              {icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </>
      );
    
      if (isClickable && onClick) {
        return (
          <button
            className={cardClasses}
            onClick={onClick}
            aria-label={ariaLabel || `View details for ${title}: ${value}`}
            type="button"
          >
            <CardContent />
          </button>
        );
      }
    
      return (
        <div className={cardClasses} aria-label={ariaLabel}>
          <CardContent />
        </div>
      );
    };


      // Format currency values
  const formatCurrency = useCallback((value) => {
    if (typeof value !== 'number') return '0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 p-2">

    {/* ASM Info Card */}
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1 - Basic Info */}
         <div>
          <h3 className="text-xl font-semibold mb-1 text-[#111827]">{analyticsData?.profile?.name}</h3>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
              analyticsData?.profile?.status === "SUSPENDED"
                ? "bg-red-50 text-red-600"
                : analyticsData?.profile?.status === "ACTIVE"
                ? "bg-[#12B99C]/20 text-[#12B99C]"  // Primary color for active status
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {analyticsData?.profile?.status}
          </span>
        </div> 
    
        {/* Column 2 - Contact Information */}
         <div>
          <h4 className="text-sm font-semibold text-[#1E3A8A] mb-2">Contact Information</h4>
          <div className="space-y-1">
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm text-[#111827]">{analyticsData?.profile?.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-[#111827]">{analyticsData?.profile?.email}</p>
            </div>
          </div>
        </div> 
    
        {/* Column 3 - System Information */}
        <div>
          <h4 className="text-sm font-semibold text-[#1E3A8A] mb-2">System Information</h4>
          <div className="space-y-1">
            <div>
              <p className="text-xs text-gray-500">Employee ID</p>
              <p className="text-sm text-[#111827]">{analyticsData?.profile?.employeeId}</p>
            </div>
        
          </div>
        </div>


      </div>
    </div>
    
    
    
    
    
    
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">


          <MetricCard
          title="Total Partners"
          value={analyticsData?.analytics?.totals?.partners}
          icon={<Users className="w-5 h-5 text-white" />}
          color="bg-blue-800"
        //   onClick={handleNavigateToPartner}
        ariaLabel={`${analyticsData?.partner} partners`}
        path="/asm/partners"
        idData={id}
        />
   
  
    
             <MetricCard
              title="Total Customers"
              value={analyticsData?.analytics?.totals?.customers}
              icon={<Users className="w-5 h-5 text-white" />}
              color="bg-amber-500"
              ariaLabel={`${analyticsData?.totals?.customers} customers`}
              path="/asm/customers"
         
            />
    

            <MetricCard
              title="Total Disbursed"
              value={ formatCurrency(analyticsData?.analytics?.totalDisbursed)  }
              icon={<Banknote className="w-5 h-5 text-white" />}
              color="bg-purple-600"
              ariaLabel={`Disbursed amount of ${formatCurrency(analyticsData?.analytics?.totalDisbursed)}`}
            /> 


          </div> 
    
          {/* Performance Section */}

          
           <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-slate-700 mb-6">Performance</h2>
    
            <div className="space-y-4">
              <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">{new Date().getFullYear()} Performance</span>
                <span className="flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {analyticsData?.analytics?.performance}
                </span>
              </div>
    
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>Disbursed: {formatCurrency(analyticsData?.analytics?.totalDisbursed)}</span> 
                <span>Target: {formatCurrency(analyticsData?.analytics?.assignedTarget)}</span> 
              </div>
    
            
        {/* Progress Bar */}
<div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
  <div
    className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-500 ease-out"
    style={{
      width: `${
        Math.min(
          ((analyticsData?.analytics?.totalDisbursed || 0) /
            (analyticsData?.analytics?.assignedTarget || 1)) *
            100,
          100
        ).toFixed(2)
      }%`
    }}
    role="progressbar"
    aria-valuenow={Math.min(
      ((analyticsData?.analytics?.totalDisbursed || 0) /
        (analyticsData?.analytics?.assignedTarget || 1)) *
        100,
      100
    ).toFixed(2)}
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label={`Performance: ${
      Math.min(
        ((analyticsData?.analytics?.totalDisbursed || 0) /
          (analyticsData?.analytics?.assignedTarget || 1)) *
          100,
        100
      ).toFixed(2)
    }%`}
  />
</div>
       


            </div>

            
          </div> 

          
        </div>
  )


}

export default ASManalytics

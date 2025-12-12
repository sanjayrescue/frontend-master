import React from 'react';
import {
  DollarSign,
  Zap,
  Home,
  Car,
  User,
  FileText,
  Building2,
  Users,
  FileCheck,
  FileSpreadsheet,
  FileBarChart,
  RefreshCcw,
  Briefcase,
  Globe,
  Layers,
  Shield,
  Store,
  PenTool,
  Pill,
  Book,
  Clipboard,
  Calculator,
  BarChart2
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const Services = () => {
const navigate = useNavigate();
    const services = [
  {
    id: 1,
    title: "Personal Loan",
    description: "We are providing Personal Loans for individuals having salary between ₹12k and ₹5 lac.",
    amount: "₹12k min Sal",
    icon: User,
    features: [
      "Salary requirement: ₹12k to ₹5 lac",
      "Quick approval process",
      "Minimal documentation",
      "Competitive interest rates"
    ],
      link: "/partner/application/personal-loan",
    gradient: "from-blue-500 to-purple-600",
    hoverGradient: "hover:from-blue-600 hover:to-purple-700"
  },
  {
    id: 2,
    title: "Home Loan Salaried",
    description: "Get instant loans within 10 minutes using just your Aadhaar and PAN card details.",
    amount: "Call Us to Know",
    icon: Home,
    features: [
      "For salaried Person",
      "1 Day approval",
      "Digital process",
      "Instant disbursement"
    ],
     link: "/partner/application/home-loan-salaried",
    gradient: "from-emerald-500 to-teal-600",
    hoverGradient: "hover:from-emerald-600 hover:to-teal-700"
  },
  {
    id: 3,
    title: "Home Loan Bussiness",
    description: "We provide home loans for salaried employees and business owners with flexible terms.",
    amount: "Call Us to Know",
    icon: Building2,
    features: [
      "For Business persons",
      "Flexible repayment terms",
      "Low interest rates",
      "Up to 90% financing"
    ], link: "/partner/application/home-loan-self-employed",
    gradient: "from-orange-500 to-red-600",
    hoverGradient: "hover:from-orange-600 hover:to-red-700"
  },
  {
    id: 4,
    title: "Business Loan",
    description: "Finance your dream vehicle with our comprehensive vehicle loan solutions.",
    amount: "Any Bussiness",
    icon: Briefcase,
    features: [
      "Lowest Rate",
      "Quick processing",
      "Competitive rates",
      "Flexible tenure"
    ],  link: "/partner/application/business-loan",
    gradient: "from-indigo-500 to-blue-600",
    hoverGradient: "hover:from-indigo-600 hover:to-blue-700"
  },  
];

 
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
     
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Financial Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect loan solution tailored to your financial needs
          </p>
         
         
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#12B99C] to-[#12B99C] rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
 
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
               
                <div className={`h-1 bg-gradient-to-r ${service.gradient}`}></div>
               
                <div className="p-6 flex flex-col h-full justify-between">

                 
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${service.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent size={24} />
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r ${service.gradient}`}>
                      {service.amount}
                    </span>
                  </div>
 
               
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>
 
                 
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
 
                 
                  <ul className="space-y-2 mb-6">
                    {service?.features?.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <span className="text-green-500 mr-2 flex-shrink-0 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
 
               
                  <button
                     onClick={() => navigate(service.link)}
                     className={`w-full py-3 px-4 bg-gradient-to-r ${service.gradient} ${service.hoverGradient} text-white font-semibold rounded-xl shadow-lg`}
                   >
                     Apply Now
                   </button>
                </div>
 
             
                <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
              </div>
            );
          })}
        </div>
 
     
  
      </div>
    </section>
  );
};
 
export default Services;
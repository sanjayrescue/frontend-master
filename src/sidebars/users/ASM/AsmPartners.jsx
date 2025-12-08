import React, { useState, useMemo, useEffect } from "react";
import { Eye, Search } from "lucide-react";
import {
  activatePartner,
  fetchAsmPartners,
  reassignCustomersAndDeactivatePartner,
} from "../../../feature/thunks/asmThunks";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuthData, saveAuthData } from "../../../utils/localStorage";
import axios from "axios"
import { backendurl } from "../../../feature/urldata";





const colors = {
  primary: "#12B99C",
  secondary: "#1E3A8A",
  background: "#F8FAFC",
  accent: "#F59E0B",
  text: "#111827",
};

export default function AsmPartner() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [newPartnerId, setNewPartnerId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [customerToView, setCustomerToView] = useState(null);
  const [Partners, setPartners] = useState([]);
  console.log("Partners", Partners)

  const location = useLocation();
  const { id } = location.state || {};

  const navigate = useNavigate()

  useEffect(() => {
    setSearchQuery(id);
  }, [id]);

  // Filtered list
  const filteredCustomers = useMemo(() => {
    if (!Partners || Partners.length === 0) return [];
    const term = searchQuery?.trim().toLowerCase();
    if (!term) return Partners;

    return Partners.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const phone = (c.phone || "").toLowerCase();
      const id = (c.id || "").toString().toLowerCase();
      const email = (c.email || "").toLowerCase();
      const rmId = (c.Partners || "").toLowerCase();
      const employeeId= (c.employeeId|| "" ).toLowerCase();
      // const profilePic = (c.profilePic)

      
      return (
        name.includes(term) ||
        phone.includes(term) ||
        id.includes(term) ||
        email.includes(term) ||
        rmId.includes(term) ||
        employeeId.newPartnerId(term)
      );
    });
  }, [Partners, searchQuery]);

  const handleViewCustomer = (customer) => {
    setCustomerToView(customer);
    setShowViewModal(true);
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const dispatch = useDispatch();

  const { data, loading, success, error } = useSelector(
    (state) => state.asm.partners
  );

  const otherPartners = data.filter((p) => p._id !== selectedPartner?._id);

 

  useEffect(() => {
    dispatch(fetchAsmPartners());
  }, [dispatch]);

  useEffect(() => {
    if (success && data) {
      // Transform API response -> table format
      const mapped = data.map((p, i) => ({
        id: p._id, // prefer employeeId
        name: `${p.firstName || ""} ${p.lastName || ""}`.trim(),
        phone: p.phone || "-",
        email: p.email || "-",
        Partners: p.rmId,
        PartnersID: p._id,
        employeeId: p.employeeId,
        profilePic: p.profilePic,

        createdOn: new Date(p.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        activation: p.status,
        assignTo: {
          asmName: p.asmName || "",
          rmName: p.rmName || "",
          partnerName: p.partnerName || "",
          asmEmployeeId: p.asmEmployeeId || "",
          rmEmployeeId: p.rmEmployeeId || "",
         
        },
        paymentStatus: "pending", // API doesn’t have, set default or remove
      }));
      setPartners(mapped);
    }
  }, [success, data]);

  const toggleActivation = (partner) => {
    if (partner.activation === "ACTIVE") {
      setSelectedPartner(partner);
      setModalOpen(true);
    } else {
      // Optionally handle re-activation here
    }
  };

  const handleCancelDeactivation = () => {
    setModalOpen(false);
    setSelectedPartner(null);
  };

  const handleConfirmDeactivation = () => {
   

    dispatch(
      reassignCustomersAndDeactivatePartner({
        oldPartnerId: selectedPartner.PartnersID,
        // newPartnerId: newPartnerId,
      })
    );
  };

  const loginAsUser = async (userId, navigate) => {
    try {
      const { asmToken } = getAuthData();
      if (!asmToken) throw new Error("Admin not authenticated");
  
      const res = await axios.post(
        `${backendurl}/auth/login-as/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${asmToken}` } }
      );
  
      const { token, user } = res.data;
  
      // Save impersonated token without removing admin token
      saveAuthData(token, user, true);
  
      // Navigate to role
      switch (user.role) {
        case "ASM": navigate("/asm"); break;
        case "RM": navigate("/rm"); break;
        case "PARTNER": navigate("/partner"); break;
        case "CUSTOMER": navigate("/customer"); break;
        default: navigate("/"); break;
      }
    } catch (err) {
      console.error("Login as user failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message || "Login as user failed");
    }
  };
  
 // Usage in component
const handleLoginAs = (userId) => {
  console.log(userId)
loginAsUser(userId, navigate);
};

  
  return (
    <>
      <div className="min-h-screen" style={{ background: colors.background }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Partners</h2>
              <p className="text-gray-600 mt-1">
                Total {filteredCustomers?.length || 0} records found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-[#12B99C] focus:border-transparent"
                  placeholder="Search by name, phone, or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: colors.primary }}>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      User Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Create on
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Login as
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Activation
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black-100">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-gray-50 transition-colors  border-b"
                      >
                        <td className="px-4 py-2  border-b">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                            
                            >

                              <img src={c?.profilePic} alt="profile"  className="border border-gray-900"/> 
                              {/* {c.name?.charAt(0).toUpperCase()} */}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {c.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                            { c.employeeId}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">
                            {c.phone}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">
                            {formatDate(c.createdOn)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button className="px-2 py-1 border border-[#1E3A8A] text-[#1E3A8A] text-sm transition-colors font-medium cursor-pointer"
                          onClick={()=> handleLoginAs(c.id)}
                          >
                            Login
                          </button>
                        </td>

                        <td className="px-2 py-3 align-middle">
                          <div
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                              c.activation === "ACTIVE"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                            onClick={() => {

                              if(c.activation === "ACTIVE"){
                                toggleActivation(c)
                              }
                              else{
                                dispatch(activatePartner(c.id));

                              }

                        
                              }}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                                c.activation === "ACTIVE"
                                  ? "translate-x-6"
                                  : "translate-x-0"
                              }`}
                            ></div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <button
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            onClick={() => handleViewCustomer(c)}
                            title="View Details"
                          >
                            <Eye size={16} className="text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="text-gray-500">
                          <p className="text-lg font-medium">
                            No partners found
                          </p>
                          <p className="text-sm mt-1">
                            Try adjusting your search criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* View Partner Details Modal */}
      {showViewModal && customerToView && (
        <div
          className="fixed inset-0 bg-black/25 flex items-center justify-center z-50 p-4"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-[#12B99C] text-white rounded-t-2xl">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">Partner Details</h3>
                <button
                  className="text-white/80 hover:text-white rounded-full p-2"
                  onClick={() => setShowViewModal(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-[#F8FAFC] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-[#111827] mb-4 text-base">
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <p>
                      <strong className="text-gray-700">Name:</strong>{" "}
                      <span className="text-gray-900">
                        {customerToView.name}
                      </span>
                    </p>
                    <p>
                      <strong className="text-gray-700">Email:</strong>{" "}
                      <span className="text-gray-900">
                        {customerToView.email}
                      </span>
                    </p>
                    <p>
                      <strong className="text-gray-700">Phone:</strong>{" "}
                      <span className="text-gray-900">
                        {customerToView.phone}
                      </span>
                    </p>
                    <p>
                      <strong className="text-gray-700">Created On:</strong>{" "}
                      <span className="text-gray-900">
                        {formatDate(customerToView.createdOn)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-[#111827] mb-4 text-base">
                    Account Information
                  </h4>
                  <div className="space-y-3">
                    <p>
                      <strong className="text-gray-700">Partner ID:</strong>{" "}
                      <span className="text-gray-900 font-mono">
                        {customerToView.employeeId                        }
                      </span>
                    </p>
                    <p>
                      <strong className="text-gray-700">Payment Status:</strong>
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customerToView.paymentStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {customerToView.paymentStatus.toUpperCase()}
                      </span>
                    </p>
                    <p>
                      <strong className="text-gray-700">Status:</strong>
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customerToView.activation
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customerToView.activation ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 md:col-span-2">
                  <h4 className="font-semibold text-[#111827] mb-4 text-base">
                    Assignment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong className="text-gray-700">ASM:</strong>
                        <span className="text-gray-900 ml-1">
                          {customerToView.assignTo.asmName || "Not Assigned"}
                        </span>
                      </p>
                  
                
                      <p className="mt-2">
                        <strong className="text-gray-700">RM:</strong>
                        <span className="text-gray-900 ml-1">
                          {customerToView.assignTo.rmName || "Not Assigned"}
                        </span>
                      </p>
                   
                    </div>

                    <div>
                    <p>
                        <strong className="text-gray-700">ASM Employee Id</strong>
                        <span className="text-gray-900 ml-1">
                          {customerToView.assignTo.asmEmployeeId || "Not Assigned"}
                        </span>
                      </p>
                      <p className="mt-2">
                        <strong className="text-gray-700">Rm Employee Id</strong>
                        <span className="text-gray-900 ml-1">
                          {customerToView.assignTo.rmEmployeeId || "Not Assigned"}
                        </span>
                      </p>
                 
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="px-6 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">


        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Suspend Partner
          </h3>
          <p className="text-gray-700 mb-6">
            Are you sure you want to <span className="font-semibold text-red-600">suspend</span> the partner{" "}
            <span className="font-semibold">{selectedPartner?.name}</span>?<br />
            This will deactivate their account and they will not be able to log in.
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
              onClick={handleCancelDeactivation}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              onClick={() => {
                handleConfirmDeactivation();
                setModalOpen(false);
                setSelectedPartner(null);
              }}
            >
              Yes, Suspend
            </button>
          </div>
        </div>
         
        </div>
      )}
    </>
  );
}

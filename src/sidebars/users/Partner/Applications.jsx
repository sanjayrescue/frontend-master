import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  X,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthData } from "../../../utils/localStorage";
import { backendurl } from "../../../feature/urldata";

const Application = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // remark
  const [open, setOpen] = useState(false);
  const [selectedRemark, setSelectedRemark] = useState("");

  const remark = "This is the remark you want to show in the popup."; // You can replace with dynamic data

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { partnerToken } = getAuthData(); // 🔑 Adjust if you store token differently
        const res = await axios.get(`${backendurl}/partner/get-applications`, {
          headers: { Authorization: `Bearer ${partnerToken}` },
        });

        const mappedData = res.data.map((app) => ({
          id: app.appNo || app._id, // Prefer appNo (e.g., TLF0001)
          customerName: `${app.customer?.firstName || ""} ${
            app.customer?.lastName || ""
          }`.trim(),
          contact: app.customer?.phone || app.customerId?.phone || "—",
          dateSubmitted: app.createdAt, // ISO string → will format later in UI
          loanType: app.loanType || "—",
          loanAmount: app.customer?.loanAmount
            ? `₹${app.customer.loanAmount.toLocaleString("en-IN")}`
            : "—",
          approvalAmount: app.approvedLoanAmount
            ? `₹${app.approvedLoanAmount.toLocaleString("en-IN")}`
            : "—",
          status: mapStatus(app.status), // normalize backend → UI
          stageHistory: app.stageHistory || [],
        }));

        setApplications(mappedData);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // ✅ Status normalizer: backend enums → UI friendly labels
  const mapStatus = (status) => {
    switch (status) {
      case "DRAFT":
        return "DRAFT";
      case "SUBMITTED":
        return "SUBMITTED";
      case "DOC_INCOMPLETE":
        return "DOC_INCOMPLETE";
      case "DOC_COMPLETE":
        return "DOC_COMPLETE";
      case "DOC_SUBMITTED":
        return "DOC_SUBMITTED";
      case "UNDER_REVIEW":
        return "UNDER_REVIEW";
      case "APPROVED":
        return "APPROVED";
      case "AGREEMENT":
        return "AGREEMENT";
      case "REJECTED":
        return "REJECTED";
      case "DISBURSED":
        return "DISBURSED";
      default:
        return status || "Unknown";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "DISBURSED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      application.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.loanType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const summaryStats = {
    total: applications.length,
    inProcess: applications.filter((a) => a.status === "In Process").length,
    disbursed: applications.filter((a) => a.status === "Disbursed").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  function getStatusCount(customers, status) {
    if (!Array.isArray(customers)) return 0;

    return customers.filter(
      (customer) =>
        customer.status &&
        customer.status.toUpperCase() === status.toUpperCase()
    ).length;
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/25 bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative mx-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Remark</h2>
            <p className="text-gray-600 mb-6 break-words">{selectedRemark}</p>

            <div className="flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-7xl py-4 sm:py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#1E3A8A" }}>
                Applications
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Monitor and manage loan applications
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90 text-sm sm:text-base w-full sm:w-auto justify-center"
              style={{ backgroundColor: "#12B99C" }}
              onClick={() => {
                navigate("/partner/get-loan");
              }}
            >
              <Plus size={18} /> New Application
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="text-xl sm:text-2xl font-bold mb-1"
                    style={{ color: "#111827" }}
                  >
                    {summaryStats.total}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Total Applications
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-blue-100 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="text-xl sm:text-2xl font-bold mb-1"
                    style={{ color: "#F59E0B" }}
                  >
                    {getStatusCount(applications, "DRAFT")}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">In Process</div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Clock size={20} className="text-yellow-100 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold mb-1 text-green-600">
                    {getStatusCount(applications, "DISBURSED")}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Disbursed</div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-100 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold mb-1 text-red-600">
                    {getStatusCount(applications, "REJECTED")}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Rejected</div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <XCircle size={20} className="text-red-100 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search applications by ID, customer name, or loan type..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base"
                  style={{ focusRingColor: "#12B99C" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative w-full lg:w-auto">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  className="w-full lg:w-auto pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-sm sm:text-base"
                  style={{ focusRingColor: "#12B99C" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="DRAFT">Draft</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="DOC_INCOMPLETE">Document Incomplete</option>
                  <option value="DOC_COMPLETE">Document Complete</option>
                  <option value="DOC_SUBMITTED">Document Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="AGREEMENT">Agreement</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="DISBURSED">Disbursed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications Table - Desktop */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#12B99C" }}>
                  <tr>
                    <th
                      className="px-4 py-4 text-left text-sm font-semibold"
                      style={{ color: "white" }}
                    >
                      User Name
                    </th>
                    <th
                      className="px-4 py-4 text-left text-sm font-semibold"
                      style={{ color: "white" }}
                    >
                      Application Id
                    </th>
                    <th
                      className="px-4 py-4 text-left text-sm font-semibold"
                      style={{ color: "white" }}
                    >
                      Contact
                    </th>
                    <th
                      className="px-4 py-4 text-left text-sm font-semibold"
                      style={{ color: "white" }}
                    >
                      Date
                    </th>
                    <th
                      className="px-4 py-4 text-left text-sm font-semibold"
                      style={{ color: "white" }}
                    >
                      Loan Type
                    </th>
                    <th
                      className="px-4 py-4 text-left text-sm font-semibold"
                      style={{ color: "white" }}
                    >
                      Loan Amount
                    </th>
                    <th
                      className="px-4 py-4 text-left text-sm font-semibold"
                      style={{ color: "white" }}
                    >
                      Approval Amount
                    </th>
                    <th
                      className="px-4 py-4 text-left text-sm font-semibold"
                      style={{ color: "white" }}
                    >
                      Status
                    </th>
                    <th
                      className="px-4 py-4 text-left text-sm font-semibold"
                      style={{ color: "white" }}
                    >
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplications.map((application) => (
                    <tr
                      key={application.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {application.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div
                            className="text-sm font-medium"
                            style={{ color: "#111827" }}
                          >
                            {application.customerName}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className="font-mono text-sm font-medium"
                          style={{ color: "#111827" }}
                        >
                          {application.id}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-600">
                          {application.contact}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(application.dateSubmitted)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm" style={{ color: "#111827" }}>
                          {application.loanType}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className="text-sm font-medium"
                          style={{ color: "#111827" }}
                        >
                          {application.loanAmount}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className="text-sm font-medium"
                          style={{ color: "#111827" }}
                        >
                          {application.approvalAmount}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            className="px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition-opacity text-sm"
                            style={{ backgroundColor: "orange" }}
                            title="View"
                            onClick={() => {
                              const lastRemark = application.stageHistory
                                ?.length
                                ? application.stageHistory[
                                    application.stageHistory.length - 1
                                  ].note
                                : "No remarks available";

                              setSelectedRemark(lastRemark);
                              setOpen(true);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Applications Cards - Mobile & Tablet */}
          <div className="lg:hidden space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-xl shadow-sm p-4">
                {/* Header with avatar and name */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {application.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {application.customerName}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {application.id}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Contact</div>
                    <div className="font-medium text-gray-900">{application.contact}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Date</div>
                    <div className="font-medium text-gray-900">
                      {formatDate(application.dateSubmitted)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Loan Type</div>
                    <div className="font-medium text-gray-900">{application.loanType}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Loan Amount</div>
                    <div className="font-medium text-gray-900">{application.loanAmount}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Approval Amount</div>
                    <div className="font-medium text-gray-900">{application.approvalAmount}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity text-sm"
                    style={{ backgroundColor: "orange" }}
                    onClick={() => {
                      const lastRemark = application.stageHistory
                        ?.length
                        ? application.stageHistory[
                            application.stageHistory.length - 1
                          ].note
                        : "No remarks available";

                      setSelectedRemark(lastRemark);
                      setOpen(true);
                    }}
                  >
                    View Remarks
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm text-center py-12 text-gray-500">
              <div className="mb-4">
                <Search size={48} className="mx-auto text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-sm sm:text-base">No applications match your search criteria.</p>
            </div>
          )}

          {/* Results Summary */}
          {filteredApplications.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-600">
              Showing {filteredApplications.length} of {applications.length}{" "}
              applications
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Application;
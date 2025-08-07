import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const RateManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newService, setNewService] = useState("");
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  
  // New state for tab functionality and data display
  const [selectedService, setSelectedService] = useState(null);
  const [serviceData, setServiceData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/accounts");
        setCompanies(response.data);
      } catch (err) {
        setError("Failed to fetch companies.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSelect = async (selectedOption) => {
    const company = companies.find((c) => c._id === selectedOption.value);
    setSelectedCompany(company);
    setServices([]);
    setMessage("");
    setToasterMessage("");
    setSelectedService(null);
    setServiceData([]);

    try {
      const response = await axios.get(
        "http://localhost:4000/api/get-company-services",
        {
          params: {
            companyName: company.companyName.toLowerCase(),
          },
        }
      );

      const servicesArray = response.data.services || [];

      setServices(servicesArray);

      if (servicesArray.length === 0) {
        setToasterMessage("No services found. Please create a new service.");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to fetch services.");
    }
  };

  const handleCreateService = async () => {
    if (!newService || !selectedCompany) return;

    try {
      const response = await axios.post(
        "http://localhost:4000/api/create-service-type",
        {
          serviceName: newService.trim(),
          companyName: selectedCompany.companyName,
        }
      );

      const { message, collection } = response.data;
      setServices((prev) =>
        prev.includes(collection) ? prev : [...prev, collection]
      );
      setMessage(message);
      setNewService(""); // reset input
      setIsModalOpen(false); // close modal
    } catch (err) {
      console.error("Create service error:", err);
      setMessage("Failed to create service.");
    }
  };

  // New function to handle service tab click
  const handleServiceClick = async (serviceName) => {
    setSelectedService(serviceName);
    setCurrentPage(1);
    await fetchServiceData(serviceName, 1);
  };

  // New function to fetch service data
  const fetchServiceData = async (serviceName, page = currentPage) => {
    setDataLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/get-services", {
        params: {
          serviceName: serviceName,
          page: page,
          limit: limit,
        },
      });

      setServiceData(response.data.data);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
    } catch (err) {
      console.error("Error fetching service data:", err);
      setError("Failed to fetch service data.");
    } finally {
      setDataLoading(false);
    }
  };

  // New function to handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchServiceData(selectedService, newPage);
    }
  };

  const companyOptions = companies.map((company) => ({
    value: company._id,
    label: company.companyName || company.name,
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-6xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Rate Management
        </h1>

        {loading ? (
          <LoadingIndicator />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            <CompanySelector options={companyOptions} onSelect={handleSelect} />

            {selectedCompany && (
              <>
                <CompanyDetails company={selectedCompany} />
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">
                    Services
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                  >
                    Create New Service
                  </button>
                </div>
                <ServiceTabs 
                  services={services} 
                  selectedService={selectedService}
                  onServiceClick={handleServiceClick}
                />
                
                {/* Data Table Section */}
                {selectedService && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      {selectedService} Data
                    </h3>
                    {dataLoading ? (
                      <div className="text-center py-4">Loading data...</div>
                    ) : (
                      <>
                        <DataTable data={serviceData} />
                        <Pagination 
                          currentPage={currentPage}
                          totalPages={totalPages}
                          total={total}
                          onPageChange={handlePageChange}
                        />
                      </>
                    )}
                  </div>
                )}

                {toasterMessage && (
                  <div className="mt-4 text-red-500 text-center">
                    {toasterMessage}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Modal for Creating New Service */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3 className="text-lg font-semibold mb-4">Create New Service</h3>
          <input
            type="text"
            placeholder="Enter service name"
            className="p-2 border rounded-md w-full"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCreateService}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              Create
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const LoadingIndicator = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-5 bg-gray-300 rounded w-1/3 mx-auto" />
    <div className="h-10 bg-gray-300 rounded" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-red-500 text-center">{message}</div>
);

const CompanySelector = ({ options, onSelect }) => (
  <>
    <label className="block text-gray-700 text-sm font-medium mb-2">
      Select a Company:
    </label>
    <Select
      options={options}
      onChange={onSelect}
      placeholder="Search or select a company..."
      className="mb-6"
      styles={{
        control: (base) => ({
          ...base,
          padding: "2px",
          borderRadius: "0.375rem",
          borderColor: "#d1d5db",
        }),
      }}
    />
  </>
);

const CompanyDetails = ({ company }) => (
  <div className="border-t border-gray-200 pt-4 mb-6">
    <h2 className="text-lg font-semibold text-gray-700 mb-3">
      Company Details:
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
      <DetailRow label="Name" value={company.name} />
      <DetailRow label="Company" value={company.companyName} />
      <DetailRow label="Email" value={company.email} />
      <DetailRow label="Billing Email" value={company.billingEmail} />
      <DetailRow label="Sales Email" value={company.salesEmail || "N/A"} />
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div>
    <span className="font-medium">{label}:</span> {value}
  </div>
);

// Updated ServiceTabs component (formerly ServiceList)
const ServiceTabs = ({ services, selectedService, onServiceClick }) => (
  <div className="mt-6">
    {services.length > 0 ? (
      <div className="flex flex-wrap gap-3">
        {services.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onServiceClick(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all cursor-pointer ${
              selectedService === s
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    ) : (
      <div className="text-gray-500 text-center">No services available.</div>
    )}
  </div>
);

// New DataTable component
const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No data available for this service.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dial Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Platinum USD
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Effective Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item._id || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.locationName || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.dialCode || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.platinumUSD || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.status || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.effectiveDate 
                  ? new Date(item.effectiveDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.createdAt 
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// New Pagination component
const Pagination = ({ currentPage, totalPages, total, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(currentPage - halfVisible, 1);
      let end = Math.min(start + maxVisiblePages - 1, totalPages);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(end - maxVisiblePages + 1, 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center text-sm text-gray-700">
        <span>
          Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} results
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              currentPage === pageNum
                ? "bg-blue-600 text-white"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 w-1/3">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

export default RateManagement;
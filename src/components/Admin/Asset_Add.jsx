import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../UserContext/UserContext';

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    model: "",
    serial_number: "",
    location: "",
    user_name: "",
    asset_value: "",
    vendor_name: "",
    purchase_date: "",
    po_number: "",
    amc_from: "",
    amc_to: "",
    amc_interval: "",
    last_amc: "",
    procure_by: "",
    warranty_upto: "",
    group: "",
    type: "",
    user_id: ''
  });

  const { user } = useContext(UserContext);
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState({ success: null, message: "" });
  const [attachmentError, setAttachmentError] = useState("");
  const [filters, setFilters] = useState({});
  const [dynamicFields, setDynamicFields] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [empDetails, setEmpDetails] = useState([]);
  const [locations, setLocations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [types, setTypes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/dropdown.php`);
        const data = await response.json();
        if (data) {
          setLocations(data.branches || []);
          setGroups(data.groups || []);
          setTypes(data.types || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchEmpDetails = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/Dropdown.php`);
        const data = await response.json();
        setEmpDetails(data.Empdetails || []);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmpDetails();
  }, []);

  useEffect(() => {
    if (formData.type) {
      const fetchDynamicFields = async () => {
        try {
          const response = await fetch(`${baseURL}/backend/get_extra_columns.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ type: formData.type }),
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error("Network response was not ok: " + text);
          }

          const result = await response.json();
          setDynamicFields(result.extra_columns || []);
        } catch (error) {
          console.error("Error fetching dynamic fields:", error);
          toast.error("Error fetching dynamic fields: " + error.message);
        }
      };

      fetchDynamicFields();
    }
  }, [formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'group') {
      setFormData((prev) => ({ ...prev, group: value, type: '' }));
      setDynamicFields([]);
    } else if (name === 'amc_warranty_type') {
      setFormData((prev) => ({
        ...prev,
        amc_warranty_type: value,
        amc_from: '',
        amc_to: '',
        amc_interval: '',
        last_amc: '',
        warranty_upto: '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await fetch(`${baseURL}/backend/asset_add.php`, { method: 'POST', body: form });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Something went wrong");

      if (result.message === "Asset Already Exists") {
        toast.error(result.message);
      } else if (result.message === "Asset added successfully with tag and copied to unapproved assets.") {
        toast.success(result.message);
        location.reload();
      } else {
        throw new Error("Unexpected response message.");
      }
    } catch (error) {
      toast.error("There was a problem with your fetch operation: " + error.message);
    }
  };

  return (
    <div className="bg-second w-full h-full text-xs mx-auto p-1 lg:overflow-y-hidden ticket-scroll">
      <div className="w-full h-full p-2 bg-box rounded-lg">
        <div className="flex font-bold justify-between items-center mb-3 p-3">
          <h1 className="text-lg">Single Asset Add</h1>
          <button
            onClick={() => navigate('/bulk_assetadd')}
            className="flex text-xs items-center px-3 py-2 bg-box border border-gray-400 shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Bulk Import
          </button>
        </div>
        <form onSubmit={handleSubmit} className="ticket-table mt-2 space-y-4 text-label">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-3 ml-10 pr-10 mb-0">
            {[
              { label: "Group", name: "group", value: formData.group, options: groups.map(g => ({ id: g.id, name: g.group })) },
              { label: "Type", name: "type", value: formData.type, options: types.filter(t => t.group_id === formData.group).map(t => ({ id: t.type, name: t.type })) },
              { label: "Manufacturer", name: "manufacturer", value: formData.manufacturer, type: "text" },
              { label: "Model", name: "model", value: formData.model, type: "text" },
              { label: "Serial Number", name: "serial_number", value: formData.serial_number, type: "number" },
              { label: "Branch", name: "location", value: formData.location, options: locations.map(l => ({ id: l.id, name: l.name })) },
              { label: "Employee Name", name: "user_name", value: formData.user_id, options: empDetails.map(e => ({ id: e.employee_id, name: `${e.firstname} ${e.lastname}` })) },
              { label: "Asset Value", name: "asset_value", value: formData.asset_value, type: "number" },
              { label: "Vendor Name", name: "vendor_name", value: formData.vendor_name, type: "text" },
              { label: "Purchase Date", name: "purchase_date", value: formData.purchase_date, type: "date" },
              { label: "PO Number", name: "po_number", value: formData.po_number, type: "text" },
              { label: "AMC / Warranty Type", name: "amc_warranty_type", value: formData.amc_warranty_type, options: [{ id: 'AMC', name: 'AMC' }, { id: 'Warranty', name: 'Warranty' }] },
            ].map(({ label, name, value, type = "select", options }, index) => (
              <div key={index} className="flex items-center mb-2 mr-4">
                <label className="text-sm font-semibold text-prime mr-2 w-32">{label}</label>
                {type === "select" ? (
                  <select name={name} value={value} onChange={handleChange} className="flex-grow text-xs border p-2 rounded-md outline-none transition ease-in-out delay-150 focus:shadow-sm">
                    <option value="">Select {label}</option>
                    {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    placeholder={`Enter ${label}`}
                    value={value}
                    onChange={handleChange}
                    className="flex-grow text-xs border p-2 rounded-md outline-none transition ease-in-out delay-150 focus:shadow-sm"
                  />
                )}
              </div>
            ))}
            {formData.amc_warranty_type === 'AMC' && ['amc_from', 'amc_to', 'amc_interval', 'last_amc'].map((field, i) => (
              <div key={i} className="flex items-center mb-2 mr-4">
                <label className="text-sm font-semibold text-prime mr-2 w-32">{field.replace(/_/g, ' ')}</label>
                <input
                  type={field.includes('interval') ? 'number' : 'date'}
                  name={field}
                  placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                  value={formData[field]}
                  onChange={handleChange}
                  className="flex-grow text-xs border p-2 rounded-md outline-none transition ease-in-out delay-150 focus:shadow-sm"
                />
              </div>
            ))}
            {formData.amc_warranty_type === 'Warranty' && (
              <div className="flex items-center mb-2 mr-4">
                <label className="text-sm font-semibold text-prime mr-2 w-32">Warranty Upto</label>
                <input
                  type="date"
                  name="warranty_upto"
                  value={formData.warranty_upto}
                  onChange={handleChange}
                  className="flex-grow text-xs border p-2 rounded-md outline-none transition ease-in-out delay-150 focus:shadow-sm"
                />
              </div>
            )}
            <div className="flex items-center mb-2 mr-4">
              <label className="text-sm font-semibold text-prime mr-2 w-32">Procure By</label>
              <input
                type="date"
                name="procure_by"
                value={formData.procure_by}
                onChange={handleChange}
                className="flex-grow text-xs border p-2 rounded-md outline-none transition ease-in-out delay-150 focus:shadow-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-3 ml-10 pr-10 mb-0">
            {dynamicFields.map((field, index) => (
              <div key={index} className="flex items-center mb-2 mr-4">
                <label className="capitalize text-sm font-semibold text-prime mr-2 w-32">{field.replace('_', ' ')}</label>
                <input
                  type="text"
                  name={field}
                  placeholder={`Enter ${field.replace('_', ' ')}`}
                  value={formData[field]}
                  onChange={handleChange}
                  className="flex-grow text-xs border p-2 rounded-md outline-none transition ease-in-out delay-150 focus:shadow-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-1 bg-prime font-semibold text-lg text-white py-2 px-8 rounded-md shadow-md focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;

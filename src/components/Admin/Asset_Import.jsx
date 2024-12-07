import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../config.js';

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
        type: ""
    });

    const [groups, setGroups] = useState([]);
    const [types, setTypes] = useState([]);
    const [defaultColumns, setDefaultColumns] = useState([]);
    const [extraColumns, setExtraColumns] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(''); 

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const response = await fetch(`${baseURL}/backend/dropdown.php`);
                const data = await response.json();
                if (data.groups) setGroups(data.groups);
                if (data.types) setTypes(data.types);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };
        fetchDropdownData();
    }, []);

    useEffect(() => {
        return () => {
            setFile(null);
            setFileName('');
        };
    }, []);

    useEffect(() => {
        if (formData.type) {
            const fetchColumns = async () => {
                try {
                    const response = await fetch(`${baseURL}/backend/get_extra_columns.php`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: new URLSearchParams({ type: formData.type }),
                    });

                    const result = await response.json();
                    const excludeFields = ["id", "tag", "post_date"];
                    const filteredDefaultColumns = result.default_columns.filter(field => !excludeFields.includes(field));
                    const filteredExtraColumns = result.extra_columns.filter(field => !excludeFields.includes(field));

                    setDefaultColumns(filteredDefaultColumns);
                    setExtraColumns(filteredExtraColumns);
                } catch (error) {
                    console.error('Error fetching columns:', error);
                }
            };
            fetchColumns();
        }
    }, [formData.type]);

    const handleFieldSelection = (field) => {
        setSelectedFields((prevSelectedFields) =>
            prevSelectedFields.includes(field)
                ? prevSelectedFields.filter(f => f !== field)
                : [...prevSelectedFields, field]
        );
    };

    const handleSelectGroup = (group) => {
        setFormData({
            ...formData,
            group: group.id,
            type: '',
        });
        setDefaultColumns([]);
        setExtraColumns([]);
        setSelectedFields([]);
        setFile(null);
        setIsDialogOpen(false);
    };

    const handleSelectType = (type) => {
        setFormData({
            ...formData,
            type: type.type,
        });
        setSelectedFields([]);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const isCSV = selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv');
            if (isCSV) {
                setFile(selectedFile);  
                setFileName(selectedFile.name);  
            } else {
                toast.error("Only CSV files are allowed.");
                setFile(null);
                setFileName("");
            }
        }
    }; 

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedFields([]);
    };

    const handleExportCSV = () => {
        if (selectedFields.length === 0) {
            toast.error("No fields selected for export.");
            return;
        }
        const templateType = formData.type || "TYPE_NOT_FOUND"; 
        const firstRow = `${templateType}`;
        const secondRow = selectedFields.join(",");
        const csvContent = firstRow + "\n" + secondRow + "\n";
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !formData.type) {
            toast.error("Please select a type and upload a file.");
            return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append("type", formData.type);  
        formDataToSend.append("file", file);  
    
        try {
            const response = await fetch(`${baseURL}/backend/import_add.php`, {
                method: "POST",
                body: formDataToSend,
            });
            const result = await response.json();
            if (result.success) {
                toast.success("Data imported successfully.");
                setFormData({
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
                    type: ""
                });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to import data.");
        }
    };             
    
    const filteredTypes = types.filter(type => type.group_id === formData.group);

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };
  
    const handleImportClick = () => {
        navigate('/single_assetadd');
      };
    return (
        <div className="bg-box h-full p-3">
<div className="flex font-bold justify-between items-center mb-3 p-3 ">
      <h1 className="text-lg">Bulk Asset Import</h1>
      <button
        onClick={handleImportClick}
        className="flex text-xs items-center px-3 py-2 bg-box border border-gray-400 shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform hover:scale-110"
      >
         Single Asset Add +
      </button>
    </div>
        <div className="flex bg-box overflow-hidden gap-4 p-3">
        {/* Column 1: Group Buttons */}
        <div className="w-1/2 bg-box rounded-lg h-full overflow-y-auto flex flex-col justify-center items-center">
            <h2 className="font-bold text-md mb-2">Select Group</h2>
            <div className="flex flex-col items-center w-full">
                {groups.map((group) => (
                    <button
                        key={group.id}
                        onClick={() => handleSelectGroup(group)}
                        className={`m-2 w-2/3 text-xs py-2 px-3 rounded shadow-sm hover:shadow-md border ${formData.group === group.id ? 'bg-blue-500 text-white' : 'bg-second text-black'}`}
                    >
                        {group.group}
                    </button>
                ))}
            </div>
        </div>
    
        {/* Column 2: Type Buttons */}
        <div className="w-1/2 bg-box rounded-lg h-full overflow-y-auto flex flex-col justify-center items-center">
            <h2 className="font-bold text-md mb-2">Select Type</h2>
            {formData.group ? (
                <div className="flex flex-col items-center w-full">
                    {filteredTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => handleSelectType(type)}
                            className={`m-2 w-2/3 text-xs py-2  px-3 rounded shadow-sm hover:shadow-md border ${formData.type === type.type ? 'bg-green-500 text-white' : 'bg-second text-black'}`}
                        >
                            {type.type}
                        </button>
                    ))}
                </div>
            ) : (
                <p>Select group to view types</p>
            )}
        </div>
    
        {/* Column 3: Template and Submit */}
        <div className="w-full bg-box rounded-lg h-full overflow-y-auto flex flex-col justify-center items-center">
            <h2 className="font-bold text-md mb-2">Template Import</h2>
            {formData.type ? (
                <>
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={handleOpenDialog}
                            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md"
                        >
                            Open Template
                        </button>
                    </div>
                    <div className="flex flex-col items-center w-full">
                        <label
                            htmlFor="file-upload"
                            className="bg-gray-300 m-2 w-2/3 cursor-pointer text-black py-2 px-4 rounded-md shadow-md  flex items-center justify-center"
                        >
                            <input
                                id="file-upload"
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            Attach File
                        </label>
                        {fileName && (
                            <p className="text-xs text-gray-600 mt-1">{fileName}</p>
                        )}
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="mt-4 bg-prime font-mont font-semibold text-lg text-white py-2 px-8 rounded-md shadow-md focus:outline-none"
                    >
                        Submit
                    </button>
                </>
            ) : (
                <p>Please select a type to enable import.</p>
            )}
        </div>
    
        {/* Template Dialog */}
        {isDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative z-10">
                    <h2 className="text-xl font-semibold mb-4 text-center">Template Fields</h2>
                    <div className="overflow-y-auto max-h-64">
                        <table className="min-w-full bg-box border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 text-center">Column Names</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...defaultColumns, ...extraColumns].map((field) => (
                                    <tr 
                                        key={field} 
                                        className={`cursor-pointer ${selectedFields.includes(field) ? 'bg-yellow-200' : ''}`} 
                                        onClick={() => handleFieldSelection(field)}
                                    >
                                        <td className="border border-gray-300 p-2 text-center">
                                            {field}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handleCloseDialog}
                            className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md"
                        >
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
    </div>

    );
};

export default Form;

import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import MedicineReport from './MedicineReport';
import StockReport from './StockReport';
import PatientsReport from './PatientsReport';
import { useNavigate } from 'react-router-dom';

function EPrescribeSoftware() {
  const [activeReport, setActiveReport] = useState("medicine");

  const { mmu } = useParams();
  

  const handleTabChange = (event, newValue) => {
    setActiveReport(newValue);
  };

  const navigate = useNavigate();

  const handleApply = () => {
      navigate(-1); // Navigate to the specified route
  };

  let content;

  switch (mmu) {
    case "1":
      content = <p>Kanniyakumari</p>;
      break;
    case "2":
      content = <p>Krishnagiri</p>;
      break;
    case "3":
      content = <p>Nilgiris</p>;
      break;
    case "4":
      content = <p>Tenkasi</p>;
      break;
    case "5":
      content = <p>Tirunelveli</p>;
      break;
    case "6":
      content = <p>Tuticorin</p>;
      break;
    case "7":
      content = <p>Virudhunagar</p>;
      break;
    default:
      content = <p>Dashboard Not defined</p>;
  }


  return (
    <section className='bg-white w-full h-full p-4'>
    <Container className="">
         <span className='font-bold text-prime mt-4 text-xl font-poppins'>{content}</span>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeReport} onChange={handleTabChange}>
          <Tab label="Medicine Report" value="medicine" />
          <Tab label="Stock Report" value="stock" />
          <Tab label="Patients Register" value="patients" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        {activeReport === "medicine" && <MedicineReport />}
        {activeReport === "stock" && <StockReport />}
        {activeReport === "patients" && <PatientsReport />}
      </Box>
    </Container>
    <div className="flex justify-end fixed bottom-6 right-6">
  <button onClick={handleApply} className="bg-prime text-white px-4 py-1 rounded-sm ">Back</button>  
  </div>
    </section>
  );
}

export default EPrescribeSoftware;
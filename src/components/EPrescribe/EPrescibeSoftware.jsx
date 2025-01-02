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

function EPrescribeSoftware() {
  const [activeReport, setActiveReport] = useState("medicine");

  const { mmu } = useParams();
  

  const handleTabChange = (event, newValue) => {
    setActiveReport(newValue);
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
    <Container className="bg-white w-full h-full p-4">
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
  );
}

export default EPrescribeSoftware;
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

  return (
    <Container className="bg-white w-full h-full p-4">
      
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
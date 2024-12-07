import React,{useState} from 'react'
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { PieChart, Pie, Cell, Tooltip, Legend, Label, LabelList } from 'recharts';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Grid } from '@mui/material';
import { LineChart, Line, CartesianGrid, Tooltip as ChartTooltip, Legend as ChartLegend } from 'recharts';


const data1 = [
    { year: '2020', "Current Assets": 400, "Non-Current Assets": 500, "Current Liabilities": 300, "Non-Current Liabilities": 200, "Capital Stock": 150, "Retained Earnings": 350, "Treasury": 100 },
    { year: '2021', "Current Assets": 450, "Non-Current Assets": 550, "Current Liabilities": 320, "Non-Current Liabilities": 220, "Capital Stock": 180, "Retained Earnings": 370, "Treasury": 120 },
    { year: '2022', "Current Assets": 420, "Non-Current Assets": 530, "Current Liabilities": 310, "Non-Current Liabilities": 210, "Capital Stock": 160, "Retained Earnings": 360, "Treasury": 110 },
    { year: '2023', "Current Assets": 470, "Non-Current Assets": 560, "Current Liabilities": 330, "Non-Current Liabilities": 230, "Capital Stock": 190, "Retained Earnings": 380, "Treasury": 130 },
    { year: '2024', "Current Assets": 430, "Non-Current Assets": 540, "Current Liabilities": 340, "Non-Current Liabilities": 240, "Capital Stock": 170, "Retained Earnings": 390, "Treasury": 140 },
  ];
  

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <Typography variant="subtitle1">{label}</Typography>
          {payload.map((entry, index) => (
            <Typography key={`item-${index}`} variant="body2">
              {entry.name}: ${entry.value.toLocaleString()}k
            </Typography>
          ))}
        </div>
      );
    }
  
    return null;
  };

  
function Dashboard() {

  const [activeIndex, setActiveIndex] = useState(null);

  // Function to handle hover events
  const onPieEnter = (data, index) => {
    setActiveIndex(index);
  };

  // Function to handle hover out events
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  
    const currentWeekData = [
      { day: 'Mon', asset: 5000 },
      { day: 'Tue', asset: 15000 },
      { day: 'Wed', asset: 8000 },
      { day: 'Thu', asset: 20000 },
      { day: 'Fri', asset: 18000 },
      { day: 'Sat', asset: 27000 },
      { day: 'Sun', asset: 25000 },
    ];
  
    const previousWeekData = [
      { day: 'Mon', asset: 8000 },
      { day: 'Tue', asset: 12000 },
      { day: 'Wed', asset: 10000 },
      { day: 'Thu', asset: 17000 },
      { day: 'Fri', asset: 19000 },
      { day: 'Sat', asset: 30000 },
      { day: 'Sun', asset: 26000 },
    ];
  


  return (
    <main className='font-poppins m-1 '>
        <section>
        <div className=''>
         <div className='grid grid-cols-2 gap-1 '>
         <div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full bg-box p-4 rounded-sm">
  {/* Box 1 */}
  <div className="bg-box flex justify-around items-center gap-4 shadow-sm p-5 rounded-lg border w-full max-w-xs mx-auto">
    <div>
      <p className="text-center text-sm">Total Assets</p>
      <h2 className="text-4xl font-semibold">1000</h2>
    </div>
    <FaMagnifyingGlassChart size={30} color="#5fdd33" />
  </div>

  {/* Box 2 */}
  <div className="bg-box flex justify-around items-center gap-4 shadow-sm p-5 rounded-lg border w-full max-w-xs mx-auto">
    <div>
      <p className="text-center text-sm">Total Assets</p>
      <h2 className="text-4xl font-semibold">1000</h2>
    </div>
    <FaMagnifyingGlassChart size={30} color="#5fdd33" />
  </div>

  {/* Box 3 */}
  <div className="bg-box flex justify-around items-center gap-4 shadow-sm p-5 rounded-lg border w-full max-w-xs mx-auto">
    <div>
      <p className="text-center text-sm">Total Assets</p>
      <h2 className="text-4xl font-semibold">1000</h2>
    </div>
    <FaMagnifyingGlassChart size={30} color="#5fdd33" />
  </div>

  {/* Box 4 */}
  <div className="bg-box flex justify-around items-center gap-4 shadow-sm p-5 rounded-lg border w-full max-w-xs mx-auto">
    <div>
      <p className="text-center text-sm">Total Assets</p>
      <h2 className="text-4xl font-semibold">1000</h2>
    </div>
    <FaMagnifyingGlassChart size={30} color="#5fdd33" />
  </div>
</div>

    
  </div>
  <div className='bg-box'>
  <CardContent>
        <Typography variant="h6" gutterBottom>
          Asset Details 
        </Typography>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data1} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Current Assets" fill="#00C49F" />
            <Bar dataKey="Non-Current Assets" fill="#0088FE" />
            <Bar dataKey="Current Liabilities" fill="#FFBB28" />
            <Bar dataKey="Non-Current Liabilities" fill="#FF8042" />
            <Bar dataKey="Capital Stock" fill="#6A1B9A" />
            <Bar dataKey="Retained Earnings" fill="#FF4081" />
            <Bar dataKey="Treasury" fill="#1A237E" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
   
  </div>
  </div>
  
</div>

        </section>

{/* Sparkline chart */}
<section className="flex gap-1 mt-1">
  {/* Left Section - Asset Details and Line Chart */}
  <div className="bg-box p-4 rounded-md" style={{ width: '700px' }}>
    <Typography variant="h6" color="text.secondary" gutterBottom>
      Assets by graph
    </Typography>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={6}>
        <Typography variant="subtitle1" color="text.secondary">
          Current Week
        </Typography>
        <Typography variant="h4" color="primary">
          $58,254
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle1" color="text.secondary">
          Previous Week
        </Typography>
        <Typography variant="h4" color="secondary">
          $69,524
        </Typography>
      </Grid>
    </Grid>

    <ResponsiveContainer width="100%" height={300} className="mt-4">
      <LineChart data={currentWeekData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <ChartTooltip />
        <ChartLegend />
        <Line type="monotone" dataKey="asset" stroke="#00C49F" />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Right Section - SVG Map */}
  <div className="bg-box p-4 rounded-md flex-1">
    <Typography variant="h6" color="text.secondary" gutterBottom>
      Asset by Location
    </Typography>
    <div className="flex justify-center items-center">
      <div>
        <svg width="300" height="400" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 550 L80 450 Q90 420, 120 400 Q150 370, 140 340 Q130 300, 170 250 Q180 200, 210 150 Q230 100, 220 50 L250 10"
            fill="#EFEFEF"
            stroke="#333"
            strokeWidth="2"
          />
          <path d="M80 450 Q110 430, 120 400" stroke="#999" strokeWidth="1" />
          <path d="M140 340 Q160 310, 170 250" stroke="#999" strokeWidth="1" />
          <path d="M210 150 Q225 110, 220 50" stroke="#999" strokeWidth="1" />

          <circle cx="120" cy="400" r="5" fill="#FF5722" />
          <text x="130" y="400" fontSize="12" fontFamily="Arial" fill="#333">T Nagar</text>

          <circle cx="170" cy="250" r="5" fill="#FF5722" />
          <text x="180" y="250" fontSize="12" fontFamily="Arial" fill="#333">Guindy</text>

          <circle cx="210" cy="150" r="5" fill="#FF5722" />
          <text x="220" y="150" fontSize="12" fontFamily="Arial" fill="#333">Marina Beach</text>
        </svg>
      </div>
      
      {/* Example location revenue list */}
      <div className="ml-4">
        <Typography variant="subtitle1" color="text.secondary" ><span className='text-xs'>Alwarpet - 61k</span></Typography>
        <Typography variant="subtitle1" color="text.secondary" ><span className='text-xs'>Marina Beach - 72k</span></Typography>
        <Typography variant="subtitle1" color="text.secondary" ><span className='text-xs'>Guindy - 39k</span></Typography>
        <Typography variant="subtitle1" color="text.secondary" ><span className='text-xs'>T Nagar - 25k</span></Typography>
      </div>
    </div>
  </div>
</section>

{/* Pie chart  */}
       <section>
         <div className='flex items-center mt-1 gap-1'>
             <div className='w-2/3 bg-box p-3'>
                    <h2>Newly Added Assets</h2>     
             </div>
             <div className='w-1/3 bg-box p-3'>
                    <h2>Total Assets</h2>    
                    <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={activeIndex === index ? '#82ca9d' : '#8884d8'}
              opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
            />
          ))}
          
          {/* Add non-overlapping labels on top of each pie slice */}
          <LabelList
            dataKey="name"
            fill="#eee"
            fontSize={14}
            dy={-10} // Vertical offset to move the labels above slices
          />
        </Pie>
        <Tooltip />
      </PieChart>
      <div>
        {data.map((entry, index) => (
          <div
            key={index}
            style={{
              display: 'inline-block',
              margin: '0 10px',
              fontWeight: activeIndex === index ? 'bold' : 'normal',
            }}
          >
            <span>{entry.name}</span>
          </div>
        ))}
      </div> 
             </div>
             <div className='w-1/3 bg-box p-3'>
                    <h2>Recent activity</h2>     
             </div>
         </div>
       </section>
       <div style={{ textAlign: 'center' }}>
     
    </div>
    </main>
  )
}

export default Dashboard;
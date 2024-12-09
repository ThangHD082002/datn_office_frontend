import React, { useState } from 'react'
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material'
import { Line } from 'react-chartjs-2'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Mock data for buildings (replace with dynamic data from API if needed)
const buildingOptions = [
  { id: '1', name: 'Building A' },
  { id: '2', name: 'Building B' },
  { id: '3', name: 'Building C' }
]

const SignedContract = () => {
  const [building, setBuilding] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [chartNotes, setChartNotes] = useState('')

  const handleSearch = async () => {
    if (!building || !startDate || !endDate) {
      alert('Please fill in all fields.')
      return
    }

    // Fake data simulation instead of API call
    const fakeData = [
      { date: '2024-12-01', contracts: 12 },
      { date: '2024-12-02', contracts: 15 },
      { date: '2024-12-03', contracts: 10 },
      { date: '2024-12-04', contracts: 18 },
      { date: '2024-12-05', contracts: 7 },
      { date: '2024-12-06', contracts: 22 },
      { date: '2024-12-07', contracts: 14 },
      { date: '2024-12-08', contracts: 16 }
    ]

    // Simulating notes from the response
    const fakeNotes = 'Data is based on mock data for the selected building and date range.'

    // Set chart data and notes
    setChartData(fakeData)
    setChartNotes(fakeNotes)
  }

  const lineData = chartData
    ? {
        labels: chartData.map((item) => item.date),
        datasets: [
          {
            label: 'Số hợp đồng đã ký',
            data: chartData.map((item) => item.contracts),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4, // Smooth line
            pointRadius: 5,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)'
          }
        ]
      }
    : null

  const lineOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày'
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Số hợp đồng đã ký'
        },
        beginAtZero: true
      }
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          p: 4,
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          boxShadow: 1,
          maxWidth: '800px',
          margin: 'auto'
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Thống kê số hợp đồng đã ký
        </Typography>

        {/* Filters Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 4,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <TextField
            select
            label="Chọn Tòa nhà"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            sx={{ flex: 1, minWidth: '200px' }}
          >
            {buildingOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            renderInput={(params) => <TextField {...params} sx={{ flex: 1, minWidth: '200px' }} />}
          />

          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(date) => setEndDate(date)}
            renderInput={(params) => <TextField {...params} sx={{ flex: 1, minWidth: '200px' }} />}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              height: '56px',
              flex: 1,
              minWidth: '150px',
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Search
          </Button>
        </Box>

        {/* Chart Section */}
        {lineData ? (
          <Box>
            <Line data={lineData} options={lineOptions} />
            {chartNotes && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Note: {chartNotes}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            No data to display. Please search for statistics.
          </Typography>
        )}
      </Box>
    </LocalizationProvider>
  )
}

export default SignedContract

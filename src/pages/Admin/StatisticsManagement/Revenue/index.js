import React, { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material'
import { Line } from 'react-chartjs-2'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers'
import axios from 'axios'
import { axiosInstance } from '~/utils/axiosInstance'
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const SignedContract = () => {
  const [building, setBuilding] = useState('')
  const [buildings, setBuildings] = useState([]) // Store the building list
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [chartData, setChartData] = useState(null)

  // Fetch building options on component mount
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axiosInstance.get(`/buildings/all`)
        if (response.data && response.data.result) {
          setBuildings(response.data.result) // Set fetched buildings
        }
      } catch (error) {
        console.error('Error fetching buildings:', error)
        alert('Failed to fetch building options.')
      }
    }

    fetchBuildings()
  }, [])

  // Function to generate an array of dates between startDate and endDate
  const generateDateRange = (start, end) => {
    const dates = []
    let currentDate = new Date(start)
    while (currentDate <= end) {
      dates.push(new Date(currentDate).toISOString().split('T')[0]) // Format as YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return dates
  }

  const handleSearch = async () => {
    if (!building || !startDate || !endDate) {
      alert('Please fill in all fields.')
      return
    }

    try {
      const formattedStartDate = startDate.toISOString().split('T')[0]
      const formattedEndDate = endDate.toISOString().split('T')[0]

      const response = await axiosInstance.post('/contract/stat-building-contracts', {
        buildingId: building,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      })

      const { result, data } = response.data

      if (result.responseCode === 200 && data.length > 0) {
        const dateRange = generateDateRange(startDate, endDate)

        const chartValues = dateRange.map((date) => {
          const found = data.find((item) => item.date === date)
          return found ? found.numberOfContracts : 0
        })

        setChartData({
          labels: dateRange,
          values: chartValues
        })
      } else {
        alert(result.message || 'No data found.')
        setChartData(null)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to fetch data. Please try again later.')
      setChartData(null)
    }
  }

  const lineData = chartData
    ? {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Số hợp đồng đã ký',
            data: chartData.values,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)'
          }
        ]
      }
    : null

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 4, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1, maxWidth: '800px', margin: 'auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Thống kê số hợp đồng đã ký
        </Typography>

        {/* Filters */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
          <TextField
            select
            label="Chọn Tòa nhà"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            sx={{ flex: 1 }}
          >
            {buildings.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            renderInput={(params) => <TextField {...params} sx={{ flex: 1 }} />}
          />

          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(date) => setEndDate(date)}
            renderInput={(params) => <TextField {...params} sx={{ flex: 1 }} />}
          />

          <Button variant="contained" onClick={handleSearch} sx={{ height: '56px', backgroundColor: '#1976d2' }}>
            Search
          </Button>
        </Box>

        {/* Chart */}
        {lineData ? (
          <Box>
            <Line data={lineData} options={{ responsive: true }} />
          </Box>
        ) : (
          <Typography align="center" sx={{ mt: 2 }}>
            No data to display. Please search for statistics.
          </Typography>
        )}
      </Box>
    </LocalizationProvider>
  )
}

export default SignedContract

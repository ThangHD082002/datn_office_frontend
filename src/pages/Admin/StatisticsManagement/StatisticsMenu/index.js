import React, { useState } from 'react'
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, List } from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

const StatisticsMenu = ({ open }) => {
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <>
      {/**
       * Thống kê
       */}
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={[
            {
              minHeight: 48,
              px: 2.5
            },
            open ? { justifyContent: 'initial' } : { justifyContent: 'center' }
          ]}
          onClick={handleExpandClick}
        >
          <ListItemIcon
            sx={[
              {
                minWidth: 0,
                justifyContent: 'center',
                fontSize: '24px'
              },
              open ? { mr: 3 } : { mr: 'auto' }
            ]}
          >
            <BarChartIcon fontSize="large" /> {/* Updated icon */}
          </ListItemIcon>
          <ListItemText
            primary="Thống kê"
            primaryTypographyProps={{ fontSize: '15px' }}
            sx={[open ? { opacity: 1 } : { opacity: 0 }]}
          />
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} href="/admin/statistics/contracts">
            <ListItemText primary="Hợp đồng" primaryTypographyProps={{ fontSize: '14px' }} />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} href="/admin/statistics/revenue">
            <ListItemText primary="Doanh thu" primaryTypographyProps={{ fontSize: '14px' }} />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  )
}

export default StatisticsMenu

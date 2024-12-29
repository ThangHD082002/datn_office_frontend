import React, { useState } from 'react'
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, List, Tooltip } from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import DescriptionIcon from '@mui/icons-material/Description' // Icon for contracts
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const LargeTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .MuiTooltip-tooltip`]: {
      fontSize: theme.typography.pxToRem(16), // Set tooltip font size
      backgroundColor: theme.palette.background.paper, // Optional: customize background
      color: theme.palette.text.primary, // Optional: customize text color
      border: '1px solid #dadde9' // Optional: add a border
    }
  })
)

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
            <BarChartIcon fontSize="large" />
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
          <LargeTooltip title="Thống kê hợp đồng" placement="right">
            <ListItemButton sx={{ pl: 4 }} href="/admin/statistics/contracts">
              <ListItemIcon>
                <DescriptionIcon fontSize="medium" />
              </ListItemIcon>
              {open && <ListItemText primary="Hợp đồng" primaryTypographyProps={{ fontSize: '14px' }} />}
            </ListItemButton>
          </LargeTooltip>
        </List>
      </Collapse>
    </>
  )
}

export default StatisticsMenu

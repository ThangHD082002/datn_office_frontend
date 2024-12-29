import * as React from 'react'
import styles from './SidebarAdmin.module.scss'
import classNames from 'classnames/bind'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ApartmentIcon from '@mui/icons-material/Apartment'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import ContactPageIcon from '@mui/icons-material/ContactPage'
import GroupIcon from '@mui/icons-material/Group'
import PreviewIcon from '@mui/icons-material/Preview'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import StatisticsMenu from '~/pages/Admin/StatisticsManagement/StatisticsMenu'


import { useState } from 'react';
import { Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const cx = classNames.bind(styles)
const drawerWidth = 240

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  backgroundColor: '#B7272D',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })
      }
    }
  ]
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme)
      }
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme)
      }
    }
  ]
}))

function SidebarAdmin({ onToggle }) {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  const handleDrawerOpen = () => {
    setOpen(true)
    onToggle(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
    onToggle(false)
  }

  const clickLogout = () => {
    // Kiểm tra và xóa 'authToken'
    if (localStorage.getItem('authToken')) {
      localStorage.removeItem('authToken')
    }

    // Kiểm tra và xóa 'role'
    if (localStorage.getItem('role')) {
      localStorage.removeItem('role')
    }

    // Chuyển hướng đến '/login'
    navigate('/login')
  }

  const [openu, setOpenU] = useState(false);

  const handleToggle = () => {
    setOpenU((prev) => !prev);
  };

  const showUser = () => {
    navigate('/admin/detail-manager'); // Thay "/tai-khoan" bằng đường dẫn trang bạn muốn điều hướng đến.
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
                fontSize: '24px'
              },
              open && { display: 'none' }
            ]}
          >
            <MenuIcon fontSize="inherit" />
          </IconButton>
          <Typography variant="h4" noWrap component="div">
            Office Nest
          </Typography>
          <Box sx={{ position: 'absolute', right: '40px' }}>
            <Box sx={{ position: 'relative' }}>
              <IconButton onClick={handleToggle} sx={{ display: 'flex', alignItems: 'center', color: 'white'}}>
                <Avatar alt="User Avatar" src="/path-to-avatar.jpg" /> {/* Thay ảnh đại diện theo ý bạn */}
                {openu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              {openu && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    borderRadius: 1,
                    mt: 1,
                    minWidth: 200
                  }}
                >
                  <List>
                    <ListItem button onClick={showUser} sx={{ cursor: 'pointer' }}>
                      <ListItemIcon>
                        <AccountCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Tài khoản" sx={{ color: 'black'}}/>
                    </ListItem>
                  </List>
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              marginLeft: '10px',
              fontWeight: 'bold'
            }}
          >
            Phiên bản 1.0
          </Typography>
          <IconButton
            onClick={handleDrawerClose}
            sx={[
              {
                marginRight: '2px',
                fontSize: '24px'
              }
            ]}
          >
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon fontSize="inherit" />
            ) : (
              <ChevronLeftIcon fontSize="inherit" />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/**
           * Dashboard
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
              href={`/admin`}
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
                <DashboardIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary="Bảng điều khiển"
                primaryTypographyProps={{ fontSize: '15px' }}
                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
              />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.5)', height: '1px' }} />

          <ListItem disablePadding sx={{ display: 'block' }}>
            {/**
             * Building
             */}
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5
                },
                open ? { justifyContent: 'initial' } : { justifyContent: 'center' }
              ]}
              href={`/admin/buildings`}
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
                <ApartmentIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý Toà nhà"
                primaryTypographyProps={{ fontSize: '15px' }}
                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
              />
            </ListItemButton>
          </ListItem>

          {/**
           * Office
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
              href={`/admin/offices`}
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
                <MeetingRoomIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý văn phòng"
                primaryTypographyProps={{ fontSize: '15px' }}
                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
              />
            </ListItemButton>
          </ListItem>

          {/**
           * Request
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
              href={`/admin/requests`}
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
                <PreviewIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý yêu cầu xem"
                primaryTypographyProps={{ fontSize: '15px' }}
                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
              />
            </ListItemButton>
          </ListItem>

          {/**
           * Contract
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
              href={`/admin/contracts`}
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
                <ContactPageIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý hợp đồng"
                primaryTypographyProps={{ fontSize: '15px' }}
                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
              />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.5)', height: '1px' }} />

          {/**
           * User
           * */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5
                },
                open ? { justifyContent: 'initial' } : { justifyContent: 'center' }
              ]}
              href={`/admin/users`}
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
                <GroupIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý người dùng"
                primaryTypographyProps={{ fontSize: '15px' }}
                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
              />
            </ListItemButton>
          </ListItem>
          {/* Thống kê */}
          <StatisticsMenu open={open} />
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5
                },
                open ? { justifyContent: 'initial' } : { justifyContent: 'center' }
              ]}
              onClick={clickLogout}
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
                <LogoutIcon fontSize="large" /> {/* Thay icon GroupIcon bằng LogoutIcon */}
              </ListItemIcon>
              <ListItemText
                primary="Đăng xuất" // Tên hiển thị mới
                primaryTypographyProps={{ fontSize: '15px' }}
                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Typography sx={{ marginBottom: 2 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                    enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                    imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                    Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                    Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                    adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                    nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                    leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                    feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                    consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                    sapien faucibus et molestie ac.
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                    Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                    eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                    neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                    tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                    sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                    tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                    gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                    et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                    tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                    eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                    posuere sollicitudin aliquam ultrices sagittis orci a.
                </Typography>
            </Box> */}
    </Box>
  )
}

export default SidebarAdmin

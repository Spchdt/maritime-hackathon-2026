import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Stack from '@mui/material/Stack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import Tooltip from '@mui/material/Tooltip';

const drawerWidth = 80; // Small "Rail" width

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('Dashboard');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
      { text: 'Dashboard', icon: <DashboardIcon /> },
      { text: 'Fleet', icon: <DirectionsBoatIcon /> },
      { text: 'Analysis', icon: <AnalyticsIcon /> },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', py: 2 }}>
      {/* Rail Logo/Icon */}
      <Box sx={{ mb: 4, mt: 1, color: 'primary.main', p: 1 }}>
          <DirectionsBoatIcon sx={{ fontSize: 24, color: 'primary.main' }} />
      </Box>

      <List sx={{ width: '100%', px: 1.5 }}>
        {navItems.map((item) => {
          const active = activeItem === item.text;
          return (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 3 }}>
             <Tooltip title={item.text} placement="right">
                <ListItemButton 
                    selected={active}
                    onClick={() => setActiveItem(item.text)}
                    sx={{ 
                        minHeight: 0,
                        justifyContent: 'center',
                        p: 0,
                        flexDirection: 'column',
                        bgcolor: 'transparent',
                        '&:hover': { bgcolor: 'transparent' },
                        '&.Mui-selected': { bgcolor: 'transparent', '&:hover': { bgcolor: 'transparent' } }
                    }}
                >
                    {/* Active Indicator Pill */}
                    <Box sx={{
                        width: 56,
                        height: 32,
                        borderRadius: 16, // Pill shape
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: active ? 'secondary.light' : 'transparent',
                        mb: 0.5,
                        transition: 'background-color 0.2s',
                    }}>
                        <ListItemIcon 
                            sx={{ 
                                minWidth: 0, 
                                color: active ? 'text.primary' : 'text.secondary'
                            }}
                        >
                        {item.icon}
                        </ListItemIcon>
                    </Box>
                    
                    {/* Label */}
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            fontSize: '0.75rem', 
                            fontWeight: active ? 600 : 500, 
                            color: active ? 'text.primary' : 'text.secondary',
                            textAlign: 'center'
                        }}
                    >
                        {item.text}
                    </Typography>
                </ListItemButton>
             </Tooltip>
          </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: { sm: 'none' } 
        }}
      >
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={1}>
             <DirectionsBoatIcon sx={{ color: 'primary.main' }} />
             <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                kopi-marihack26
             </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Navigation Rail */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation rail"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }, // Normal width for mobile
          }}
        >
           {/* Re-implement standard drawer content for mobile if needed, but reusing rail content is okay too if adjusted */}
           {drawer} 
        </Drawer>
        
        {/* Desktop Rail */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth, 
                borderRight: 'none', 
                bgcolor: 'background.default',
                overflowX: 'hidden'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: 'background.default', maxWidth: '100vw', overflowX: 'hidden' }}
      >
        <Toolbar sx={{ display: { sm: 'none' } }} /> 
        
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            {activeItem === 'Dashboard' ? children : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                    <Typography variant="h4" color="text.secondary" fontWeight="bold">
                        Coming Soon
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        The {activeItem} module is under development.
                    </Typography>
                </Box>
            )}
        </Box>
      </Box>
    </Box>
  );
}

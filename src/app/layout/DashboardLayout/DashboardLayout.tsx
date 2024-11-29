"use client";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  Grid2,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation"; // Ensure correct import
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedItem } from "../../../../redux/features/dashboard";
import { menuItems } from "./menuItems";
import { Logout } from "@mui/icons-material";
import Image from "next/image";

const drawerWidth = 240;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const tab = pathname.split("/")[2];
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter(); // Ensure router is initialized

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token (or session)
    router.push("/"); // Redirect to login
  };

  const handleNavigation = (path: string) => {
    setMobileOpen(false);
    router.push(path); // Navigate to the specified path
  };

  const drawer = (
    <Stack
      justifyContent="space-between"
      sx={{ height: "calc(100% - 12px)", minWidth: "100%" }}
    >
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Grid2 container spacing={2} alignItems="center">
          <Grid2 size={{ xs: 12 }} textAlign="center">
            <Image
              src="/logo.png"
              alt="logo"
              width={80}
              height={80}
              style={{
                objectFit: "cover",
              }}
              unoptimized
            />
          </Grid2>
          <Grid2 size={{ xs: 8 }}>
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>
          </Grid2>
        </Grid2>
      </Stack>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            sx={{
              backgroundColor:
                tab === item.title.toLowerCase() ? "#f2972733" : "transparent",
            }}
            onClick={() => {
              handleNavigation(item.path);
              dispatch(setSelectedItem(item.id));
            }}
          >
            <ListItemIcon>
              <item.icon sx={{ color: "#F29727" }} />
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Logout sx={{ color: "#F29727" }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Stack>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="warning"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Welcome, Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;

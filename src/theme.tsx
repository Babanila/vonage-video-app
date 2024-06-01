import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b779ff',
    },
    secondary: {
      main: '#d6219c',
    },
    background: {
      paper: '#f6f6f6',
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#24466c',
    },
    secondary: {
      main: '#f4616b',
    },
    background: {
      paper: '#131415',
    },
  },
});

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#24466c",
    },
    secondary: {
      main: "#f4616b",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7C9EFF" },
    background: { default: "#080808", paper: "#141414" },
    text: {
      primary: "rgba(255,255,255,0.96)",
      secondary: "rgba(255,255,255,0.62)",
      disabled: "rgba(255,255,255,0.40)",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-geist), Arial, sans-serif",
    h1: {
      fontSize: "clamp(2.625rem, 11vw, 3.5rem)",
      fontWeight: 650,
      lineHeight: 1.08,
      letterSpacing: "-0.045em",
    },
    body1: { fontSize: "1.0625rem", lineHeight: 1.6 },
    button: { fontSize: "0.9375rem", fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          minHeight: 48,
          paddingInline: 24,
          borderRadius: 12,
          "&:focus-visible": { outline: "2px solid #7C9EFF", outlineOffset: 3 },
        },
        contained: {
          backgroundColor: "rgba(255,255,255,0.96)",
          color: "#080808",
          "&:hover": { backgroundColor: "#dfe5f2" },
        },
      },
    },
  },
});

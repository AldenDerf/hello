import { Box, Button, Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box component="main" sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", px: { xs: 2.5, sm: 3 }, py: 6 }}>
      <Stack spacing={4} sx={{ width: "100%", maxWidth: 420 }}>
        <Stack spacing={2}>
          <Typography component="h1" variant="h1">hello.</Typography>
          <Typography color="text.secondary" variant="body1">
            Something slightly unnecessary is being built here.
          </Typography>
        </Stack>
        <Button variant="contained" type="button" sx={{ alignSelf: "flex-start" }}>Continue</Button>
      </Stack>
    </Box>
  );
}

"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { submitInviteCode, type AccessResult } from "@/app/actions/invite";
import { FirstRunStory } from "./FirstRunStory";

type Scene = "ACCESS" | "CHECKING" | "GRANTED" | "WARNING" | "READY" | "ALREADY_ACTIVE" | "COMPLETED";
type ErrorKind = "INVALID" | "ERROR" | null;

export function ExperienceEntry({ hasSession }: { hasSession: boolean }) {
  const [scene, setScene] = useState<Scene>(hasSession ? "WARNING" : "ACCESS");
  const [code, setCode] = useState("");
  const [error, setError] = useState<ErrorKind>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (scene !== "GRANTED") return;
    const timer = window.setTimeout(() => setScene("WARNING"), reducedMotion ? 0 : 650);
    return () => window.clearTimeout(timer);
  }, [scene, reducedMotion]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (scene === "CHECKING") return;
    setError(null);
    setScene("CHECKING");

    let result: AccessResult;
    try {
      result = await submitInviteCode(code);
    } catch {
      result = { kind: "ERROR" };
    }

    switch (result.kind) {
      case "ACTIVE":
      case "TEST":
        setCode("");
        setScene("GRANTED");
        break;
      case "INVALID":
      case "ERROR":
        setError(result.kind);
        setScene("ACCESS");
        break;
      case "ALREADY_ACTIVE":
        setScene("ALREADY_ACTIVE");
        break;
      case "COMPLETED":
        setScene("COMPLETED");
        break;
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        px: { xs: 2.5, sm: 3 },
        pt: { xs: 6, sm: 8 },
        pb: { xs: "calc(48px + env(safe-area-inset-bottom))", sm: 8 },
        background: "radial-gradient(ellipse 90% 60% at 50% 20%, rgba(37,55,88,0.28), transparent 72%), radial-gradient(ellipse 70% 50% at 90% 90%, rgba(111,91,67,0.07), transparent 75%), linear-gradient(160deg, #080a10 0%, #080808 68%, #0a0d15 100%)",
        overflowX: "hidden",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 440 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={scene}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.3, ease: "easeOut" }}
          >
            {scene === "ACCESS" && (
              <Stack spacing={4}>
                <Stack spacing={2}>
                  <Typography component="h1" variant="h4" sx={{ fontWeight: 600, letterSpacing: "-0.035em" }}>
                    Oh, nice. Pinansin mo message ko. 😂
                  </Typography>
                  <Stack spacing={2} sx={{ pt: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>Na-curious ka, ’no?</Typography>
                    <Typography color="text.secondary">Sige… since nandito ka na rin,<br />ilagay mo yung code. 😌</Typography>
                  </Stack>
                </Stack>
                <Box component="form" onSubmit={submit} noValidate>
                  <Stack spacing={2}>
                    <TextField
                      id="invite-code"
                      label="Access code"
                      value={code}
                      onChange={(event) => { setCode(event.target.value); setError(null); }}
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      required
                      fullWidth
                      error={error !== null}
                      aria-describedby={error ? "invite-feedback" : undefined}
                      slotProps={{ htmlInput: { minLength: 1 } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          minHeight: 56,
                          backgroundColor: "#101010",
                          "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
                          "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                          "&.Mui-focused fieldset": { borderColor: "primary.main" },
                        },
                      }}
                    />
                    <Box id="invite-feedback" role={error ? "alert" : undefined} aria-live="polite" sx={{ minHeight: error ? "auto" : 0 }}>
                      {error && (
                        <Stack spacing={0.5}>
                          <Typography>{error === "INVALID" ? "That code doesn’t look right." : "Something went wrong on my side."}</Typography>
                          <Typography color="text.secondary">{error === "INVALID" ? "Check it and try again." : "Try that again."}</Typography>
                        </Stack>
                      )}
                    </Box>
                    <Button type="submit" variant="contained" disabled={!code.trim()} fullWidth>Unlock</Button>
                  </Stack>
                </Box>
              </Stack>
            )}

            {scene === "CHECKING" && (
              <Stack spacing={2} aria-live="polite">
                <Typography component="h1" variant="h5">Checking your code...</Typography>
                <Typography color="text.secondary">This should only take a second.</Typography>
              </Stack>
            )}

            {scene === "GRANTED" && (
              <Typography component="h1" variant="h5" sx={{ color: "primary.main", letterSpacing: "0.08em" }}>
                ACCESS GRANTED
              </Typography>
            )}

            {scene === "WARNING" && (
              <Stack spacing={4}>
                <Stack spacing={3}>
                  <Typography component="h1" variant="h4" sx={{ fontWeight: 600, letterSpacing: "-0.035em" }}>
                    This was made only for you.
                  </Typography>
                  <Typography>Pag natapos mo na, <Box component="span" sx={{ fontWeight: 600, color: "#f5eee7" }}>hindi mo na mababalikan ’to.</Box></Typography>
                  <Typography>Kaya saglit lang…</Typography>
                  <Typography sx={{ fontWeight: 600 }}>dito ka muna. 😌</Typography>
                  <Typography>May gusto lang akong sabihin.</Typography>
                </Stack>
                <Button variant="contained" onClick={() => setScene("READY")} fullWidth>
                  Sige.
                </Button>
              </Stack>
            )}

            {scene === "READY" && <FirstRunStory />}

            {scene === "ALREADY_ACTIVE" && (
              <Stack spacing={2}>
                <Typography component="h1" variant="h4">This invite is already in progress.</Typography>
                <Typography color="text.secondary">Open it from the same session you started with, or try again later.</Typography>
              </Stack>
            )}

            {scene === "COMPLETED" && (
              <Stack spacing={2}>
                <Typography component="h1" variant="h5" sx={{ letterSpacing: "0.08em" }}>ACCESS ALREADY USED</Typography>
                <Typography color="text.secondary">You&apos;ve already been through this once.</Typography>
              </Stack>
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}

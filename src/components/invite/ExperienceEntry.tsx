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
        py: { xs: 6, sm: 8 },
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
                  <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: "0.18em" }}>
                    PRIVATE ACCESS
                  </Typography>
                  <Typography component="h1" variant="h1">hello.</Typography>
                  <Stack spacing={1} sx={{ pt: 1 }}>
                    <Typography color="text.secondary">This page isn&apos;t really meant for everyone.</Typography>
                    <Typography color="text.secondary">Enter the code I sent you.</Typography>
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
                    <Button type="submit" variant="contained" disabled={!code.trim()} fullWidth>Enter</Button>
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
                <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: "0.18em" }}>
                  ONE-TIME ACCESS
                </Typography>
                <Stack spacing={3}>
                  <Typography component="h1" variant="h4" sx={{ fontWeight: 600, letterSpacing: "-0.035em" }}>
                    This page was made for one person.
                  </Typography>
                  <Typography>One access code.<br />One first run.<br />Yours.</Typography>
                  <Typography color="text.secondary">
                    Once you finish this, you won&apos;t be able to open the same first-run experience again.
                  </Typography>
                  <Typography>So for the next few minutes...</Typography>
                  <Typography>stay focused.</Typography>
                  <Typography color="text.secondary">
                    No multitasking.<br />No skipping ahead.<br />Instagram can wait.
                  </Typography>
                  <Typography>May tanong ako mamaya.</Typography>
                </Stack>
                <Button variant="contained" onClick={() => setScene("READY")} fullWidth>
                  Alright. You have my attention.
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

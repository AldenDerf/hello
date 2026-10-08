"use client";

import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import { finishFirstRun } from "@/app/actions/invite";

type Beat = { lines: string[]; action: string; quiet?: boolean };

const beats: Beat[] = [
  { lines: ["Okay.", "Before anything else..."], action: "Go on." },
  { lines: ["A normal person would've just sent “hi.”", "I built a website.", "Excellent judgment, obviously."], action: "Fair enough." },
  { lines: ["I've seen you before.", "You probably didn't notice me.", "But I noticed you."], action: "Continue.", quiet: true },
  { lines: ["And I remember thinking...", "Ang ganda niya.", "That was pretty much it.", "We didn't talk. Nothing dramatic happened.", "I just remembered you."], action: "Go on.", quiet: true },
  { lines: ["Then later...", "your Instagram randomly showed up.", "Wait. Siya yata 'to.", "So naturally... I followed you.", "Very sophisticated process."], action: "Okay." },
  { lines: ["Then you requested to follow me back.", "And I thought... okay.", "Maybe this is a good time to finally say hi.", "Apparently my version of “hi” is this entire website."], action: "Continue." },
  { lines: ["Running completely unnecessary analysis...", "Normal DM difficulty: very low", "Website effort: unnecessarily high", "Regret level: currently acceptable", "Conclusion: still worth it."], action: "Seems accurate." },
  { lines: ["Anyway.", "There's actually a reason I made this."], action: "Tell me.", quiet: true },
  { lines: ["Crush kita."], action: "Okay.", quiet: true },
  { lines: ["Relax. Hindi ito proposal.", "I just wanted to tell you properly that I think you're really beautiful.", "And apparently this was my idea of “properly.”"], action: "Continue.", quiet: true },
  { lines: ["That's really it.", "No dramatic expectations.", "I just thought it would be more fun to tell you this way than send another generic DM."], action: "Go on.", quiet: true },
  { lines: ["Oh. One more thing.", "Curious ka kung saan kita unang nakita?"], action: "Reveal it." },
  { lines: ["Nice try.", "That story is better told in a conversation.", "The rest is more fun to ask."], action: "Fair enough." },
  { lines: ["Anyway... now you know.", "I'm Alden.", "And yes—ako yung gumawa ng buong website instead of sending one sentence.", "I stand by the decision."], action: "Continue." },
  { lines: ["That's all for now."], action: "Finish", quiet: true },
];

const reactions = [
  { choice: "Not weird.", reply: "Good. You're handling this suspiciously well." },
  { choice: "A little.", reply: "That's fair." },
  { choice: "You built a whole website.", reply: "Exactly. We're on the same page." },
];

export function FirstRunStory() {
  const [step, setStep] = useState(0);
  const [reaction, setReaction] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const beat = step > 2 ? beats[step - 1] : beats[step];

  async function advance() {
    if (step !== 15) { setStep(step + 1); return; }
    if (finishing) return;
    setFinishing(true);
    setError(null);
    try {
      const result = await finishFirstRun();
      if (result.kind === "DONE") setDone(true);
      else setError(result.kind === "NO_SESSION" ? "Your session has ended. Enter your code again to continue." : "Something went wrong on my side. Try that again.");
    } catch {
      setError("Something went wrong on my side. Try that again.");
    } finally {
      setFinishing(false);
    }
  }

  if (done) return <Stack spacing={2} aria-live="polite"><Typography component="h1" variant="h4">That&apos;s it.</Typography><Typography>You can go back to Instagram now.</Typography><Typography color="text.secondary">Thanks for giving this unnecessary amount of effort your attention.</Typography></Stack>;

  return (
    <Box>
      <motion.div key={step} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0.1 : beat?.quiet ? 0.3 : 0.35 }}>
        {step === 2 ? (
          <Stack spacing={3}>
            <Stack spacing={1}><Typography color="text.secondary">Quick check.</Typography><Typography component="h1" variant="h4">How weird is this so far?</Typography></Stack>
            <Stack spacing={1.5}>
              {reactions.map(({ choice, reply }) => <Button key={choice} variant={reaction === reply ? "contained" : "outlined"} fullWidth onClick={() => setReaction(reply)} sx={{ justifyContent: "flex-start", textAlign: "left", borderColor: "divider", color: reaction === reply ? undefined : "text.primary" }}>{choice}</Button>)}
            </Stack>
            {reaction && <Stack spacing={2} aria-live="polite"><Typography>{reaction}</Typography><Button variant="contained" fullWidth onClick={() => { setReaction(null); setStep(3); }}>Continue.</Button></Stack>}
          </Stack>
        ) : (
          <Stack spacing={4}>
            <Stack spacing={beat?.quiet ? 3 : 2} aria-live="polite">
              {beat?.lines.map((line, index) => <Typography key={line} component={index === 0 ? "h1" : "p"} variant={index === 0 || (step === 9 && index === 0) ? "h4" : "body1"} color={index > 0 && index === beat.lines.length - 1 ? "text.secondary" : "text.primary"} sx={{ m: 0 }}>{line}</Typography>)}
            </Stack>
            {error && <Typography role="alert" color="error.main">{error}</Typography>}
            <Button variant="contained" fullWidth disabled={finishing} onClick={advance}>{finishing ? "Finishing..." : beat?.action}</Button>
          </Stack>
        )}
      </motion.div>
    </Box>
  );
}

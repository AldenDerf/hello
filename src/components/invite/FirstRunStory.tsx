"use client";

import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import { finishFirstRun } from "@/app/actions/invite";

type Line = { text: string; emphasis?: boolean; before?: string; after?: string };
type Scene = { lines: Line[]; action: string; quiet?: boolean };
const line = (text: string, emphasis = false): Line => ({ text, emphasis });
const phrase = (before: string, text: string, after = ""): Line => ({ before, text, after, emphasis: true });

const scenes: Scene[] = [
  { lines: [phrase("Normally, magme-message lang dapat ako ng ", "“Hi.”"), line("Kaso somehow..."), line("gumawa pa ako ng website. 😂", true)], action: "Oo nga eh." },
  { lines: [line("Since nandito ka na rin…"), line("sayang naman kung hanggang “Hi” lang. 😅", true)], action: "Sige, tuloy mo." },
  { lines: [line("Actually..."), line("nakita na kita before.", true), line("And honestly..."), line("napansin talaga kita. 😅", true)], action: "Tapos?", quiet: true },
  { lines: [line("Honestly..."), line("nung nakita kita,"), line("ito talaga yung una kong naisip:"), line("“Ang ganda niya.” 😅", true), line("Simple lang ’yun."), line("Pero somehow, naalala pa rin kita.", true)], action: "Haha okay...", quiet: true },
  { lines: [line("Lately..."), line("biglang lumabas Instagram mo."), line("Napatingin ako nang:"), line("“Wait... parang siya ’to ah.”", true), line("Kaya…"), line("Follow. 😂", true)], action: "Smooth." },
  { lines: [line("Tapos nag-request ka rin mag-follow back."), line("Nagulat ako dun. 😅", true), line("Napa-isip ako:"), line("“Sige… baka magandang timing na ’to.”", true), phrase("Para sabihin na rin yung ", "gusto kong sabihin sa’yo.")], action: "Ano ’yon?" },
  { lines: [line("Pero bago ’yon…"), line("Simpleng message lang sana ’to."), phrase("Kaso naisip ko, ", "baka ma-seen lang ako. 😂"), line("Ang ending…"), line("gumawa na lang ako ng buong website. 😂", true), phrase("Para at least, ", "may effort bago ma-seen. 😭😂")], action: "Grabe ka. 😂" },
  { lines: [line("Okay."), line("Eto na talaga."), line("Kaya ko ginawa ’to kasi…"), line("may gusto lang akong sabihin sa’yo nang maayos.", true)], action: "Sige.", quiet: true },
  { lines: [], action: "Okay, noted. 😂", quiet: true },
  { lines: [line("Anyway…"), line("yun lang talaga.", true), line("Yung gumawa ng website para lang sabihin:"), line("“Hi… crush kita.” 😂", true), line("Medyo napasobra sa effort.", true), line("Pero at least memorable. 😅")], action: "Finish" },
];

function CrushReveal({ onContinue }: { onContinue: () => void }) {
  const reducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), reducedMotion ? 0 : 1000);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <Stack spacing={5} sx={{ py: { xs: 2, sm: 4 } }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="body1">Nung nakita kita ulit sa Instagram…</Typography>
        <Typography>napangiti talaga ako. 😅</Typography>
        <Typography>Tapos dun ko naisip…</Typography>
        <Box sx={{ position: "relative", isolation: "isolate", py: 1, "&::before": { content: '""', position: "absolute", inset: "-36px -24px", zIndex: -1, background: "radial-gradient(ellipse, rgba(205,177,129,0.13), transparent 68%)", pointerEvents: "none" } }}>
          <Typography sx={{ fontSize: "clamp(1.65rem, 7vw, 2.25rem)", fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.025em", color: "#f5eee1" }}>“Oo nga… crush ko talaga ’to.”</Typography>
        </Box>
      </Stack>
      {revealed && (
        <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0.1 : 0.4 }}>
          <Stack spacing={3} aria-live="polite">
            <Typography sx={{ fontWeight: 600, color: "#f5eee1" }}>Nasabi ko rin. 😂</Typography>
            <Button variant="contained" fullWidth onClick={onContinue}>Okay, noted. 😂</Button>
          </Stack>
        </motion.div>
      )}
    </Stack>
  );
}

export function FirstRunStory() {
  const [step, setStep] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const scene = scenes[step];

  async function advance() {
    if (step < scenes.length - 1) { setStep(step + 1); return; }
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

  if (done) return (
    <Stack spacing={2} aria-live="polite" sx={{ py: 2 }}>
      <Typography component="h1" variant="h4">Ayun. Tapos na.</Typography>
      <Typography>Pwede ka nang bumalik sa Instagram. 😂</Typography>
      <Typography color="text.secondary">Salamat sa pagbibigay ng ilang minutes sa kalokohan kong ’to.</Typography>
      <Typography>And… ingat ka. 🙂</Typography>
      <Stack spacing={0.5} sx={{ pt: 5, borderTop: "1px solid rgba(255,255,255,0.09)", mt: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>Gusto mo ulit ng access?</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>PM is the key. 🔑😂</Typography>
      </Stack>
    </Stack>
  );

  return (
    <Box>
      <motion.div key={step} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0.1 : scene.quiet ? 0.35 : 0.25 }}>
        {step === 8 ? <CrushReveal onContinue={advance} /> : (
          <Stack spacing={scene.quiet ? 5 : 4}>
            <Stack spacing={scene.quiet ? 2.5 : 1.5} aria-live="polite">
              {scene.lines.map(({ text, emphasis, before, after }, index) => <Typography key={text} component={index === 0 ? "h1" : "p"} variant={emphasis && !before ? "h5" : "body1"} sx={{ m: 0, fontWeight: emphasis && !before ? 600 : undefined, color: scene.quiet ? "#f5eee7" : undefined }}>
                {before}<Box component="span" sx={{ fontWeight: emphasis ? 600 : undefined }}>{text}</Box>{after}
              </Typography>)}
            </Stack>
            {error && <Typography role="alert" color="error.main">{error}</Typography>}
            <Button variant="contained" fullWidth disabled={finishing} onClick={advance}>{finishing ? "Finishing..." : scene.action}</Button>
          </Stack>
        )}
      </motion.div>
    </Box>
  );
}

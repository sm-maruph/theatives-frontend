import { useState, useEffect } from "react";
import styled from "styled-components";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // lighter than loadFull — far less mobile load
import ConfigDark from "../../config/particlesjs-config.json";
import ConfigLight from "../../config/particlesjs-config-light.json";

const THEME_BG = {
  dark:  "radial-gradient(ellipse 80% 70% at 50% 40%, #2e0e13 0%, #190709 58%, #0c0405 100%)",
  light: "radial-gradient(ellipse 80% 70% at 50% 40%, #a32b34 0%, #871f27 55%, #5c141a 100%)",
};

const ACCENTS = ["#ff5c72", "#ffc46b", "#ffd9a3"];
const LINK_COLOR = "#ff5c72";

const Box = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: ${({ $bg }) => $bg};
`;

const applyTheme = (config) => {
  const c = JSON.parse(JSON.stringify(config));
  c.particles = c.particles || {};
  c.particles.color = { value: ACCENTS };
  if (c.particles.links) c.particles.links.color = LINK_COLOR;
  if (c.particles.line_linked) c.particles.line_linked.color = LINK_COLOR;
  return c;
};

/* Decide once whether this device should run the animated canvas.
   Phones + reduced-motion users get the static gradient only —
   this is what stops the mobile modal flicker. */
const useLiteMode = () => {
  const [lite, setLite] = useState(true); // default to lite until we check (SSR-safe)
  useEffect(() => {
    const smallScreen = window.matchMedia("(max-width: 820px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLite(smallScreen || coarse || reduced);
  }, []);
  return lite;
};

const ParticlesComponent = ({ theme = "dark" }) => {
  const lite = useLiteMode();
  const bg = THEME_BG[theme] || THEME_BG.dark;

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  // On phones: render ONLY the themed gradient background, no live canvas.
  if (lite) {
    return <Box $bg={bg} />;
  }

  const base = theme === "light" ? ConfigLight : ConfigDark;
  const options = applyTheme(base);

  return (
    <Box $bg={bg}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={options}
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default ParticlesComponent;

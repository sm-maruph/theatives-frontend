import styled from "styled-components";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import ConfigDark from "../../config/particlesjs-config.json";
import ConfigLight from "../../config/particlesjs-config-light.json";

/* Maroon / rose / gold theme to match the Service & About pages. */
const THEME_BG = {
  dark:  "radial-gradient(ellipse 80% 70% at 50% 40%, #2e0e13 0%, #190709 58%, #0c0405 100%)",
  light: "radial-gradient(ellipse 80% 70% at 50% 40%, #a32b34 0%, #871f27 55%, #5c141a 100%)",
};

const ACCENTS = ["#ff5c72", "#ffc46b", "#ffd9a3"]; // rose · gold · warm sand
const LINK_COLOR = "#ff5c72";

const Box = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;            /* behind the modal content */
  pointer-events: none;
  background: ${({ $bg }) => $bg};
`;

/* Deep-clone the JSON and override only the colours, so we don't
   mutate the imported config and we work whether it's a v1
   (line_linked) or v2 (links) tsparticles config. */
const applyTheme = (config) => {
  const c = JSON.parse(JSON.stringify(config));
  c.particles = c.particles || {};
  c.particles.color = { value: ACCENTS };
  if (c.particles.links) c.particles.links.color = LINK_COLOR;
  if (c.particles.line_linked) c.particles.line_linked.color = LINK_COLOR;
  return c;
};

const ParticlesComponent = ({ theme = "dark" }) => {
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const base = theme === "light" ? ConfigLight : ConfigDark;
  const options = applyTheme(base);

  return (
    <Box $bg={THEME_BG[theme] || THEME_BG.dark}>
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

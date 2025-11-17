import styled from "styled-components";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import ConfigDark from "../../config/particlesjs-config.json";
import ConfigLight from "../../config/particlesjs-config-light.json";

const Box = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0; /* behind modal */
  pointer-events: none;
  background: white;
`;

const ParticlesComponent = ({ theme = "dark" }) => {
  const particlesInit = async (engine) => {
    // load all tsparticles features
    await loadFull(engine);
  };

  return (
    <Box>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={theme === "light" ? ConfigLight : ConfigDark}
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default ParticlesComponent;

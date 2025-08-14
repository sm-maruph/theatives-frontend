import React, { useState, useEffect, useRef } from "react";
import "./css/WorkSection.css";
import { getAllWorks } from "../../adminServices/workServices";

const WorksSection = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const playersRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [apiReady, setApiReady] = useState(false);

  // Fetch works on mount
  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const works = await getAllWorks();
      setWorks(works);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load YouTube Iframe API script once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };
    } else {
      setApiReady(true);
    }
  }, []);

  // Initialize player when active index changes
  useEffect(() => {
    if (!apiReady || activeIndex === null || !works[activeIndex]) return;

    const initializePlayer = () => {
      if (playersRef.current[activeIndex]) return;

      playersRef.current[activeIndex] = new window.YT.Player(
        `player-${activeIndex}`,
        {
          videoId: works[activeIndex].description,
          events: {
            onReady: (event) => {
              // Auto-play when ready
              event.target.playVideo();
              updateRotationState();
            },
            onStateChange: (event) => {
              updateRotationState();
              if (event.data === window.YT.PlayerState.ENDED) {
                setActiveIndex(null);
              }
            },
          },
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
        }
      );
    };

    initializePlayer();

    return () => {
      if (playersRef.current[activeIndex]) {
        playersRef.current[activeIndex].destroy();
        playersRef.current[activeIndex] = null;
      }
    };
  }, [activeIndex, apiReady, works]);

  const isAnyVideoPlaying = () => {
    return playersRef.current.some((player) => {
      if (!player || !player.getPlayerState) return false;
      const state = player.getPlayerState();
      return (
        state === window.YT.PlayerState.PLAYING ||
        state === window.YT.PlayerState.BUFFERING
      );
    });
  };

  const updateRotationState = () => {
    if (!sliderRef.current) return;
    if (isAnyVideoPlaying() || sliderRef.current.matches(":hover")) {
      sliderRef.current.classList.add("paused");
    } else {
      sliderRef.current.classList.remove("paused");
    }
  };

  const handleClick = (index) => {
    // If clicking the same video that's playing, pause it
    if (activeIndex === index) {
      if (playersRef.current[index]) {
        playersRef.current[index].pauseVideo();
      }
      setActiveIndex(null);
      return;
    }

    // Set new active index (will trigger auto-play in onReady)
    setActiveIndex(index);
  };

  const handleMouseEnter = () => {
    if (!sliderRef.current) return;
    sliderRef.current.classList.add("paused");
  };

  const handleMouseLeave = () => {
    if (!sliderRef.current) return;
    if (!isAnyVideoPlaying()) {
      sliderRef.current.classList.remove("paused");
    }
  };

  if (loading) return <div className="loading">Loading works...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="banner">
      <div
        ref={sliderRef}
        className="slider"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {works.map((work, i) => {
          const angle = (360 / works.length) * i;
          const isActive = activeIndex === i;
          
          return (
            <div
              key={i}
              className={`item ${isActive ? "active" : ""}`}
              style={{ "--angle": `${angle}deg` }}
              onClick={() => handleClick(i)}
            >
              {isActive ? (
                <div id={`player-${i}`} className="youtube-iframe"></div>
              ) : (
                <div className="video-placeholder">
                  <div className="video-thumbnail">
                    <img
                      src={`https://img.youtube.com/vi/${work.description}/mqdefault.jpg`}
                      alt={work.title}
                    />
                    <div className="play-icon">▶</div>
                  </div>
                </div>
              )}
              <h3>{work.title}</h3>
            </div>
          );
        })}
        <div className="model"></div>
      </div>
    </div>
  );
};

export default WorksSection;
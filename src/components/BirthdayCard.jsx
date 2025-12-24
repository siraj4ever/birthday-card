"use client";

import React, { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";
import "./BirthdayCard.css";

const BirthdayCard = () => {
  const [celebrate, setCelebrate] = useState(false);
  const audioRef = useRef(null);
  const magicalSoundRef = useRef(null);
  const [showCard, setShowCard] = useState(false);
  const [showShutter, setShowShutter] = useState(false);
  const [shutterOpen, setShutterOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});

  // Array of bestie images
  const images = ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Song playlist
  const songs = ["/audio/wish.mp3", "/audio/Happy-Birthday.mp3"];
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Target date: 6th January 2026 at 12:00 AM IST
  const targetDate = new Date("2025-11-05T18:30:00Z");


  // Check if it's time to show the card
  useEffect(() => {
    const now = new Date();
    if (now >= targetDate) {
      setShowShutter(true); // Show shutter page first
    } else {
      setShowCard(false);
      setShowShutter(false);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (showCard || showShutter) return; // Stop countdown if card or shutter is shown

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setShowShutter(true); // Show shutter page first
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showCard, showShutter]);

  // Auto change image every 3 seconds (only when card is shown)
  useEffect(() => {
    if (!showCard) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [showCard]);

  // Automatically play next song when one ends (only when card is shown)
  useEffect(() => {
    if (!showCard) return;
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      const nextIndex = (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(nextIndex);
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex, showCard]);

  // Update audio source when currentSongIndex changes (only when card is shown)
  useEffect(() => {
    if (!showCard || !celebrate) return;
    const audio = audioRef.current;
    if (audio) {
      audio.src = songs[currentSongIndex];
      audio.play().catch(() => {});
    }
  }, [currentSongIndex, celebrate, showCard]);

  const handleCelebrate = () => {
    setCelebrate(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleStop = () => {
    setCelebrate(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Function to play magical shutter sound from audio file
  const playMagicalShutterSound = () => {
    try {
      if (magicalSoundRef.current) {
        magicalSoundRef.current.currentTime = 0; // Reset to beginning
        magicalSoundRef.current.volume = 0.7; // Set volume
        magicalSoundRef.current.play().catch((error) => {
          console.log("Magical sound could not be played:", error);
        });
      }
    } catch (error) {
      console.log("Magical sound could not be played:", error);
    }
  };

  const handleOpenShutter = () => {
    setShutterOpen(true);
    // Play magical shutter sound
    playMagicalShutterSound();
    // After shutter animation completes, show the main card
    // Shutter animation takes ~2s (1.2s transition + 0.7s delay for last panel)
    setTimeout(() => {
      setShowCard(true);
      setShowShutter(false);
    }, 2000); // Wait for shutter animation to complete
  };

  // If not time yet, show countdown
  if (!showCard && !showShutter) {
    return (
      <main className="countdown-container">
        <h1 className="countdown-title">Countdown to Palak's Birthday!</h1>

        <div className="glow-text countdown-timer">
          <span>{timeLeft.days} Days</span> :<span>{timeLeft.hours} Hours</span>{" "}
          :<span>{timeLeft.minutes} Minutes</span> :
          <span>{timeLeft.seconds} Seconds</span>
        </div>

        <p className="countdown-note">
          The celebration is coming soon — 6th January 2026! 🎉
        </p>
      </main>
    );
  }

  // Show shutter page after countdown
  if (showShutter && !showCard) {
    return (
      <main className="shutter-container">
        {/* Magical sound audio element */}
        <audio ref={magicalSoundRef} src="/audio/magical.mp3" preload="auto" />
        <div className="shutter-page">
          <div className="shutter-content">
            <h1 className="shutter-title">🎉 It's Time! 🎉</h1>
            <p className="shutter-subtitle">
              Something magical is waiting behind...
            </p>
            <div className="shutter-message">
              <p className="reveal-text">
                Pull up the shutters to reveal your surprise!
              </p>
              <p className="reveal-hint">
                ✨ A special celebration awaits you ✨
              </p>
            </div>
          </div>

          {/* Shutter panels */}
          <div className={`shutter-panels ${shutterOpen ? "open" : ""}`}>
            <div className="shutter-panel"></div>
            <div className="shutter-panel"></div>
            <div className="shutter-panel"></div>
            <div className="shutter-panel"></div>
            <div className="shutter-panel"></div>
            <div className="shutter-panel"></div>
            <div className="shutter-panel"></div>
            <div className="shutter-panel"></div>
          </div>

          {/* Bottom glow with arrow */}
          <div className="shutter-bottom-glow" onClick={handleOpenShutter}>
            <div className="glow-effect"></div>
            <div className="arrow-container">
              <svg
                className="arrow-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 13L12 8L17 13"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 18L12 13L17 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="click-hint">Click to reveal</p>
          </div>
        </div>
      </main>
    );
  }

  // Full birthday card template
  return (
    <main className={`main ${showCard ? "zoom-in" : ""}`}>
      {/* Audio element */}
      <audio ref={audioRef} src={songs[currentSongIndex]} loop={false} />

      {/* SECTION 1 */}
      <section className="page__1">
        <div className="page__1-text">
          <div className="block1">
            <img src="/images/gift.png" className="gift" alt="gift" />
            <img src="/images/happy.webp" className="hb" alt="happy birthday" />
            <img src="/images/gift.png" className="gifts" alt="gift" />
            <img src="/images/balloon.png" className="balloon" alt="balloon" />
            <h1>
              Happy Birthday, <span className="glow-text">Palak!</span>
            </h1>
            <h3>
              06<sup>th</sup> January 2026, Tuesday
            </h3>
            <p>
              Wishing you all the love, laughter, and happiness you truly deserve! 💫  
              Even with the distance, you became one of the most genuine parts of my university journey. 🎓  
              Grateful for our bond — and to meeting someday! 🤍
            </p>

            {!celebrate ? (
              <button type="button" className="btn" onClick={handleCelebrate}>
                <p className="glow-text">Click Here To Celebrate 🎉</p>
              </button>
            ) : (
              <button
                type="button"
                className="btn stop-btn"
                onClick={handleStop}
              >
                <p className="glow-text">Stop Celebration 🎉</p>
              </button>
            )}
          </div>
        </div>

        <div className="page__1-image">
          <img src={images[currentImageIndex]} alt="Bestie Photo" />
        </div>

        <img src="/images/cake.png" className="cake" alt="cake" />
        <img src="/images/star.png" className="star" alt="star" />
      </section>

      {/* SECTION 2: BIRTHDAY WISHES */}
      <section className="wishes container">
        <img
          src="/images/cake.png"
          className="star"
          alt="star"
          style={{ marginRight: "-65px", marginTop: "-35px" }}
        />
        <h2>Birthday Wishes 🎁</h2>
      
        <div className="wishes-grid">
          <div className="wish-card">
            🎂 Happy Birthday to someone who became special without ever meeting in person.
          </div>
      
          <div className="wish-card">
            📚 Same university, same classes — and somehow, a real friendship.
          </div>
      
          <div className="wish-card">
            🌍 Distance never stopped us from sharing laughs, rants, and late-night talks.
          </div>
      
          <div className="wish-card">
            🤍 One day we’ll meet — until then, this friendship already means a lot.
          </div>
        </div>
      </section>


      {/* SECTION 3: FUN QUOTES */}
      <section className="quotes container">
        <img
          src="/images/star.png"
          className="star"
          alt="star"
          style={{ marginRight: "1115px", marginTop: "-35px" }}
        />
        <h2>Fun Quotes 💛</h2>
      
        <div className="quotes-grid">
          <div className="quote-card">
            "Some friendships start in classrooms and grow through conversations." 🎓
          </div>
      
          <div className="quote-card">
            "Distance means nothing when the bond is real." 🌍
          </div>
      
          <div className="quote-card">
            "We haven’t met yet — but the friendship already feels familiar." ✨
          </div>
        </div>
      </section>

      {/* 🎊 CONFETTI */}
      {celebrate && <Confetti recycle={true} numberOfPieces={300} />}

      {/* FOOTER */}
      <footer className="footer">
        <p>
          Made with ❤️ and best wishes from <span>Siraj</span>
        </p>
      </footer>
    </main>
  );
};

export default BirthdayCard;

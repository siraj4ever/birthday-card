"use client";

import React, { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";
import "./BirthdayCard.css";

const BirthdayCard = () => {
  const [celebrate, setCelebrate] = useState(false);
  const audioRef = useRef(null);
  const [showCard, setShowCard] = useState(false); // New state for showing card or countdown
  const [timeLeft, setTimeLeft] = useState({}); // New state for countdown

  // Array of bestie images
  const images = ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Song playlist
  const songs = ["/audio/wish.mp3", "/audio/Happy-Birthday.mp3"];
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Target date: 7th November 2025 at 12:00 AM
  const targetDate = new Date("2025-11-07T12:00:00");

  // Check if it's time to show the card
  useEffect(() => {
    const now = new Date();
    if (now >= targetDate) {
      setShowCard(true);
    } else {
      setShowCard(false);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (showCard) return; // Stop countdown if card is shown

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setShowCard(true);
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
  }, [showCard]);

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

  // Navigation functions for photo gallery
  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  // If not time yet, show countdown
  if (!showCard) {
    return (
      <main className="countdown-container">
        <h1 className="countdown-title">Countdown to Mannat's Birthday!</h1>

        <div className="glow-text countdown-timer">
          <span>{timeLeft.days} Days</span> :<span>{timeLeft.hours} Hours</span>{" "}
          :<span>{timeLeft.minutes} Minutes</span> :
          <span>{timeLeft.seconds} Seconds</span>
        </div>

        <p className="countdown-note">
          The celebration is coming soon — 7th November 2025! 🎉
        </p>
      </main>
    );
  }

  // Full birthday card template
  return (
    <main className="main">
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
              Happy Birthday, <span className="glow-text">Mannat!</span>
            </h1>
            <h3>
              07<sup>th</sup> November 2025, Friday
            </h3>
            <p>
              Wishing you all the love, laughter, and happiness in the world!
              You’re amazing, and I’m so grateful for all the fun memories we’ve
              shared in the office. Here’s to many more!! 💖🎉
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
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            style={{
              position: "absolute",
              left: "-50px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "#2b2d42",
              color: "#edf2f4",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "18px",
              cursor: "pointer",
              transition: "0.4s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => (
              (e.target.style.background = "transparent"),
              (e.target.style.border = "1px solid #2b2d42"),
              (e.target.style.color = "#2b2d42")
            )}
            onMouseLeave={(e) => (
              (e.target.style.background = "#2b2d42"),
              (e.target.style.border = "none"),
              (e.target.style.color = "#edf2f4")
            )}
          >
            ‹
          </button>

          <img src={images[currentImageIndex]} alt="Bestie Photo" />

          {/* Next Button */}
          <button
            onClick={handleNext}
            style={{
              position: "absolute",
              right: "-50px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "#2b2d42",
              color: "#edf2f4",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "18px",
              cursor: "pointer",
              transition: "0.4s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => (
              (e.target.style.background = "transparent"),
              (e.target.style.border = "1px solid #2b2d42"),
              (e.target.style.color = "#2b2d42")
            )}
            onMouseLeave={(e) => (
              (e.target.style.background = "#2b2d42"),
              (e.target.style.border = "none"),
              (e.target.style.color = "#edf2f4")
            )}
          >
            ›
          </button>
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
            🎂 Wishing you a day filled with joy, love, and lots of cake!
          </div>
          <div className="wish-card">
            ✨ Keep shining bright — just like you always do!
          </div>
          <div className="wish-card">
            💫 May all your dreams come true this year.
          </div>
          <div className="wish-card">
            🌸 Here’s to more adventures and laughter ahead!
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
            "Good friends are like stars — you don't always see them, but you
            know they're always there." ⭐
          </div>
          <div className="quote-card">
            "Life is better with true friends… and a little bit of cake." 🎂
          </div>
          <div className="quote-card">
            "A best friend is someone who makes you laugh even when you think
            you'll never smile again." 😂
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

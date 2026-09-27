/*
 * Kustomisasi cepat: ubah recipientName, photoCards, dan birthdayMessage di bawah ini.
 * Lagu latar memakai file audio lokal milik pengguna agar hak cipta dan lisensi tetap terjaga.
 */
const birthdayConfig = {
  recipientName: "Untukmu, Salma Yovena Ulilhaq my Lopee♥♥",
  birthdayMessage:
    "Semoga semua kerja keras, cita-cita, dan impian yang lagi kamu usahakan perlahan-lahan dibukakan jalannya dan tercapai satu per satu di waktu yang paling tepat. Tetap jadi Sayangku yang penyabar, penuh kasih sayang dan rajin menabung seperti yang aku kenal ya. Pokoke Selamat Ulang Tahun ya Sayangkuuu Cintakuuuuuuu",
  photoCards: [
    {
      caption: "Kenangan pertama",
      image: "./3.jpg",
      alt: "Foto kenangan nomor 1",
    },
    {
      caption: "Momen yang berarti",
      image: "./2.jpg",
      alt: "Foto kenangan nomor 2",
    },
    {
      caption: "Hari yang istimewa",
      image: "./5.jpg",
      alt: "Foto kenangan nomor 3",
    },
    {
      caption: "Selalu bersama",
      image: "./4.jpg",
      alt: "Foto kenangan nomor 4",
    },
    {
      caption: "Tawa yang dikenang",
      image: "./7.jpg",
      alt: "Foto kenangan nomor 5",
    },
    {
      caption: "Cerita kita selanjutnya",
      image: "./6.JPG",
      alt: "Foto kenangan nomor 6",
    },
  ],
};

const welcomeScreen = document.querySelector("#welcome");
const birthdayContent = document.querySelector("#birthday-content");
const openButton = document.querySelector("#open-surprise");
const musicButton = document.querySelector("#music-toggle");
const birthdayAudio = document.querySelector("#birthday-audio");
const confettiCanvas = document.querySelector("#confetti-canvas");
const confettiContext = confettiCanvas.getContext("2d");
const modal = document.querySelector("#secret-modal");
const candles = [...document.querySelectorAll(".candle")];
const wishButton = document.querySelector("#wish-button");
const wishStatus = document.querySelector("#wish-status");
const liveAnnouncement = document.querySelector("#live-announcement");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let opened = false;
let isMusicPlaying = false;
let animationFrame = 0;
let particles = [];
let lastFocusedElement;
let wishTimer;

function applyConfig() {
  document.querySelector("#recipient-name").firstChild.textContent = birthdayConfig.recipientName;
  document.querySelector("#birthday-message").textContent = birthdayConfig.birthdayMessage;

  document.querySelectorAll(".photo-card").forEach((card, index) => {
    const photo = birthdayConfig.photoCards[index];
    if (!photo) return;
    const image = card.querySelector(".photo-card__image");
    image.style.backgroundImage = `linear-gradient(180deg, rgba(34, 16, 36, .03), rgba(25, 12, 37, .2)), url("${photo.image}")`;
    image.setAttribute("aria-label", photo.alt);
    card.querySelector("figcaption span:nth-child(2)").textContent = photo.caption;
  });
}

function setDateLabel() {
  const date = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  document.querySelector("#today-label").textContent = date.toUpperCase();
}

function sizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  confettiCanvas.width = Math.round(window.innerWidth * ratio);
  confettiCanvas.height = Math.round(window.innerHeight * ratio);
  confettiContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function launchConfetti(amount = 125) {
  const colors = ["#f2a6bb", "#edc783", "#fff4dc", "#bb96e1", "#f3bd9f"];
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.34;

  for (let i = 0; i < amount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.5 + Math.random() * 8;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      width: 3 + Math.random() * 5,
      height: 3 + Math.random() * 7,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.22,
      gravity: 0.12 + Math.random() * 0.09,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      decay: 0.003 + Math.random() * 0.003,
    });
  }

  if (!animationFrame) animationFrame = requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) => particle.opacity > 0 && particle.y < window.innerHeight + 30);

  for (const particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.gravity;
    particle.vx *= 0.993;
    particle.rotation += particle.spin;
    particle.opacity -= particle.decay;

    confettiContext.save();
    confettiContext.translate(particle.x, particle.y);
    confettiContext.rotate(particle.rotation);
    confettiContext.globalAlpha = Math.max(particle.opacity, 0);
    confettiContext.fillStyle = particle.color;
    confettiContext.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
    confettiContext.restore();
  }

  if (particles.length) {
    animationFrame = requestAnimationFrame(drawConfetti);
  } else {
    animationFrame = 0;
    confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function revealContent() {
  if (opened) return;
  opened = true;
  welcomeScreen.classList.add("is-leaving");
  birthdayContent.inert = false;
  window.setTimeout(() => birthdayContent.classList.add("is-visible"), 240);
  window.setTimeout(() => {
    welcomeScreen.hidden = true;
    document.body.classList.remove("is-locked");
    observeReveals();
  }, 820);
  launchConfetti(prefersReducedMotion.matches ? 45 : 145);
  liveAnnouncement.textContent = "Kejutan ulang tahun terbuka. Selamat ulang tahun!";
}

function observeReveals() {
  const elements = document.querySelectorAll(".reveal");
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
  );

  elements.forEach((element) => observer.observe(element));
}

function updateProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  document.querySelector("#progress-bar").style.width = `${progress}%`;
}

function extinguishCandle(candle) {
  if (!candle.classList.contains("is-lit")) return;
  candle.classList.remove("is-lit");
  candle.setAttribute("aria-pressed", "true");
  const remaining = candles.filter((item) => item.classList.contains("is-lit")).length;
  wishStatus.textContent = remaining ? `${remaining} lilin lagi menunggu permintaanmu.` : "Permintaanmu sudah terbang ke semesta ✨";

  if (!remaining) {
    wishStatus.textContent = "Permintaanmu terkirim! Semoga segera terwujud ✨";
    liveAnnouncement.textContent = "Semua lilin padam. Permintaanmu terkirim ke semesta!";
    launchConfetti(90);
  }
}

function resetCandles() {
  candles.forEach((candle) => {
    candle.classList.add("is-lit");
    candle.setAttribute("aria-pressed", "false");
  });
  wishStatus.textContent = "3 lilin menunggu permintaanmu.";
}

function startWishSequence() {
  window.clearTimeout(wishTimer);
  resetCandles();
  wishStatus.textContent = "Pejamkan mata… permintaanmu sudah hampir terkirim. ✨";
  wishButton.disabled = true;
  wishButton.setAttribute("aria-label", "Permintaan sedang dikirim");

  candles.forEach((candle, index) => {
    wishTimer = window.setTimeout(
      () => {
        extinguishCandle(candle);
        if (index === candles.length - 1) {
          wishButton.disabled = false;
          wishButton.removeAttribute("aria-label");
          wishButton.innerHTML = 'Buat permintaan lagi <span aria-hidden="true">✦</span>';
        }
      },
      850 + index * 620,
    );
  });
}

function setMusicState(playing) {
  isMusicPlaying = playing;
  musicButton.classList.toggle("is-playing", playing);
  musicButton.setAttribute("aria-pressed", String(playing));
  musicButton.setAttribute("aria-label", playing ? "Matikan musik" : "Aktifkan musik");
  musicButton.querySelector(".music-toggle__label").textContent = playing ? "musik nyala" : "musik mati";
}

function waitForAudioSource() {
  if (birthdayAudio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      window.clearTimeout(timeout);
      birthdayAudio.removeEventListener("canplay", handleCanPlay);
      birthdayAudio.removeEventListener("error", handleError);
    };
    const handleCanPlay = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error("File lagu tidak ditemukan atau tidak dapat diputar."));
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Waktu memuat lagu habis."));
    }, 8000);

    birthdayAudio.addEventListener("canplay", handleCanPlay);
    birthdayAudio.addEventListener("error", handleError);
    birthdayAudio.load();
  });
}

async function toggleMusic() {
  if (isMusicPlaying) {
    birthdayAudio.pause();
    setMusicState(false);
    return;
  }

  try {
    await waitForAudioSource();
    await birthdayAudio.play();
    setMusicState(true);
  } catch (error) {
    setMusicState(false);
    musicButton.querySelector(".music-toggle__label").textContent = "lagu belum ada";
    musicButton.setAttribute("aria-label", "Periksa file NCT127.mp3 di folder website");
    liveAnnouncement.textContent = error.message;
  }
}

async function startMusicOnLoad() {
  try {
    await waitForAudioSource();
    await birthdayAudio.play();
    setMusicState(true);
    musicButton.hidden = true;
  } catch (error) {
    setMusicState(false);
    musicButton.hidden = false;
    const blockedByBrowser = error.name === "NotAllowedError";
    musicButton.querySelector(".music-toggle__label").textContent = blockedByBrowser ? "aktifkan musik" : "lagu belum ada";
    musicButton.setAttribute("aria-label", blockedByBrowser ? "Browser meminta interaksi untuk mengaktifkan musik" : "Periksa file NCT127.mp3 di folder website");
    liveAnnouncement.textContent = blockedByBrowser ? "Browser memblokir pemutaran otomatis. Tekan tombol Aktifkan musik untuk mulai memutar lagu." : "Lagu belum dapat diputar. Pastikan file NCT127.mp3 tersedia di folder website.";
  }
}

function openModal() {
  lastFocusedElement = document.activeElement;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  modal.querySelector(".modal__close").focus();
}

function closeModal() {
  if (!modal.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
  lastFocusedElement?.focus();
}

function handleModalKeyboard(event) {
  if (!modal.classList.contains("is-open")) return;
  if (event.key === "Escape") closeModal();
  if (event.key !== "Tab") return;
  const focusable = [...modal.querySelectorAll("button")].filter((element) => !element.disabled);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

applyConfig();
setDateLabel();
sizeCanvas();
window.addEventListener("resize", sizeCanvas, { passive: true });
window.addEventListener("scroll", updateProgress, { passive: true });
openButton.addEventListener("click", revealContent);
musicButton.addEventListener("click", toggleMusic);
wishButton.addEventListener("click", startWishSequence);
candles.forEach((candle) => candle.addEventListener("click", () => extinguishCandle(candle)));
document.querySelector("#secret-button").addEventListener("click", openModal);
modal.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
document.addEventListener("keydown", handleModalKeyboard);
startMusicOnLoad();

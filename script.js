// quản lý giao diện sáng tối
(function () {
  const currentTheme = localStorage.getItem("site-theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
})();

document.addEventListener("DOMContentLoaded", function () {
  // cập nhật nút theme
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    const updateThemeBtnIcon = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      themeToggleBtn.innerHTML = isDark ? "☀️ Sáng" : "🌙 Tối";
    };
    updateThemeBtnIcon();

    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const nextTheme = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("site-theme", nextTheme);
      updateThemeBtnIcon();
      showToast(isDark ? "Đã bật giao diện sáng!" : "Đã bật giao diện đêm bí ẩn!");
    });
  }

  // tạo âm thanh vui nhộn bằng web audio api (ko cần file mp3 ngoài)
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // hiệu ứng beep
  function playTone(freq, duration, type = "sine") {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  // hiệu ứng troll gáy
  function playCrowSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [300, 420, 560, 720, 950];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.18, "sawtooth");
      }, idx * 100);
    });
  }

  // hiệu ứng tít tít máy quét
  function playScanSound() {
    playTone(880, 0.08, "square");
  }

  // hiệu ứng thành công
  function playSuccessSound() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.25, "triangle");
      }, idx * 120);
    });
  }

  // hàm hiển thị toast
  function showToast(message) {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3200);
  }
  window.showToast = showToast;

  // tính năng máy đo độ gay
  const btnScanGay = document.getElementById("btnScanGay");
  const gayProgressBar = document.getElementById("gayProgressBar");
  const gayResultText = document.getElementById("gayResultText");

  if (btnScanGay && gayProgressBar && gayResultText) {
    let scanning = false;
    btnScanGay.addEventListener("click", function () {
      if (scanning) return;
      scanning = true;
      btnScanGay.disabled = true;
      btnScanGay.textContent = "Đang quét ADN... ⏳";
      gayProgressBar.style.width = "0%";
      gayResultText.textContent = "Hệ thống đang phân tích tín hiệu bê đê...";

      let step = 0;
      const totalSteps = 20;
      const interval = setInterval(() => {
        step++;
        const percent = Math.min(100, Math.floor((step / totalSteps) * 100));
        gayProgressBar.style.width = percent + "%";
        playScanSound();

        if (step >= totalSteps) {
          clearInterval(interval);
          scanning = false;
          btnScanGay.disabled = false;
          btnScanGay.textContent = "Quét lại phát nữa 🔄";
          playSuccessSound();
          gayResultText.innerHTML = `Kết quả: <b style="color: #ff007f; font-size: 1.2rem;">100% Gay Siêu Cấp Vip Pro</b> 🏳️‍🌈 (kết quả chuẩn 100%)`;
          showToast("Đã phân tích xong: Nồng độ gay đạt cực đại!");
        }
      }, 70);
    });
  }

  // nút troll: donate bỉm
  const btnDonateBim = document.getElementById("btnDonateBim");
  if (btnDonateBim) {
    let bimCount = parseInt(localStorage.getItem("phucha_bim_count") || "0", 10);
    btnDonateBim.addEventListener("click", () => {
      bimCount++;
      localStorage.setItem("phucha_bim_count", bimCount);
      playTone(600, 0.15, "triangle");
      showToast(`🍼 Đã donate 1 bịch bỉm cho Hà! (Tổng cộng: ${bimCount} bịch)`);
    });
  }

  // nút troll: tố cáo
  const btnReport = document.getElementById("btnReport");
  if (btnReport) {
    btnReport.addEventListener("click", () => {
      playTone(220, 0.35, "sawtooth");
      showToast("🚨 Đơn tố cáo đã gửi tới FBI và Hội bảo vệ chim thế giới!");
    });
  }

  // nút troll: nghe tiếng gáy
  const btnCrow = document.getElementById("btnCrow");
  if (btnCrow) {
    btnCrow.addEventListener("click", () => {
      playCrowSound();
      showToast("🔊 Nguyễn Phúc Hà vừa gáy ó ó ó!");
    });
  }

  // nút troll: copy link dìm hàng
  const btnShare = document.getElementById("btnShare");
  if (btnShare) {
    btnShare.addEventListener("click", () => {
      const url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          playSuccessSound();
          showToast("📋 Đã sao chép link! Mau gửi vào group chat bóc phốt 😆");
        }).catch(() => {
          showToast("Link trang: " + url);
        });
      } else {
        showToast("Link: " + url);
      }
    });
  }

  // logic lightbox xem ảnh album
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const btnRandomPic = document.getElementById("btnRandomPic");

  if (galleryItems.length > 0 && lightboxModal && lightboxImg) {
    const imagesList = Array.from(galleryItems).map((item) => {
      const img = item.querySelector("img");
      return {
        src: img ? img.getAttribute("src") : "",
        alt: img ? (img.getAttribute("alt") || "Ảnh tư liệu") : "Ảnh tư liệu"
      };
    });

    let currentIndex = 0;

    function openLightbox(index) {
      if (index < 0 || index >= imagesList.length) return;
      currentIndex = index;
      lightboxImg.src = imagesList[currentIndex].src;
      if (lightboxCaption) {
        lightboxCaption.innerHTML = `Ảnh ${currentIndex + 1} / ${imagesList.length} - <span>${imagesList[currentIndex].alt}</span>`;
      }
      lightboxModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightboxModal.classList.remove("active");
      document.body.style.overflow = "";
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
      openLightbox(currentIndex);
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % imagesList.length;
      openLightbox(currentIndex);
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        openLightbox(index);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); showPrev(); });
    if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); showNext(); });

    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal || e.target.classList.contains("lightbox-content")) {
        closeLightbox();
      }
    });

    // điều hướng bằng phím
    document.addEventListener("keydown", (e) => {
      if (!lightboxModal.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    });

    // nút bốc quẻ ảnh ngẫu nhiên
    if (btnRandomPic) {
      btnRandomPic.addEventListener("click", () => {
        const randIdx = Math.floor(Math.random() * imagesList.length);
        openLightbox(randIdx);
        playSuccessSound();
        showToast(`🎲 Bốc trúng bức ảnh số ${randIdx + 1}!`);
      });
    }
  }
});

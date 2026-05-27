document.addEventListener('DOMContentLoaded', () => {

    // Ép trình duyệt luôn tải từ đầu trang, không khôi phục vị trí cuộn cũ
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- 1. Mở Cửa Chữ Hỉ, Phát Video & Phát Nhạc ---
    const doorOverlay = document.getElementById('doorOverlay');
    const videoContainer = document.getElementById('videoContainer');
    const weddingVideo = document.getElementById('weddingVideo');
    const bgMusic = document.getElementById('bgMusic');
    const musicControl = document.getElementById('musicControl');

    // Khóa cuộn trang khi chưa mở thiệp
    document.body.style.overflow = 'hidden';

    // Hàm chuyển cảnh sau khi video kết thúc hoặc bấm bỏ qua
    let transitionTriggered = false;
    const revealInvitation = () => {
        if (transitionTriggered) return;
        transitionTriggered = true;

        // Dừng video nếu đang chạy
        weddingVideo.pause();

        // Ẩn màn hình video
        videoContainer.classList.add('fade-out');

        // Phát nhạc nền
        bgMusic.play().then(() => {
            musicControl.classList.add('show');
        }).catch(err => console.log("Lỗi phát nhạc:", err));

        // Hiện nội dung chính
        document.getElementById('mainContent').classList.add('show-content');

        // Đợi hiệu ứng ẩn video hoàn tất
        setTimeout(() => {
            document.body.style.overflow = 'auto';
            videoContainer.style.display = 'none';
        }, 800);
    };

    // Khi bấm vào cửa
    doorOverlay.addEventListener('click', () => {
        // Mở cửa
        doorOverlay.classList.add('opened');

        // Chờ cửa mở xong (1.5s) rồi hiện video
        setTimeout(() => {
            doorOverlay.style.display = 'none';
            videoContainer.classList.add('active');

            // Tua video về đầu và phát
            weddingVideo.currentTime = 0;
            weddingVideo.play().catch(err => {
                console.log("Không thể tự động phát video:", err);
            });
        }, 1500);
    });

    // Khi video kết thúc → hiện nội dung
    weddingVideo.addEventListener('ended', revealInvitation);



    // Sự kiện bật/tắt nhạc khi bấm vào icon nhạc
    musicControl.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicControl.classList.remove('paused');
        } else {
            bgMusic.pause();
            musicControl.classList.add('paused');
        }
    });

    // --- 2. Scroll Reveal (Hiệu ứng trồi lên) ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Nếu muốn hiệu ứng chỉ chạy 1 lần, bỏ comment dòng dưới
                // observer.unobserve(entry.target);
            } else {
                // Nếu người dùng cuộn ngược lên, có muốn phần tử ẩn đi để lần sau cuộn xuống hiện lại không?
                // Theo ghi chú design-notes: khi rời khỏi vùng xem thì gỡ class để lần sau replay.
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Kích hoạt khi 15% phần tử xuất hiện trên màn hình
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3. Tạo Lịch Tháng 11/2026 ---
    const calendarDaysContainer = document.getElementById('calendarDays');
    const targetYear = 2026;
    const targetMonth = 10; // Tháng 11 (0-indexed: 10 là tháng 11)
    const targetDates = [28, 29]; // Các ngày cần tô đỏ

    // Tính ngày đầu tiên của tháng và tổng số ngày trong tháng
    const firstDay = new Date(targetYear, targetMonth, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate(); // 30 ngày

    let html = '';
    
    // In các ô trống của tuần đầu tiên nếu mùng 1 không phải Chủ Nhật
    for (let i = 0; i < firstDay; i++) {
        html += `<span></span>`;
    }

    // In các ngày trong tháng
    for (let d = 1; d <= daysInMonth; d++) {
        if (targetDates.includes(d)) {
            html += `<span class="heart">${d}</span>`;
        } else {
            html += `<span>${d}</span>`;
        }
    }

    calendarDaysContainer.innerHTML = html;

});

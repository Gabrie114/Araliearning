// ============ PAGES ============
const Pages = {
    landing() {
        return `
        ${Components.navbar()}
        <section class="hero">
            <div class="hero-bg"></div>
            <div class="hero-content">
                <h1>Platform <span>E-Learning</span> Modern untuk Masa Depan Pendidikan</h1>
                <p>Teknologi pembelajaran terkini yang aman, efisien, dan akurat untuk guru dan murid di seluruh Indonesia.</p>
                <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
                    <a href="#/courses" class="btn btn-primary btn-lg">
                        <i class="fas fa-play-circle"></i> Jelajahi Kursus
                    </a>
                    <a href="#/login" class="btn btn-outline btn-lg">
                        <i class="fas fa-user-plus"></i> Mulai Belajar
                    </a>
                </div>
                
                <div class="hero-card">
                    <div class="hero-card-info">
                        <div class="hero-card-item">
                            <i class="fas fa-video"></i>
                            <div>
                                <strong>Video Interaktif</strong>
                                <span>Belajar lewat video YouTube</span>
                            </div>
                        </div>
                        <div class="hero-card-item">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <div>
                                <strong>Guru Berpengalaman</strong>
                                <span>Materi dari pengajar terbaik</span>
                            </div>
                        </div>
                        <div class="hero-card-item">
                            <i class="fas fa-certificate"></i>
                            <div>
                                <strong>Progres Belajar</strong>
                                <span>Pantau kemajuan belajarmu</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="hero-stats">
                    <div class="hero-stat">
                        <div class="hero-stat-value">100+</div>
                        <div class="hero-stat-label">Video Pembelajaran</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">50+</div>
                        <div class="hero-stat-label">Kursus Tersedia</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">1000+</div>
                        <div class="hero-stat-label">Murid Aktif</div>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="section" style="background: var(--white);">
            <div class="container">
                <div class="section-header">
                    <span class="section-badge">Fitur Unggulan</span>
                    <h2>Mengapa Memilih AralieArning?</h2>
                    <p>Platform pembelajaran yang dirancang untuk kemudahan guru dalam mengajar dan murid dalam belajar.</p>
                </div>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon"><i class="fas fa-play-circle"></i></div>
                        <h3>Video Pembelajaran</h3>
                        <p>Tonton video pembelajaran langsung di platform tanpa perlu berpindah ke YouTube. Belajar jadi lebih fokus.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"><i class="fas fa-tasks"></i></div>
                        <h3>Pantau Progress</h3>
                        <p>Lacak kemajuan belajar Anda dengan progress bar di setiap kursus. Ketahui materi mana yang sudah selesai.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"><i class="fas fa-users-cog"></i></div>
                        <h3>Manajemen Mudah</h3>
                        <p>Admin dan guru dapat dengan mudah mengelola kursus, materi, dan peserta melalui dashboard yang intuitif.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"><i class="fas fa-mobile-alt"></i></div>
                        <h3>Responsif</h3>
                        <p>Akses platform dari perangkat apapun - desktop, tablet, atau smartphone dengan tampilan yang optimal.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"><i class="fas fa-shield-alt"></i></div>
                        <h3>Aman & Terpercaya</h3>
                        <p>Sistem autentikasi yang aman untuk melindungi data pengguna dan memastikan akses yang tepat.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"><i class="fas fa-infinity"></i></div>
                        <h3>Akses Tanpa Batas</h3>
                        <p>Belajar kapan saja, dimana saja. Materi selalu tersedia 24/7 untuk mendukung proses belajar Anda.</p>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="section" style="background: var(--gray-100);">
            <div class="container">
                <div class="section-header">
                    <span class="section-badge">Kursus Populer</span>
                    <h2>Mulai Perjalanan Belajarmu</h2>
                    <p>Pilih dari berbagai kursus yang tersedia dan mulai belajar hari ini.</p>
                </div>
                <div class="courses-grid" id="landing-courses"></div>
                <div style="text-align:center;margin-top:2rem;">
                    <a href="#/courses" class="btn btn-primary btn-lg">Lihat Semua Kursus <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </section>
        
        ${Components.footer()}
        `;
    },

    login() {
        return `
        <div class="auth-page">
            <div class="auth-card">
                <h2>Selamat Datang</h2>
                <p class="subtitle">Masuk ke akun AralieArning Anda</p>
                <form onsubmit="Pages.handleLogin(event)">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-control" id="login-email" placeholder="nama@email.com" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" class="form-control" id="login-password" placeholder="Masukkan password" required>
                    </div>
                    <div id="login-error" class="form-error" style="margin-bottom:1rem;display:none;"></div>
                    <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;" id="login-btn">
                        <i class="fas fa-sign-in-alt"></i> Masuk
                    </button>
                </form>
                <p style="text-align:center;margin-top:1.5rem;font-size:0.9rem;color:var(--gray-600);">
                    <a href="#/" style="color:var(--primary)"><i class="fas fa-arrow-left"></i> Kembali ke Beranda</a>
                </p>
                <div style="margin-top:2rem;padding:1rem;background:var(--gray-100);border-radius:8px;font-size:0.8rem;">
                    <strong>Demo Login:</strong><br>
                    Admin: admin@araliearning.com / admin123
                </div>
            </div>
        </div>`;
    },

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');
        const btn = document.getElementById('login-btn');
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        errorEl.style.display = 'none';
        
        try {
            const data = await App.api('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            App.login(data.token, data.user);
            App.toast('Login berhasil!', 'success');
        } catch (err) {
            errorEl.textContent = err.message;
            errorEl.style.display = 'block';
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Masuk';
        }
    },

    studentDashboard() {
        return `
        ${Components.navbar()}
        <div class="dashboard">
            ${Components.sidebar()}
            <div class="main-content">
                <h2 style="margin-bottom:0.5rem;">Kursus Saya</h2>
                <p style="color:var(--gray-600);margin-bottom:2rem;">Lanjutkan belajar dari kursus yang telah Anda ikuti.</p>
                <div id="my-courses-container">
                    <div class="loading"><div class="spinner"></div></div>
                </div>
            </div>
        </div>`;
    },

    async loadMyCourses() {
        try {
            const courses = await App.api('/api/my-courses');
            const container = document.getElementById('my-courses-container');
            if (courses.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-book-open"></i>
                        <h3>Belum ada kursus</h3>
                        <p>Anda belum mengikuti kursus apapun. Jelajahi kursus yang tersedia!</p>
                        <a href="#/courses" class="btn btn-primary">Jelajahi Kursus</a>
                    </div>`;
            } else {
                container.innerHTML = `
                    <div class="courses-grid">
                        ${courses.map(c => `
                            <div class="course-card" onclick="App.navigate('#/course/${c.id}')">
                                <div class="course-card-thumbnail" style="background: linear-gradient(135deg, var(--primary), var(--secondary));">
                                    <i class="fas fa-play-circle"></i>
                                    <span class="course-card-category">${c.category || 'Umum'}</span>
                                </div>
                                <div class="course-card-body">
                                    <h3>${c.title}</h3>
                                    <p>${c.description}</p>
                                    <div class="progress-bar" style="margin-bottom:0.75rem;">
                                        <div class="progress-bar-fill" style="width:${c.enrollment?.progress || 0}%"></div>
                                    </div>
                                    <div class="course-card-meta">
                                        <span><i class="fas fa-chart-line"></i> ${c.enrollment?.progress || 0}% selesai</span>
                                        <span><i class="fas fa-video"></i> ${c.materialCount || 0} Materi</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`;
            }
        } catch (err) {
            App.toast(err.message, 'error');
        }
    }
};

// Load landing page courses
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        const container = document.getElementById('landing-courses');
        if (container) {
            try {
                const courses = await App.api('/api/courses');
                if (courses.length > 0) {
                    container.innerHTML = courses.slice(0, 3).map(c => Components.courseCard(c)).join('');
                } else {
                    container.innerHTML = '<p style="text-align:center;color:var(--gray-500);">Belum ada kursus tersedia. Silakan login sebagai admin untuk menambahkan kursus.</p>';
                }
            } catch (err) {
                container.innerHTML = '';
            }
        }
    }, 100);
});

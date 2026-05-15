// ============ REUSABLE COMPONENTS ============
const Components = {
    navbar(transparent = false) {
        const user = App.currentUser;
        return `
        <nav class="navbar${transparent ? ' navbar-transparent' : ''}">
            <a href="#/" class="navbar-brand">
                <i class="fas fa-graduation-cap"></i>
                AralieArning
            </a>
            <ul class="navbar-menu">
                <li><a href="#/" class="${App.currentPage === 'home' ? 'active' : ''}">Beranda</a></li>
                <li><a href="#/courses" class="${App.currentPage === 'courses' ? 'active' : ''}">Kursus</a></li>
                ${user ? `<li><a href="#/dashboard" class="${App.currentPage === 'dashboard' ? 'active' : ''}">Dashboard</a></li>` : ''}
            </ul>
            <div class="navbar-actions">
                ${user ? `
                    <span style="font-size:0.85rem;color:var(--gray-600);">
                        <i class="fas fa-user-circle"></i> ${user.name}
                        <span class="badge badge-${user.role}" style="margin-left:6px">${user.role}</span>
                    </span>
                    <button class="btn btn-secondary btn-sm" onclick="App.logout()">
                        <i class="fas fa-sign-out-alt"></i> Keluar
                    </button>
                ` : `
                    <a href="#/login" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Masuk
                    </a>
                `}
            </div>
        </nav>`;
    },

    sidebar() {
        const user = App.currentUser;
        const isAdmin = user && user.role === 'admin';
        const isGuru = user && user.role === 'guru';
        
        return `
        <aside class="sidebar">
            <div class="sidebar-section">MENU UTAMA</div>
            <ul class="sidebar-menu">
                <li><a href="#/dashboard" class="${App.currentPage === 'dashboard' ? 'active' : ''}">
                    <i class="fas fa-home"></i> Dashboard
                </a></li>
                ${isAdmin ? `
                <li><a href="#/users" class="${App.currentPage === 'users' ? 'active' : ''}">
                    <i class="fas fa-users"></i> Kelola Pengguna
                </a></li>
                ` : ''}
                ${isAdmin || isGuru ? `
                <li><a href="#/manage-courses" class="${App.currentPage === 'manage-courses' ? 'active' : ''}">
                    <i class="fas fa-book"></i> Kelola Kursus
                </a></li>
                ` : ''}
                <li><a href="#/courses" class="${App.currentPage === 'courses' ? 'active' : ''}">
                    <i class="fas fa-play-circle"></i> Jelajahi Kursus
                </a></li>
            </ul>
            <div class="sidebar-section">AKUN</div>
            <ul class="sidebar-menu">
                <li><a href="#" onclick="App.logout(); return false;">
                    <i class="fas fa-sign-out-alt"></i> Keluar
                </a></li>
            </ul>
        </aside>`;
    },

    footer() {
        return `
        <footer class="footer">
            <div class="footer-content">
                <div>
                    <h4><i class="fas fa-graduation-cap"></i> AralieArning</h4>
                    <p>Platform e-learning modern untuk guru dan murid. Belajar kapan saja, dimana saja.</p>
                </div>
                <div>
                    <h4>Navigasi</h4>
                    <a href="#/">Beranda</a><br>
                    <a href="#/courses">Kursus</a><br>
                    <a href="#/login">Masuk</a>
                </div>
                <div>
                    <h4>Kontak</h4>
                    <p><i class="fas fa-envelope"></i> info@araliearning.com</p>
                    <p><i class="fas fa-phone"></i> +62 812 3456 7890</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 AralieArning. All rights reserved.</p>
            </div>
        </footer>`;
    },

    modal(id, title, bodyHtml, footerHtml = '') {
        return `
        <div class="modal-overlay" id="${id}">
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="Components.closeModal('${id}')">&times;</button>
                </div>
                <div class="modal-body">
                    ${bodyHtml}
                </div>
                ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
            </div>
        </div>`;
    },

    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('active');
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('active');
    },

    courseCard(course) {
        const thumbnailBg = course.thumbnail 
            ? `background: url('${course.thumbnail}') center/cover;` 
            : `background: linear-gradient(135deg, var(--primary), var(--secondary));`;
        
        return `
        <div class="course-card" onclick="App.navigate('#/course/${course.id}')">
            <div class="course-card-thumbnail" style="${thumbnailBg}">
                ${!course.thumbnail ? '<i class="fas fa-play-circle"></i>' : ''}
                <span class="course-card-category">${course.category || 'Umum'}</span>
            </div>
            <div class="course-card-body">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-card-meta">
                    <span><i class="fas fa-user"></i> ${course.creatorName || 'Pengajar'}</span>
                    <span><i class="fas fa-video"></i> ${course.materialCount || 0} Materi</span>
                </div>
            </div>
        </div>`;
    }
};

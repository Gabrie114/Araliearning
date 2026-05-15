// ============ COURSE PAGES (Student View - Dicoding/Coursera style) ============
const Course = {
    listPage() {
        return `
        ${Components.navbar()}
        <div style="padding-top:70px;min-height:100vh;background:var(--gray-100);">
            <div style="background:linear-gradient(135deg, var(--primary), var(--accent));padding:3rem 2rem;color:white;text-align:center;">
                <h1 style="font-size:2.2rem;font-weight:700;margin-bottom:0.75rem;">Jelajahi Kursus</h1>
                <p style="opacity:0.9;max-width:600px;margin:0 auto;">Temukan kursus yang sesuai dengan minat dan kebutuhanmu. Belajar dari video berkualitas dari guru-guru terbaik.</p>
            </div>
            <div class="container" style="padding:2rem 1rem;">
                <div id="course-filters" style="display:flex;gap:0.75rem;margin-bottom:2rem;flex-wrap:wrap;">
                    <button class="btn btn-primary btn-sm filter-btn active" onclick="Course.filterCourses('all')">Semua</button>
                    <button class="btn btn-secondary btn-sm filter-btn" onclick="Course.filterCourses('Pemrograman')">Pemrograman</button>
                    <button class="btn btn-secondary btn-sm filter-btn" onclick="Course.filterCourses('Matematika')">Matematika</button>
                    <button class="btn btn-secondary btn-sm filter-btn" onclick="Course.filterCourses('Bahasa')">Bahasa</button>
                    <button class="btn btn-secondary btn-sm filter-btn" onclick="Course.filterCourses('Sains')">Sains</button>
                    <button class="btn btn-secondary btn-sm filter-btn" onclick="Course.filterCourses('Desain')">Desain</button>
                    <button class="btn btn-secondary btn-sm filter-btn" onclick="Course.filterCourses('Bisnis')">Bisnis</button>
                </div>
                <div class="courses-grid" id="courses-list">
                    <div class="loading"><div class="spinner"></div></div>
                </div>
            </div>
        </div>
        ${Components.footer()}`;
    },

    allCourses: [],

    async loadCourses() {
        try {
            const courses = await App.api('/api/courses');
            this.allCourses = courses;
            this.renderCourses(courses);
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    renderCourses(courses) {
        const container = document.getElementById('courses-list');
        if (courses.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column:1/-1;">
                    <i class="fas fa-book-open"></i>
                    <h3>Belum ada kursus</h3>
                    <p>Kursus akan segera tersedia. Silakan cek kembali nanti.</p>
                </div>`;
        } else {
            container.innerHTML = courses.map(c => Components.courseCard(c)).join('');
        }
    },

    filterCourses(category) {
        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-secondary');
        });
        event.target.classList.remove('btn-secondary');
        event.target.classList.add('active', 'btn-primary');
        
        if (category === 'all') {
            this.renderCourses(this.allCourses);
        } else {
            this.renderCourses(this.allCourses.filter(c => c.category === category));
        }
    },

    // ============ COURSE DETAIL PAGE (Dicoding/Coursera style) ============
    detailPage(courseId) {
        return `
        ${Components.navbar()}
        <div class="course-detail">
            <div id="course-detail-content">
                <div class="loading" style="padding:5rem;"><div class="spinner"></div></div>
            </div>
        </div>`;
    },

    async loadCourseDetail(courseId, materialId) {
        try {
            const course = await App.api(`/api/courses/${courseId}`);
            const materials = course.materials || [];
            
            // Check enrollment
            let enrollment = null;
            if (App.currentUser) {
                try {
                    const myCourses = await App.api('/api/my-courses');
                    const enrolled = myCourses.find(c => c.id === courseId);
                    if (enrolled) enrollment = enrolled.enrollment;
                } catch {}
            }
            
            // Select current material
            let currentMaterial = null;
            if (materialId) {
                currentMaterial = materials.find(m => m.id === materialId);
            }
            if (!currentMaterial && materials.length > 0) {
                currentMaterial = materials.sort((a,b) => a.order - b.order)[0];
            }
            
            const container = document.getElementById('course-detail-content');
            container.innerHTML = `
                <div class="course-hero">
                    <div class="container">
                        <h1>${course.title}</h1>
                        <p>${course.description}</p>
                        <div class="course-hero-meta">
                            <span><i class="fas fa-user"></i> ${course.creatorName}</span>
                            <span><i class="fas fa-video"></i> ${materials.length} Materi</span>
                            <span><i class="fas fa-folder"></i> ${course.category}</span>
                        </div>
                        ${!enrollment && App.currentUser ? `
                            <button class="btn btn-lg" style="margin-top:1.5rem;background:var(--white);color:var(--primary);" onclick="Course.enrollCourse('${courseId}')">
                                <i class="fas fa-plus-circle"></i> Ikuti Kursus Ini
                            </button>
                        ` : ''}
                        ${!App.currentUser ? `
                            <a href="#/login" class="btn btn-lg" style="margin-top:1.5rem;background:var(--white);color:var(--primary);">
                                <i class="fas fa-sign-in-alt"></i> Masuk untuk Mengikuti Kursus
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                <div class="course-layout">
                    <div class="course-main">
                        ${currentMaterial ? `
                            <div class="video-container">
                                ${App.getYoutubeEmbed(currentMaterial.youtubeUrl) 
                                    ? `<iframe src="${App.getYoutubeEmbed(currentMaterial.youtubeUrl)}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`
                                    : `<div class="video-placeholder"><i class="fas fa-video-slash"></i><p>Video tidak tersedia</p></div>`
                                }
                            </div>
                            <div class="material-content">
                                <h2>${currentMaterial.title}</h2>
                                <div class="description">
                                    ${currentMaterial.description ? currentMaterial.description.replace(/\n/g, '<br>') : '<p style="color:var(--gray-500);">Tidak ada deskripsi untuk materi ini.</p>'}
                                </div>
                                ${enrollment ? `
                                    <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--gray-200);">
                                        <button class="btn btn-success" onclick="Course.completeMaterial('${currentMaterial.id}', '${courseId}')" 
                                            ${enrollment.completedMaterials && enrollment.completedMaterials.includes(currentMaterial.id) ? 'disabled style="opacity:0.7;"' : ''}>
                                            <i class="fas fa-check-circle"></i> 
                                            ${enrollment.completedMaterials && enrollment.completedMaterials.includes(currentMaterial.id) ? 'Sudah Selesai' : 'Tandai Selesai'}
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                        ` : `
                            <div class="video-container">
                                <div class="video-placeholder">
                                    <i class="fas fa-play-circle"></i>
                                    <p>Pilih materi untuk mulai belajar</p>
                                </div>
                            </div>
                            <div class="material-content">
                                <h2>Selamat Datang di ${course.title}</h2>
                                <div class="description">
                                    <p>${course.description}</p>
                                    ${materials.length === 0 ? '<p style="color:var(--gray-500);margin-top:1rem;">Belum ada materi untuk kursus ini.</p>' : '<p style="margin-top:1rem;">Pilih materi dari sidebar untuk memulai belajar.</p>'}
                                </div>
                            </div>
                        `}
                    </div>
                    
                    <div class="course-sidebar">
                        <div class="course-sidebar-header">
                            <h3>Materi Kursus</h3>
                            <p>${materials.length} materi tersedia</p>
                            ${enrollment ? `
                                <div class="progress-bar">
                                    <div class="progress-bar-fill" style="width:${enrollment.progress || 0}%"></div>
                                </div>
                                <p style="font-size:0.75rem;color:var(--gray-500);margin-top:0.3rem;">${enrollment.progress || 0}% selesai</p>
                            ` : ''}
                        </div>
                        <ul class="material-list">
                            ${materials.sort((a,b) => a.order - b.order).map((m, i) => `
                                <li class="material-item ${currentMaterial && currentMaterial.id === m.id ? 'active' : ''} ${enrollment && enrollment.completedMaterials && enrollment.completedMaterials.includes(m.id) ? 'completed' : ''}" 
                                    onclick="App.navigate('#/course/${courseId}/${m.id}')">
                                    <span class="material-number">
                                        ${enrollment && enrollment.completedMaterials && enrollment.completedMaterials.includes(m.id) ? '<i class="fas fa-check" style="font-size:0.6rem;"></i>' : (i + 1)}
                                    </span>
                                    <div class="material-item-info">
                                        <h4>${m.title}</h4>
                                        <span><i class="fas fa-play-circle"></i> Video</span>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
        } catch (err) {
            document.getElementById('course-detail-content').innerHTML = `
                <div class="empty-state" style="padding:5rem;">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Kursus Tidak Ditemukan</h3>
                    <p>${err.message}</p>
                    <a href="#/courses" class="btn btn-primary">Kembali ke Daftar Kursus</a>
                </div>`;
        }
    },

    async enrollCourse(courseId) {
        try {
            await App.api(`/api/courses/${courseId}/enroll`, { method: 'POST' });
            App.toast('Berhasil mengikuti kursus!', 'success');
            Course.loadCourseDetail(courseId);
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    async completeMaterial(materialId, courseId) {
        try {
            await App.api(`/api/materials/${materialId}/complete`, { method: 'POST' });
            App.toast('Materi ditandai selesai!', 'success');
            Course.loadCourseDetail(courseId, materialId);
        } catch (err) {
            App.toast(err.message, 'error');
        }
    }
};

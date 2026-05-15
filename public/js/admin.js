// ============ ADMIN PAGES ============
const Admin = {
    dashboard() {
        return `
        ${Components.navbar()}
        <div class="dashboard">
            ${Components.sidebar()}
            <div class="main-content">
                <h2 style="margin-bottom:0.5rem;">Dashboard Admin</h2>
                <p style="color:var(--gray-600);margin-bottom:2rem;">Selamat datang kembali, ${App.currentUser.name}!</p>
                
                <div class="stats-grid" id="stats-container">
                    <div class="stat-card">
                        <div class="stat-card-icon blue"><i class="fas fa-users"></i></div>
                        <h3 id="stat-users">-</h3>
                        <p>Total Pengguna</p>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon green"><i class="fas fa-chalkboard-teacher"></i></div>
                        <h3 id="stat-guru">-</h3>
                        <p>Guru</p>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon orange"><i class="fas fa-user-graduate"></i></div>
                        <h3 id="stat-murid">-</h3>
                        <p>Murid</p>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon purple"><i class="fas fa-book"></i></div>
                        <h3 id="stat-courses">-</h3>
                        <p>Kursus</p>
                    </div>
                </div>
                
                <div class="table-container">
                    <div class="table-header">
                        <h3>Aksi Cepat</h3>
                    </div>
                    <div style="padding:1.5rem;display:flex;gap:1rem;flex-wrap:wrap;">
                        <a href="#/users" class="btn btn-primary"><i class="fas fa-user-plus"></i> Kelola Pengguna</a>
                        <a href="#/manage-courses" class="btn btn-success"><i class="fas fa-plus"></i> Kelola Kursus</a>
                        <a href="#/courses" class="btn btn-secondary"><i class="fas fa-eye"></i> Lihat Kursus</a>
                    </div>
                </div>
            </div>
        </div>`;
    },

    guruDashboard() {
        return `
        ${Components.navbar()}
        <div class="dashboard">
            ${Components.sidebar()}
            <div class="main-content">
                <h2 style="margin-bottom:0.5rem;">Dashboard Guru</h2>
                <p style="color:var(--gray-600);margin-bottom:2rem;">Selamat datang, ${App.currentUser.name}! Kelola kursus dan materi Anda di sini.</p>
                
                <div style="display:flex;gap:1rem;margin-bottom:2rem;">
                    <a href="#/manage-courses" class="btn btn-primary"><i class="fas fa-plus"></i> Tambah Kursus Baru</a>
                    <a href="#/courses" class="btn btn-secondary"><i class="fas fa-eye"></i> Lihat Semua Kursus</a>
                </div>
                
                <div class="table-container">
                    <div class="table-header">
                        <h3>Kursus Saya</h3>
                    </div>
                    <div id="guru-courses-container">
                        <div class="loading"><div class="spinner"></div></div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    async loadGuruCourses() {
        try {
            const courses = await App.api('/api/courses');
            const myCourses = courses.filter(c => c.creatorId === App.currentUser.id);
            const container = document.getElementById('guru-courses-container');
            if (myCourses.length === 0) {
                container.innerHTML = `<div class="empty-state"><i class="fas fa-book"></i><h3>Belum ada kursus</h3><p>Mulai buat kursus pertama Anda!</p></div>`;
            } else {
                container.innerHTML = `<table><thead><tr><th>Judul</th><th>Kategori</th><th>Jumlah Materi</th><th>Aksi</th></tr></thead><tbody>
                    ${myCourses.map(c => `<tr>
                        <td><strong>${c.title}</strong></td>
                        <td>${c.category}</td>
                        <td>${c.materialCount} materi</td>
                        <td class="action-btns">
                            <button class="btn btn-sm btn-primary" onclick="Admin.editCourse('${c.id}')"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-secondary" onclick="Admin.manageMaterials('${c.id}')"><i class="fas fa-list"></i> Materi</button>
                        </td>
                    </tr>`).join('')}
                </tbody></table>`;
            }
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    async loadStats() {
        try {
            const stats = await App.api('/api/stats');
            document.getElementById('stat-users').textContent = stats.totalUsers;
            document.getElementById('stat-guru').textContent = stats.totalGuru;
            document.getElementById('stat-murid').textContent = stats.totalMurid;
            document.getElementById('stat-courses').textContent = stats.totalCourses;
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    // ============ USERS PAGE ============
    usersPage() {
        return `
        ${Components.navbar()}
        <div class="dashboard">
            ${Components.sidebar()}
            <div class="main-content">
                <h2 style="margin-bottom:2rem;">Kelola Pengguna</h2>
                
                <div class="table-container">
                    <div class="table-header">
                        <h3>Daftar Pengguna</h3>
                        <button class="btn btn-primary" onclick="Admin.showAddUserModal()">
                            <i class="fas fa-plus"></i> Tambah Pengguna
                        </button>
                    </div>
                    <div id="users-table-container">
                        <div class="loading"><div class="spinner"></div></div>
                    </div>
                </div>
                
                <div id="user-modal-container"></div>
            </div>
        </div>`;
    },

    async loadUsers() {
        try {
            const users = await App.api('/api/users');
            const container = document.getElementById('users-table-container');
            container.innerHTML = `
            <table>
                <thead>
                    <tr><th>Nama</th><th>Email</th><th>Role</th><th>Tanggal Dibuat</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    ${users.map(u => `
                    <tr>
                        <td><strong>${u.name}</strong></td>
                        <td>${u.email}</td>
                        <td><span class="badge badge-${u.role}">${u.role}</span></td>
                        <td>${new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
                        <td class="action-btns">
                            ${u.role !== 'admin' ? `
                                <button class="btn btn-sm btn-primary" onclick="Admin.showEditUserModal('${u.id}', '${u.name}', '${u.email}', '${u.role}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="Admin.deleteUser('${u.id}', '${u.name}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : '<span style="color:var(--gray-400);font-size:0.8rem;">-</span>'}
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>`;
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    showAddUserModal() {
        const container = document.getElementById('user-modal-container');
        container.innerHTML = Components.modal('add-user-modal', 'Tambah Pengguna Baru', `
            <form onsubmit="Admin.handleAddUser(event)">
                <div class="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" class="form-control" id="user-name" required placeholder="Masukkan nama lengkap">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" id="user-email" required placeholder="nama@email.com">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" class="form-control" id="user-password" required placeholder="Min. 6 karakter" minlength="6">
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select class="form-control" id="user-role" required>
                        <option value="">Pilih Role</option>
                        <option value="guru">Guru</option>
                        <option value="murid">Murid</option>
                    </select>
                </div>
                <div id="add-user-error" class="form-error" style="display:none;margin-bottom:1rem;"></div>
                <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
                    <i class="fas fa-plus"></i> Tambah Pengguna
                </button>
            </form>
        `);
        Components.openModal('add-user-modal');
    },

    showEditUserModal(id, name, email, role) {
        const container = document.getElementById('user-modal-container');
        container.innerHTML = Components.modal('edit-user-modal', 'Edit Pengguna', `
            <form onsubmit="Admin.handleEditUser(event, '${id}')">
                <div class="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" class="form-control" id="edit-user-name" value="${name}" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" id="edit-user-email" value="${email}" required>
                </div>
                <div class="form-group">
                    <label>Password Baru (kosongkan jika tidak diubah)</label>
                    <input type="password" class="form-control" id="edit-user-password" placeholder="Kosongkan jika tidak diubah">
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select class="form-control" id="edit-user-role" required>
                        <option value="guru" ${role === 'guru' ? 'selected' : ''}>Guru</option>
                        <option value="murid" ${role === 'murid' ? 'selected' : ''}>Murid</option>
                    </select>
                </div>
                <div id="edit-user-error" class="form-error" style="display:none;margin-bottom:1rem;"></div>
                <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
                    <i class="fas fa-save"></i> Simpan Perubahan
                </button>
            </form>
        `);
        Components.openModal('edit-user-modal');
    },

    async handleAddUser(e) {
        e.preventDefault();
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const role = document.getElementById('user-role').value;
        const errorEl = document.getElementById('add-user-error');
        
        try {
            await App.api('/api/users', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, role })
            });
            Components.closeModal('add-user-modal');
            App.toast('Pengguna berhasil ditambahkan!', 'success');
            Admin.loadUsers();
        } catch (err) {
            errorEl.textContent = err.message;
            errorEl.style.display = 'block';
        }
    },

    async handleEditUser(e, id) {
        e.preventDefault();
        const name = document.getElementById('edit-user-name').value;
        const email = document.getElementById('edit-user-email').value;
        const password = document.getElementById('edit-user-password').value;
        const role = document.getElementById('edit-user-role').value;
        const errorEl = document.getElementById('edit-user-error');
        
        const body = { name, email, role };
        if (password) body.password = password;
        
        try {
            await App.api(`/api/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body)
            });
            Components.closeModal('edit-user-modal');
            App.toast('Pengguna berhasil diperbarui!', 'success');
            Admin.loadUsers();
        } catch (err) {
            errorEl.textContent = err.message;
            errorEl.style.display = 'block';
        }
    },

    async deleteUser(id, name) {
        if (!confirm(`Yakin ingin menghapus pengguna "${name}"?`)) return;
        try {
            await App.api(`/api/users/${id}`, { method: 'DELETE' });
            App.toast('Pengguna berhasil dihapus!', 'success');
            Admin.loadUsers();
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    // ============ COURSES MANAGEMENT ============
    coursesPage() {
        return `
        ${Components.navbar()}
        <div class="dashboard">
            ${Components.sidebar()}
            <div class="main-content">
                <h2 style="margin-bottom:2rem;">Kelola Kursus</h2>
                
                <div class="table-container">
                    <div class="table-header">
                        <h3>Daftar Kursus</h3>
                        <button class="btn btn-primary" onclick="Admin.showAddCourseModal()">
                            <i class="fas fa-plus"></i> Tambah Kursus
                        </button>
                    </div>
                    <div id="courses-table-container">
                        <div class="loading"><div class="spinner"></div></div>
                    </div>
                </div>
                
                <div id="course-modal-container"></div>
                <div id="material-modal-container"></div>
            </div>
        </div>`;
    },

    async loadCourses() {
        try {
            const courses = await App.api('/api/courses');
            const filteredCourses = App.currentUser.role === 'guru' 
                ? courses.filter(c => c.creatorId === App.currentUser.id) 
                : courses;
            const container = document.getElementById('courses-table-container');
            
            if (filteredCourses.length === 0) {
                container.innerHTML = `<div class="empty-state"><i class="fas fa-book"></i><h3>Belum ada kursus</h3><p>Buat kursus pertama Anda!</p></div>`;
            } else {
                container.innerHTML = `
                <table>
                    <thead>
                        <tr><th>Judul</th><th>Kategori</th><th>Pembuat</th><th>Materi</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                        ${filteredCourses.map(c => `
                        <tr>
                            <td><strong>${c.title}</strong></td>
                            <td>${c.category}</td>
                            <td>${c.creatorName}</td>
                            <td>${c.materialCount} materi</td>
                            <td class="action-btns">
                                <button class="btn btn-sm btn-primary" onclick="Admin.showEditCourseModal('${c.id}')"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-sm btn-secondary" onclick="Admin.manageMaterials('${c.id}')"><i class="fas fa-list"></i></button>
                                <button class="btn btn-sm btn-danger" onclick="Admin.deleteCourse('${c.id}', '${c.title}')"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>`;
            }
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    showAddCourseModal() {
        const container = document.getElementById('course-modal-container');
        container.innerHTML = Components.modal('add-course-modal', 'Tambah Kursus Baru', `
            <form onsubmit="Admin.handleAddCourse(event)">
                <div class="form-group">
                    <label>Judul Kursus</label>
                    <input type="text" class="form-control" id="course-title" required placeholder="Contoh: Dasar Pemrograman Python">
                </div>
                <div class="form-group">
                    <label>Deskripsi</label>
                    <textarea class="form-control" id="course-desc" required placeholder="Deskripsikan kursus ini..."></textarea>
                </div>
                <div class="form-group">
                    <label>Kategori</label>
                    <select class="form-control" id="course-category">
                        <option value="Pemrograman">Pemrograman</option>
                        <option value="Matematika">Matematika</option>
                        <option value="Bahasa">Bahasa</option>
                        <option value="Sains">Sains</option>
                        <option value="Desain">Desain</option>
                        <option value="Bisnis">Bisnis</option>
                        <option value="Umum">Umum</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Thumbnail URL (opsional)</label>
                    <input type="url" class="form-control" id="course-thumbnail" placeholder="https://...">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
                    <i class="fas fa-plus"></i> Buat Kursus
                </button>
            </form>
        `);
        Components.openModal('add-course-modal');
    },

    async showEditCourseModal(id) {
        try {
            const course = await App.api(`/api/courses/${id}`);
            const container = document.getElementById('course-modal-container');
            container.innerHTML = Components.modal('edit-course-modal', 'Edit Kursus', `
                <form onsubmit="Admin.handleEditCourse(event, '${id}')">
                    <div class="form-group">
                        <label>Judul Kursus</label>
                        <input type="text" class="form-control" id="edit-course-title" value="${course.title}" required>
                    </div>
                    <div class="form-group">
                        <label>Deskripsi</label>
                        <textarea class="form-control" id="edit-course-desc" required>${course.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Kategori</label>
                        <select class="form-control" id="edit-course-category">
                            ${['Pemrograman','Matematika','Bahasa','Sains','Desain','Bisnis','Umum'].map(cat => 
                                `<option value="${cat}" ${course.category === cat ? 'selected' : ''}>${cat}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Thumbnail URL (opsional)</label>
                        <input type="url" class="form-control" id="edit-course-thumbnail" value="${course.thumbnail || ''}">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
                        <i class="fas fa-save"></i> Simpan Perubahan
                    </button>
                </form>
            `);
            Components.openModal('edit-course-modal');
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    async handleAddCourse(e) {
        e.preventDefault();
        try {
            await App.api('/api/courses', {
                method: 'POST',
                body: JSON.stringify({
                    title: document.getElementById('course-title').value,
                    description: document.getElementById('course-desc').value,
                    category: document.getElementById('course-category').value,
                    thumbnail: document.getElementById('course-thumbnail').value
                })
            });
            Components.closeModal('add-course-modal');
            App.toast('Kursus berhasil dibuat!', 'success');
            Admin.loadCourses();
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    async handleEditCourse(e, id) {
        e.preventDefault();
        try {
            await App.api(`/api/courses/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: document.getElementById('edit-course-title').value,
                    description: document.getElementById('edit-course-desc').value,
                    category: document.getElementById('edit-course-category').value,
                    thumbnail: document.getElementById('edit-course-thumbnail').value
                })
            });
            Components.closeModal('edit-course-modal');
            App.toast('Kursus berhasil diperbarui!', 'success');
            Admin.loadCourses();
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    async deleteCourse(id, title) {
        if (!confirm(`Yakin ingin menghapus kursus "${title}"? Semua materi di dalamnya juga akan terhapus.`)) return;
        try {
            await App.api(`/api/courses/${id}`, { method: 'DELETE' });
            App.toast('Kursus berhasil dihapus!', 'success');
            Admin.loadCourses();
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    // ============ MATERIALS MANAGEMENT ============
    async manageMaterials(courseId) {
        try {
            const course = await App.api(`/api/courses/${courseId}`);
            const materials = await App.api(`/api/courses/${courseId}/materials`);
            const container = document.getElementById('material-modal-container') || document.getElementById('course-modal-container');
            
            container.innerHTML = Components.modal('materials-modal', `Materi: ${course.title}`, `
                <div style="margin-bottom:1rem;">
                    <button class="btn btn-primary btn-sm" onclick="Admin.showAddMaterialModal('${courseId}')">
                        <i class="fas fa-plus"></i> Tambah Materi
                    </button>
                </div>
                <div id="materials-list">
                    ${materials.length === 0 ? '<p style="color:var(--gray-500);text-align:center;padding:2rem;">Belum ada materi</p>' :
                    materials.sort((a,b) => a.order - b.order).map((m, i) => `
                        <div style="display:flex;align-items:center;gap:12px;padding:0.75rem;border:1px solid var(--gray-200);border-radius:8px;margin-bottom:0.5rem;">
                            <span style="width:28px;height:28px;background:var(--primary-light);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:600;color:var(--primary);">${i+1}</span>
                            <div style="flex:1;">
                                <strong style="font-size:0.85rem;">${m.title}</strong><br>
                                <small style="color:var(--gray-500);">${m.youtubeUrl}</small>
                            </div>
                            <button class="btn btn-sm btn-danger" onclick="Admin.deleteMaterial('${m.id}', '${courseId}')"><i class="fas fa-trash"></i></button>
                        </div>
                    `).join('')}
                </div>
                <div id="add-material-form-container"></div>
            `);
            Components.openModal('materials-modal');
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    showAddMaterialModal(courseId) {
        const container = document.getElementById('add-material-form-container');
        container.innerHTML = `
            <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--gray-200);">
                <h4 style="margin-bottom:1rem;">Tambah Materi Baru</h4>
                <form onsubmit="Admin.handleAddMaterial(event, '${courseId}')">
                    <div class="form-group">
                        <label>Judul Materi</label>
                        <input type="text" class="form-control" id="material-title" required placeholder="Contoh: Pengenalan Variabel">
                    </div>
                    <div class="form-group">
                        <label>Link YouTube</label>
                        <input type="url" class="form-control" id="material-youtube" required placeholder="https://www.youtube.com/watch?v=...">
                    </div>
                    <div class="form-group">
                        <label>Deskripsi / Penjelasan</label>
                        <textarea class="form-control" id="material-desc" placeholder="Penjelasan singkat tentang materi ini..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Tambah</button>
                </form>
            </div>
        `;
    },

    async handleAddMaterial(e, courseId) {
        e.preventDefault();
        try {
            await App.api(`/api/courses/${courseId}/materials`, {
                method: 'POST',
                body: JSON.stringify({
                    title: document.getElementById('material-title').value,
                    youtubeUrl: document.getElementById('material-youtube').value,
                    description: document.getElementById('material-desc').value
                })
            });
            App.toast('Materi berhasil ditambahkan!', 'success');
            Admin.manageMaterials(courseId);
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    async deleteMaterial(materialId, courseId) {
        if (!confirm('Yakin ingin menghapus materi ini?')) return;
        try {
            await App.api(`/api/materials/${materialId}`, { method: 'DELETE' });
            App.toast('Materi berhasil dihapus!', 'success');
            Admin.manageMaterials(courseId);
        } catch (err) {
            App.toast(err.message, 'error');
        }
    },

    editCourse(id) {
        Admin.showEditCourseModal(id);
    }
};

// ============ APP CORE ============
const App = {
    currentUser: null,
    token: null,
    currentPage: '',

    init() {
        this.token = localStorage.getItem('token');
        this.loadUser().then(() => {
            this.router();
            window.addEventListener('hashchange', () => this.router());
        });
    },

    async loadUser() {
        if (!this.token) return;
        try {
            const res = await this.api('/api/auth/me');
            this.currentUser = res;
        } catch {
            this.logout();
        }
    },

    async api(url, options = {}) {
        const headers = { 'Content-Type': 'application/json' };
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
        
        const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Something went wrong');
        return data;
    },

    login(token, user) {
        this.token = token;
        this.currentUser = user;
        localStorage.setItem('token', token);
        this.navigate(user.role === 'murid' ? '#/courses' : '#/dashboard');
    },

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('token');
        this.navigate('#/');
    },

    navigate(hash) {
        window.location.hash = hash;
    },

    router() {
        const hash = window.location.hash || '#/';
        const app = document.getElementById('app');
        
        // Parse route
        const [path, ...params] = hash.slice(2).split('/');
        
        switch (path) {
            case '':
            case 'home':
                this.currentPage = 'home';
                app.innerHTML = Pages.landing();
                break;
            case 'login':
                this.currentPage = 'login';
                app.innerHTML = Pages.login();
                break;
            case 'dashboard':
                if (!this.currentUser) return this.navigate('#/login');
                this.currentPage = 'dashboard';
                if (this.currentUser.role === 'admin') {
                    app.innerHTML = Admin.dashboard();
                    Admin.loadStats();
                } else if (this.currentUser.role === 'guru') {
                    app.innerHTML = Admin.guruDashboard();
                    Admin.loadGuruCourses();
                } else {
                    app.innerHTML = Pages.studentDashboard();
                    Pages.loadMyCourses();
                }
                break;
            case 'users':
                if (!this.currentUser || this.currentUser.role !== 'admin') return this.navigate('#/login');
                this.currentPage = 'users';
                app.innerHTML = Admin.usersPage();
                Admin.loadUsers();
                break;
            case 'manage-courses':
                if (!this.currentUser || (this.currentUser.role !== 'admin' && this.currentUser.role !== 'guru')) return this.navigate('#/login');
                this.currentPage = 'manage-courses';
                app.innerHTML = Admin.coursesPage();
                Admin.loadCourses();
                break;
            case 'courses':
                this.currentPage = 'courses';
                app.innerHTML = Course.listPage();
                Course.loadCourses();
                break;
            case 'course':
                this.currentPage = 'course';
                const courseId = params[0];
                const materialId = params[1];
                app.innerHTML = Course.detailPage(courseId);
                Course.loadCourseDetail(courseId, materialId);
                break;
            default:
                this.currentPage = 'home';
                app.innerHTML = Pages.landing();
        }
    },

    toast(message, type = 'info') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    getYoutubeId(url) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    },

    getYoutubeEmbed(url) {
        const id = this.getYoutubeId(url);
        return id ? `https://www.youtube.com/embed/${id}` : null;
    }
};

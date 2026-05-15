const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');


const PORT = 3000;
const JWT_SECRET = 'araliearning-secret-key-2024';

// ============ UTILITY FUNCTIONS ============
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}

function sendJSON(res, data, status = 200) {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(data));
}

function sendFile(res, filePath) {
    const ext = path.extname(filePath);
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    
    if (!fs.existsSync(filePath)) {
        // SPA fallback - serve index.html
        const indexPath = path.join(__dirname, 'public', 'index.html');
        if (fs.existsSync(indexPath)) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fs.readFileSync(indexPath));
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
        return;
    }
    
    res.writeHead(200, { 'Content-Type': mime });
    res.end(fs.readFileSync(filePath));
}

// ============ DATABASE ============
const DB_PATH = path.join(__dirname, 'data', 'db.json');

function getDB() {
    if (!fs.existsSync(DB_PATH)) {
        const dir = path.join(__dirname, 'data');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        const initialDB = {
            users: [{
                id: '1',
                name: 'Administrator',
                email: 'admin@araliearning.com',
                password: hashPassword('admin123'),
                role: 'admin',
                createdAt: new Date().toISOString()
            }],
            courses: [],
            materials: [],
            enrollments: []
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
        return initialDB;
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function saveDB(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function generateId() {
    return crypto.randomUUID();
}

// ============ AUTH ============
function generateToken(user) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 86400000 })).toString('base64url');
    const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
    try {
        const [header, body, signature] = token.split('.');
        const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
        if (signature !== expectedSig) return null;
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
        if (payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

function getUser(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return verifyToken(authHeader.split(' ')[1]);
}

// ============ ROUTER ============
function matchRoute(method, pathname) {
    const routes = [
        // Auth
        { method: 'POST', pattern: '/api/auth/login', handler: handleLogin },
        { method: 'GET', pattern: '/api/auth/me', handler: handleMe },
        // Users
        { method: 'GET', pattern: '/api/users', handler: handleGetUsers },
        { method: 'POST', pattern: '/api/users', handler: handleCreateUser },
        { method: 'PUT', pattern: '/api/users/:id', handler: handleUpdateUser },
        { method: 'DELETE', pattern: '/api/users/:id', handler: handleDeleteUser },
        // Courses
        { method: 'GET', pattern: '/api/courses', handler: handleGetCourses },
        { method: 'POST', pattern: '/api/courses', handler: handleCreateCourse },
        { method: 'GET', pattern: '/api/courses/:id', handler: handleGetCourse },
        { method: 'PUT', pattern: '/api/courses/:id', handler: handleUpdateCourse },
        { method: 'DELETE', pattern: '/api/courses/:id', handler: handleDeleteCourse },
        // Materials
        { method: 'GET', pattern: '/api/courses/:courseId/materials', handler: handleGetMaterials },
        { method: 'POST', pattern: '/api/courses/:courseId/materials', handler: handleCreateMaterial },
        { method: 'PUT', pattern: '/api/materials/:id', handler: handleUpdateMaterial },
        { method: 'DELETE', pattern: '/api/materials/:id', handler: handleDeleteMaterial },
        // Enrollment
        { method: 'POST', pattern: '/api/courses/:courseId/enroll', handler: handleEnroll },
        { method: 'GET', pattern: '/api/my-courses', handler: handleMyCourses },
        { method: 'POST', pattern: '/api/materials/:id/complete', handler: handleCompleteMaterial },
        // Stats
        { method: 'GET', pattern: '/api/stats', handler: handleStats }
    ];

    for (const route of routes) {
        if (route.method !== method) continue;
        const params = matchPath(route.pattern, pathname);
        if (params !== null) return { handler: route.handler, params };
    }
    return null;
}

function matchPath(pattern, pathname) {
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');
    if (patternParts.length !== pathParts.length) return null;
    
    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
            params[patternParts[i].slice(1)] = pathParts[i];
        } else if (patternParts[i] !== pathParts[i]) {
            return null;
        }
    }
    return params;
}

// ============ HANDLERS ============
async function handleLogin(req, res, params, body) {
    const { email, password } = body;
    const db = getDB();
    const user = db.users.find(u => u.email === email && u.password === hashPassword(password));
    if (!user) return sendJSON(res, { error: 'Email atau password salah' }, 401);
    const token = generateToken(user);
    sendJSON(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

async function handleMe(req, res) {
    const user = getUser(req);
    if (!user) return sendJSON(res, { error: 'Unauthorized' }, 401);
    const db = getDB();
    const dbUser = db.users.find(u => u.id === user.id);
    if (!dbUser) return sendJSON(res, { error: 'User not found' }, 404);
    sendJSON(res, { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role });
}

async function handleGetUsers(req, res) {
    const user = getUser(req);
    if (!user || user.role !== 'admin') return sendJSON(res, { error: 'Unauthorized' }, 401);
    const db = getDB();
    sendJSON(res, db.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })));
}

async function handleCreateUser(req, res, params, body) {
    const user = getUser(req);
    if (!user || user.role !== 'admin') return sendJSON(res, { error: 'Unauthorized' }, 401);
    const { name, email, password, role } = body;
    if (!name || !email || !password || !role) return sendJSON(res, { error: 'Semua field harus diisi' }, 400);
    if (!['guru', 'murid'].includes(role)) return sendJSON(res, { error: 'Role harus guru atau murid' }, 400);
    const db = getDB();
    if (db.users.find(u => u.email === email)) return sendJSON(res, { error: 'Email sudah terdaftar' }, 400);
    const newUser = { id: generateId(), name, email, password: hashPassword(password), role, createdAt: new Date().toISOString() };
    db.users.push(newUser);
    saveDB(db);
    sendJSON(res, { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, 201);
}

async function handleUpdateUser(req, res, params, body) {
    const user = getUser(req);
    if (!user || user.role !== 'admin') return sendJSON(res, { error: 'Unauthorized' }, 401);
    const { name, email, password, role } = body;
    const db = getDB();
    const idx = db.users.findIndex(u => u.id === params.id);
    if (idx === -1) return sendJSON(res, { error: 'User tidak ditemukan' }, 404);
    if (db.users[idx].role === 'admin') return sendJSON(res, { error: 'Tidak bisa edit admin' }, 403);
    if (name) db.users[idx].name = name;
    if (email) {
        if (db.users.find(u => u.email === email && u.id !== params.id)) return sendJSON(res, { error: 'Email sudah digunakan' }, 400);
        db.users[idx].email = email;
    }
    if (password) db.users[idx].password = hashPassword(password);
    if (role && ['guru', 'murid'].includes(role)) db.users[idx].role = role;
    saveDB(db);
    sendJSON(res, { id: db.users[idx].id, name: db.users[idx].name, email: db.users[idx].email, role: db.users[idx].role });
}

async function handleDeleteUser(req, res, params) {
    const user = getUser(req);
    if (!user || user.role !== 'admin') return sendJSON(res, { error: 'Unauthorized' }, 401);
    const db = getDB();
    const idx = db.users.findIndex(u => u.id === params.id);
    if (idx === -1) return sendJSON(res, { error: 'User tidak ditemukan' }, 404);
    if (db.users[idx].role === 'admin') return sendJSON(res, { error: 'Tidak bisa hapus admin' }, 403);
    db.users.splice(idx, 1);
    saveDB(db);
    sendJSON(res, { message: 'User berhasil dihapus' });
}

async function handleGetCourses(req, res) {
    const db = getDB();
    const courses = db.courses.map(c => {
        const creator = db.users.find(u => u.id === c.creatorId);
        const materialCount = db.materials.filter(m => m.courseId === c.id).length;
        return { ...c, creatorName: creator ? creator.name : 'Unknown', materialCount };
    });
    sendJSON(res, courses);
}

async function handleGetCourse(req, res, params) {
    const db = getDB();
    const course = db.courses.find(c => c.id === params.id);
    if (!course) return sendJSON(res, { error: 'Kursus tidak ditemukan' }, 404);
    const creator = db.users.find(u => u.id === course.creatorId);
    const materials = db.materials.filter(m => m.courseId === course.id);
    sendJSON(res, { ...course, creatorName: creator ? creator.name : 'Unknown', materials });
}

async function handleCreateCourse(req, res, params, body) {
    const user = getUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'guru')) return sendJSON(res, { error: 'Unauthorized' }, 401);
    const { title, description, category, thumbnail } = body;
    if (!title || !description) return sendJSON(res, { error: 'Judul dan deskripsi harus diisi' }, 400);
    const db = getDB();
    const newCourse = { id: generateId(), title, description, category: category || 'Umum', thumbnail: thumbnail || '', creatorId: user.id, createdAt: new Date().toISOString() };
    db.courses.push(newCourse);
    saveDB(db);
    sendJSON(res, newCourse, 201);
}

async function handleUpdateCourse(req, res, params, body) {
    const user = getUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'guru')) return sendJSON(res, { error: 'Unauthorized' }, 401);
    const { title, description, category, thumbnail } = body;
    const db = getDB();
    const idx = db.courses.findIndex(c => c.id === params.id);
    if (idx === -1) return sendJSON(res, { error: 'Kursus tidak ditemukan' }, 404);
    if (user.role === 'guru' && db.courses[idx].creatorId !== user.id) return sendJSON(res, { error: 'Hanya bisa edit kursus sendiri' }, 403);
    if (title) db.courses[idx].title = title;
    if (description) db.courses[idx].description = description;
    if (category) db.courses[idx].category = category;
    if (thumbnail !== undefined) db.courses[idx].thumbnail = thumbnail;
    saveDB(db);
    sendJSON(res, db.courses[idx]);
}

async function handleDeleteCourse(req, res, params) {
    const user = getUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'guru')) return sendJSON(res, { error: 'Unauthorized' }, 401);
    const db = getDB();
    const idx = db.courses.findIndex(c => c.id === params.id);
    if (idx === -1) return sendJSON(res, { error: 'Kursus tidak ditemukan' }, 404);
    if (user.role === 'guru' && db.courses[idx].creatorId !== user.id) return sendJSON(res, { error: 'Hanya bisa hapus kursus sendiri' }, 403);
    const courseId = db.courses[idx].id;
    db.courses.splice(idx, 1);
    db.materials = db.materials.filter(m => m.courseId !== courseId);
    db.enrollments = db.enrollments.filter(e => e.courseId !== courseId);
    saveDB(db);
    sendJSON(res, { message: 'Kursus berhasil dihapus' });
}

async function handleGetMaterials(req, res, params) {
    const db = getDB();
    sendJSON(res, db.materials.filter(m => m.courseId === params.courseId));
}

async function handleCreateMaterial(req, res, params, body) {
    const user = getUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'guru')) return sendJSON(res, { error: 'Unauthorized' }, 401);
    const { title, description, youtubeUrl, order } = body;
    if (!title || !youtubeUrl) return sendJSON(res, { error: 'Judul dan link YouTube harus diisi' }, 400);
    const db = getDB();
    const course = db.courses.find(c => c.id === params.courseId);
    if (!course) return sendJSON(res, { error: 'Kursus tidak ditemukan' }, 404);
    if (user.role === 'guru' && course.creatorId !== user.id) return sendJSON(res, { error: 'Hanya bisa tambah materi ke kursus sendiri' }, 403);
    const newMaterial = { id: generateId(), courseId: params.courseId, title, description: description || '', youtubeUrl, order: order || db.materials.filter(m => m.courseId === params.courseId).length + 1, createdAt: new Date().toISOString() };
    db.materials.push(newMaterial);
    saveDB(db);
    sendJSON(res, newMaterial, 201);
}

async function handleUpdateMaterial(req, res, params, body) {
    const user = getUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'guru')) return sendJSON(res, { error: 'Unauthorized' }, 401);
    const { title, description, youtubeUrl, order } = body;
    const db = getDB();
    const idx = db.materials.findIndex(m => m.id === params.id);
    if (idx === -1) return sendJSON(res, { error: 'Materi tidak ditemukan' }, 404);
    if (title) db.materials[idx].title = title;
    if (description !== undefined) db.materials[idx].description = description;
    if (youtubeUrl) db.materials[idx].youtubeUrl = youtubeUrl;
    if (order) db.materials[idx].order = order;
    saveDB(db);
    sendJSON(res, db.materials[idx]);
}

async function handleDeleteMaterial(req, res, params) {
    const user = getUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'guru')) return sendJSON(res, { error: 'Unauthorized' }, 401);
    const db = getDB();
    const idx = db.materials.findIndex(m => m.id === params.id);
    if (idx === -1) return sendJSON(res, { error: 'Materi tidak ditemukan' }, 404);
    db.materials.splice(idx, 1);
    saveDB(db);
    sendJSON(res, { message: 'Materi berhasil dihapus' });
}

async function handleEnroll(req, res, params) {
    const user = getUser(req);
    if (!user) return sendJSON(res, { error: 'Unauthorized' }, 401);
    const db = getDB();
    const course = db.courses.find(c => c.id === params.courseId);
    if (!course) return sendJSON(res, { error: 'Kursus tidak ditemukan' }, 404);
    const existing = db.enrollments.find(e => e.userId === user.id && e.courseId === params.courseId);
    if (existing) return sendJSON(res, { error: 'Sudah terdaftar di kursus ini' }, 400);
    const enrollment = { id: generateId(), userId: user.id, courseId: params.courseId, progress: 0, completedMaterials: [], enrolledAt: new Date().toISOString() };
    db.enrollments.push(enrollment);
    saveDB(db);
    sendJSON(res, enrollment, 201);
}

async function handleMyCourses(req, res) {
    const user = getUser(req);
    if (!user) return sendJSON(res, { error: 'Unauthorized' }, 401);
    const db = getDB();
    const enrollments = db.enrollments.filter(e => e.userId === user.id);
    const courses = enrollments.map(e => {
        const course = db.courses.find(c => c.id === e.courseId);
        if (!course) return null;
        const materialCount = db.materials.filter(m => m.courseId === e.courseId).length;
        return { ...course, enrollment: e, materialCount };
    }).filter(Boolean);
    sendJSON(res, courses);
}

async function handleCompleteMaterial(req, res, params) {
    const user = getUser(req);
    if (!user) return sendJSON(res, { error: 'Unauthorized' }, 401);
    const db = getDB();
    const material = db.materials.find(m => m.id === params.id);
    if (!material) return sendJSON(res, { error: 'Materi tidak ditemukan' }, 404);
    const enrollment = db.enrollments.find(e => e.userId === user.id && e.courseId === material.courseId);
    if (!enrollment) return sendJSON(res, { error: 'Belum terdaftar di kursus ini' }, 400);
    if (!enrollment.completedMaterials.includes(params.id)) {
        enrollment.completedMaterials.push(params.id);
        const totalMaterials = db.materials.filter(m => m.courseId === material.courseId).length;
        enrollment.progress = Math.round((enrollment.completedMaterials.length / totalMaterials) * 100);
        saveDB(db);
    }
    sendJSON(res, enrollment);
}

async function handleStats(req, res) {
    const user = getUser(req);
    if (!user || user.role !== 'admin') return sendJSON(res, { error: 'Unauthorized' }, 401);
    const db = getDB();
    sendJSON(res, {
        totalUsers: db.users.length,
        totalGuru: db.users.filter(u => u.role === 'guru').length,
        totalMurid: db.users.filter(u => u.role === 'murid').length,
        totalCourses: db.courses.length,
        totalMaterials: db.materials.length,
        totalEnrollments: db.enrollments.length
    });
}

// ============ SERVER ============
const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = parsedUrl.pathname;

    // API routes
    if (pathname.startsWith('/api/')) {
        const body = await parseBody(req);
        const route = matchRoute(req.method, pathname);
        if (route) {
            try {
                await route.handler(req, res, route.params, body);
            } catch (err) {
                console.error('Error:', err);
                sendJSON(res, { error: 'Internal server error' }, 500);
            }
        } else {
            sendJSON(res, { error: 'Not found' }, 404);
        }
        return;
    }

    // Static files
    let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
    sendFile(res, filePath);
});

server.listen(PORT, () => {
    console.log(`AralieArning E-Learning server running on http://localhost:${PORT}`);
    getDB(); // Initialize DB
});

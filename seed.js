const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function generateId() {
    return crypto.randomUUID();
}

const db = {
    users: [
        {
            id: '1',
            name: 'Administrator',
            email: 'admin@araliearning.com',
            password: hashPassword('admin123'),
            role: 'admin',
            createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: generateId(),
            name: 'Budi Santoso',
            email: 'budi@araliearning.com',
            password: hashPassword('guru123'),
            role: 'guru',
            createdAt: '2024-01-15T00:00:00.000Z'
        },
        {
            id: generateId(),
            name: 'Siti Nurhaliza',
            email: 'siti@araliearning.com',
            password: hashPassword('guru123'),
            role: 'guru',
            createdAt: '2024-02-01T00:00:00.000Z'
        },
        {
            id: generateId(),
            name: 'Ahmad Rizki',
            email: 'ahmad@araliearning.com',
            password: hashPassword('murid123'),
            role: 'murid',
            createdAt: '2024-02-15T00:00:00.000Z'
        },
        {
            id: generateId(),
            name: 'Dewi Lestari',
            email: 'dewi@araliearning.com',
            password: hashPassword('murid123'),
            role: 'murid',
            createdAt: '2024-03-01T00:00:00.000Z'
        }
    ],
    courses: [],
    materials: [],
    enrollments: []
};

// Get guru IDs
const guruBudi = db.users[1].id;
const guruSiti = db.users[2].id;

// Create courses
const courses = [
    {
        id: generateId(),
        title: 'Dasar Pemrograman Python',
        description: 'Pelajari dasar-dasar pemrograman dengan bahasa Python. Kursus ini cocok untuk pemula yang baru memulai perjalanan di dunia pemrograman.',
        category: 'Pemrograman',
        thumbnail: '',
        creatorId: guruBudi,
        createdAt: '2024-03-01T00:00:00.000Z'
    },
    {
        id: generateId(),
        title: 'Web Development dengan HTML & CSS',
        description: 'Belajar membuat website dari nol dengan HTML dan CSS. Anda akan mempelajari struktur halaman web dan cara mempercantiknya.',
        category: 'Pemrograman',
        thumbnail: '',
        creatorId: guruBudi,
        createdAt: '2024-03-15T00:00:00.000Z'
    },
    {
        id: generateId(),
        title: 'Matematika Dasar SMA',
        description: 'Penguatan konsep matematika dasar untuk siswa SMA. Meliputi aljabar, trigonometri, dan statistika dasar.',
        category: 'Matematika',
        thumbnail: '',
        creatorId: guruSiti,
        createdAt: '2024-04-01T00:00:00.000Z'
    },
    {
        id: generateId(),
        title: 'Bahasa Inggris untuk Pemula',
        description: 'Kursus bahasa Inggris dasar yang mencakup grammar, vocabulary, dan conversation untuk kehidupan sehari-hari.',
        category: 'Bahasa',
        thumbnail: '',
        creatorId: guruSiti,
        createdAt: '2024-04-15T00:00:00.000Z'
    }
];

db.courses = courses;

// Create materials for each course
const materials = [
    // Python course materials
    { id: generateId(), courseId: courses[0].id, title: 'Pengenalan Python dan Instalasi', description: 'Pada materi ini, kita akan berkenalan dengan bahasa pemrograman Python. Python adalah bahasa yang mudah dipelajari dan sangat populer di dunia industri.\n\nTopik yang dibahas:\n- Apa itu Python?\n- Kelebihan Python\n- Cara menginstal Python\n- Menjalankan program pertama', youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', order: 1, createdAt: '2024-03-01T00:00:00.000Z' },
    { id: generateId(), courseId: courses[0].id, title: 'Variabel dan Tipe Data', description: 'Pelajari cara menyimpan data menggunakan variabel dan mengenal berbagai tipe data di Python seperti string, integer, float, dan boolean.', youtubeUrl: 'https://www.youtube.com/watch?v=cQT33yu9pY8', order: 2, createdAt: '2024-03-02T00:00:00.000Z' },
    { id: generateId(), courseId: courses[0].id, title: 'Percabangan (If-Else)', description: 'Memahami logika percabangan menggunakan if, elif, dan else untuk membuat program yang dapat mengambil keputusan.', youtubeUrl: 'https://www.youtube.com/watch?v=DZwmZ8Usvnk', order: 3, createdAt: '2024-03-03T00:00:00.000Z' },
    { id: generateId(), courseId: courses[0].id, title: 'Perulangan (Loop)', description: 'Belajar menggunakan for loop dan while loop untuk mengulang eksekusi kode secara efisien.', youtubeUrl: 'https://www.youtube.com/watch?v=94UHCEmprCY', order: 4, createdAt: '2024-03-04T00:00:00.000Z' },
    
    // Web Dev course materials
    { id: generateId(), courseId: courses[1].id, title: 'Pengenalan HTML', description: 'Mempelajari dasar-dasar HTML (HyperText Markup Language) sebagai fondasi setiap halaman web.\n\nAnda akan belajar:\n- Struktur dasar dokumen HTML\n- Tag-tag penting\n- Membuat halaman pertama', youtubeUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg', order: 1, createdAt: '2024-03-15T00:00:00.000Z' },
    { id: generateId(), courseId: courses[1].id, title: 'CSS Dasar - Styling Halaman Web', description: 'Belajar mempercantik halaman web dengan CSS. Memahami selector, property, dan value.', youtubeUrl: 'https://www.youtube.com/watch?v=1PnVor36_40', order: 2, createdAt: '2024-03-16T00:00:00.000Z' },
    { id: generateId(), courseId: courses[1].id, title: 'Layout dengan Flexbox', description: 'Menguasai CSS Flexbox untuk membuat layout halaman yang responsif dan modern.', youtubeUrl: 'https://www.youtube.com/watch?v=fYq5PXgSsbE', order: 3, createdAt: '2024-03-17T00:00:00.000Z' },
    
    // Math course materials
    { id: generateId(), courseId: courses[2].id, title: 'Aljabar - Persamaan Linear', description: 'Memahami konsep persamaan linear satu variabel dan dua variabel. Dilengkapi dengan contoh soal dan pembahasan.', youtubeUrl: 'https://www.youtube.com/watch?v=NybHckSEQBI', order: 1, createdAt: '2024-04-01T00:00:00.000Z' },
    { id: generateId(), courseId: courses[2].id, title: 'Trigonometri Dasar', description: 'Mengenal fungsi trigonometri: sin, cos, tan dan penerapannya dalam menyelesaikan masalah.', youtubeUrl: 'https://www.youtube.com/watch?v=PUB0TaZ7bhA', order: 2, createdAt: '2024-04-02T00:00:00.000Z' },
    
    // English course materials
    { id: generateId(), courseId: courses[3].id, title: 'Basic Grammar - Tenses', description: 'Mempelajari tenses dasar dalam bahasa Inggris: Simple Present, Simple Past, dan Simple Future. Dilengkapi contoh kalimat sehari-hari.', youtubeUrl: 'https://www.youtube.com/watch?v=L1N1YGOqFiU', order: 1, createdAt: '2024-04-15T00:00:00.000Z' },
    { id: generateId(), courseId: courses[3].id, title: 'Vocabulary Building', description: 'Tips dan teknik untuk memperkaya kosakata bahasa Inggris dengan cepat dan efektif.', youtubeUrl: 'https://www.youtube.com/watch?v=eDvH2sZLUEs', order: 2, createdAt: '2024-04-16T00:00:00.000Z' }
];

db.materials = materials;

// Save
const DB_PATH = path.join(__dirname, 'data', 'db.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

console.log('Database seeded successfully!');
console.log('');
console.log('=== Akun Login ===');
console.log('Admin  : admin@araliearning.com / admin123');
console.log('Guru   : budi@araliearning.com / guru123');
console.log('Guru   : siti@araliearning.com / guru123');
console.log('Murid  : ahmad@araliearning.com / murid123');
console.log('Murid  : dewi@araliearning.com / murid123');

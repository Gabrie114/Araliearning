# Araliearning - Platform E-Learning

Platform e-learning modern dengan fitur CRUD untuk Admin, Guru, dan Murid. Mendukung video pembelajaran dari YouTube yang bisa ditonton langsung di dalam platform.

## Fitur

- **Admin**: Mengelola pengguna (tambah, edit, hapus guru dan murid), mengelola semua kursus dan materi
- **Guru**: Membuat dan mengelola kursus sendiri, menambahkan video YouTube sebagai materi
- **Murid**: Mengikuti kursus, menonton video, melacak progress belajar
- **Landing Page**: Tampilan modern terinspirasi desain AeroSense
- **Halaman Kursus**: Tampilan mirip Dicoding/Coursera dengan video player dan progress tracking

## Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla JavaScript (SPA)
- **Database**: JSON File (no external dependencies needed)
- **Styling**: Custom CSS dengan desain modern
- **Icons**: Font Awesome 6

## Cara Menjalankan

```bash
# Clone repository
git clone <repo-url>
cd Araliearning

# Seed database (opsional - untuk data contoh)
node seed.js

# Jalankan server
node server.js
```

Server berjalan di `http://localhost:3000`

## Akun Login Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@araliearning.com | admin123 |
| Guru | budi@araliearning.com | guru123 |
| Guru | siti@araliearning.com | guru123 |
| Murid | ahmad@araliearning.com | murid123 |
| Murid | dewi@araliearning.com | murid123 |

## Struktur Folder

```
Araliearning/
├── server.js          # Backend API server
├── seed.js            # Database seeder
├── package.json
├── data/
│   └── db.json        # JSON database (auto-generated)
└── public/
    ├── index.html     # Main SPA entry point
    ├── css/
    │   └── style.css  # All styles
    └── js/
        ├── app.js         # Core app (router, auth, API)
        ├── components.js  # Reusable UI components
        ├── pages.js       # Landing page & auth
        ├── admin.js       # Admin/Guru dashboard
        └── course.js      # Course list & detail view
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course detail
- `POST /api/courses` - Create course (admin/guru)
- `PUT /api/courses/:id` - Update course (admin/guru)
- `DELETE /api/courses/:id` - Delete course (admin/guru)

### Materials
- `GET /api/courses/:courseId/materials` - List materials
- `POST /api/courses/:courseId/materials` - Add material (admin/guru)
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Enrollment
- `POST /api/courses/:courseId/enroll` - Enroll in course
- `GET /api/my-courses` - Get enrolled courses
- `POST /api/materials/:id/complete` - Mark material as complete

### Stats
- `GET /api/stats` - Get platform statistics (admin)

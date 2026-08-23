# EduPulse — Academic Performance & Attendance Tracking System

EduPulse is a college-level full-stack Web Application Development (WAD) project satisfying all **PBL 2** (Responsive Web Interface Development) and **PBL 3** (CRUD Operations with Full Responsive Application) lab manual requirements.

---

## 1. Problem Statement

Faculty members need a simple, centralized application to manage student records, log daily subject attendance, record internal & practical marks, and identify students who require academic support (low attendance < 75%) without managing separate spreadsheets.

---

## 2. Official Technology Stack

* **Frontend**: React.js, JSX, CSS, React Hooks (`useState`, `useEffect`), Fetch API / Query Client
* **Backend**: Node.js, Express.js (REST API)
* **Database**: MongoDB (via Mongoose models with automatic local fallback engine for offline execution)
* **API Testing**: Postman compatible
* **Design & Layout**: Responsive Tailwind CSS (375px mobile, 768px tablet, 1440px desktop)

---

## 3. Main User & Core Pages

There is **one main user role** (Faculty). The application consists of **5 main pages**:

1. **Login**: Faculty authentication (`faculty@edupulse.edu` / `1234`)
2. **Dashboard**: Summary KPI cards (Total Students, Overall Attendance %, Average Marks %, Low Attendance alerts), Recent Students, Subject Attendance & Performance charts
3. **Students**: Complete CRUD (Create, Read, Update, Delete), Search filter, Duplicate enrollment protection, Student Detail Modal
4. **Attendance**: Daily attendance logging (`Present`/`Absent`), Subject filtering, Real-time metrics
5. **Performance**: Internal (0–30) and Practical (0–20) marks entry, Automatic Total calculation (`Total = Internal + Practical`)

---

## 4. MongoDB Database Collections

### `students` Collection
* `id` / `_id`: Unique identifier
* `name`: Student full name
* `enrollmentNo`: Unique enrollment string (e.g. `23CE001`)
* `email`: Student email
* `semester`: Numeric semester (e.g. `5`)
* `branch`: Academic branch (e.g. `Computer Science & Engineering`)

### `attendance` Collection
* `id` / `_id`: Unique identifier
* `studentId`: Reference to student ID
* `subject`: Core subject (`WAD`, `DBMS`, `COA`, `DMGT`)
* `date`: YYYY-MM-DD
* `status`: `Present` or `Absent`

### `performance` Collection
* `id` / `_id`: Unique identifier
* `studentId`: Reference to student ID
* `subject`: Core subject (`WAD`, `DBMS`, `COA`, `DMGT`)
* `internalMarks`: Internal assessment score (0–30)
* `practicalMarks`: Practical examination score (0–20)

---

## 5. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/students` | List all students |
| `GET` | `/api/students/:id` | Get single student profile |
| `POST` | `/api/students` | Add new student (returns 409 on duplicate enrollment) |
| `PUT` | `/api/students/:id` | Update student details |
| `DELETE` | `/api/students/:id` | Delete student and cascade delete attendance/performance |
| `GET` | `/api/attendance` | List attendance records |
| `POST` | `/api/attendance` | Log new attendance entry |
| `PUT` | `/api/attendance/:id` | Update attendance record |
| `DELETE` | `/api/attendance/:id` | Delete attendance record |
| `GET` | `/api/performance` | List performance records |
| `POST` | `/api/performance` | Log internal (0–30) & practical (0–20) marks |
| `PUT` | `/api/performance/:id` | Update performance record |
| `DELETE` | `/api/performance/:id` | Delete performance record |
| `GET` | `/api/dashboard` | Fetch aggregated KPI summaries & low-attendance alerts |
| `GET` | `/api/healthz` | Health check endpoint |

---

## 6. How to Run Locally (Windows / macOS / Linux)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start the Full Application
```bash
# Terminal 1: Backend Express API Server (runs on http://localhost:5000)
$env:PORT="5000"; node --enable-source-maps ./artifacts/api-server/dist/index.mjs

# Terminal 2: Frontend React Application (runs on http://localhost:5173)
$env:PORT="5173"; $env:BASE_PATH="/"; pnpm --filter @workspace/edupulse run dev
```

### 3. Open in Browser
Access the application at: **[http://localhost:5173](http://localhost:5173)**

---

## 7. WAD Viva & Rubric Alignment

* **PBL 2 Marks Target**: Responsive CSS grid/flexbox across 375px / 768px / 1440px viewports, semantic HTML5 structure, reusable React components, and accessible forms.
* **PBL 3 Marks Target**: Full CRUD functionality, REST API architecture, MongoDB persistence, backend range & duplicate validation, HTTP status codes, and clean presentation-ready code.
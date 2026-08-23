import { Router, type IRouter, type Response } from "express";
import { localStore, connectMongo, isDbConnected, StudentModel, AttendanceModel, PerformanceModel } from "@workspace/db";

const router: IRouter = Router();
const ok = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const fail = (res: Response, message: string, status = 400) => res.status(status).json({ success: false, message });

// Initialize database connection on startup
connectMongo().catch(() => {});

// ========================
// STUDENTS ENDPOINTS
// ========================

// GET /api/students
router.get("/students", async (_req, res) => {
  try {
    if (isDbConnected()) {
      const docs = await StudentModel.find().sort({ id: -1 }).lean();
      return res.json(docs.map((d: any) => ({ id: d.id, name: d.name, enrollmentNo: d.enrollmentNo, email: d.email, semester: d.semester, branch: d.branch })));
    }
    return res.json(localStore.getStudents());
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to fetch students" });
  }
});

// GET /api/students/:id
router.get("/students/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    if (isDbConnected()) {
      const doc = await StudentModel.findOne({ id }).lean();
      if (!doc) return fail(res, "Student not found", 404);
      return res.json({ id: doc.id, name: doc.name, enrollmentNo: doc.enrollmentNo, email: doc.email, semester: doc.semester, branch: doc.branch });
    }
    const student = localStore.getStudentById(id);
    if (!student) return fail(res, "Student not found", 404);
    return res.json(student);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to fetch student" });
  }
});

// POST /api/students
router.post("/students", async (req, res) => {
  const { name, enrollmentNo, email, semester, branch } = req.body;
  if (![name, enrollmentNo, email, semester, branch].every((v) => v !== undefined && v !== null && String(v).trim() !== "")) {
    return fail(res, "All student fields are required");
  }
  if (!/^\S+@\S+\.\S+$/.test(String(email).trim())) {
    return fail(res, "Please enter a valid email");
  }

  const cleanName = String(name).trim();
  const cleanEnrollment = String(enrollmentNo).trim();
  const cleanEmail = String(email).trim();
  const cleanSemester = Number(semester);
  const cleanBranch = String(branch).trim();

  try {
    if (isDbConnected()) {
      const existing = await StudentModel.findOne({ enrollmentNo: new RegExp(`^${cleanEnrollment}$`, "i") });
      if (existing) {
        return fail(res, "A student with this enrollment number already exists.", 409);
      }
      const count = await StudentModel.countDocuments();
      const newId = count + 100 + Math.floor(Math.random() * 1000);
      const created = await StudentModel.create({
        id: newId,
        name: cleanName,
        enrollmentNo: cleanEnrollment,
        email: cleanEmail,
        semester: cleanSemester,
        branch: cleanBranch,
      });
      return res.status(201).json({
        id: created.id,
        name: created.name,
        enrollmentNo: created.enrollmentNo,
        email: created.email,
        semester: created.semester,
        branch: created.branch,
      });
    }

    const created = localStore.addStudent({
      name: cleanName,
      enrollmentNo: cleanEnrollment,
      email: cleanEmail,
      semester: cleanSemester,
      branch: cleanBranch,
    });
    return res.status(201).json(created);
  } catch (err: any) {
    if (err.code === 11000) {
      return fail(res, "A student with this enrollment number already exists.", 409);
    }
    return res.status(500).json({ success: false, message: err.message || "Failed to create student" });
  }
});

// PUT /api/students/:id
router.put("/students/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, enrollmentNo, email, semester, branch } = req.body;
  if (![name, enrollmentNo, email, semester, branch].every((v) => v !== undefined && v !== null && String(v).trim() !== "")) {
    return fail(res, "All student fields are required");
  }
  if (!/^\S+@\S+\.\S+$/.test(String(email).trim())) {
    return fail(res, "Please enter a valid email");
  }

  const cleanName = String(name).trim();
  const cleanEnrollment = String(enrollmentNo).trim();
  const cleanEmail = String(email).trim();
  const cleanSemester = Number(semester);
  const cleanBranch = String(branch).trim();

  try {
    if (isDbConnected()) {
      const existing = await StudentModel.findOne({ id: { $ne: id }, enrollmentNo: new RegExp(`^${cleanEnrollment}$`, "i") });
      if (existing) {
        return fail(res, "A student with this enrollment number already exists.", 409);
      }
      const updated = await StudentModel.findOneAndUpdate(
        { id },
        { name: cleanName, enrollmentNo: cleanEnrollment, email: cleanEmail, semester: cleanSemester, branch: cleanBranch },
        { new: true }
      ).lean();
      if (!updated) return fail(res, "Student not found", 404);
      return res.json({ id: updated.id, name: updated.name, enrollmentNo: updated.enrollmentNo, email: updated.email, semester: updated.semester, branch: updated.branch });
    }

    const updated = localStore.updateStudent(id, {
      name: cleanName,
      enrollmentNo: cleanEnrollment,
      email: cleanEmail,
      semester: cleanSemester,
      branch: cleanBranch,
    });
    if (!updated) return fail(res, "Student not found", 404);
    return res.json(updated);
  } catch (err: any) {
    if (err.code === 11000) {
      return fail(res, "A student with this enrollment number already exists.", 409);
    }
    return res.status(500).json({ success: false, message: err.message || "Failed to update student" });
  }
});

// DELETE /api/students/:id
router.delete("/students/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    if (isDbConnected()) {
      await StudentModel.deleteOne({ id });
      await AttendanceModel.deleteMany({ studentId: id });
      await PerformanceModel.deleteMany({ studentId: id });
    } else {
      localStore.deleteStudent(id);
    }
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to delete student" });
  }
});

// ========================
// ATTENDANCE ENDPOINTS
// ========================

// GET /api/attendance
router.get("/attendance", async (_req, res) => {
  try {
    if (isDbConnected()) {
      const records = await AttendanceModel.find().sort({ date: -1, id: -1 }).lean();
      const students = await StudentModel.find().lean();
      const studentMap = new Map(students.map((s: any) => [s.id, s.name]));
      return res.json(
        records.map((r: any) => ({
          id: r.id,
          studentId: r.studentId,
          studentName: studentMap.get(r.studentId) || "Unknown Student",
          subject: r.subject,
          date: r.date,
          status: r.status,
        }))
      );
    }
    return res.json(localStore.getAttendance());
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to fetch attendance" });
  }
});

// POST /api/attendance
router.post("/attendance", async (req, res) => {
  const { studentId, subject, date, status } = req.body;
  if (!studentId || !ok(subject) || !ok(date) || !["Present", "Absent"].includes(status)) {
    return fail(res, "Student, subject, date and status (Present/Absent) are required");
  }

  const sId = Number(studentId);
  const cleanSubject = String(subject).trim();
  const cleanDate = String(date).trim();
  const cleanStatus = String(status).trim();

  try {
    if (isDbConnected()) {
      const count = await AttendanceModel.countDocuments();
      const newId = count + 100 + Math.floor(Math.random() * 1000);
      const created = await AttendanceModel.create({
        id: newId,
        studentId: sId,
        subject: cleanSubject,
        date: cleanDate,
        status: cleanStatus,
      });
      return res.status(201).json({ id: created.id, studentId: created.studentId, subject: created.subject, date: created.date, status: created.status });
    }

    const created = localStore.addAttendance({ studentId: sId, subject: cleanSubject, date: cleanDate, status: cleanStatus });
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to create attendance record" });
  }
});

// PUT /api/attendance/:id
router.put("/attendance/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { studentId, subject, date, status } = req.body;
  if (!studentId || !ok(subject) || !ok(date) || !["Present", "Absent"].includes(status)) {
    return fail(res, "Student, subject, date and status (Present/Absent) are required");
  }

  const sId = Number(studentId);
  const cleanSubject = String(subject).trim();
  const cleanDate = String(date).trim();
  const cleanStatus = String(status).trim();

  try {
    if (isDbConnected()) {
      const updated = await AttendanceModel.findOneAndUpdate(
        { id },
        { studentId: sId, subject: cleanSubject, date: cleanDate, status: cleanStatus },
        { new: true }
      ).lean();
      if (!updated) return fail(res, "Attendance record not found", 404);
      return res.json({ id: updated.id, studentId: updated.studentId, subject: updated.subject, date: updated.date, status: updated.status });
    }

    const updated = localStore.updateAttendance(id, { studentId: sId, subject: cleanSubject, date: cleanDate, status: cleanStatus });
    if (!updated) return fail(res, "Attendance record not found", 404);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to update attendance record" });
  }
});

// DELETE /api/attendance/:id
router.delete("/attendance/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    if (isDbConnected()) {
      await AttendanceModel.deleteOne({ id });
    } else {
      localStore.deleteAttendance(id);
    }
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to delete attendance record" });
  }
});

// ========================
// PERFORMANCE ENDPOINTS
// ========================

// GET /api/performance
router.get("/performance", async (_req, res) => {
  try {
    if (isDbConnected()) {
      const records = await PerformanceModel.find().sort({ id: -1 }).lean();
      const students = await StudentModel.find().lean();
      const studentMap = new Map(students.map((s: any) => [s.id, s.name]));
      return res.json(
        records.map((r: any) => ({
          id: r.id,
          studentId: r.studentId,
          studentName: studentMap.get(r.studentId) || "Unknown Student",
          subject: r.subject,
          internalMarks: Number(r.internalMarks),
          practicalMarks: Number(r.practicalMarks),
        }))
      );
    }
    return res.json(localStore.getPerformance());
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to fetch performance records" });
  }
});

// POST /api/performance
router.post("/performance", async (req, res) => {
  const { studentId, subject, internalMarks, practicalMarks } = req.body;
  const intM = Number(internalMarks);
  const pracM = Number(practicalMarks);

  if (!studentId || !ok(subject) || isNaN(intM) || intM < 0 || intM > 30 || isNaN(pracM) || pracM < 0 || pracM > 20) {
    return fail(res, "Enter valid marks: internal 0–30 and practical 0–20");
  }

  const sId = Number(studentId);
  const cleanSubject = String(subject).trim();

  try {
    if (isDbConnected()) {
      const count = await PerformanceModel.countDocuments();
      const newId = count + 100 + Math.floor(Math.random() * 1000);
      const created = await PerformanceModel.create({
        id: newId,
        studentId: sId,
        subject: cleanSubject,
        internalMarks: intM,
        practicalMarks: pracM,
      });
      return res.status(201).json({ id: created.id, studentId: created.studentId, subject: created.subject, internalMarks: created.internalMarks, practicalMarks: created.practicalMarks });
    }

    const created = localStore.addPerformance({ studentId: sId, subject: cleanSubject, internalMarks: intM, practicalMarks: pracM });
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to create performance record" });
  }
});

// PUT /api/performance/:id
router.put("/performance/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { studentId, subject, internalMarks, practicalMarks } = req.body;
  const intM = Number(internalMarks);
  const pracM = Number(practicalMarks);

  if (!studentId || !ok(subject) || isNaN(intM) || intM < 0 || intM > 30 || isNaN(pracM) || pracM < 0 || pracM > 20) {
    return fail(res, "Enter valid marks: internal 0–30 and practical 0–20");
  }

  const sId = Number(studentId);
  const cleanSubject = String(subject).trim();

  try {
    if (isDbConnected()) {
      const updated = await PerformanceModel.findOneAndUpdate(
        { id },
        { studentId: sId, subject: cleanSubject, internalMarks: intM, practicalMarks: pracM },
        { new: true }
      ).lean();
      if (!updated) return fail(res, "Performance record not found", 404);
      return res.json({ id: updated.id, studentId: updated.studentId, subject: updated.subject, internalMarks: updated.internalMarks, practicalMarks: updated.practicalMarks });
    }

    const updated = localStore.updatePerformance(id, { studentId: sId, subject: cleanSubject, internalMarks: intM, practicalMarks: pracM });
    if (!updated) return fail(res, "Performance record not found", 404);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to update performance record" });
  }
});

// DELETE /api/performance/:id
router.delete("/performance/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    if (isDbConnected()) {
      await PerformanceModel.deleteOne({ id });
    } else {
      localStore.deletePerformance(id);
    }
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to delete performance record" });
  }
});

// ========================
// DASHBOARD ENDPOINT
// ========================

// GET /api/dashboard
router.get("/dashboard", async (_req, res) => {
  try {
    let studentsList: Array<{ id: number; name: string; enrollmentNo: string; email: string; semester: number; branch: string }> = [];
    let attendanceList: Array<{ id: number; studentId: number; subject: string; date: string; status: string }> = [];
    let performanceList: Array<{ id: number; studentId: number; subject: string; internalMarks: number; practicalMarks: number }> = [];

    if (isDbConnected()) {
      studentsList = await StudentModel.find().lean();
      attendanceList = await AttendanceModel.find().lean();
      performanceList = await PerformanceModel.find().lean();
    } else {
      studentsList = localStore.students;
      attendanceList = localStore.attendance;
      performanceList = localStore.performance;
    }

    const totalStudents = studentsList.length;

    // Attendance Calculations
    const totalAttendanceCount = attendanceList.length;
    const presentAttendanceCount = attendanceList.filter((a: any) => a.status === "Present").length;
    const overallAttendance = totalAttendanceCount > 0 ? Math.round((presentAttendanceCount / totalAttendanceCount) * 1000) / 10 : 0;

    // Performance Calculations (Internal out of 30 + Practical out of 20 = Total out of 50 => percentage = total * 2)
    const totalPerfCount = performanceList.length;
    const totalPerfPercentage = performanceList.reduce((sum: number, p: any) => sum + (Number(p.internalMarks) + Number(p.practicalMarks)) * 2, 0);
    const averageMarks = totalPerfCount > 0 ? Math.round((totalPerfPercentage / totalPerfCount) * 10) / 10 : 0;

    // Recent Students (limit 5)
    const recentStudents = [...studentsList].sort((a: any, b: any) => b.id - a.id).slice(0, 5);

    // Subject Attendance Summaries
    const subjects = Array.from(new Set([...attendanceList.map((a: any) => a.subject), ...performanceList.map((p: any) => p.subject), "WAD", "DBMS", "COA", "DMGT"]));

    const subjectAttendance = subjects.map((subj) => {
      const subjAtt = attendanceList.filter((a: any) => a.subject === subj);
      const pres = subjAtt.filter((a: any) => a.status === "Present").length;
      const val = subjAtt.length > 0 ? Math.round((pres / subjAtt.length) * 1000) / 10 : 85;
      return { subject: subj, value: val };
    });

    const subjectPerformance = subjects.map((subj) => {
      const subjPerf = performanceList.filter((p: any) => p.subject === subj);
      const avgPct = subjPerf.length > 0 ? subjPerf.reduce((s: number, p: any) => s + (Number(p.internalMarks) + Number(p.practicalMarks)) * 2, 0) / subjPerf.length : 75;
      return { subject: subj, value: Math.round((avgPct / 2) * 10) / 10 };
    });

    // Low Attendance Students (< 75%)
    const lowAttendanceMap = new Map<number, { present: number; total: number }>();
    attendanceList.forEach((a: any) => {
      const curr = lowAttendanceMap.get(a.studentId) || { present: 0, total: 0 };
      curr.total += 1;
      if (a.status === "Present") curr.present += 1;
      lowAttendanceMap.set(a.studentId, curr);
    });

    const lowAttendance: Array<{ id: number; name: string; enrollmentNo: string; subject: string; value: number }> = [];
    studentsList.forEach((s: any) => {
      const stat = lowAttendanceMap.get(s.id);
      if (stat && stat.total > 0) {
        const pct = (stat.present / stat.total) * 100;
        if (pct < 75) {
          lowAttendance.push({
            id: s.id,
            name: s.name,
            enrollmentNo: s.enrollmentNo,
            subject: `Overall Attendance (${s.name})`,
            value: Math.round(pct * 10) / 10,
          });
        }
      }
    });

    return res.json({
      totalStudents,
      overallAttendance,
      averageMarks,
      recentStudents,
      subjectAttendance,
      subjectPerformance,
      lowAttendance,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to compile dashboard data" });
  }
});

export default router;
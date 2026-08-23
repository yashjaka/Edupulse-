import mongoose, { Schema, model, Document } from "mongoose";

export interface IStudent extends Document {
  id: number;
  name: string;
  enrollmentNo: string;
  email: string;
  semester: number;
  branch: string;
}

export interface IAttendance extends Document {
  id: number;
  studentId: number;
  subject: string;
  date: string;
  status: string;
}

export interface IPerformance extends Document {
  id: number;
  studentId: number;
  subject: string;
  internalMarks: number;
  practicalMarks: number;
}

const StudentSchema = new Schema<IStudent>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    enrollmentNo: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    semester: { type: Number, required: true },
    branch: { type: String, required: true },
  },
  { timestamps: true }
);

const AttendanceSchema = new Schema<IAttendance>(
  {
    id: { type: Number, required: true, unique: true },
    studentId: { type: Number, required: true },
    subject: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, required: true, enum: ["Present", "Absent"] },
  },
  { timestamps: true }
);

const PerformanceSchema = new Schema<IPerformance>(
  {
    id: { type: Number, required: true, unique: true },
    studentId: { type: Number, required: true },
    subject: { type: String, required: true },
    internalMarks: { type: Number, required: true, min: 0, max: 30 },
    practicalMarks: { type: Number, required: true, min: 0, max: 20 },
  },
  { timestamps: true }
);

export const StudentModel = mongoose.models.Student || model<IStudent>("Student", StudentSchema);
export const AttendanceModel = mongoose.models.Attendance || model<IAttendance>("Attendance", AttendanceSchema);
export const PerformanceModel = mongoose.models.Performance || model<IPerformance>("Performance", PerformanceSchema);

// In-Memory Data Store (Fallback when offline/local without MongoDB daemon)
class StorageStore {
  private nextStudentId = 4;
  private nextAttendanceId = 7;
  private nextPerformanceId = 7;

  students: Array<{ id: number; name: string; enrollmentNo: string; email: string; semester: number; branch: string }> = [
    { id: 1, name: "Rahul Patel", enrollmentNo: "23CE001", email: "rahul@example.com", semester: 5, branch: "Computer Engineering" },
    { id: 2, name: "Jay Patel", enrollmentNo: "23CE002", email: "jay@example.com", semester: 5, branch: "Computer Engineering" },
    { id: 3, name: "Amit Shah", enrollmentNo: "23CE003", email: "amit@example.com", semester: 5, branch: "Computer Engineering" },
  ];

  attendance: Array<{ id: number; studentId: number; subject: string; date: string; status: string }> = [
    { id: 1, studentId: 1, subject: "WAD", date: "2026-08-21", status: "Present" },
    { id: 2, studentId: 1, subject: "DBMS", date: "2026-08-21", status: "Present" },
    { id: 3, studentId: 2, subject: "WAD", date: "2026-08-21", status: "Absent" },
    { id: 4, studentId: 2, subject: "DBMS", date: "2026-08-21", status: "Present" },
    { id: 5, studentId: 3, subject: "WAD", date: "2026-08-21", status: "Absent" },
    { id: 6, studentId: 3, subject: "COA", date: "2026-08-21", status: "Present" },
  ];

  performance: Array<{ id: number; studentId: number; subject: string; internalMarks: number; practicalMarks: number }> = [
    { id: 1, studentId: 1, subject: "WAD", internalMarks: 24, practicalMarks: 18 },
    { id: 2, studentId: 1, subject: "DBMS", internalMarks: 22, practicalMarks: 17 },
    { id: 3, studentId: 2, subject: "WAD", internalMarks: 19, practicalMarks: 15 },
    { id: 4, studentId: 2, subject: "DBMS", internalMarks: 20, practicalMarks: 16 },
    { id: 5, studentId: 3, subject: "WAD", internalMarks: 18, practicalMarks: 14 },
    { id: 6, studentId: 3, subject: "COA", internalMarks: 21, practicalMarks: 16 },
  ];

  getStudents() {
    return [...this.students].sort((a, b) => b.id - a.id);
  }

  getStudentById(id: number) {
    return this.students.find((s) => s.id === id);
  }

  addStudent(data: { name: string; enrollmentNo: string; email: string; semester: number; branch: string }) {
    if (this.students.some((s) => s.enrollmentNo.toLowerCase() === data.enrollmentNo.toLowerCase())) {
      const err: any = new Error("A student with this enrollment number already exists.");
      err.code = 11000;
      throw err;
    }
    const newStudent = { id: this.nextStudentId++, ...data };
    this.students.push(newStudent);
    return newStudent;
  }

  updateStudent(id: number, data: { name: string; enrollmentNo: string; email: string; semester: number; branch: string }) {
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const existing = this.students.find((s) => s.id !== id && s.enrollmentNo.toLowerCase() === data.enrollmentNo.toLowerCase());
    if (existing) {
      const err: any = new Error("A student with this enrollment number already exists.");
      err.code = 11000;
      throw err;
    }
    this.students[index] = { id, ...data };
    return this.students[index];
  }

  deleteStudent(id: number) {
    this.students = this.students.filter((s) => s.id !== id);
    this.attendance = this.attendance.filter((a) => a.studentId !== id);
    this.performance = this.performance.filter((p) => p.studentId !== id);
    return true;
  }

  getAttendance() {
    return this.attendance
      .map((a) => {
        const student = this.students.find((s) => s.id === a.studentId);
        return { ...a, studentName: student ? student.name : "Unknown Student" };
      })
      .sort((a, b) => b.id - a.id);
  }

  addAttendance(data: { studentId: number; subject: string; date: string; status: string }) {
    const record = { id: this.nextAttendanceId++, ...data };
    this.attendance.push(record);
    return record;
  }

  updateAttendance(id: number, data: { studentId: number; subject: string; date: string; status: string }) {
    const index = this.attendance.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.attendance[index] = { id, ...data };
    return this.attendance[index];
  }

  deleteAttendance(id: number) {
    this.attendance = this.attendance.filter((a) => a.id !== id);
    return true;
  }

  getPerformance() {
    return this.performance
      .map((p) => {
        const student = this.students.find((s) => s.id === p.studentId);
        return { ...p, studentName: student ? student.name : "Unknown Student" };
      })
      .sort((a, b) => b.id - a.id);
  }

  addPerformance(data: { studentId: number; subject: string; internalMarks: number; practicalMarks: number }) {
    const record = { id: this.nextPerformanceId++, ...data };
    this.performance.push(record);
    return record;
  }

  updatePerformance(id: number, data: { studentId: number; subject: string; internalMarks: number; practicalMarks: number }) {
    const index = this.performance.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.performance[index] = { id, ...data };
    return this.performance[index];
  }

  deletePerformance(id: number) {
    this.performance = this.performance.filter((p) => p.id !== id);
    return true;
  }
}

export const localStore = new StorageStore();

let isMongoConnected = false;

export async function connectMongo(): Promise<boolean> {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/edupulse";
  try {
    if (mongoose.connection.readyState === 1) return true;
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log("Connected to MongoDB successfully at", uri);
    return true;
  } catch (err) {
    isMongoConnected = false;
    console.log("MongoDB connection not active locally. Using EduPulse Local Storage Engine.");
    return false;
  }
}

export function isDbConnected(): boolean {
  return isMongoConnected;
}

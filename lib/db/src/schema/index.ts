import { integer, numeric, pgTable, serial, text, date } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  enrollmentNo: text("enrollment_no").notNull().unique(),
  email: text("email").notNull(),
  semester: integer("semester").notNull(),
  branch: text("branch").notNull(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  date: date("date").notNull(),
  status: text("status").notNull(),
});

export const performance = pgTable("performance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  internalMarks: numeric("internal_marks").notNull(),
  practicalMarks: numeric("practical_marks").notNull(),
});
import { z } from "zod";
export const id = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ID");
export const userCreate = z.object({ name:z.string().min(2), email:z.string().email(), password:z.string().min(6), role:z.enum(["CR","STUDENT","ADMIN"]), studentId:id.nullable().optional() });
export const studentCreate = z.object({ rollNumber:z.string().min(1), name:z.string().min(2), email:z.string().email().optional(), department:z.string().optional(), semester:z.number().int().positive().optional(), section:z.string().optional(), active:z.boolean().optional() });
export const subjectCreate = z.object({ code:z.string().min(1), name:z.string().min(2), department:z.string().optional(), semester:z.number().int().positive().optional(), section:z.string().optional() });
export const attendanceCreate = z.object({ student:id, subject:id, date:z.coerce.date(), status:z.enum(["PRESENT","ABSENT","LATE"]), note:z.string().max(500).optional() });
export const attendanceUpdate = z.object({ status:z.enum(["PRESENT","ABSENT","LATE"]).optional(), date:z.coerce.date().optional(), note:z.string().max(500).optional() });
export const bulkAttendance = z.object({ subject:id, date:z.coerce.date(), records:z.array(z.object({ student:id, status:z.enum(["PRESENT","ABSENT","LATE"]), note:z.string().max(500).optional() })).min(1) });

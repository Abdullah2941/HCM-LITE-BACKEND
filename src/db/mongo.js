import bcrypt from 'bcryptjs';
import { initializeFileStore, User, Employee, LeaveRequest, AttendanceRecord, Announcement } from '../models/index.js';
export async function connectMongo(){
  await initializeFileStore();
  const demoUsers=[
    {name:'Alex Morgan',email:'admin@hcmlite.local',password:'Admin123!',role:'Admin',department:'People'},
    {name:'Jamie Lee',email:'hr@hcmlite.local',password:'HrDemo123!',role:'HR',department:'People'},
    {name:'Taylor Reed',email:'employee@hcmlite.local',password:'Employee123!',role:'Employee',department:'Engineering'}
  ];
  for(const u of demoUsers)if(!(await User.findOne({email:u.email})))await User.create({name:u.name,email:u.email,passwordHash:await bcrypt.hash(u.password,10),role:u.role,department:u.department});
  if(!(await Employee.countDocuments()))await Employee.insertMany([
    {name:'Olivia Rhye',email:'olivia@hcmlite.local',role:'Product Designer',department:'Design',status:'Active'}, {name:'Phoenix Baker',email:'phoenix@hcmlite.local',role:'Engineering Lead',department:'Engineering',status:'Active'}, {name:'Lana Steiner',email:'lana@hcmlite.local',role:'HR Manager',department:'People',status:'On leave'}, {name:'Demi Wilkinson',email:'demi@hcmlite.local',role:'Marketing Lead',department:'Marketing',status:'Active'}, {name:'Candice Wu',email:'candice@hcmlite.local',role:'UX Researcher',department:'Design',status:'Active'}, {name:'Natali Craig',email:'natali@hcmlite.local',role:'People Partner',department:'People',status:'Active'}]);
  if(!(await LeaveRequest.countDocuments()))await LeaveRequest.insertMany([{employeeName:'Lana Steiner',type:'Annual leave',startDate:'2026-10-28',endDate:'2026-10-30',status:'Pending'},{employeeName:'Phoenix Baker',type:'Sick leave',startDate:'2026-10-20',endDate:'2026-10-20',status:'Approved'},{employeeName:'Olivia Rhye',type:'Annual leave',startDate:'2026-11-02',endDate:'2026-11-04',status:'Pending'}]);
  if(!(await AttendanceRecord.countDocuments()))await AttendanceRecord.insertMany([{employeeName:'Olivia Rhye',employeeEmail:'olivia@hcmlite.local',date:new Date().toISOString().slice(0,10),checkIn:'09:02',checkOut:'',status:'Present'},{employeeName:'Phoenix Baker',employeeEmail:'phoenix@hcmlite.local',date:new Date().toISOString().slice(0,10),checkIn:'09:17',checkOut:'',status:'Late'}]);
  if(!(await Announcement.countDocuments()))await Announcement.insertMany([{title:'October all-hands meeting',message:'Join the monthly company update on Friday.',createdAtLabel:'2026-10-20'},{title:'Holiday calendar updated',message:'The upcoming holiday calendar is available in Organization Setup.',createdAtLabel:'2026-10-18'}]);
  console.log('File-system data store ready (backend/data/hcm-data.json).');
}

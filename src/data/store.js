export const users = [
  { id:'u1', name:'Alex Morgan', email:'admin@hcmlite.local', password:'Admin123!', role:'Admin', department:'People' },
  { id:'u2', name:'Jamie Lee', email:'hr@hcmlite.local', password:'HrDemo123!', role:'HR', department:'People' },
  { id:'u3', name:'Taylor Reed', email:'employee@hcmlite.local', password:'Employee123!', role:'Employee', department:'Engineering' },
];
export const employees = [
  {id:'e1',name:'Olivia Rhye',email:'olivia@hcmlite.local',role:'Product Designer',department:'Design',status:'Active'},
  {id:'e2',name:'Phoenix Baker',email:'phoenix@hcmlite.local',role:'Engineering Lead',department:'Engineering',status:'Active'},
  {id:'e3',name:'Lana Steiner',email:'lana@hcmlite.local',role:'HR Manager',department:'People',status:'On leave'},
  {id:'e4',name:'Demi Wilkinson',email:'demi@hcmlite.local',role:'Marketing Lead',department:'Marketing',status:'Active'},
  {id:'e5',name:'Candice Wu',email:'candice@hcmlite.local',role:'UX Researcher',department:'Design',status:'Active'},
  {id:'e6',name:'Natali Craig',email:'natali@hcmlite.local',role:'People Partner',department:'People',status:'Active'},
];
export const leaveRequests = [
  {id:'l1',employeeName:'Lana Steiner',type:'Annual leave',startDate:'2026-10-28',endDate:'2026-10-30',status:'Pending'},
  {id:'l2',employeeName:'Phoenix Baker',type:'Sick leave',startDate:'2026-10-20',endDate:'2026-10-20',status:'Approved'},
  {id:'l3',employeeName:'Olivia Rhye',type:'Annual leave',startDate:'2026-11-02',endDate:'2026-11-04',status:'Pending'},
];
export const announcements = [
  {id:'a1',title:'October all-hands meeting',message:'Join the monthly company update on Friday.',createdAt:'2026-10-20'},
  {id:'a2',title:'Holiday calendar updated',message:'The upcoming holiday calendar is available in Organization Setup.',createdAt:'2026-10-18'},
];
export const auditLog = [];

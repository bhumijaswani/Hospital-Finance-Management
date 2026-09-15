import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import billingRoute from './routes/billingRoute.js';
import expenseRoute from './routes/expenseRoute.js';
import dashboardRoute from './routes/dashboardRoute.js';
import authRoute from './routes/authRoute.js';
import doctorRoute from './routes/doctorRoute.js';       
import patientRoute from './routes/patientRoute.js';     
import auditLogRoute from './routes/auditLogRoute.js';   
const app = express();

app.use(cors({
    origin: 'https://hospital-finance-management.netlify.app',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());   // ← missing tha, add kiya

app.use('/api/bills', billingRoute);
app.use('/api/expenses', expenseRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/auth', authRoute);
app.use('/api/doctors', doctorRoute);      
app.use('/api/patients', patientRoute);  
app.use('/api/audit-logs', auditLogRoute);
app.listen(3000, () => {
  console.log("Express server live on PORT 3000");
});
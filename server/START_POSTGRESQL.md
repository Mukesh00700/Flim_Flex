# 🚀 How to Start PostgreSQL on Windows

## ⚠️ Current Issue
Your PostgreSQL database is not running. The connection to `localhost:5432` is being refused.

---

## 🔍 Method 1: Start via Windows Services (Easiest)

### Step 1: Open Services Manager
```powershell
# Press Win + R, type: services.msc
# OR run this command:
Start-Process services.msc
```

### Step 2: Find PostgreSQL Service
Look for a service named:
- `postgresql-x64-14` (or similar version number)
- `PostgreSQL 14 Server`
- `PostgreSQL Database Server`

### Step 3: Start the Service
1. Right-click on the PostgreSQL service
2. Click **Start**
3. (Optional) Right-click → Properties → Startup Type → **Automatic**

---

## 🔍 Method 2: Start via pgAdmin 4

### If you have pgAdmin installed:
1. Open **pgAdmin 4** from Start Menu
2. This often automatically starts the PostgreSQL server
3. Connect to your server in pgAdmin
4. If it connects, your server is running!

---

## 🔍 Method 3: Start via Command Line

### Find your PostgreSQL installation:
```powershell
# Check common paths:
dir "C:\Program Files\PostgreSQL\*\bin\pg_ctl.exe"
dir "C:\Program Files (x86)\PostgreSQL\*\bin\pg_ctl.exe"
```

### Start PostgreSQL manually:
```powershell
# Replace <VERSION> with your PostgreSQL version (14, 15, etc.)
# Replace <DATA_DIR> with your data directory path

cd "C:\Program Files\PostgreSQL\<VERSION>\bin"
pg_ctl -D "C:\Program Files\PostgreSQL\<VERSION>\data" start
```

---

## 🔍 Method 4: Using NET START Command

```powershell
# Try these common service names:
net start postgresql-x64-14
# OR
net start postgresql-x64-15
# OR
net start postgresql-x64-16
```

---

## 🆕 If PostgreSQL is NOT Installed

### Download & Install PostgreSQL:

1. **Download:** https://www.postgresql.org/download/windows/
2. **Install PostgreSQL 14 or later**
3. During installation:
   - Set password to: `mUKESH@07` (or remember to update your config)
   - Port: `5432` (default)
   - Install pgAdmin 4 (recommended)

4. **Create Database:**
   ```sql
   -- Open pgAdmin or psql and run:
   CREATE DATABASE "FLIM_FLEX";
   ```

---

## ✅ Verify PostgreSQL is Running

### Test 1: Check if port 5432 is listening
```powershell
netstat -an | findstr :5432
```
**Expected output:**
```
TCP    0.0.0.0:5432           0.0.0.0:0              LISTENING
TCP    [::]:5432              [::]:0                 LISTENING
```

### Test 2: Test database connection
```powershell
cd server
node -e "import('./config/db.js').then(() => setTimeout(() => process.exit(0), 2000))"
```
**Expected output:**
```
Connection successful! Time: 2025-11-14T...
```

---

## 🎯 Once PostgreSQL is Running

### Run the demo data seed script:
```powershell
cd server
node seed-demo-data.js
```

This will create:
- ✅ 8 Users (5 customers + 3 admins)
- ✅ 8 Movies (Inception, Dark Knight, Jawan, etc.)
- ✅ 4 Theaters (Mumbai, Delhi, Bangalore, Pune)
- ✅ 2400 Seats across 16 halls
- ✅ 100+ Shows over multiple days
- ✅ Pricing rules
- ✅ 3 Sample bookings

---

## 🔧 Common Issues

### Issue: "Connection refused"
**Solution:** PostgreSQL service is not running. Use Method 1 or 2 above.

### Issue: "Password authentication failed"
**Solution:** 
1. Check `server/config/db.js` for password
2. Current password: `mUKESH@07`
3. If wrong, either update the file or reset PostgreSQL password

### Issue: "Database does not exist"
**Solution:**
```sql
-- Connect to PostgreSQL and create the database:
CREATE DATABASE "FLIM_FLEX";
```

### Issue: Can't find PostgreSQL service
**Solution:** PostgreSQL might not be installed. See "If PostgreSQL is NOT Installed" section.

---

## 📞 Quick Troubleshooting Commands

```powershell
# 1. Check if PostgreSQL process is running
Get-Process postgres -ErrorAction SilentlyContinue

# 2. Check PostgreSQL service status
Get-Service | Where-Object {$_.DisplayName -like "*postgres*"}

# 3. Check if port 5432 is in use
Test-NetConnection -ComputerName localhost -Port 5432

# 4. Find PostgreSQL installation
Get-ChildItem "C:\Program Files" -Filter "postgresql" -Directory
```

---

## 🎉 After Starting PostgreSQL

Once PostgreSQL is running successfully:

1. ✅ Verify connection works
2. ✅ Run migrations (if needed)
3. ✅ Run `node seed-demo-data.js`
4. ✅ Start your server: `npm run dev`
5. ✅ Test with demo credentials:
   - Email: `john@example.com`
   - Password: `password123`

---

## 💡 Pro Tip

Set PostgreSQL to start automatically:
1. Open `services.msc`
2. Find PostgreSQL service
3. Right-click → Properties
4. Startup type: **Automatic**
5. Click Apply

Now PostgreSQL will start every time you boot Windows! 🚀

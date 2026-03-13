# DNS Resolution Issue - Solutions

## Problem
Python's psycopg2 library cannot resolve DNS hostnames on your Windows system, even though:
- Command line tools (nslookup, Resolve-DnsName) work fine
- Your DNS is set to Google DNS (8.8.8.8)
- The hostnames are valid and resolve correctly outside Python

## Root Cause
This is a known issue with Python on Windows where the socket library fails to resolve DNS. Possible causes:
1. Firewall blocking Python's DNS requests
2. Antivirus software interfering with Python network calls
3. Windows DNS Client service issues
4. IPv6-only addresses (Supabase only provides IPv6 for direct connections)

## Attempted Solutions
1. ✗ Direct connection to `db.thzapvupdalwtdlhgfve.supabase.co` - DNS resolution fails
2. ✗ IPv6 address `[2406:da1a:6b0:f60a:f9e5:ef9d:60a2:672e]` - Connection timeout (no IPv6 connectivity)
3. ✗ Supabase Pooler `aws-0-ap-south-1.pooler.supabase.com` - "Tenant or user not found" error

## Recommended Solutions

### Option 1: Fix Windows DNS for Python (RECOMMENDED)
Try these steps in order:

1. **Restart Windows DNS Client Service**
   ```powershell
   Restart-Service -Name "Dnscache" -Force
   ```

2. **Temporarily Disable Firewall/Antivirus**
   - Disable Windows Firewall temporarily
   - Disable antivirus temporarily
   - Test if Python can connect

3. **Reinstall Python with different options**
   - Uninstall Python 3.14.2
   - Install Python 3.11 or 3.12 (more stable)
   - Ensure "Add Python to PATH" is checked

4. **Use a different network**
   - Try mobile hotspot
   - Try different WiFi network
   - This helps identify if it's network-specific

### Option 2: Use Supabase REST API Instead
Instead of direct PostgreSQL connection, use Supabase's REST API (PostgREST):
- No DNS resolution needed for database
- Uses HTTPS which works on your system
- Requires rewriting all database queries

### Option 3: Use a Local DNS Proxy
Install and configure a local DNS proxy that Python can use:
1. Install `dnsproxy` or similar tool
2. Configure it to listen on 127.0.0.1
3. Point Python to use it

### Option 4: Use Docker
Run the backend in Docker where DNS works properly:
1. Install Docker Desktop
2. Create Dockerfile for backend
3. Run backend in container

## Immediate Next Steps
1. Try restarting DNS Client service
2. Temporarily disable firewall/antivirus and test
3. If still fails, consider using a different computer or network
4. As last resort, switch to Supabase REST API approach

## Testing Command
After trying any fix, test with:
```bash
cd backend
python -c "import socket; print(socket.gethostbyname('db.thzapvupdalwtdlhgfve.supabase.co'))"
```

If this prints an IP address, the fix worked!

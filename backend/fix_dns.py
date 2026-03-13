import socket
import os
from urllib.parse import urlparse, urlunparse

# Get the database URL from environment
db_url = os.getenv("DATABASE_URL", "postgresql://postgres:8UoSh23gaBCuEqgl@db.thzapvupdalwtdlhgfve.supabase.co:5432/postgres")

# Parse the URL
parsed = urlparse(db_url)

# Try to resolve the hostname
hostname = parsed.hostname
print(f"Trying to resolve: {hostname}")

try:
    # Try to get IPv4 address
    ip_address = socket.gethostbyname(hostname)
    print(f"Resolved to: {ip_address}")
    
    # Replace hostname with IP in the URL
    netloc = parsed.netloc.replace(hostname, ip_address)
    new_parsed = parsed._replace(netloc=netloc)
    new_url = urlunparse(new_parsed)
    
    print(f"\nOriginal URL: {db_url}")
    print(f"New URL: {new_url}")
    print(f"\nAdd this to your .env file:")
    print(f"DATABASE_URL={new_url}")
    
except socket.gaierror as e:
    print(f"Failed to resolve hostname: {e}")
    print("\nTrying alternative DNS resolution...")
    
    # Try using getaddrinfo for more control
    try:
        results = socket.getaddrinfo(hostname, None, socket.AF_INET)
        if results:
            ip_address = results[0][4][0]
            print(f"Resolved to: {ip_address}")
            
            netloc = parsed.netloc.replace(hostname, ip_address)
            new_parsed = parsed._replace(netloc=netloc)
            new_url = urlunparse(new_parsed)
            
            print(f"\nOriginal URL: {db_url}")
            print(f"New URL: {new_url}")
            print(f"\nAdd this to your .env file:")
            print(f"DATABASE_URL={new_url}")
    except Exception as e2:
        print(f"Alternative resolution also failed: {e2}")

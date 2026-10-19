"""
Folio Notes - Local Development Server Launcher
Runs a simple HTTP server and launches your default web browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    os.chdir(DIRECTORY)
    server_address = ("127.0.0.1", PORT)
    
    # Try finding an open port if 8000 is occupied
    actual_port = PORT
    for attempt_port in range(PORT, PORT + 20):
        try:
            httpd = socketserver.TCPServer(("127.0.0.1", attempt_port), Handler)
            actual_port = attempt_port
            break
        except OSError:
            continue
    else:
        print("Could not find an available port between 8000 and 8020.")
        sys.exit(1)

    url = f"http://127.0.0.1:{actual_port}/index.html"
    print("\n" + "="*56)
    print("  🌿 Folio Notes — Human-Friendly Note Taking App")
    print("="*56)
    print(f"  Server running locally at: {url}")
    print("  All data is stored persistently in your browser.")
    print("  Press Ctrl+C to stop the server.")
    print("="*56 + "\n")

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped. Happy writing!")
        sys.exit(0)

if __name__ == "__main__":
    run()

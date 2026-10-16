#!/usr/bin/env python3
"""Local preview that behaves like GitHub Pages.

The stdlib server returns its own plain-text error page for a missing path and
never looks at 404.html, so the styled 404 cannot be seen locally. This serves
404.html with a real 404 status instead, the way GitHub Pages does.

    python3 serve.py          # http://localhost:4173
    python3 serve.py 8080     # another port
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4173


class Handler(SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        if code != 404:
            return super().send_error(code, message, explain)
        try:
            with open('404.html', 'rb') as page:
                body = page.read()
        except OSError:
            return super().send_error(code, message, explain)
        self.send_response(404)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(body)


if __name__ == '__main__':
    server = ThreadingHTTPServer(('0.0.0.0', PORT), Handler)
    print(f'Serving on http://localhost:{PORT}, unknown paths return 404.html')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()

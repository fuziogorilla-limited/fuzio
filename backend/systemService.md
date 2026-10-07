[Unit]
Description=Fuzio Django Gunicorn
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/var/www/fuzio/backend
EnvironmentFile=/var/www/fuzio/backend/.env
ExecStart=/var/www/fuzio/backend/venv/bin/gunicorn \
 --workers 3 \
 --bind 127.0.0.1:8000 \
 backend.wsgi:application

Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target

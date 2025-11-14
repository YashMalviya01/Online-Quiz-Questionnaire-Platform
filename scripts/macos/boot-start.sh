#!/bin/bash

PROJECT_DIR="/Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform"
LOG_DIR="$PROJECT_DIR/logs"
PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$PATH"

mkdir -p "$LOG_DIR"

log() {
	echo "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG_DIR/autostart.log"
}

check_port() {
	local port=$1
	if command -v nc >/dev/null 2>&1; then
		nc -z localhost "$port" >/dev/null 2>&1
	else
		lsof -i ":$port" -sTCP:LISTEN -t >/dev/null 2>&1
	fi
}

wait_for_port() {
	local service_name=$1
	local port=$2
	local attempts=${3:-40}
	local attempt=0

	while [ $attempt -lt $attempts ]; do
		if check_port "$port"; then
			log "$service_name is listening on port $port"
			return 0
		fi
		sleep 2
		attempt=$((attempt + 1))
	done

	log "$service_name failed to listen on port $port within expected time"
	return 1
}

log "Boot startup script initiated"

# Allow system services to settle
sleep 15

log "Ensuring Ollama service is running"
if ! pgrep -f "ollama serve" >/dev/null; then
	nohup ollama serve > "$LOG_DIR/ollama.log" 2>&1 &
	sleep 5
else
	log "Ollama service already running"
fi

cd "$PROJECT_DIR" || exit 1

log "Starting MongoDB container"
docker-compose up -d mongo

log "Waiting for MongoDB to be ready..."
wait_for_port "MongoDB" 27017 40 || log "MongoDB port 27017 not open yet, continuing"

log "Starting backend and frontend containers"
cd "$PROJECT_DIR" || exit 1
docker-compose up -d backend frontend >> "$LOG_DIR/docker-start.log" 2>&1
wait_for_port "Backend" 4000 40 || log "Backend container not exposing port 4000 yet"
wait_for_port "Frontend" 5173 40 || log "Frontend container not exposing port 5173 yet"

cd "$PROJECT_DIR" || exit 1
log "Starting Ngrok tunnel"
docker-compose up -d ngrok

log "Boot startup script completed"


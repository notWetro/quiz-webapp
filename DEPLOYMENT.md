# Deployment auf NAS

## Setup Anleitung

### 1. SSH-Key für NAS erstellen (falls noch nicht vorhanden)

```bash
ssh-keygen -t ed25519 -C "github-actions"
```

Kopiere den Public Key auf dein NAS:
```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub username@nas-ip
```

### 2. GitHub Secrets einrichten

Gehe zu: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Füge folgende Secrets hinzu:

- **NAS_HOST**: Die IP-Adresse oder Hostname deines NAS (z.B. `192.168.1.100` oder `nas.local`)
- **NAS_USERNAME**: Dein SSH-Username auf dem NAS (z.B. `admin`)
- **NAS_SSH_KEY**: Der private SSH-Key (kompletter Inhalt von `~/.ssh/id_ed25519`)
- **NAS_PORT**: SSH Port (optional, Standard: `22`)
- **NAS_PROJECT_PATH**: Pfad auf dem NAS wo das Projekt liegt (optional, Standard: `/volume1/docker/quiz-webapp`)

### 3. Projekt auf NAS vorbereiten

SSH auf dein NAS und führe aus:

```bash
# Erstelle Projektverzeichnis
mkdir -p /volume1/docker/quiz-webapp
cd /volume1/docker/quiz-webapp

# Clone Repository
git clone https://github.com/DEIN-USERNAME/quiz-webapp.git .

# Docker und Docker-Compose sollten bereits installiert sein
# Falls nicht, installiere sie über das NAS Package Center
```

### 4. Erste Deployment testen

Pushe etwas auf den `main` Branch:

```bash
git add .
git commit -m "Test deployment"
git push origin main
```

Der GitHub Action Workflow sollte automatisch starten und auf dem NAS deployen.

### 5. Logs ansehen

GitHub Actions Logs:
- Gehe zu `Actions` Tab in deinem Repository

Container Logs auf NAS:
```bash
ssh username@nas-ip
docker logs quiz-webapp
```

### 6. App aufrufen

Die App sollte nun erreichbar sein unter:
```
http://NAS-IP:3000
```

## Troubleshooting

### SSH Connection Failed
- Prüfe ob SSH Port offen ist: `telnet NAS-IP 22`
- Prüfe SSH Key Format in GitHub Secrets
- Teste SSH manuell: `ssh -i ~/.ssh/id_ed25519 username@nas-ip`

### Git Pull Failed
- Stelle sicher, dass Git auf dem NAS installiert ist
- Prüfe Git Credentials/SSH Keys auf dem NAS

### Docker Build Failed
- Prüfe ob genug Speicher verfügbar ist
- Schaue in die Docker Logs: `docker logs quiz-webapp`

### Port bereits belegt
Ändere Port in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Statt 3000
```

## Manuelle Befehle auf NAS

```bash
# Container Status
docker ps

# Container stoppen
docker stop quiz-webapp

# Container starten
docker start quiz-webapp

# Container neu bauen
cd /volume1/docker/quiz-webapp
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Logs ansehen
docker logs -f quiz-webapp

# Alte Images aufräumen
docker image prune -a
```

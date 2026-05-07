#!/bin/sh
set -e

CERTS_DIR="docker/nginx/certs"
KEY="$CERTS_DIR/dev.key"
CRT="$CERTS_DIR/dev.crt"

# Subject fields for the self-signed certificate.
# Override via env vars, e.g. CERT_O="My Org" CERT_OU="Frontend Team" make certs
CERT_C="${CERT_C:-AT}"
CERT_ST="${CERT_ST:-Vienna}"
CERT_L="${CERT_L:-Vienna}"
CERT_O="${CERT_O:-42Vienna}"
CERT_OU="${CERT_OU:-Transcendence Dev}"
CERT_CN="${CERT_CN:-localhost}"

mkdir -p "$CERTS_DIR"

if [ ! -f "$KEY" ] || [ ! -f "$CRT" ]; then
	echo "Generating self-signed certificate..."
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout "$KEY" \
		-out "$CRT" \
		-subj "/C=$CERT_C/ST=$CERT_ST/L=$CERT_L/O=$CERT_O/OU=$CERT_OU/CN=$CERT_CN" \
		-addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
		
	echo "Certificate generated in $CERTS_DIR"
else
	echo "Certificate already exists."
fi
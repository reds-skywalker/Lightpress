#!/bin/bash
# Script para gestión de usuarios en el servidor Lightpress

if [ -z "$1" ]; then
  echo "Uso: ./manage_users.sh [nombre_usuario]"
  exit 1
fi

NEW_USER=$1

# Verificar si el usuario ya existe
if id "$NEW_USER" &>/dev/null; then
    echo "El usuario $NEW_USER ya existe."
else
    # Crear usuario y agregarlo al grupo de docker para que pueda gestionar contenedores
    sudo useradd -m -s /bin/bash "$NEW_USER"
    sudo usermod -aG docker "$NEW_USER"
    echo "¡Usuario $NEW_USER creado y añadido al grupo Docker exitosamente!"
fi

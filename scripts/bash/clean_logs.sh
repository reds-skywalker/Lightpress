#!/bin/bash
# Script para limpieza de logs antiguos

echo "Iniciando limpieza de logs - $(date)"

# Limpiar logs del sistema (journalctl) más antiguos de 7 días
sudo journalctl --vacuum-time=7d

# Limpiar contenedores, redes e imágenes de Docker que no se estén usando
docker system prune -af --volumes

echo "Limpieza completada exitosamente."

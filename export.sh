#!/usr/bin/env bash

# Nom du fichier de sortie
OUTPUT="export_code.txt"

# On le vide au cas où il existe déjà
> "$OUTPUT"

# Dossiers à exclure
EXCLUDES=(
  "node_modules"
  ".git"
  "dist"
  "build"
  ".next"
  "venv"
  "__pycache__"
)

# Fichiers à exclure explicitement
EXCLUDE_FILES=(
  "package-lock.json"
)

# Construction des patterns d'exclusion pour les dossiers
EXCLUDE_PARAMS=()
for e in "${EXCLUDES[@]}"; do
  EXCLUDE_PARAMS+=(-path "*$e*" -prune -o)
done

# Construction des patterns d'exclusion pour les fichiers
EXCLUDE_FILE_PARAMS=()
for f in "${EXCLUDE_FILES[@]}"; do
  EXCLUDE_FILE_PARAMS+=(! -name "$f")
done

# Extensions de fichiers à exporter
EXTENSIONS="sh js ts jsx tsx py go java cpp hpp c h html css scss json yaml yml md"

echo "==== EXPORT CODE ====" >> "$OUTPUT"

for ext in $EXTENSIONS; do
  echo -e "\n### EXTENSION .$ext ###\n" >> "$OUTPUT"

  find . \
    "${EXCLUDE_PARAMS[@]}" \
    -type f -name "*.$ext" \
    "${EXCLUDE_FILE_PARAMS[@]}" \
    -print | while read -r FILE; do
      echo -e "\n===== FICHIER: $FILE =====\n" >> "$OUTPUT"
      cat "$FILE" >> "$OUTPUT"
    done
done

echo -e "\n=== FIN ===\n" >> "$OUTPUT"
echo "Export terminé dans $OUTPUT"

#!/usr/bin/env bash

OUTPUT="stitch_ready.txt"
> "$OUTPUT"

echo "==== STITCH READY EXPORT ====" >> "$OUTPUT"

FILES=(
  "app/choice-pricing/page.tsx"
  "app/globals.css"
  "tailwind.config.ts"
)
 

for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ]; then
    echo -e "\n===== $FILE =====\n" >> "$OUTPUT"
    cat "$FILE" >> "$OUTPUT"
  else
    echo -e "\n===== $FILE (NOT FOUND) =====\n" >> "$OUTPUT"
  fi
done

echo -e "\n=== END ===\n" >> "$OUTPUT"

echo "✅ Export terminé dans $OUTPUT"
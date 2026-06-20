#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 \"message de commit\"" >&2
  exit 1
fi

commit_message="$*"

npm run lint
npm run build
git status --short
git add .
git commit -m "$commit_message"

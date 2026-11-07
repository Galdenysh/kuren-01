#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

wanted="$(tr -d '[:space:]' < .nvmrc)"
nvm_root="${NVM_DIR:-$HOME/.nvm}/versions/node"
match="$(ls -d "$nvm_root"/v"${wanted}"* 2>/dev/null | sort -V | tail -1 || true)"
if [[ -n "$match" && -x "$match/bin/node" ]]; then
  export PATH="$match/bin:$PATH"
  hash -r
fi

node_ver="$(node -p "process.versions.node")"
IFS=. read -r major minor _ <<< "$node_ver"
if ((major < 20 || (major == 20 && minor < 19))); then
  echo "Kuren-01 needs Node >= 20.19 (Vite 8). Now: v${node_ver}" >&2
  echo "Login PATH has Node 18 before nvm. Install 22: nvm install && nvm use  (see .nvmrc)" >&2
  exit 1
fi

exec "$@"

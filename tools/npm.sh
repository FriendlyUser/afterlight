#!/bin/bash
# Usage: tools/npm.sh <npm args>   e.g. tools/npm.sh install, tools/npm.sh run build
# Runs npm in the project root. Uses Linux npm when installed; otherwise, from WSL,
# the Windows npm (cmd.exe `pushd` maps the WSL share to a temporary drive letter).
# node_modules must then be installed and used from the same side (Windows binaries).
cd "$(dirname "$0")/.."
if command -v node >/dev/null 2>&1 && [[ "$(command -v npm)" != /mnt/* ]]; then
  exec npm "$@"
fi
# pushd accepts the \\wsl$ form of the share, not \\wsl.localhost, and the path must
# stay unquoted (WSL passes quotes through escaped), so it can't contain spaces.
WIN_DIR=$(wslpath -w "$PWD" | sed 's|^\\\\wsl\.localhost\\|\\\\wsl$\\|')
[[ "$WIN_DIR" == *" "* ]] && { echo "tools/npm.sh: project path has spaces; run npm from Windows instead" >&2; exit 1; }
cd /mnt/c || exit 1
# Native file watching does not work across the share, so Vite polls (vite.config.js).
exec cmd.exe /d /c "set AFTERLIGHT_POLL=1&& pushd $WIN_DIR && npm $* & popd"

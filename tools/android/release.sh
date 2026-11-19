#!/bin/bash
# Usage: tools/android/release.sh [version-name]      e.g. tools/android/release.sh 1.0.1
#
# Builds the Android app bundle for Google Play and signs it:
#   1. GitHub Actions builds the bundle from what is on GitHub (.github/workflows/android.yml)
#   2. it is downloaded into release/android/
#   3. it is signed with your upload key (kept outside this repository)
# The result is release/android/afterlight-<version>-<code>.aab: upload that file in
# Play Console. A debug APK lands beside it, for trying the build on a phone first.
#
# The shared signing kit does the work, so the same command serves every game:
# /home/david/claude_space/android-release (or $ANDROID_RELEASE_KIT).
KIT="${ANDROID_RELEASE_KIT:-/home/david/claude_space/android-release}"
[[ -x "$KIT/build-from-github.sh" ]] || { echo "release.sh: the signing kit is not at $KIT (set ANDROID_RELEASE_KIT)" >&2; exit 1; }
exec "$KIT/build-from-github.sh" "$(cd "$(dirname "$0")/../.." && pwd)" "$@"

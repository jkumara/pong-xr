#!/bin/bash

DIR_PATH=$(dirname "$(realpath "${BASH_SOURCE:-$0}")")
npx http-server "$DIR_PATH/.." -S -C "$LOCAL_CERT" -K "$LOCAL_KEY"  -c-1 -p "$PORT"
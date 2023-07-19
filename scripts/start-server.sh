#!/bin/bash

DIR_PATH=$(dirname "$(realpath "${BASH_SOURCE:-$0}")")
npx http-server "$DIR_PATH/.." -c-1 -p "$PORT"
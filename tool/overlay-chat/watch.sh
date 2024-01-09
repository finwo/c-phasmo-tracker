#!/usr/bin/env bash

while true; do
  inotifywait --recursive $(dirname $0)/src --event modify
  npm run build
done

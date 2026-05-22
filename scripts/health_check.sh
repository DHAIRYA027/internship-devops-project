#!/bin/bash

URL="http://127.0.0.1:64819"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ "$STATUS" -eq 200 ]; then
    echo "Application healthy"
    exit 0
else
    echo "Application unhealthy"
    exit 1
fi
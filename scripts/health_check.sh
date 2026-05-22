#!/bin/bash

STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9999)

if [ "$STATUS" -eq 200 ]; then
    echo "Application healthy"
    exit 0
else
    echo "Application unhealthy"
    exit 1
fi
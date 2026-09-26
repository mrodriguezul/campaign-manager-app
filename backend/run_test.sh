#!/bin/bash

echo "Starting tests E2E..."

docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from e2e-tests

TEST_RESULT=$?

echo "Cleaning infrastructure..."

docker-compose -f docker-compose.test.yml down -v

if [ $TEST_RESULT -eq 0 ]; then
  echo "✅ ¡Tests passed successfully!"
  exit 0
else
  echo "❌ Tests failed."
  exit 1
fi
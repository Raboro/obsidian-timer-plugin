#!/bin/bash

echo -e "\ntry to fix all issues if present"

bun run lint:fix

git commit -am "fixed eslint issues"

echo -e "\ncheck all issues fixed"

bun run lint
lint_exit_code=$?

if [ $lint_exit_code -ne 0 ]; then
    echo "Linting errors still exist. Exiting."
    exit 1
fi

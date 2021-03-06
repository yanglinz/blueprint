#!/usr/bin/env bash

cd $(dirname $0)/..
set -e

# ---------------------------------------------------------------------------------------------------------------------
# NPM pre publish

# https://circleci.com/docs/npm-login/
echo -e "$NPM_USER\n$NPM_PASSWORD\n$NPM_EMAIL" | npm login

# ---------------------------------------------------------------------------------------------------------------------
# NPM publish

TO_PUBLISH=$(echo "console.log(require('./packages/style-override/package.json').version)" | node)
VERSIONS=$(npm info @pbs/blueprint-style-override versions || echo "new_package")

# check for presence of this version in the list of all published versions
if [[ $VERSIONS == *"'$TO_PUBLISH'"* ]]; then
  echo "Nothing to publish for @pbs/blueprint-style-override @$TO_PUBLISH"
else
  echo "Publishing @pbs/blueprint-style-override @$TO_PUBLISH..."
  # must set public access for scoped packages
  npm publish packages/style-override --access public
fi

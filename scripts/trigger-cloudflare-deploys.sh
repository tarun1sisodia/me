#!/usr/bin/env bash
# Trigger Cloudflare Workers Builds deploys for the portfolio's main,
# main2 and main3 branches via their deploy hooks. Used when those
# branches stop auto-deploying on push — e.g. after main3 became the
# default branch — or to redeploy their latest code on demand.
#
# The hook URLs are secrets (anyone holding one can trigger a build), so
# they are NOT stored in this repo. Set them in the environment first:
#
#   export CF_DEPLOY_HOOK_MAIN="https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/<main-hook-id>"
#   export CF_DEPLOY_HOOK_MAIN2="https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/<main2-hook-id>"
#   export CF_DEPLOY_HOOK_MAIN3="https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/<main3-hook-id>"
#   ./scripts/trigger-cloudflare-deploys.sh
#
# Any hook left unset is skipped, so one branch can be triggered alone:
#   CF_DEPLOY_HOOK_MAIN3="..." ./scripts/trigger-cloudflare-deploys.sh
set -u

fail=0

trigger() {
  local name="$1" url="$2"
  if [ -z "$url" ]; then
    echo "skip $name: hook URL is not set"
    return 0
  fi
  echo "triggering $name deploy..."
  local resp http body
  resp="$(curl -s -w "\n%{http_code}" -X POST "$url")"
  http="${resp##*$'\n'}"
  body="${resp%$'\n'*}"
  if [ "$http" = "200" ] || [ "$http" = "201" ] || [ "$http" = "202" ]; then
    echo "ok $name (HTTP $http)"
  else
    echo "FAILED $name (HTTP $http): $body"
    fail=1
  fi
}

trigger main "${CF_DEPLOY_HOOK_MAIN:-}"
trigger main2 "${CF_DEPLOY_HOOK_MAIN2:-}"
trigger main3 "${CF_DEPLOY_HOOK_MAIN3:-}"

exit "$fail"

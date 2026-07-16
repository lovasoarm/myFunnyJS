#!/usr/bin/env bash
assert_eq() {
  local expected="$1" actual="$2" label="$3"
  if [ "$expected" = "$actual" ]; then
    echo "  [OK]   $label"
  else
    echo "  [FAIL] $label"
    echo "         attendu : $expected"
    echo "         obtenu  : $actual"
    return 1
  fi
}
assert_file_eq() {
  local expected_file="$1" actual_file="$2" label="$3"
  if diff -q "$expected_file" "$actual_file" >/dev/null; then
    echo "  [OK]   $label"
  else
    echo "  [FAIL] $label"
    diff -u "$expected_file" "$actual_file" | head -30 >&2
    return 1
  fi
}

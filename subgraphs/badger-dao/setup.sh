#!/bin/zsh
typeset -a array

array=("matic" "bsc" "mainnet")

for i ("${array[@]}")
do
  yarn prepare:"$i"
  yarn codegen
done

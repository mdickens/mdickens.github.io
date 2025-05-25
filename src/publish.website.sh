#!/bin/bash -x
OUTDIR=../docs/
CURDIR=~/workspace/mdickens.github.io/src
cd $CURDIR
./generate.website.sh
cd $OUTDIR
git add . ;  git commit -m ' update website'; git push origin main 
cd $CURDIR



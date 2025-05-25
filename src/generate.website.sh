#!/bin/bash
OUTDIR=../docs/
CURDIR=~/workspace/mdickens.github.io/src

cd $CURDIR

counter=1

for file in home.html about.html services.html services.blog.html portfolio.html contact.html; do 
	rando=$(echo $(( RANDOM % 21 + 1 )))
  	cat ./styles.css.template | sed "s/__BACKGROUND__/.\/b${rando}.png/" > ${OUTDIR}/styles.${counter}.css
  	cat ./header.html | sed "s/__STYLESHEET__/.\/styles.${counter}.css/" > ${OUTDIR}/${file}
    cat ./${file} >> ${OUTDIR}/${file}
  	cat ./footer.html >> ${OUTDIR}/${file}
	let counter=$counter+1
done

cat ${OUTDIR}/home.html > ${OUTDIR}/index.html




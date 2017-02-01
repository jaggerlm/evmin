#$1: sid
#S2: errors
#$3: maxLength
#$4: expected solution
traceMinimize(){
	node jsmin gen -s $1 -e $2 -L $3 -E $4
	python ./log/$1_z3/generatingCons.py #>>/dev/null
	node jsmin check2 -s $1 -E $4
}
#bug 1. chart.js
#traceMinimize 1464657621260 1051 10 132,443,818,970,1051
#bug 2. chart.js
#traceMinimize 1464933703078 1189 15 451,807,1043,1145,1189

#TODO: bug 4. handsontable 
#traceMinimize 1425276010802 689,690 15 211,214,273,276,359,360,495,497,684,689,690

#bug 6. jpushMenu
#traceMinimize 1430793897214 338 15 148,338

#TODO: bug 7: TODOList
#traceMinimize 1432816837035 1395 15 584,1309,1395
#bug 8. fullpage.js
#traceMinimize 1432604567665 395 15 199,294,395

#editor.md
#traceMinimize 1471836191598 1322 15 412,1322
#http://192.168.137.2/rr_replay?sid=1471836191598&reduce=true&base=1&policy=WEAK&mode=STEP

#TODO my-mind
traceMinimize 1471844959272 1286 50 1083,1087,1093,1095,1099,1105,1278,1286 

#bug 11. foundation-sites
#traceMinimize 1456407830011 1562 15 1556,1562
#bug 12. reveal-js
#traceMinimize 1456465391339 613 15 246,251,255,609,611,613

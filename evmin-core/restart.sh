#npm install
#npm run-script build
killall node 2>/dev/null
rm instrumentedScripts/* -rf 2>/dev/null
find ./qunit_test -name '*jalangi*' -exec rm {} \;

echo "" &
node src/js/commands/rr_proxy.js & 
node src/js/commands/rr_server.js &
node src/js/commands/test_server.js &

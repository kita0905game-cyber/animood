require('node:child_process').execFileSync(process.execPath,['--test',require('node:path').join(__dirname,'v05.test.mjs')],{stdio:'inherit'});

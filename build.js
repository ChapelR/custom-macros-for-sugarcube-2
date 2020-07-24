// jshint esversion: 6, node: true

const jetpack = require('fs-jetpack'),
    Terser  = require('terser');



const buildDate = new Date().toISOString().split('T')[0],
    buildID = require('git-commit-id')();

function build () {
    const jsFiles = jetpack.find('./scripts', {
        matching : '*.js',
        recursive : false
    });
    
    jsFiles.forEach( file => {
        const source = jetpack.read(file);
        let path = file.split(/[\\\/]/g);

        const name = path.pop().split('.').join('.min.');

        let version = source.match(/(v|version\s+)(\d+\.\d+.\d+)/);
        if (version == null) {
            version = '0.0.0';
            console.log(`missing version info: ${file}`);
        } else {
            version = version[2];
        }
        
        const result = Terser.minify(source);
        
        console.log(result.error);
        
        path.unshift('.');
        path.push('minified');
        path.push(name);
        path = path.join('/');
        
        const ret = `// ${name}, for SugarCube 2, by Chapel\n// v${version}, ${buildDate}, ${buildID}\n;${result.code}\n// end ${name}`;
        
        jetpack.write(path, ret, {atomic : true});
    });
}

build();
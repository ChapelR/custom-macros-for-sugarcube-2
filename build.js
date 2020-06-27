// build me

var jetpack = require('fs-jetpack'),
    Terser  = require('terser');

function build () {
    var jsFiles = jetpack.find('./scripts', {
        matching : '*.js',
        recursive : false
    });
    
    jsFiles.forEach( function (file) {
        var source = jetpack.read(file),
            path   = file.split(/[\\\/]/g),
            name   = path.pop().split('.').join('.min.'),
            result, ret;
        
        result = Terser.minify(source);
        
        console.log(result.error);
        
        path.unshift('.');
        path.push('minified');
        path.push(name);
        path = path.join('/');
        
        ret = '// ' + name + ', for SugarCube 2, by Chapel\n;' + result.code + '\n// end ' + name; 
        
        jetpack.write(path, ret, {atomic : true});
    });
}

build();
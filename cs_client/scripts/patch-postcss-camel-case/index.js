var postcss = require('postcss');

function replacer(g) {
    var character = g[g.length - 1];

    return g[0] === '.' ? '.' + character.toLowerCase() : character.toUpperCase();
}
function isGlobalModule(globalModules, inputFile) {
    return globalModules.some(regex => inputFile.match(regex));
}
module.exports = postcss.plugin('postcss-camel-case', function(opts = {}) {
    var pattern = new RegExp(
      `[-.${opts.skipUnderscore ? '' : '_'}]+([a-zA-Z])`,
      'g'
    );
    const globalModules = opts.globalModulePaths || [];
    return function(css) {
        const inputFile = css.source.input.file;
        css.walkRules(function(rule) {
            if (!isGlobalModule(globalModules, inputFile))
                rule.selector = rule.selector.replace(pattern, replacer);
        });
    };
});

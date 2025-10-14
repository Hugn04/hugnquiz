function toCamelCase(str) {
    return str.replace(/-([a-z])/g, function (match, letter) {
        return letter.toUpperCase();
    });
}

function getObjStyleClassName(className) {
    const sheets = document.styleSheets;
    let result = {};

    for (let i = 0; i < sheets.length; i++) {
        const rules = sheets[i].cssRules || sheets[i].rules;

        for (let j = 0; j < rules.length; j++) {
            if (rules[j].selectorText === `.${className}`) {
                const style = rules[j].style;
                for (let k = 0; k < style.length; k++) {
                    const propertyName = style.item(k);
                    const camelCaseName = toCamelCase(propertyName);
                    result[camelCaseName] = style.getPropertyValue(propertyName);
                }
            }
        }
    }
    return result;
}
export default getObjStyleClassName;

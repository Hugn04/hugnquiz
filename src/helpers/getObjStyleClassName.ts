function toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function getObjStyleClassName(className: string): Record<string, string> {
    const sheets = document.styleSheets;
    const result: Record<string, string> = {};

    for (let i = 0; i < sheets.length; i++) {
        const sheet = sheets[i];

        let rules: CSSRuleList | undefined;
        try {
            // Một số stylesheet cross-origin sẽ lỗi khi truy cập
            rules = sheet.cssRules;
        } catch {
            continue;
        }

        if (!rules) continue;

        for (let j = 0; j < rules.length; j++) {
            const rule = rules[j] as CSSStyleRule;

            if (rule.selectorText === `.${className}`) {
                const style = rule.style;

                for (let k = 0; k < style.length; k++) {
                    const property = style.item(k);
                    const camelName = toCamelCase(property);
                    result[camelName] = style.getPropertyValue(property);
                }
            }
        }
    }

    return result;
}

export default getObjStyleClassName;

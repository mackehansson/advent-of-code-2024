const input = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
const splitted = input.split("mul").filter(i => !i.search(/\(.*\)/));
const resultArr = [];

for (let i = 0; i < splitted.length; i++) {
    const onlyParaentheses = splitted[i].match(/\(.*?\)/g)?.join('').trim() || '';
    const containsSpaces = /\s/.test(onlyParaentheses);
    if (containsSpaces) continue;
    const removedParantheses = onlyParaentheses.replace("(", "").replace(")", "").trim().split(",").map(Number);
    if (removedParantheses.length !== 2) continue;
    resultArr.push(removedParantheses[0] * removedParantheses[1]);
}

console.log(resultArr.reduce((acc, curr) => acc + curr, 0));
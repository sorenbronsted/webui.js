
let o = JSON.parse('{"a":1,"b":"b","c":null}');
console.log(typeof o.c);
console.log(o.c === null);
console.log(o.c);
console.log(JSON.stringify(o));
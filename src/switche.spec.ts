import { switche } from "./switche";

const i: number = 7;
const a = switche<number|string>(i)
    .case(1, 'One')
    .case(2, 'Two')
    .case('seven', 'Seven')
    .default('Many');//?

const b = switche(i)
    .case<number|string>(1, 'One')
    .case(2, 'Two')
    .case(7, 7)
    .default('Many');//?

const c = switche(i)
    .case(1, 'One')
    .case(2, 'Two')
    .case(7, 'Seven')
    .default('Many');//?

const d = switche<number|string, string|boolean>(i)
    .case(1, 'One')
    .case(2, 'Two')
    .case('seven', true)
    .default('Many');//?


const e = switche(i)
    .case(1, 'One')
    .case(n => n > 3 && n <= 7, 'medium')
    .default('Other');//?

const f = switche(i)
    .case(n => n > 3 && n <= 7, 'medium')
    .case(1, 'One')
    .default('Other');//?

const result = switche(i)
    .case(v => v > 6, 'High')
    .case(1, 'One')
    .case(2, 'Two')
    .default('Neither');//?
    
/* ------ Should have type errors ------ */
const z = switche(i)
    .case(1, 'One')
    .case(2, 'Two')
    .case('seven', 'Seven')
    .default('Many');//?

const y = switche<number>(i)
    .case(1, 'One')
    .case(2, 'Two')
    .case('seven', 'Seven')
    .default('Many');//?

const x = switche<number|string, string>(i)
    .case(1, 'One')
    .case(2, 'Two')
    .case('seven', 7)
    .default('Many');//?

const w = switche<number|string, string>(i)
    .case<string|number>(1, 'One')
    .case(2, 'Two')
    .case('seven', 7)
    .default('Many');//?


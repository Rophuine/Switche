# Switche

Have you ever wished TypeScript had an expression-syntax equivalent of `switch`? I have. Unfortunately, JavaScript/TypeScript `switch` doesn't return a value. You can fake it with a function, something like this:

```typescript
const result = (() => {
    switch (value) {
        case 1: return 'One';
        case 2: return 'Two';
        default: return 'Neither'
    }
})();
```

That's a lot of code, though, and you need to add a return type annotation if you want some kind of enforcement of the return type (in the above example, you can change ```'two'``` to ```2``` and TypeScript won't complain).

Switche gives you a nicer syntax to achieve the same result, with a little more type safety.

## Value Syntax

Provide the value to test in a call to `switche`, then provide multiple `.case` calls, and finally a `.default` call. The result of the call chain will be the second parameter of the **first** matching case, or else the parameter passed to `.default`

```typescript
const result = switche(value)
    .case(1, 'One')
    .case(2, 'Two')
    .default('Neither');
```

## Predicate syntax

As well as providing values to match against, you can provide predicate functions:
```typescript
const result = switche(value)
    .case(v => v < 0, 'Negative')
    .case(1, 'One')
    .case(2, 'Two')
    .default('Neither');
```

## Throw if not matched

Instead of providing a default, you can tell Switche to throw an error if there is no match. `.orThrow` takes two optional parameters: an error message and an error type. If you provide an error type, it must inherit from `Error` and accept a string in the constructor.

```typescript
const result = switche(value)
    .case(1, 'One')
    .orThrow('The provided value was not 1');
```

```typescript
class CustomError extends Error {    
    constructor(details) {
        super(`Custom error being thrown with message '${details}'`);
    }
}
const result = switche(value)
    .case(1, 'One')
    .orThrow('The provided value was not 1', CustomError);
```

If your custom error constructor doesn't take a single string parameter or you otherwise want to control the creation of the error, you can pass a function as the first parameter which will be called to create the error to throw. In this case, the second parameter is ignored.

```typescript
class ComplexCustomError extends Error {
    constructor(errorCode: number) {
        super(`Error thrown with code ${errorCode}`);
    }
}
try {
    const result = switche(i)
    .case(2, 'Two')
    .orThrow(() => new ComplexCustomError(5));
} catch (ex) {
    ex;//?
}
```

## Type Safety

```typescript
const result = switche(value)
    .case(1, 'One')
    .case(2, 'Two')
    .default('Neither'); // Expression type: string
```

Unlike in the `switch` example above, if you replace one of the strings with something of a different type, you'll get a type error. All to `case` or `default` must be of the same type as the first parameter to the first `case` call.

```typescript
const result = switche(value)
    .case(1, 'One')
    .case(2, 2) // Type error: Argument of type 'number' is not assignable to parameter of type 'string'.
    .default('Neither');
```

You can control the result type using generic parameters. For example, if you *want* to allow either strings or numbers, you can provide `string|number` as a generic parameter to the first `case` call. 

```typescript
const result = switche(value)
    .case<string|number>(1, 'One')
    .case(2, 2)
    .default('Neither'); // Expression type: string|number
```

You can place the generic parameter immediately after the `switche` call as well, but then you have to provide the input type as the first parameter (the second parameter, which specifies the output type, is optional):
```typescript
const result = switche<number,string|number>(value)
    .case(1, 'One')
    .case(2, 2)
    .default('Neither'); // Expression type: string|number
```

If you provide generic parameters in both places, the second one will be ignored. In this example, `string` (provided as the generic parameter to `switche`) will be used, and `number|string` provided to the first `case` call will be ignored.
```typescript
const result = switche<number,string>(value)
    .case<number|string>(1, 'One')
    .case(2, 2) // Type error: Argument of type 'number' is not assignable to parameter of type 'string'.
    .default('Neither');
```


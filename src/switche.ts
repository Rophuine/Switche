function switcheResolved<TValue, TResult>(result: TResult) {
    return {
        case: (v: TValue, r: TResult) => switcheResolved<TValue, TResult>(result),
        default: (r: TResult) => result
    };
}

function switcheUnresolved<TValue, TResult>(value: TValue) {
    return {
        case: (v: TValue, r: TResult) => v === value ? switcheResolved<TValue, TResult>(r) : switcheUnresolved<TValue, TResult>(value),
        default: (r: TResult) => r
    }
}

const NotSpecifiedSymbol: unique symbol = Symbol();
type NotSpecified = typeof NotSpecifiedSymbol;

export function switche<TValue, TProvidedResult=NotSpecified>(value: TValue) {
    return {
        case: <TResult>(v: TValue, r: TProvidedResult extends NotSpecified ? TResult : TProvidedResult) => {
            return v === value
                ? switcheResolved<TValue, TProvidedResult extends NotSpecified ? TResult : TProvidedResult>(r) 
                : switcheUnresolved<TValue, TProvidedResult extends NotSpecified ? TResult : TProvidedResult>(value);
        },
    };
}

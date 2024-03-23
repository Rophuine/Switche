type CaseResult<TValue, TResult> = {
    case: (v: TValue|((u: TValue) => boolean), r: TResult) => CaseResult<TValue, TResult>,
    default: (r: TResult) => TResult
}

function switcheResolved<TValue, TResult>(result: TResult): CaseResult<TValue, TResult> {
    return {
        case: (v, r) => switcheResolved<TValue, TResult>(result),
        default: (r) => result
    };
}

function isCaseFunctionParameter<TValue>(parameter: unknown | ((u: TValue) => boolean)): parameter is ((u: TValue) => boolean) {
    if (typeof parameter !== 'function') return false;
    return true; // Shortcoming: If the value being switched on is a function, this won't work.
}

function switcheUnresolved<TValue, TResult>(value: TValue): CaseResult<TValue, TResult> {
    return {
        case: (v, r) => {
            const match = isCaseFunctionParameter(v) ? v(value) : v === value;
            return match ? switcheResolved<TValue, TResult>(r) : switcheUnresolved<TValue, TResult>(value)
        },
        default: (r) => r
    }
}

const NotSpecifiedSymbol: unique symbol = Symbol();
type NotSpecified = typeof NotSpecifiedSymbol;

export function switche<TValue, TProvidedResult=NotSpecified>(value: TValue) {
    return {
        case: <TResult>(v: TValue|((u: TValue) => boolean), r: TProvidedResult extends NotSpecified ? TResult : TProvidedResult) => {
            const match = isCaseFunctionParameter(v) ? v(value) : v === value;
            return match
                ? switcheResolved<TValue, TProvidedResult extends NotSpecified ? TResult : TProvidedResult>(r) 
                : switcheUnresolved<TValue, TProvidedResult extends NotSpecified ? TResult : TProvidedResult>(value);
        },
    };
}

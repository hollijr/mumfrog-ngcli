export class FibonacciPy {
    code:String = `
"""
recursion_fibseq.py
Implements a function recursivly to get the desired
Fibonacci sequence value.
Tests the implementation.
"""

def get_fib(position):
    # base cases
    if position is 0: return 0
    if position is 1: return 1

    # recursion
    hashtbl = {}
    next = get_fib_perf(position - 1, hashtbl) + get_fib_perf(position - 2, hashtbl)
    return next

def get_fib_perf(position, hashtbl):
    # base cases
    if position is 0 or position is 1: return position

    # use hashed value for better performance
    if position in hashtbl:
        print 'using hashtable'
        return hashtbl[position]

    # recursion
    next = get_fib_perf(position - 1, hashtbl) + get_fib_perf(position - 2, hashtbl)
    hashtbl[position] = next  # hash the computed value to save time
    return next

# Test cases
print get_fib(9)
print get_fib(11)
print get_fib(0)
`;
}
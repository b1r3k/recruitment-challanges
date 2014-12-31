/*
Odwrotna notacja polska (ang. reverse polish notation, RPN) – jest sposobem zapisu wyrażeń arytmetycznych, w którym znak wykonywanej operacji
umieszczony jest po operandach, a nie pomiędzy nimi jak w konwencjonalnym zapisie algebraicznym (np. 2 2 + zamiast 2 + 2). Zapis ten pozwala na
całkowitą rezygnację z użycia nawiasów w wyrażeniach, jako że jednoznacznie określa kolejność wykonywanych działań.
Napisz funkcję kalkulatora realizującego działania wg notacji RPN, tak aby dla podanych poniżej danych wejściowych zwracała odpowiadające im
wyjścia.

2 3 + 5

4 4 + 2 * 16

5 5 * 5 + 10 – 4 / 1

a to 1, b to 2 + 3

ABC 4 DEF8 - -4
 */

'use strict';

var _ = require('lodash');

var tokenize = function (expr, valid_operators) {
    var raw_tokens = expr.split(" "),
        valid_token_regexp_fmt = '(\\d+)|{0}';

    var valid_token_regexp = new RegExp(valid_token_regexp_fmt.replace("{0}", function () {
        var extracted_operators = "";

        for (var operatorIdx in valid_operators) {
            extracted_operators = extracted_operators + "(\\" + valid_operators[operatorIdx] + ")|";
        }

        return extracted_operators.slice(0, extracted_operators.length - 1);
    }));

//    console.log(valid_token_regexp);

    return _.map(raw_tokens, function (item) {
        var token = valid_token_regexp.exec(item);
//        console.log('Item: ', item, ' token: ', token);
        return token ? token[0] : null;
    });
};

var calculate = function (expresion) {
    var operators = {
            '+': function (operandA, operandB) {
                return operandA + operandB;
            },
            '-': function (operandA, operandB) {
                return operandB - operandA;
            },
            '*': function (operandA, operandB) {
                return operandA * operandB;
            },
            '/': function (operandA, operandB) {
                return operandB / operandA;
            },
        },
        tokens = null;

    tokens = tokenize(expresion, Object.keys(operators));

//    console.log(tokens);

    var result = _.reduce(tokens, function (stack, token, tokenId) {
        var operandA,
            operandB;

        if (token in operators) {
//            console.log('Op: ' + token + ' stack: ' + stack);
            operandA = parseInt(stack.pop());
            operandB = parseInt(stack.pop());
            stack.push(operators[token](operandA, operandB));
        } else if (token != null) {
            stack.push(token);
        }
        return stack;
    }, []);

//    console.log(result);

    return result[0];
};

exports.test_solution = {
    setUp: function (done) {
        done();
    },
    'default test 1': function (test) {
        test.expect(1);

        test.equal(calculate("2 3 +"), 5);
        test.done();
    },
    'default test 2': function (test) {
        test.expect(1);

        test.equal(calculate("4 4 + 2 *"), 16);
        test.done();
    },
    'default test 3': function (test) {
        test.expect(1);

        test.equal(calculate("5 5 * 5 + 10 - 4 /"), 5);
        test.done();
    },
    'general RPN test 1': function (test) {
        test.expect(1);

        test.equal(calculate("10 4 3 + 2 * -"), -4);
        test.done();
    },
    'general RPN test 2': function (test) {
        test.expect(1);

        test.equal(calculate("90 34 12 33 55 66 + * - + -"), 4037);
        test.done();
    },
    'rosetta RPN test 1': function (test) {
        test.expect(1);

        test.equal(calculate("3 4 2 * 1 5 - 2 3 ^ ^ / +"), 3);
        test.done();
    },
    'default (expr set A) test 4': function (test) {
        test.expect(1);

        test.equal(calculate("a to 1, b to 2 +"), 3);
        test.done();
    },
    'default (expr set B) without expr!': function (test) {
        test.expect(1);

        test.equal(calculate("4 8 -"), -4);
        test.done();
    },
    'default (expr set B) test 5': function (test) {
        test.expect(1);

        test.equal(calculate("ABC 4 DEF8 -"), -4);
        test.done();
    },


};

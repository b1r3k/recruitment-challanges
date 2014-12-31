'use strict';

var _ = require('lodash');

var tokenize = function (expr) {
    var raw_tokens = expr.split(" ");

    return raw_tokens;
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

    tokens = tokenize(expresion);
    
    var result = _.reduce(tokens, function (stack, token, tokenId) {
        var operandA,
            operandB;

        if (token in operators) {
//            console.log('Op: ' + token + ' stack: ' + stack);
            operandA = parseInt(stack.pop());
            operandB = parseInt(stack.pop());
            stack.push(operators[token](operandA, operandB));
        } else {
            stack.push(token);
        };
        return stack;
    }, []);

//    console.log(result);

    return result[0];
};

exports.test_solution = {
    setUp: function (done) {
        // setup here
        done();
    },
    'default test 1': function (test) {
        test.expect(1);
        // tests here
        test.equal(calculate("2 3 +"), 5);
        test.done();
    },
    'default test 2': function (test) {
        test.expect(1);
        // tests here
        test.equal(calculate("4 4 + 2 *"), 16);
        test.done();
    },
    'default test 3': function (test) {
        test.expect(1);
        // tests here
        test.equal(calculate("5 5 * 5 + 10 - 4 /"), 5);
        test.done();
    },
    'general RPN test 1': function (test) {
        test.expect(1);
        // tests here
        test.equal(calculate("10 4 3 + 2 * -"), -4);
        test.done();
    },
    'general RPN test 2': function (test) {
        test.expect(1);
        // tests here
        test.equal(calculate("90 34 12 33 55 66 + * - + -"), 4037);
        test.done();
    },
    'rosetta RPN test 1': function (test) {
        test.expect(1);
        // tests here
        test.equal(calculate("3 4 2 * 1 5 - 2 3 ^ ^ / +"), 3);
        test.done();
    },
    'default (expr set A) test 4': function (test) {
        test.expect(1);
        // tests here
        test.equal(calculate("a to 1, b to 2 +"), 3);
        test.done();
    },
    'default (expr set B) test 5': function (test) {
        test.expect(1);
        // tests here
        test.equal(calculate("ABC 4 DEF8 -"), -4);
        test.done();
    },




};

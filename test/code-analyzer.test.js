import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });

    it('is parsing a update expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('i++')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"UpdateExpression","operator":"++","argument":{"type":"Identifier","name":"i"},"prefix":false}}],"sourceType":"script"}'
        );
    });

    it('is parsing a update expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('++i')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"UpdateExpression","operator":"++","argument":{"type":"Identifier","name":"i"},"prefix":true}}],"sourceType":"script"}'
        );
    });


    it('is parsing a returnStatement and function declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function check(i){return i;}')),
            '{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"check"},"params":[{"type":"Identifier","name":"i"}],"body":{"type":"BlockStatement","body":[{"type":"ReturnStatement","argument":{"type":"Identifier","name":"i"}}]},"generator":false,"expression":false,"async":false}],"sourceType":"script"}'
        );
    });


    it('is parsing a member expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('table[0] = 1;')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"table"},"property":{"type":"Literal","value":0,"raw":"0"}},"right":{"type":"Literal","value":1,"raw":"1"}}}],"sourceType":"script"}'
        );
    });

    it('is parsing a member expression and indentifier and literal correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('temp = table[0]')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"temp"},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"table"},"property":{"type":"Literal","value":0,"raw":"0"}}}}],"sourceType":"script"}'
        );
    });

    it('is parsing a binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('temp = (x+y)*2')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"temp"},"right":{"type":"BinaryExpression","operator":"*","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x"},"right":{"type":"Identifier","name":"y"}},"right":{"type":"Literal","value":2,"raw":"2"}}}}],"sourceType":"script"}'
        );
    });

    it('is parsing a binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('temp = (x*y) + a[3];')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"temp"},"right":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"*","left":{"type":"Identifier","name":"x"},"right":{"type":"Identifier","name":"y"}},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"a"},"property":{"type":"Literal","value":3,"raw":"3"}}}}}],"sourceType":"script"}'
        );
    });

    it('is parsing a binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('x = x +2;')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"x"},"right":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x"},"right":{"type":"Literal","value":2,"raw":"2"}}}}],"sourceType":"script"}'
        );
    });

    it('is parsing a while statement + binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('while(x<y){x=a[0]+1;}')),
            '{"type":"Program","body":[{"type":"WhileStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Identifier","name":"x"},"right":{"type":"Identifier","name":"y"}},"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"x"},"right":{"type":"BinaryExpression","operator":"+","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"a"},"property":{"type":"Literal","value":0,"raw":"0"}},"right":{"type":"Literal","value":1,"raw":"1"}}}}]}}],"sourceType":"script"}'
        );
    });

    it('is parsing an for statement + vriable declartion correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('for(let i=0;i<10;i++){var che = (i*2);}')),
            '{"type":"Program","body":[{"type":"ForStatement","init":{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"i"},"init":{"type":"Literal","value":0,"raw":"0"}}],"kind":"let"},"test":{"type":"BinaryExpression","operator":"<","left":{"type":"Identifier","name":"i"},"right":{"type":"Literal","value":10,"raw":"10"}},"update":{"type":"UpdateExpression","operator":"++","argument":{"type":"Identifier","name":"i"},"prefix":false},"body":{"type":"BlockStatement","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"che"},"init":{"type":"BinaryExpression","operator":"*","left":{"type":"Identifier","name":"i"},"right":{"type":"Literal","value":2,"raw":"2"}}}],"kind":"var"}]}}],"sourceType":"script"}'
        );
    });


    it('is parsing an if statement + unary correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if(l>10){i = -1}')),
            '{"type":"Program","body":[{"type":"IfStatement","test":{"type":"BinaryExpression","operator":">","left":{"type":"Identifier","name":"l"},"right":{"type":"Literal","value":10,"raw":"10"}},"consequent":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"i"},"right":{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1"},"prefix":true}}}]},"alternate":null}],"sourceType":"script"}'
        );
    });
});

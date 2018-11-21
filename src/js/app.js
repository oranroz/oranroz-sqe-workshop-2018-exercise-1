import $ from 'jquery';
import {parseCode} from './code-analyzer';


let counter = 1;
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {

        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        /*  var temp = JSON.stringify(parsedCode);*/

        counter = 1;
        parser(parsedCode);
        show();
        JSON.stringify(parsedCode);
    });
});


let table = [];
//let tempName = '';

function parser(parsedCode){
    if (parsedCode.type != null) {
        let f = dictionary[parsedCode.type](parsedCode);
        return f;
    }



}

function parsProgram(code) {

    if (code.body != null)
    {
        var i;
        //table.push({ Line: counter, Type: 'function declaration', Name: 'binarySearch' ,Condition:'', Value: ''});
        for( i=0;i<code.body.length;i++){
            parser(code.body[i]);
        }
    }

}

function parsFunctionDeclaration(code) {
    if(code.id != null)
    {
        parser(code.id);
    }
    if(code.params != null)
    {
        var i;
        for( i=0;i<code.params.length;i++){
            table.push({ Line: counter, Type: code.type, Name: code.params[i].name ,Condition:'', Value: ''});
        }
        counter++;
        if(code.body != null)
        {
            parser(code.body);
        }
    }

}

function parsIdentifier(code) {
    if(code.type == 'Identifier'){
        return code.name;
    }
}

function parsBlockStatement(code) {
    if (code.body != null)
    {
        var i;
        //table.push({ Line: counter, Type: 'function declaration', Name: 'binarySearch' ,Condition:'', Value: ''});
        for( i=0;i<code.body.length;i++){
            parser(code.body[i]);
        }
    }

}

function parsVariableDeclaration(code) {

    if(code.declarations != null)
    {
        var i;
        for(i=0;i<code.declarations.length;i++){
            let name = parser(code.declarations[i].id);
            let val = code.declarations[i].init;
            table.push({ Line: counter, Type: code.type , Name:name ,Condition:'', Value: val});
        }
        counter++;
    }

}

function parsExpressionStatement(code) {
    parser(code.expression);
}

function parsWhileStatement(code) {
    let cond = parser(code.test);
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: cond, Value: ''});
    counter++;
    parser(code.body);

}

function parsAssignmentExpression(code) {
    let name = parser(code.left);
    let val = parser(code.right);
    table.push({ Line: counter, Type: code.type , Name: name ,Condition:'', Value: val});
    counter++;

}

function parsBinaryExpression(code) {
    let left = parser(code.left);
    let right = parser(code.right);
    return left +' '+code.operator + ' '+  right;

}

function parsLiteral(code) {
    return code.value;

}

function parsIfStatement(code) {
    let cond = parser(code.test);
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: cond, Value: ''});
    counter++;
    if(code.consequent != null){
        parser(code.consequent);
    }

    if(code.alternate != null)
    {
        parser(code.alternate);
    }

}

function parsReturnStatement(code) {
    let val = parser(code.argument);
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: '', Value: val});
    counter++;
}

function parsUnaryExpression(code) {
    let val = parser(code.argument);
    if(code.prefix == true)
    {
        return (code.operator + val);
    }
    else{
        return(val+code.operator);
    }
}

function parsMemberExpression(code) {
    let ob = parser(code.object);
    let pro = parser(code.property);
    return (ob + '[' + pro + ']');
}

function parsForStatement(code){
    let init = parser(code.init);
    let test = parser(code.test);
    let up = parser(code.update);
    let con = init + ';' + test + ';' + up;
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: con, Value: ''});
    counter++;
    parser(code.body);


}
function parsUpdateExpression(code) {
    let val = parser(code.argument);
    if(code.prefix == true)
    {
        return (code.operator + val);
    }
    else{
        return(val+code.operator);
    }

}

let dictionary = {
    'VariableDeclaration': parsVariableDeclaration,
    'Program' : parsProgram,
    'FunctionDeclaration': parsFunctionDeclaration,
    'BlockStatement': parsBlockStatement,
    'ExpressionStatement': parsExpressionStatement,
    'WhileStatement': parsWhileStatement,
    'AssignmentExpression': parsAssignmentExpression,
    'BinaryExpression': parsBinaryExpression,
    'Identifier': parsIdentifier,
    'Literal': parsLiteral,
    'IfStatement':parsIfStatement,
    'ReturnStatement': parsReturnStatement,
    'UnaryExpression': parsUnaryExpression,
    'MemberExpression': parsMemberExpression,
    'ForStatement': parsForStatement,
    'UpdateExpression': parsUpdateExpression


};

function show() {
    let FinalTable = document.getElementById('myTable');
    newTable(FinalTable);
    for (let i = 0; i< table.length; i++)
    {
        var row = FinalTable.insertRow(i+1);
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);
        var c3 = row.insertCell(2);
        var c4 = row.insertCell(3);
        var c5 = row.insertCell(4);
        c1.innerHTML = table[i].Line;
        c2.innerHTML = table[i].Type;
        c3.innerHTML = table[i].Name;
        c4.innerHTML = table[i].Condition;
        c5.innerHTML = table[i].Value;
    }
    table = [];
}

function newTable(table)
{
    var i;
    let length = table.rows.length;
    for(i=length-1;i>0;i--){
        table.deleteRow(i);
    }
}

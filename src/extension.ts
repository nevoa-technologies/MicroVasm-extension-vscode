import * as vscode from 'vscode';


enum InstructionParameter {
    Register,
    Value,
    Reference,
    Type,
    Number,
    Comparsion,
    ExternalFunction,
    String
}

class Instruction {
    name: string;
    description: string;
    parameters: InstructionParameter[];

    constructor(name: string, description: string, parameters: InstructionParameter[]) {
        this.name = name;
        this.description = description;
        this.parameters = parameters;
    }
}


const completionRegisters: vscode.CompletionItem[] = [
    { label: 'R0', kind: vscode.CompletionItemKind.Property, detail: 'General purpose register.' },
    { label: 'R1', kind: vscode.CompletionItemKind.Property, detail: 'General purpose register.' },
    { label: 'R2', kind: vscode.CompletionItemKind.Property, detail: 'General purpose register.' },
    { label: 'R3', kind: vscode.CompletionItemKind.Property, detail: 'General purpose register.' },
    { label: 'R4', kind: vscode.CompletionItemKind.Property, detail: 'General purpose register.' },
    { label: 'RR', kind: vscode.CompletionItemKind.Property, detail: 'Register to receive the returned value of external functions.' },
];

const completionTypes: vscode.CompletionItem[] = [
    { label: 'INT8', kind: vscode.CompletionItemKind.Enum, detail: 'Integer signed number of 1 byte.' },
    { label: 'INT16', kind: vscode.CompletionItemKind.Enum, detail: 'Integer signed number of 2 bytes.' },
    { label: 'INT32', kind: vscode.CompletionItemKind.Enum, detail: 'Integer signed number of 4 bytes.' },
    { label: 'INT64', kind: vscode.CompletionItemKind.Enum, detail: 'Integer signed number of 8 byte.' },
    { label: 'UINT8', kind: vscode.CompletionItemKind.Enum, detail: 'Integer unsigned number of 1 byte.' },
    { label: 'UINT16', kind: vscode.CompletionItemKind.Enum, detail: 'Integer unsigned number of 2 bytes.' },
    { label: 'UINT32', kind: vscode.CompletionItemKind.Enum, detail: 'Integer unsigned number of 4 bytes.' },
    { label: 'UINT64', kind: vscode.CompletionItemKind.Enum, detail: 'Integer unsigned number of 8 bytes.' },
    { label: 'FLOAT32', kind: vscode.CompletionItemKind.Enum, detail: 'Floating point number of 4 bytes.' },
    { label: 'FLOAT64', kind: vscode.CompletionItemKind.Enum, detail: 'Double precision floating point number of 8 bytes.' },
];

const completionComparsions: vscode.CompletionItem[] = [
    { label: 'EQUAL', kind: vscode.CompletionItemKind.Operator, detail: '' },
    { label: 'NOT_EQUAL', kind: vscode.CompletionItemKind.Operator, detail: '' },
    { label: 'GREATER', kind: vscode.CompletionItemKind.Operator, detail: '' },
    { label: 'LESS', kind: vscode.CompletionItemKind.Operator, detail: '' },
    { label: 'GREATER_OR_EQUAL', kind: vscode.CompletionItemKind.Operator, detail: '' },
    { label: 'LESS_OR_EQUAL', kind: vscode.CompletionItemKind.Operator, detail: '' },
];


var typesSet = new Set<string>();
completionTypes.forEach(t => {
    typesSet.add(t.label.toString());
});

var registersSet = new Set<string>();
completionRegisters.forEach(r => {
    registersSet.add(r.label.toString());
});

var comparsionsSet = new Set<string>();
completionComparsions.forEach(c => {
    comparsionsSet.add(c.label.toString());
});

const instructions: Instruction[] = [
    new Instruction('FUNCTION', 'Declares a function that will be linked into the VM.', [InstructionParameter.String]),
    new Instruction('EOP', 'Finishes the program.', []),
    new Instruction('DEF', 'Defines an address in the memory stack.', [InstructionParameter.Type, InstructionParameter.String, InstructionParameter.Value]),
    new Instruction('LDR', 'Load bytes from the stack into a register.', [InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('STR', 'Set bytes of the stack from a register.', [InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('LDS', 'Load bytes from the stack into a register.', [InstructionParameter.Register, InstructionParameter.Number, InstructionParameter.Type]),
    new Instruction('STS', 'Set bytes of the stack from a register.', [InstructionParameter.Register, InstructionParameter.Number, InstructionParameter.Type]),
    new Instruction('LDI', 'Load an immediate constant value into a register.', [InstructionParameter.Register, InstructionParameter.Type, InstructionParameter.Value]),
    new Instruction('MOV', 'Copies the value from a register into another.', [InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('NEG', 'Negates a register.', [InstructionParameter.Register]),
    new Instruction('INVOKE', 'Call a linked external function.', [InstructionParameter.ExternalFunction]),
    new Instruction('ADD', 'Adds 2 registers.', [InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('SUB', 'Subtracts 2 registers.', [InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('MUL', 'Multiplies 2 registers.', [InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('DIV', 'Divides 2 registers.', [InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('SCOPE', 'Creates a new scope.', [InstructionParameter.String]),
    new Instruction('END', 'Ends the previous scope.', []),
    new Instruction('REFERENCE', 'Creates a reference that can be used by JMPs and CALLs.', [InstructionParameter.String]),
    new Instruction('CMP', 'Compares 2 registers.', [InstructionParameter.Comparsion, InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('JMP', 'Jumps to a location if the value of the given register is not 0.', [InstructionParameter.Register, InstructionParameter.Reference]),
    new Instruction('CALL', 'Jumps to a location. Creating and ending a scope will make it return to where it was called.', [InstructionParameter.Reference]),
    new Instruction('AND', 'Logical And. Performs a bitwise AND on 2 registers.', [InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('ORR', 'Logical Or. Performs a bitwise OR on 2 registers.', [InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('NOT', 'Logical Not. Performs a bitwise NOT on 2 registers.', [InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('LSL', 'Logical Shift Left. Performs a bitwise shift left on 2 registers.', [InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('LSR', 'Logical Shift Right. Performs a bitwise shift right on 2 registers.', [InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register]),
    new Instruction('XOR', 'Logical Exclusive Or. Performs a bitwise XOR on 2 registers.', [InstructionParameter.Register, InstructionParameter.Register, InstructionParameter.Register])
];

var instructionsMap = new Map<string, Instruction>();

var completionInstructions: vscode.CompletionItem[] = [];

instructions.forEach(i => {
    completionInstructions.push({ label: i.name, kind: vscode.CompletionItemKind.Function, detail: i.description });
    instructionsMap.set(i.name, i);
});


var keywords = new Map<string, string>();

completionRegisters.forEach(c => {
    keywords.set(c.label.toString(), c.detail!!.toString());
});

completionTypes.forEach(t => {
    keywords.set(t.label.toString(), t.detail!!.toString());
});


completionInstructions.forEach(c => {
    keywords.set(c.label.toString(), c.detail!!.toString());
});

var diagnosticCollection: vscode.DiagnosticCollection;
var externalFunctions = new Map<string, any>();
var references = new Map<string, any>();
var varDefinitions = new Map<string, any>();
var completionVars: vscode.CompletionItem[] = new Array();


function checkErrors() {
    const document = vscode.window.activeTextEditor!!.document;
    const text = document.getText();
    const lines = text?.split(new RegExp('\\r?\\n|\\r'));

    if (!document.fileName.endsWith(".vasm"))
        return;

    var lineIndex = -1;

    diagnosticCollection.clear();
    externalFunctions.clear();
    references.clear();
    varDefinitions.clear();
    completionVars = [];

    var referencesBeingCalled: any[] = [];

    var scopeLines: number[] = [0];
    var currentScope = 0;

    lines?.forEach(line => {
        lineIndex++;
        var argStart = -1;
        var argEnd = -1;
        var args = [];

        for (var i = 0; i < line.length; i++) {

            if (line.charAt(i) == ';')
                break;

            if ((line.charAt(i) == ' ' || line.charAt(i) == '\t')) {
                if (argStart != -1) {

                    argEnd = i;
                    args.push({ value: line.substring(argStart, argEnd), start: argStart, end: argEnd });
                    argStart = -1;

                    while (line.charAt(i) == ' ' || line.charAt(i) == '\t') {
                        i++;
                    }

                    i--;
                }
            }
            else if (argStart == -1) {
                argStart = i;
                argEnd = -1;
            }
        }

        if (argEnd == -1) {
            var lastArg = line.substring(argStart, i);

            if (lastArg.trim() != "")
                args.push({ value: lastArg, start: argStart, end: i });
        }

        if (args.length > 0) {
            const instruction = instructionsMap.get(args[0].value);

            if (instruction == null) {
                setError(document, "Error. Invalid instruction.", new vscode.Position(lineIndex, args[0].start), new vscode.Position(lineIndex, args[args.length - 1].end));
            }
            else {

                if (instruction.parameters.length > args.length - 1) {
                    setError(document, "Error. Missing parameters.", new vscode.Position(lineIndex, args[0].start), new vscode.Position(lineIndex, args[args.length - 1].end));
                    return;
                }

                if (instruction.name == 'FUNCTION') {
                    externalFunctions.set(args[1].value, { position: new vscode.Position(lineIndex, args[0].start) });
                } else if (instruction.name == 'SCOPE') {

                    if (scopeLines.length > 1)
                    {
                        setError(document, "Error. Cannot create a scope inside a scope.", new vscode.Position(lineIndex, args[0].start), new vscode.Position(lineIndex, args[args.length - 1].end));
                        return;
                    }

                    var data: any[] = [];

                    if (references.has(args[1].value))
                        data = references.get(args[1].value);

                    var reference = references.get(args[1].value) as any[];
                    var found = false;
                    if (reference != null) {
                        reference.forEach(v => {
                            if (scopeLines.includes((v.scope))) {
                                found = true;
                                return;
                            }
                        });
                    }

                    if (found)
                        setError(document, "Error. Reference already exists.", new vscode.Position(lineIndex, args[1].start), new vscode.Position(lineIndex, args[1].end));
                    else {
                        data.push({ position: new vscode.Position(lineIndex, args[0].start), scope: currentScope, kind: vscode.CompletionItemKind.Function });
                        references.set(args[1].value, data);
                    }

                    currentScope = lineIndex;
                    scopeLines.push(currentScope);
                } else if (instruction.name == 'REFERENCE') {

                    var data: any[] = [];

                    if (references.has(args[1].value))
                        data = references.get(args[1].value);

                    var reference = references.get(args[1].value) as any[];
                    var found = false;
                    if (reference != null) {
                        reference.forEach(v => {
                            if (scopeLines.includes((v.scope))) {
                                found = true;
                                return;
                            }
                        });
                    }

                    if (found)
                        setError(document, "Error. Reference already exists.", new vscode.Position(lineIndex, args[1].start), new vscode.Position(lineIndex, args[1].end));
                    else {
                        data.push({ position: new vscode.Position(lineIndex, args[0].start), scope: currentScope, kind: vscode.CompletionItemKind.Reference });
                        references.set(args[1].value, data);
                    }
                } else if (instruction.name == 'INVOKE') {
                    if (!externalFunctions.has(args[1].value)) {
                        setError(document, "Error. Undefined function.", new vscode.Position(lineIndex, args[1].start), new vscode.Position(lineIndex, args[1].end));
                    }
                } else if (instruction.name == 'DEF') {
                    var data: any[] = [];
                    if (varDefinitions.has(args[2].value))
                        data = varDefinitions.get(args[2].value);

                    var varDefinition = varDefinitions.get(args[2].value) as any[];
                    var found = false;
                    if (varDefinition != null) {
                        varDefinition.forEach(v => {
                            if (scopeLines.includes((v.scope))) {
                                found = true;
                                return;
                            }
                        });
                    }

                    if (found) {
                        setError(document, "Error. There is already a definition called '" + args[2].value + "' in this scope.", new vscode.Position(lineIndex, args[2].start), new vscode.Position(lineIndex, args[2].end));
                    } else {
                        data.push({ position: new vscode.Position(lineIndex, args[0].start), scope: currentScope });
                        varDefinitions.set(args[2].value, data);
                    }
                }
                else if (instruction.name == 'CALL') {
                    referencesBeingCalled.push({ name: args[1].value, line: lineIndex, start: args[1].start, end: args[1].end, scopes: [...scopeLines] });
                } else if (instruction.name == 'JMP') {
                    referencesBeingCalled.push({ name: args[2].value, line: lineIndex, start: args[2].start, end: args[2].end, scopes: [...scopeLines] });
                }
                else if (instruction.name == 'END') {
                    if (scopeLines.length <= 1)
                    {
                        setError(document, "Error. There is no scope to end.", new vscode.Position(lineIndex, args[0].start), new vscode.Position(lineIndex, args[0].end));
                    }

                    scopeLines.pop();
                    currentScope = scopeLines[scopeLines.length - 1];
                }


                for (var i = 1; i < args.length; i++) {
                    if (i - 1 < instruction.parameters.length) {
                        switch (instruction.parameters[i - 1]) {
                            case InstructionParameter.Register:
                                if (!registersSet.has(args[i].value))
                                    setError(document, "Error. Invalid parameter. It should be a register.", new vscode.Position(lineIndex, args[i].start), new vscode.Position(lineIndex, args[i].end));
                                break;
                            case InstructionParameter.Type:
                                var value = args[i].value;

                                if (Number.isNaN(parseInt(value, 10)) && Number.isNaN(parseInt(value, 2)) && Number.isNaN(parseInt(value, 8)) && Number.isNaN(parseInt(value, 16)))
                                    if (!typesSet.has(args[i].value))
                                        setError(document, "Error. Invalid parameter. It should be a type.", new vscode.Position(lineIndex, args[i].start), new vscode.Position(lineIndex, args[i].end));
                                break;
                            case InstructionParameter.Comparsion:
                                if (!comparsionsSet.has(args[i].value))
                                    setError(document, "Error. Invalid parameter. It should be a comparsion.", new vscode.Position(lineIndex, args[i].start), new vscode.Position(lineIndex, args[i].end));
                                break;
                            case InstructionParameter.Number:
                                var value = args[i].value;

                                var varDefinition = varDefinitions.get(value) as any[];
                                var found = false;
                                if (varDefinition != null) {
                                    varDefinition.forEach(v => {
                                        if (scopeLines.includes((v.scope))) {
                                            found = true;
                                            return;
                                        }
                                    });
                                }

                                if (found)
                                    break;

                                if (Number.isNaN(parseInt(value, 10)) && Number.isNaN(parseInt(value, 2)) && Number.isNaN(parseInt(value, 8)) && Number.isNaN(parseInt(value, 16)))
                                    setError(document, "Error. Invalid parameter. It should be a number.", new vscode.Position(lineIndex, args[i].start), new vscode.Position(lineIndex, args[i].end));
                                break;
                            case InstructionParameter.Value:
                                var value = args[i].value;

                                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\'')))
                                    break;

                                if (Number.isNaN(parseInt(value, 10)) && Number.isNaN(parseInt(value, 2)) && Number.isNaN(parseInt(value, 8)) && Number.isNaN(parseInt(value, 16)))
                                    setError(document, "Error. Invalid parameter. It should be a number or a string.", new vscode.Position(lineIndex, args[i].start), new vscode.Position(lineIndex, args[i].end));
                                break;
                            case InstructionParameter.String:

                                var format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

                                if (format.test(args[i].value))
                                    setError(document, "Error. Invalid string. It should not contain special characters.", new vscode.Position(lineIndex, args[i].start), new vscode.Position(lineIndex, args[i].end));

                                break;
                        }
                    }
                    else {
                        setError(document, "Error. This instruction has more parameters than it should.", new vscode.Position(lineIndex, args[i].start), new vscode.Position(lineIndex, args[i].end));
                    }
                }
            }
        }
    });

    referencesBeingCalled.forEach(r => {

        var hasReference = false;

        if (references.has(r.name)) {
            (references.get(r.name) as any[]).forEach(rr => {
                if ((r.scopes as number[]).includes(rr.scope)) {
                    hasReference = true;
                    return;
                }
            });
        }

        if (!hasReference)
            setError(document, "Error. Undefined scope.", new vscode.Position(r.line, r.start), new vscode.Position(r.line, r.end));
    })

    varDefinitions.forEach((value, key) => {
        completionVars.push({ label: key, kind: vscode.CompletionItemKind.Variable, detail: '' });
    });
}


function setError(document: vscode.TextDocument, msg: string, start: vscode.Position, end: vscode.Position) {

    var diagnostics = diagnosticCollection.get(document.uri);

    if (diagnostics != null) {
        diagnosticCollection.set(document.uri, diagnostics.concat([new vscode.Diagnostic(new vscode.Range(start, end), msg, vscode.DiagnosticSeverity.Error)]));
    }
    else {
        diagnosticCollection.set(document.uri, [new vscode.Diagnostic(new vscode.Range(start, end), msg, vscode.DiagnosticSeverity.Error)]);
    }
}


export function activate(context: vscode.ExtensionContext) {

    diagnosticCollection = vscode.languages.createDiagnosticCollection('microvasm');

    checkErrors();

    vscode.languages.registerHoverProvider('microvasm', {
        provideHover(document, position, token) {
            if (!document.fileName.endsWith(".vasm"))
            return;

            const line = document.lineAt(position.line).text;
            

            if (line.charAt(position.character) == ' ')
                return null;

            var startWord = 0;
            var endWord = 0;

            for (var i = position.character; i <= line.length && endWord == 0; i++) {
                if (i >= line.length || line.charAt(i) == ' ')
                    endWord = i;
            }

            for (var i = position.character; i >= 0 && startWord == 0; i--) {
                if (line.charAt(i) == ' ')
                    startWord = i + 1;
            }

            const word = line.substring(startWord, endWord);
            var name = word;

            var result = new vscode.MarkdownString();

            if (instructionsMap.has(name)) {
                var instruction = instructionsMap.get(name);

                if (instruction!!.parameters.length > 0)
                    name += ": ";

                instruction?.parameters.forEach(p => {
                    switch (p) {
                        case InstructionParameter.Register:
                            name += "{REGISTER} ";
                            break;
                        case InstructionParameter.Number:
                            name += "{NUMBER} ";
                            break;
                        case InstructionParameter.Comparsion:
                            name += "{COMPARSION} ";
                            break;
                        case InstructionParameter.Value:
                            name += "{VALUE} ";
                            break;
                        case InstructionParameter.Type:
                            name += "{TYPE} ";
                            break;
                        case InstructionParameter.String:
                            name += "{NAME} ";
                            break;
                        case InstructionParameter.ExternalFunction:
                            name += "{EXTERNAL FUNCTION} ";
                            break;
                        case InstructionParameter.Reference:
                            name += "{REFERENCE} ";
                            break;
                    }
                });
            }

            result.appendCodeblock(name);
            result.appendMarkdown("---\n");

            if (keywords.has(word))
                result.appendText(keywords.get(word)!!);

            return new vscode.Hover(result);
        }
    });

    vscode.languages.registerDefinitionProvider('microvasm', {
        provideDefinition(document, position, token) {
            if (!document.fileName.endsWith(".vasm"))
                return;

            var argStart = -1;
            var argEnd = -1;
            var args = [];
            var line = document.lineAt(position).text;
            var argHover = 0;

            for (var i = 0; i < line.length; i++) {

                if (position.character == i)
                    argHover = args.length;

                if (line.charAt(i) == ';')
                    break;

                if ((line.charAt(i) == ' ' || line.charAt(i) == '\t')) {
                    if (argStart != -1) {

                        argEnd = i;
                        args.push({ value: line.substring(argStart, argEnd), start: argStart, end: argEnd });
                        argStart = -1;

                        while (line.charAt(i) == ' ' || line.charAt(i) == '\t') {
                            i++;
                        }

                        i--;
                    }
                }
                else if (argStart == -1) {
                    argStart = i;
                    argEnd = -1;
                }
            }

            if (argEnd == -1) {
                var lastArg = line.substring(argStart, i);

                if (lastArg.trim() != "")
                    args.push({ value: lastArg, start: argStart, end: i });
            }

            if (args.length >= 2) {
                if (args[0].value == 'CALL') {
                    if (references.has(args[1].value)){
                        var ref = getReference(getAvailableScopes(document, position.line), args[1].value);

                        if (ref == null)
                            return;

                        return new vscode.Location(document.uri, ref.position);
                    }
                } else if (args[0].value == 'INVOKE') {
                    if (externalFunctions.has(args[1].value))
                        return new vscode.Location(document.uri, externalFunctions.get(args[1].value).position);
                } else if (args[0].value == 'JMP') {
                    if (args.length >= 3 && references.has(args[2].value)) {
                        var ref = getReference(getAvailableScopes(document, position.line), args[2].value);
                       
                        if (ref == null)
                        return;

                        return new vscode.Location(document.uri, ref.position);
                    }
                }
            }

            var def = getDefinition(getAvailableScopes(document, position.line), args[argHover].value);
            
            if (def == null)
                return;

            return new vscode.Location(document.uri, def.position);;
        }
    })

    vscode.workspace.onDidChangeTextDocument(function (e) {
        checkErrors();
    });

    vscode.languages.registerCompletionItemProvider('microvasm', {
        provideCompletionItems(document, position, token, context) {

            if (!document.fileName.endsWith(".vasm"))
            return;

            const line = document.lineAt(position.line).text;
            var argIndex = 0;
            var instructionStart = -1;
            var instructionEnd = -1;

            for (var i = 0; i < position.character; i++) {
                if ((line.charAt(i) == ' ' || line.charAt(i) == '\t')) {
                    if (instructionStart != -1) {
                        argIndex++;

                        if (instructionEnd == -1)
                            instructionEnd = i;

                        while (line.charAt(i) == ' ' || line.charAt(i) == '\t') {
                            i++;
                        }
                    }
                }
                else if (instructionStart == -1) {
                    instructionStart = i;
                }
            }

            if (instructionEnd == -1)
                instructionEnd = line.length;

            const instruction = line.substring(instructionStart, instructionEnd);

            if (argIndex == 0)
                return new vscode.CompletionList(completionInstructions);
            else {
                if (instructionsMap.has(instruction)) {
                    var inst = instructionsMap.get(instruction)!!;

                    if (argIndex - 1 < inst.parameters.length) {
                        switch (inst.parameters[argIndex - 1]) {
                            case InstructionParameter.Register:
                                return new vscode.CompletionList(completionRegisters);
                            case InstructionParameter.Type:
                                return new vscode.CompletionList(getCompletionVariables(document, position.line).concat(completionTypes));
                            case InstructionParameter.Comparsion:
                                return new vscode.CompletionList(completionComparsions);
                            case InstructionParameter.ExternalFunction:
                                var list: vscode.CompletionItem[] = [];
                                externalFunctions.forEach((value, key) => {
                                    list.push({ label: key, kind: vscode.CompletionItemKind.Module, detail: '' });
                                });
                                return new vscode.CompletionList(list);
                            case InstructionParameter.Reference:
                                return new vscode.CompletionList(getCompletionReferences(document, position.line));
                        }
                    }
                }
            }

            return null;
        }
    });
}



function getAvailableScopes(document: vscode.TextDocument, line: number): number[] {
    var scopes: number[] = [0];

    for (var i = 0; i < line; i++) {
        const text = document.lineAt(i).text.trim();

        if (text.startsWith('SCOPE')) {
            scopes.push(i);
        } else if (text.startsWith('END')) {
            scopes.pop();
        }
    }

    return scopes;
}


function getDefinition(scopes: number[], name: string): any {

    var value = varDefinitions.get(name);

    if (value == null)
        return null;

        var result = null;

    (value as any[]).forEach(uniqueDef => {
        if (scopes.includes(uniqueDef.scope)) {
            result = uniqueDef;
            return;
        }
    });

    return result;
}


function getCompletionVariables(document: vscode.TextDocument, line: number): vscode.CompletionItem[] {

    var scopes = getAvailableScopes(document, line);

    var result: vscode.CompletionItem[] = [];

    varDefinitions.forEach((value, key) => {
        (value as any[]).forEach(uniqueVar => {
            if (scopes.includes(uniqueVar.scope))
                completionVars.forEach(v => {
                    if (v.label == key)
                        result.push(v);
                });
        });

    })

    return result;
}


function getReference(scopes: number[], name: string): any {

    var value = references.get(name);

    if (value == null)
        return null;

        var result = null;

    (value as any[]).forEach(uniqueRef => {
        if (scopes.includes(uniqueRef.scope)) {
            result = uniqueRef;
            return;
        }
    });

    return result;
}


function getCompletionReferences(document: vscode.TextDocument, line: number): vscode.CompletionItem[] {

    var scopes = getAvailableScopes(document, line);

    var result: vscode.CompletionItem[] = [];

    references.forEach((value, key) => {
        (value as any[]).forEach(uniqueRef => {
            if (scopes.includes(uniqueRef.scope))
                result.push({ label: key, kind: uniqueRef.kind, detail: '' });
        });
    });

    return result;
}
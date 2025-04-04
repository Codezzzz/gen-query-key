import fg from 'fast-glob';
import path from 'path';
import ts from 'typescript';

interface Config {
    path: string;
    output: string;
}

class Programmer {
    private config: Required<Config>;
    private compilerOptions: Omit<ts.CompilerOptions, 'target'> & { target: ts.ScriptTarget };

    constructor(config: Required<Config>) {
        this.config = config;
        this.compilerOptions = {
            target: ts.ScriptTarget.ES2015
        };
    }

    // Getter로 createProgram 정의
    get create() {
        return async () => {
            const files = await fg(this.config.path, {
                onlyFiles: true
            });

            const program = ts.createProgram({
                rootNames: files,
                options: this.compilerOptions
            });

            return {
                program,
                checker: program.getTypeChecker()
            };
        };
    }

    // getCompilerOptions = () => {
    //     const { options: compilerOptions } = ts.parseJsonConfigFileContent(
    //         ts.readConfigFile('tsconfig.node.json', ts.sys.readFile).config,
    //         {
    //             fileExists: ts.sys.fileExists,
    //             readFile: ts.sys.readFile,
    //             readDirectory: ts.sys.readDirectory,
    //             useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames
    //         },
    //         path.dirname('.')
    //     );

    //     return compilerOptions;
    // };

    findFiles = async (program: ts.Program) => {
        const config = this.config;
        const sourceFiles = program.getSourceFiles().filter(item => {
            return !item.isDeclarationFile;
        });

        const outputFile = ts.createSourceFile(config.output, '', this.compilerOptions.target);
        // outputFiles 제외
        const projectFiles = sourceFiles.filter(item => {
            const relativePath = path.relative(process.cwd(), item.fileName);
            const outputPath = path.relative(process.cwd(), config.output);
            return !relativePath.includes(outputPath);
        });

        return {
            outputFile,
            projectFiles
        };
    };
}

export { Programmer };

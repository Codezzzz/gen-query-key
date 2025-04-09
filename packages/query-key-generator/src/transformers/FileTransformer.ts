import fs from 'fs';
import ts from 'typescript';

namespace FileTransformer {
    export const transform = async (props: {
        sourceFile: ts.SourceFile;
        printer: ts.Printer;
        statements: ts.Statement[];
    }) => {
        const { sourceFile, printer, statements } = props;

        const outputFile = sourceFile.fileName;

        const transformer: ts.TransformerFactory<ts.SourceFile> = () => {
            return rootNode => {
                return ts.factory.updateSourceFile(rootNode, [...statements]);
            };
        };

        // 변환 적용
        const result = ts.transform(sourceFile, [transformer]);

        for (const file of result.transformed) {
            const transformedSourceFile = file;

            // 메모리 해제
            result.dispose();

            // 코드 변환
            const content: string = printer.printFile(transformedSourceFile);

            // 파일 쓰기
            fs.writeFileSync(outputFile, content, 'utf-8');
        }
    };
}

export { FileTransformer };

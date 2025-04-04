import ts from 'typescript';

namespace ExportSpecifierFactory {
    const factory = ts.factory;

    const exportDeclaration = (exportSpecifier: ts.NamedExportBindings) => {
        return factory.createExportDeclaration(
            undefined,
            false,
            exportSpecifier,
            undefined,
            undefined
        );
    };

    export const named = (name: string) => {
        return exportDeclaration(
            factory.createNamedExports([
                factory.createExportSpecifier(false, undefined, factory.createIdentifier(name))
            ])
        );
    };
}

export { ExportSpecifierFactory };

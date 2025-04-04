import fs from 'fs';
import ts from 'typescript';

import { QueryKeyUsedFinder } from '../queryFinder/QueryKeyUsedFinder';
import { prettify } from '../utils';
import { GenericRunner } from '@query-key-gen/generator-common';
import path from 'path';
import { ConfigOptions } from '../types/config';

/**
 * Function used in the query key generator to find file information
 * and write it to the query-key-used-info.ts file
 */
class QueryKeyUsedInfoGenerator extends GenericRunner<ConfigOptions> {
    protected override process = async () => {
        const { program } = await this.programmer.create();
        const { projectFiles } = await this.programmer.findFiles(program);
        const queryKeyUsedInfo = QueryKeyUsedFinder.find(
            projectFiles,
            this.config.globalQueryKeyName
        );
        const result = this.makeQueryKeyUsedInfo(queryKeyUsedInfo);
        this.writeInfo(result);
        prettify(this.config.output);
    };

    makeQueryKeyUsedInfo = (queryKeyUsedInfo: QueryKeyUsedFinder.QueryKeyUsedFinderReturnType) => {
        const result = queryKeyUsedInfo.map(item => {
            const { declaration, sourceFile, parent } = item;

            const declarationName = (function () {
                if (!declaration) {
                    return;
                }

                if (ts.isVariableDeclaration(declaration)) {
                    return declaration.name.getText();
                }

                if (ts.isFunctionDeclaration(declaration)) {
                    return declaration.name?.getText();
                }

                return;
            })();

            const fileName = path.relative(process.cwd(), sourceFile.fileName).replace('src/', '');

            return {
                sourceFile: {
                    name: fileName
                },

                ['query-key']: {
                    name: parent?.getText(),
                    pos: parent?.pos,
                    end: parent?.end
                },
                func: {
                    name: declarationName,
                    pos: declaration?.pos ?? 0,
                    end: declaration?.end ?? 0
                }
            };
        });

        return result;
    };

    writeType = () => {
        return `
          interface QueryKeyUsedInfo {
                sourceFile: {
                    name: string;
                    
                };
                ["query-key"]: {
                    name: string;
                    pos: number;
                    end: number;
                };
                func: {
                    name: string;
                    pos: number;
                    end: number;
                };
            }
        `;
    };

    writeInfo = (result: object) => {
        const content = `
            ${this.writeType()}
            export const queryKeyUsedInfo : QueryKeyUsedInfo[] = ${JSON.stringify(result)};
            `;

        fs.writeFileSync(this.config.output, content);
    };
}

export { QueryKeyUsedInfoGenerator };

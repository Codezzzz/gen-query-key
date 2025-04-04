
            
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
        
            export const queryKeyUsedInfo : QueryKeyUsedInfo[] = [];
            
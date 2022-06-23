declare const useDoubleClick: (doubleClick?: (e: any, record: any) => void, click?: (e: any, record: any) => void, options?: {
    timeout: number;
}) => (event: any, rest: any) => void;
export default useDoubleClick;

export type DataPoint = string | number | undefined

export interface DataNode { [key: string]: DataNode | DataPoint }

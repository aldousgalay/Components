export interface MapOptions {
  coord: {
    lon: number,
    lat: number
  },
  text?: string,
  token: string,
  annotations?: Annotation[],
}
  
export interface Annotation {
  coord: {
    lon: number,
    lat: number
  },
  text?: string,
  options?: any
}

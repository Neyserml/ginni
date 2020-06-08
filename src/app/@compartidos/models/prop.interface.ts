export interface IProp {
  clave: string;
  valor: any;
}

export class ArrayProp {
  getArray: () => IProp[];
  unir: (arrayProp: ArrayProp) => IProp[];
  getValor: (clave: string) => any;
  push: (IProp) => any;
  filter: (IProp) => any;
  concat: (IProp) => any;
  reduce: (IProp) => any;
  map: (IProp) => any;
  pop: (IProp) => any;

  getClave: (valor: any) => string;

  static create(arr: IProp[]) {
    const arrayProp = new ArrayProp();
    arrayProp.push.apply(arrayProp, arr);
    return arrayProp;
  }
}

ArrayProp.prototype = Object.create(Array.prototype);

ArrayProp.prototype.getClave = function(valor: any): string {
  return this.filter(prop => prop.valor === valor).map(prop => prop.clave)[0];
};

ArrayProp.prototype.getArray = function(): IProp[] {
  return [].slice.apply(this);
};

ArrayProp.prototype.getValor = function(clave: string): any {
  return this.filter(prop => prop.clave === clave).map(prop => prop.valor)[0];
};

ArrayProp.prototype.unir = function(arrayProp: ArrayProp): IProp[] {
  return this.getArray().concat([].slice.apply(arrayProp));
};

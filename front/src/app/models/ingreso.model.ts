type NewType = string;

export class Ingreso {

    constructor(
        public IdPersona: NewType,
//        public Fecha: string,
        // public Monto: number,
        // public Monto: number,
        public IdPlan?: number,
        public Cantidad?: number,
        public Detalle?: string
    ) { }

}

export class Plan {

    constructor(
        // tslint:disable-next-line: no-shadowed-variable
        public Plan: string,
        public Precio: number,
        public CantClases?: number,
        public Descripcion?: string,
        public IdPlan?: string,
        public EstadoPlan?: string
    ) { }

}

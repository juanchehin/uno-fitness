export class Medicion {

    constructor(
        public Altura: string,
        public Peso: string,
        public IMC: string,
        public Musc: string,
        public Grasa: string,
        public GV: string,
        public IdProfesional: number,
        public IdCliente?: number,
        public Fecha?: string,
        public IdMedicion?: number,
        public EstadoMed?: string
    ) { }

}

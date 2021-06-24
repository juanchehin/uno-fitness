// Modelo del cliente: Posee los atributos de la persona + los atributos del cliente
export class Cliente {

    constructor(
        // public EstadoCli: string,
        public Correo: string,
        public Password: string,
        public IdTipoDocumento?: number,
        public Apellidos?: string,
        public Nombres?: string,
        public Documento?: number,
        public Telefono?: string,
        public Sexo?: number,
        public FechaNac?: string,
        public Observaciones?: string,
        public Usuario?: string,
        public Calle?: string,
        public Piso?: string,
        public Departamento?: string,
        public Ciudad?: string,
        public Pais?: string,
        public Numero?: number,
        public Objetivo?: string,
        public ClasesDisponibles?: number,    // Creo que se calcula
        public Ocupacion?: string,
        public Horario?: string,
        public IdPersona?: number
        // public IdRol?: number,
        // public EstadoPer?: string,
    ) { }

}

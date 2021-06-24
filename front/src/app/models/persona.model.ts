export class Persona {

    constructor(
        public Correo: string,
        public Password: string,
        public IdPersona?: number,
        public IdTipoDocumento?: number,
        public IdRol?: number,
        public Apellidos?: string,
        public Nombres?: string,
        public Documento?: string,
        public Telefono?: string,
        public Sexo?: number,
        public Observaciones?: string,
        public Foto?: string,
        public EstadoPer?: string,
        public FechaNac?: string,
        public Usuario?: string,
        public Calle?: string,
        public Numero?: number,
        public Piso?: string,
        public Departamento?: string,
        public Ciudad?: string,
        public Pais?: string,
        public FechaInicio?: string
    ) { }

}

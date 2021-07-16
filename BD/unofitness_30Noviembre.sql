-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2020 at 01:56 PM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `unofitness`
--
CREATE DATABASE IF NOT EXISTS `unofitness` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `unofitness`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `bsp_activar_cliente`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_activar_cliente` (`pIdPersona` SMALLINT)  SALIR:BEGIN
	/*
    Cambia el estado de un cliente a 'A' dado un IdPersona
    SP usado para cuando el cliente existia en la BD pero estaba dado de baja
    Devuelve OK o el mensaje de error en Mensaje.
    */

    
DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;

    -- Controla que el Documento sea obligatorio
	IF pIdPersona = '' OR pIdPersona IS NULL THEN
		SELECT 'Debe proveer un pIdPersona' AS Mensaje, NULL AS Id;
		LEAVE SALIR;
    END IF;
-- Controla que no exista un documento con el mismo numero que este activo
	IF NOT EXISTS (SELECT IdPersona FROM clientes WHERE IdPersona = pIdPersona) THEN
			SELECT 'Cliente inexistente' AS Mensaje;
			LEAVE SALIR;
    END IF;

-- Da de baja
	UPDATE personas set EstadoPer = 'A' WHERE IdPersona = pIdPersona;
    UPDATE clientes set EstadoCli = 'B' WHERE IdPersona = pIdPersona;
    
    SELECT 'Ok' AS Mensaje;
END$$

DROP PROCEDURE IF EXISTS `bsp_actualiza_estado_cliente`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_actualiza_estado_cliente` (`pIdPersona` SMALLINT)  SALIR:BEGIN
	/*
	Procedimiento que se ejecuta cada vez que accede un cliente 
    para verificar su estado
    */
    DECLARE pClasesDisponibles,pIdPlan,pCantidadMeses smallint;
    DECLARE pUltimoPago date;
    
	SET pIdPlan = (SELECT IdPlan FROM clientes WHERE IdPersona = pIdPersona);
	SET pClasesDisponibles = (SELECT CantClases FROM planes WHERE IdPlan = pIdPlan);

-- Controlo que el cliente exista
    IF NOT EXISTS(SELECT IdPersona FROM Clientes WHERE IdPersona = pIdPersona ) THEN
		SELECT 'El cliente no existe!' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controlo que el cliente no este dado de baja
    IF (SELECT EstadoCli FROM Clientes WHERE IdPersona = pIdPersona ) = 'B' THEN
		SELECT 'El cliente esta dado de baja' AS Mensaje;
		LEAVE SALIR;
    END IF;

-- Obtengo la ultima fecha en la cual pago (Empezo a asistir) a su plan
    SET pUltimoPago = (SELECT MAX(Fecha) 
						FROM transacciones t
						JOIN clientes c on t.IdPlanAbonado = c.IdPlan
                        WHERE t.IdPersona = pIdPersona AND t.IdPlanAbonado = pIdPlan);
                        
-- Obtengo la cantidad de meses que abono la ultima vez
    /*SET pCantidadMeses = (SELECT Cantidad 
						FROM transacciones t
						JOIN clientes c on t.IdPlanAbonado = c.IdPlan
                        WHERE c.IdPersona = pIdPersona AND c.IdPlan = pIdPlan
                        HAVING MAX(t.IdTransaccion));*/
	SET pCantidadMeses = (SELECT Cantidad 
						FROM transacciones t
						JOIN clientes c on t.IdPersona = c.IdPersona
                        WHERE c.IdPersona = pIdPersona AND c.IdPlan = pIdPlan
                        HAVING MAX(t.IdTransaccion));
                        
-- Si la cantidad de meses que pago la ultima vez supera la fecha actual, lo da de baja
    IF (DATE_ADD(pUltimoPago,INTERVAL pCantidadMeses MONTH) < NOW()) THEN
		SELECT 'Se vencieron los meses de credito para el cliente' AS Mensaje;
			UPDATE	Clientes
			SET		EstadoCli = 'B' , ClasesDisponibles = 0, MesesCredito = 0,IdPlan = 1
			WHERE	IdPersona = pIdPersona;
		LEAVE SALIR;
    END IF;

-- Controlo si pIdPersona tiene meses de credito disponible y no le quedaron clases disponibles
-- , de ser asi, se setean las nuevas clases disponibles
    IF (
    ((SELECT MesesCredito FROM Clientes WHERE IdPersona = pIdPersona)  != 0 ) 
    AND 
    ((SELECT ClasesDisponibles FROM Clientes WHERE IdPersona = pIdPersona) <= 0 )
    )
    THEN
    SELECT 'Tiene meses de credito' AS Mensaje;
		-- Pregunto si paso el mes desde que pago, si es asi, se actualiza su mes de credito
		IF (pUltimoPago < now()) THEN
			UPDATE	Clientes
			SET		EstadoCli = 'A' , ClasesDisponibles = pClasesDisponibles, MesesCredito = MesesCredito - 1
			WHERE	IdPersona = pIdPersona;
		-- Si no se paso el mes desde que pago , entonces debe esperar a que pase el mes
		ELSE
			SELECT 'Debes esperar a que pase el mes' AS Mensaje;
		END IF;
	END IF;
	
SELECT 'Ok' AS Mensaje;

END$$

DROP PROCEDURE IF EXISTS `bsp_actualiza_medicion`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_actualiza_medicion` (`pIdMedicion` INT(11), `pIdProfesional` INT(11), `pAltura` VARCHAR(10), `pPeso` VARCHAR(60), `pIMC` VARCHAR(60), `pMusc` VARCHAR(60), `pGrasa` CHAR(32), `pGV` VARCHAR(30))  SALIR:BEGIN
	/*
    Permite editar una medicion, dado su IdPersona, con todos sus datos.
    Devuelve OK o el mensaje de error en Mensaje.
    */
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		ROLLBACK;
	END;


-- Controla que exista la medicion
IF not EXISTS (SELECT IdMedicion FROM Mediciones WHERE IdMedicion = pIdMedicion ) THEN
		SELECT 'La medicion no existe' AS Mensaje;
		LEAVE SALIR;
END IF;

-- Actualizo
   	UPDATE Mediciones SET IdProfesional = pIdProfesional WHERE IdMedicion = pIdMedicion;
	UPDATE Mediciones SET Altura = pAltura WHERE IdMedicion = pIdMedicion;
	UPDATE Mediciones SET Peso = pPeso WHERE IdMedicion = pIdMedicion;
	UPDATE Mediciones SET IMC = pIMC WHERE IdMedicion = pIdMedicion;
	UPDATE Mediciones SET Musc = pMusc WHERE IdMedicion = pIdMedicion;
	UPDATE Mediciones SET Grasa = pGrasa WHERE IdMedicion = pIdMedicion;
	UPDATE Mediciones SET GV = pGV WHERE IdMedicion = pIdMedicion;



    
	SELECT 'Ok' AS Mensaje;
END$$

DROP PROCEDURE IF EXISTS `bsp_actualiza_profesional`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_actualiza_profesional` (`pIdPersona` INT(11), `pIdTipoDocumento` INT(11), `pIdRol` CHAR(1), `pApellidos` VARCHAR(60), `pNombres` VARCHAR(60), `pDocumento` CHAR(10), `pPassword` CHAR(32), `pTelefono` VARCHAR(30), `pSexo` CHAR(1), `pObservaciones` VARCHAR(250), `pFechaNac` DATE, `pCorreo` VARCHAR(50), `pUsuario` VARCHAR(60), `pCalle` VARCHAR(60), `pPiso` INT(11), `pDepartamento` VARCHAR(10), `pCiudad` VARCHAR(60), `pPais` VARCHAR(60), `pNumero` INT(11), `pEstado` CHAR(1))  SALIR:BEGIN
	/*
    Permite actualizar un profesional, dado su IdPersona, con todos sus datos.
    Si la contraseña es NULL entonces no se modifica    
    Devuelve OK o el mensaje de error en Mensaje.
    */
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		ROLLBACK;
	END;
    
    -- Controla que el documento sea obligatoria 
	IF pDocumento = '' OR pDocumento IS NULL THEN
		SELECT 'Debe proveer un documento para la persona' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla que el rol exista 
	IF NOT EXISTS(SELECT IdRol FROM roles WHERE IdRol = pIdRol ) THEN
		SELECT 'Rol inexistente' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Si se ingreso un documento distinto al que ya se tenia, entonces , se controla que no 
-- haya uno existente igual
IF (SELECT Documento FROM Personas WHERE IdPersona = pIdPersona ) != pDocumento THEN
	IF EXISTS(SELECT Documento FROM Personas WHERE Documento = pDocumento) THEN
		SELECT 'Ya existe una persona con ese documento' AS Mensaje;
		LEAVE SALIR;
    END IF;
END IF;

-- Si se ingreso un correo distinto al que ya se tenia, entonces , se controla que no 
-- haya uno existente igual
IF (SELECT Correo FROM Personas WHERE IdPersona = pIdPersona ) != pCorreo THEN
	IF (SELECT Correo FROM Personas WHERE Correo = pCorreo) THEN
		SELECT 'Ya existe una persona con ese correo' AS Mensaje;
		LEAVE SALIR;
    END IF;
END IF;

-- Controla que no exista una persona con ese usuario
IF ((SELECT Usuario FROM Personas WHERE IdPersona = pIdPersona ) != pUsuario) THEN
	IF (SELECT Usuario FROM Personas WHERE Usuario = pUsuario) THEN
		SELECT 'Ya existe una persona con ese usuario' AS Mensaje;
		LEAVE SALIR;
    END IF;
END IF;

    
-- Si no se selecciono una CONTRASEÑA o viene vacia , entonces se deja como estaba
	IF pPassword != '' OR pPassword IS NOT NULL THEN
		UPDATE Personas SET Password = MD5(pPassword) WHERE IdPersona = pIdPersona;
    END IF;	

-- Si no se selecciono una fecha de nacimiento  o viene vacia , entonces se deja como estaba
	IF (pFechaNac IS NOT NULL) THEN
		UPDATE Personas SET FechaNac = pFechaNac WHERE IdPersona = pIdPersona;
    END IF;	

-- Actualizo
   	UPDATE Personas SET IdTipoDocumento = pIdTipoDocumento WHERE IdPersona = pIdPersona;
	UPDATE Personas SET IdRol = pIdRol WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Apellidos = pApellidos WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Nombres = pNombres WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Documento = pDocumento WHERE IdPersona = pIdPersona;
    UPDATE Personas SET Telefono = pTelefono WHERE IdPersona = pIdPersona;
    UPDATE Personas SET Sexo = pSexo WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Correo = pCorreo WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Usuario = pUsuario WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Calle = pCalle WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Numero = pNumero WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Piso = pPiso WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Departamento = pDepartamento WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Ciudad = pCiudad WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Pais = pPais WHERE IdPersona = pIdPersona;
    UPDATE Personas SET EstadoPer = pEstado WHERE IdPersona = pIdPersona;
    UPDATE Personas SET Observaciones = pObservaciones WHERE IdPersona = pIdPersona;
    
	SELECT 'Ok' AS Mensaje;
END$$

DROP PROCEDURE IF EXISTS `bsp_alta_cliente`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_alta_cliente` (`pIdTipoDocumento` INT(11), `pApellidos` VARCHAR(60), `pNombres` VARCHAR(60), `pDocumento` CHAR(11), `pPassword` CHAR(32), `pTelefono` VARCHAR(30), `pSexo` CHAR(1), `pObservaciones` VARCHAR(250), `pFechaNac` DATE, `pCorreo` VARCHAR(50), `pUsuario` VARCHAR(60), `pCalle` VARCHAR(60), `pPiso` INT(11), `pDepartamento` VARCHAR(10), `pCiudad` VARCHAR(60), `pPais` VARCHAR(60), `pNumero` INT(11), `pObjetivo` VARCHAR(60), `pOcupacion` VARCHAR(60), `pHorario` VARCHAR(60))  SALIR:BEGIN
	/*
    Permite dar de alta un cliente controlando que el email no exista ya. 
    La da de alta al final del orden, con estado B: Baja. (Hasta que se inscribe en algun plan)
    El cliente empieza dado de baja hasta que pague la primera cuota
    La persona asociada con el cliente se crea activa.
    Se setea por defecto con el IdPlan = '1'
    Devuelve OK o el mensaje de error en Mensaje.
    */
	DECLARE pIdPersona,pIdCliente,pClasesDisponibles,pIdAsistencia smallint;
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;
    -- Controla que el correo sea obligatorio 
	IF pCorreo = '' OR pCorreo IS NULL THEN
		SELECT 'Debe proveer un nombre para el correo' AS Mensaje;
		LEAVE SALIR;
    END IF;
    

-- Controla que exista el tipo de documento 
	IF NOT EXISTS (SELECT IdTipoDocumento FROM tiposdocumentos WHERE IdTipoDocumento = pIdTipoDocumento) OR pIdTipoDocumento = '' OR pIdTipoDocumento IS NULL THEN
		SELECT 'Tipo de documento inexistente' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
    -- Controla que el Documento sea obligatorio
	IF pDocumento = '' OR pDocumento IS NULL THEN
		SELECT 'Debe proveer un documento' AS Mensaje;
		LEAVE SALIR;
    END IF;

    -- Controla que el Documento sea obligatorio
	IF pApellidos = '' OR pApellidos IS NULL THEN
		SELECT 'Debe proveer un Apellido' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
    -- Controla que el Documento sea obligatorio
	IF pNombres = '' OR pNombres IS NULL THEN
		SELECT 'Debe proveer un Nombre' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla que una persona no exista previamente con estado 'B'
	IF EXISTS (SELECT Correo FROM personas WHERE Correo = pCorreo) THEN
		-- Esta dada de baja ?
        IF (SELECT EstadoPer FROM Personas WHERE Correo = pCorreo) = 'B' THEN
			SELECT 'La persona ya se encuentra cargada' AS Mensaje;
			SELECT IdPersona FROM personas WHERE Correo = pCorreo;
			LEAVE SALIR;
		END IF;
    END IF;

-- Controla que una persona no exista previamente con estado 'B'
	IF EXISTS (SELECT Documento FROM personas WHERE Documento = pDocumento) THEN
		-- Esta dada de baja ?
        IF (SELECT EstadoPer FROM Personas WHERE Documento = pDocumento) = 'B' THEN
			SELECT 'La persona ya se encuentra cargada' AS Mensaje;
            SELECT IdPersona FROM personas WHERE Documento = pDocumento;
			LEAVE SALIR;
		END IF;
    END IF;

    -- Controla que no exista un documento con el mismo numero que este activo
	IF EXISTS (SELECT Documento FROM personas WHERE Documento = pDocumento) THEN
			SELECT 'Ya existe un documento con ese numero' AS Mensaje;
			LEAVE SALIR;
    END IF;
    
    -- Controla que no exista una persona con el mismo correo, '1' para rol de cliente
	IF EXISTS(SELECT Correo FROM Personas WHERE (Correo = pCorreo AND EstadoPer = 'A')) THEN
		SELECT 'Ya existe un correo con ese nombre' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla que no exista un documento con el mismo numero que este activo
	IF EXISTS(SELECT Usuario FROM Personas WHERE (Usuario = pUsuario AND EstadoPer = 'A')) THEN
		SELECT 'Ya existe un Usuario con ese Nombre' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla que sea un sexo correcto
	IF pSexo !=0 AND pSexo !=1 THEN
		SELECT 'Sexo incorrecto' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla que la fecha no sea mayor a la actual
	IF DATEDIFF(NOW(),pFechaNac) <= 0 THEN
		SELECT 'Fecha incorrecta' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
	START TRANSACTION;
		SET pIdPersona = 1 + (SELECT COALESCE(MAX(IdPersona),0) FROM Personas);
		SET pIdCliente = 1 + (SELECT COALESCE(MAX(IdPersona),0) FROM Clientes);

		INSERT INTO Personas(IdPersona,IdTipoDocumento,IdRol,Apellidos,Nombres,Documento,Password,Telefono,Sexo,FechaNac,Correo,Usuario,Calle,Numero,Piso,Departamento,Ciudad,Pais,EstadoPer,Observaciones) VALUES(pIdPersona,pIdTipoDocumento,'1',pApellidos,pNombres,pDocumento,MD5(pPassword),pTelefono,pSexo,pFechaNac,pCorreo,pUsuario,pCalle,pNumero,pPiso,pDepartamento,pCiudad,pPais,'A',pObservaciones);
		INSERT INTO Clientes(IdPersona,IdPlan,Objetivo,EstadoCli,Ocupacion,FechaInicio,Horario,ClasesDisponibles,MesesCredito) VALUES(pIdPersona,1,pObjetivo,'B',pOcupacion,now(),pHorario,0,0);

    SELECT 'Ok' AS Mensaje;

    COMMIT;

END$$

DROP PROCEDURE IF EXISTS `bsp_alta_egreso`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_alta_egreso` (`pMonto` INT(11), `pIdPersona` INT(11), `pCantidad` CHAR(10), `pDetalle` VARCHAR(60))  SALIR:BEGIN
	/*
    Permite dar de alta un egreso en la caja 
    */
	DECLARE pIdTransaccion,pIdEgreso smallint;
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;
    -- Controla que el monto sea obligatorio 
	IF pMonto = '' OR pMonto IS NULL THEN
		SELECT 'Debe proveer un monto' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla que el monto sea obligatorio 
	IF pCantidad = '' OR pCantidad IS NULL THEN
		SELECT 'Debe proveer una cantidad' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
	START TRANSACTION;
		SET pIdTransaccion = 1 + (SELECT COALESCE(MAX(IdTransaccion),0) FROM Transacciones);
		INSERT INTO Transacciones(IdTransaccion,IdPersona,IdPlanAbonado,Descripcion,Monto,Fecha,Cantidad) VALUES(pIdTransaccion,null,null,pDetalle,pMonto,CURDATE(),pCantidad);
        
		INSERT INTO Egresos(IdTransaccion) VALUES(pIdTransaccion);
    SELECT 'Ok' AS Mensaje;
    COMMIT;

END$$

DROP PROCEDURE IF EXISTS `bsp_alta_entrenador`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_alta_entrenador` (`pIdTipoDocumento` INT(11), `pApellido` VARCHAR(60), `pNombre` VARCHAR(60), `pDocumento` INT(11), `pPassword` CHAR(32), `pTelefono` VARCHAR(30), `pSexo` CHAR(1), `pObservaciones` VARCHAR(250), `pFoto` VARCHAR(60), `pFechaNac` DATE, `pCorreo` VARCHAR(50), `pUsuario` VARCHAR(60), `pCalle` VARCHAR(60), `pPiso` INT(11), `pDepartamento` VARCHAR(10), `pCiudad` VARCHAR(60), `pPais` VARCHAR(60), `pNumero` INT(11))  SALIR:BEGIN
	/*
    Permite dar de alta un entrenador controlando que el email no exista ya. 
    La da de alta al final del orden, con estado A: Activa. 
    Devuelve OK + Id o el mensaje de error en Mensaje.
    */
	DECLARE pIdPersona,pIdDireccion,pIdProfesional smallint;
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;
    -- Controla que el correo sea obligatorio 
	IF pCorreo = '' OR pCorreo IS NULL THEN
		SELECT 'Debe proveer un nombre para el correo' AS Mensaje, NULL AS Id;
		LEAVE SALIR;
    END IF;
    
    -- Controla que no exista un entrenador/persona con el mismo correo, '1' para rol de cliente
	IF (pCorreo = (SELECT correo FROM personas WHERE correo = pCorreo )) THEN
		SELECT 'Ya existe un correo con ese nombre' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
    -- Controla que el Documento sea obligatorio
	IF pDocumento = '' OR pDocumento IS NULL THEN
		SELECT 'Debe proveer un documento' AS Mensaje, NULL AS Id;
		LEAVE SALIR;
    END IF;
    
-- Controla que no exista un documento con el mismo numero
	IF EXISTS(SELECT Documento FROM Personas WHERE Documento = pDocumento) THEN
		SELECT 'Ya existe un Documento con ese numero' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
	START TRANSACTION;
		SET pIdDireccion = 1 + (SELECT COALESCE(MAX(IdDireccion),0) FROM Direcciones);
		INSERT INTO Direcciones(IdDireccion,Calle,Piso,Departamento,Ciudad,Pais,Numero) VALUES(pIdDireccion,pCalle,pPiso,pDepartamento,pCiudad,pPais,pNumero);

		SET pIdPersona = 1 + (SELECT COALESCE(MAX(IdPersona),0) FROM Personas);
		INSERT INTO Personas(IdPersona,IdRol,IdDireccion,IdTipoDocumento,Apellido,Nombre,Documento,Password,Telefono,Sexo,Observaciones,Foto,Estado,FechaNac,Correo,Usuario) VALUES(pIdPersona,2,pIdDireccion,pIdTipoDocumento,pApellido,pNombre,pDocumento,MD5(pPassword),pTelefono,pSexo,pObservaciones,pFoto,'A',pFechaNac,pCorreo,pUsuario);
        
        SET pIdProfesional = 1 + (SELECT COALESCE(MAX(IdProfesional),0) FROM Profesionales);
		INSERT INTO Profesionales(IdPersona,IdRol,IdProfesional) VALUES(pIdPersona,2,pIdProfesional);
	SELECT 'Ok' AS Mensaje;
    COMMIT;

END$$

DROP PROCEDURE IF EXISTS `bsp_alta_ingreso`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_alta_ingreso` (`pIdPersona` INT(11), `pIdPlan` INT(11), `pCantidad` INT, `pDescripcion` VARCHAR(60))  SALIR:BEGIN
	/*
    Permite dar de alta una Transaccion (ingreso de caja)
    */
	DECLARE pIdTransaccion,pMonto,pClasesDisponibles smallint;
    
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		ROLLBACK;
	END;
    
-- Controla que la pCantidad sea != 0
	IF pCantidad = '' OR pCantidad IS NULL OR pCantidad = 0 THEN
		SELECT 'Debe proveer una Cantidad' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla que la persona sea obligatoria
	IF pIdPersona = '' OR pIdPersona IS NULL THEN
		SELECT 'Debe proveer una persona' AS Mensaje, NULL AS Id;
		LEAVE SALIR;
    END IF;

-- Controla que la persona exista
	IF NOT EXISTS (SELECT IdPersona FROM Clientes WHERE IdPersona = pIdPersona) THEN
		SELECT 'Cliente inexistente' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Verifica estado del cliente , si estaba dado de baja , lo da de alta
	/*IF (SELECT EstadoCli FROM Clientes WHERE IdPersona = pIdPersona) = 'B' THEN
		UPDATE Clientes SET EstadoCli = 'A' WHERE IdPersona = pIdPersona;
    END IF;*/
    
-- Controla que el Plan exista
	IF NOT EXISTS (SELECT IdPlan FROM Planes WHERE IdPlan = pIdPlan) THEN
		SELECT 'Plan inexistente' AS Mensaje;
		LEAVE SALIR;
    END IF;

-- Seteo los valores a usar
	SET pIdTransaccion = 1 + (SELECT COALESCE(MAX(IdTransaccion),0) FROM Transacciones);
	SET pMonto = (SELECT Precio FROM planes WHERE IdPlan = pIdPlan) * pCantidad;
	SET pClasesDisponibles = (SELECT CantClases FROM planes WHERE IdPlan = pIdPlan);


START TRANSACTION;
-- Controlo si esta asistiendo a algun plan
	IF (SELECT IdPlan FROM Clientes WHERE IdPersona = pIdPersona) != 1 THEN
		-- Si esta asistiendo a algun plan, ¿Es pIdPlan?
		IF (SELECT IdPlan FROM Clientes WHERE IdPersona = pIdPersona) = pIdPlan THEN
			-- Si es asi, entonces sumo como meses de credito (menos 1 por empezar a contar el mes actual)
			UPDATE Clientes SET mesesCredito = ((SELECT mesesCredito FROM Clientes WHERE IdPersona = pIdPersona) + (pCantidad - 1))
            WHERE IdPersona = pIdPersona;
		ELSE
            -- No esta asistiendo a pIdPlan, entonces actualizo el plan al cual asistira
            UPDATE	Clientes 
			SET		IdPlan = pIdPlan,ClasesDisponibles = pClasesDisponibles,MesesCredito = (pCantidad - 1),EstadoCli = 'A'
			WHERE	IdPersona = pIdPersona;
		END IF;
	ELSE
-- Si el cliente no esta asistiendo a algun plan, entonces cargo el nuevo plan
		UPDATE 	Clientes 
		SET 	IdPlan = pIdPlan,ClasesDisponibles = pClasesDisponibles,EstadoCli = 'A',MesesCredito = (pCantidad - 1)
		WHERE 	IdPersona = pIdPersona;
	
	END IF;
    
-- Inserto la transaccion en la tabla
	INSERT INTO Transacciones(IdTransaccion,IdPersona,IdPlanAbonado,Descripcion,Monto,Fecha,Cantidad) VALUES(pIdTransaccion,pIdPersona,pIdPlan,pDescripcion,pMonto,CURDATE(),pCantidad);

	SELECT 'Ok' AS Mensaje;
COMMIT;
END$$

DROP PROCEDURE IF EXISTS `bsp_alta_medicion`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_alta_medicion` (`pIdCliente` INT(11), `pIdProfesional` INT(11), `pAltura` DECIMAL(5,2), `pPeso` DECIMAL(5,2), `pIMC` FLOAT, `pMusc` FLOAT, `pGrasa` FLOAT, `pGV` FLOAT)  SALIR:BEGIN
	/*
    Permite dar de alta una medicion siempre que el cliente exista
    La da de alta al final del orden. 
    Devuelve OK + Id o el mensaje de error en Mensaje.
    */
    
	DECLARE pIdMedicion smallint;
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;
    
-- Controla que exista el cliente
	IF NOT EXISTS(SELECT IdPersona FROM Clientes WHERE IdPersona = pIdCliente) THEN
		SELECT 'No existe un cliente con ese ID' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla que exista el profesional
	IF NOT EXISTS(SELECT IdPersona FROM Profesionales WHERE IdPersona = pIdProfesional) THEN
		SELECT 'No existe un profesional con ese ID' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla que el cliente este dado de alta
	IF ((SELECT EstadoCli FROM Clientes WHERE IdPersona = pIdCliente) = 'B') THEN
		SELECT 'El cliente esta dado de baja' AS Mensaje;
		LEAVE SALIR;
    END IF;

	START TRANSACTION;
        
  		SET pIdMedicion = 1 + (SELECT COALESCE(MAX(IdMedicion),0) FROM Mediciones);
		INSERT INTO Mediciones(IdMedicion,IdCliente,IdProfesional,Fecha,Altura,Peso,IMC,Musc,Grasa,GV,EstadoMed) VALUES(pIdMedicion,pIdCliente,pIdProfesional,CURDATE(),pAltura,pPeso,pIMC,pMusc,pGrasa,pGV,'A');
		SELECT 'Ok' AS Mensaje;
    COMMIT;
END$$

DROP PROCEDURE IF EXISTS `bsp_alta_plan`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_alta_plan` (`pPlan` VARCHAR(60), `pPrecio` DECIMAL(13,2), `pDescripcion` VARCHAR(250), `pCantClases` INT)  SALIR:BEGIN
	/*
    Permite dar de alta un plan controlando que la misma no exista ya. 
    La da de alta al final del orden, con estado A: Activa. 
    Devuelve OK + Id o el mensaje de error en Mensaje.
    */
	DECLARE pIdPlan smallint;
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;
    -- Controla que el correo sea obligatorio 
	IF pPlan = '' OR pPlan IS NULL THEN
		SELECT 'Debe proveer un nombre para el plan' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
    -- Controla que no exista un plan con el mismo nombre y que este activa
	IF EXISTS(SELECT Plan FROM planes WHERE Plan = pPlan) THEN
		SELECT 'Ya existe un plan con ese nombre' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
	START TRANSACTION;
		SET pIdPlan = 1 + (SELECT COALESCE(MAX(IdPlan),0) FROM Planes);
		INSERT INTO Planes(IdPlan,Plan,Descripcion,Precio,EstadoPlan,CantClases) VALUES(pIdPlan,pPlan,pDescripcion,pPrecio,'A',pCantClases);
    COMMIT;
END$$

DROP PROCEDURE IF EXISTS `bsp_alta_profesional`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_alta_profesional` (`pIdTipoDocumento` INT(11), `pIdRol` INT, `pApellidos` VARCHAR(60), `pNombres` VARCHAR(60), `pDocumento` CHAR(11), `pPassword` CHAR(32), `pTelefono` VARCHAR(30), `pSexo` CHAR(1), `pObservaciones` VARCHAR(250), `pFechaNac` DATE, `pCorreo` VARCHAR(50), `pUsuario` VARCHAR(60), `pCalle` VARCHAR(60), `pPiso` INT(11), `pDepartamento` VARCHAR(10), `pCiudad` VARCHAR(60), `pPais` VARCHAR(60), `pNumero` INT(11))  SALIR:BEGIN
	/*
    Permite dar de alta un profesional controlando que el email no exista ya. 
    La da de alta al final del orden, con estado A: Activa. 
    Devuelve OK + Id o el mensaje de error en Mensaje.
    */
	DECLARE pIdPersona smallint;
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;
    -- Controla que el correo sea obligatorio 
	IF pCorreo = '' OR pCorreo IS NULL THEN
		SELECT 'Debe proveer un nombre para el correo' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
    -- Controla que el pUsuario sea obligatorio 
	IF pUsuario = '' OR pUsuario IS NULL THEN
		SELECT 'Debe proveer un nombre de usuario' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
    -- Controla que no exista un profesional/persona con el mismo correo, '1' para rol de cliente
	IF (pCorreo = (SELECT correo FROM personas WHERE correo = pCorreo )) THEN
		SELECT 'Ya existe un correo con ese nombre' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
    -- Controla que el Documento sea obligatorio
	IF pDocumento = '' OR pDocumento IS NULL THEN
		SELECT 'Debe proveer un documento' AS Mensaje, NULL AS Id;
		LEAVE SALIR;
    END IF;

-- Controla que el pIdRol sea obligatorio
	IF pIdRol = '' OR pIdRol IS NULL THEN
		SELECT 'Debe proveer un rol' AS Mensaje, NULL AS Id;
		LEAVE SALIR;
    END IF;
    
-- Controla que no exista un documento con el mismo numero
	IF EXISTS(SELECT Documento FROM Personas WHERE Documento = pDocumento) THEN
		SELECT 'Ya existe un Documento con ese numero' AS Mensaje;
        SELECT pDocumento AS pDocumento;
		LEAVE SALIR;
    END IF;
    
-- Controla que no exista un documento con el mismo numero
	IF EXISTS(SELECT Usuario FROM Personas WHERE Usuario = pUsuario) THEN
		SELECT 'Ya existe un Usuario con ese nombre' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
	START TRANSACTION;
		SET pIdPersona = 1 + (SELECT COALESCE(MAX(IdPersona),0) FROM Personas);
		INSERT INTO Personas(IdPersona,IdTipoDocumento,IdRol,Apellidos,Nombres,Documento,Password,Telefono,Sexo,FechaNac,Correo,Usuario,Calle,Numero,Piso,Departamento,Ciudad,Pais,EstadoPer,Observaciones) VALUES(pIdPersona,pIdTipoDocumento,pIdRol,pApellidos,pNombres,pDocumento,MD5(pPassword),pTelefono,pSexo,pFechaNac,pCorreo,pUsuario,pCalle,pNumero,pPiso,pDepartamento,pCiudad,pPais,'A',pObservaciones);
		INSERT INTO Profesionales(IdPersona,FechaAlta,FechaBaja) VALUES(pIdPersona,now(),null);
        
	SELECT 'Ok' AS Mensaje;
    COMMIT;

END$$

DROP PROCEDURE IF EXISTS `bsp_alta_transaccion`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_alta_transaccion` (`pIdPersona` INT(11), `pIdPlan` INT(11), `pDetalle` VARCHAR(60))  SALIR:BEGIN
	/*
    Permite dar de alta un Transaccion (ingreso de caja)
    */
	DECLARE pIdTransaccion,pMonto,pIdAsistencia,pClasesDisponibles smallint;
    
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		ROLLBACK;
	END;
    
-- Controla que el Cliente/Persona exista y sea obligatorio 
	IF pIdPersona = '' OR pIdPersona IS NULL THEN
		SELECT 'Debe proveer una persona' AS Mensaje, NULL AS Id;
		LEAVE SALIR;
    END IF;
    
	IF NOT EXISTS (SELECT IdPersona FROM Clientes WHERE IdPersona = pIdPersona) THEN
		SELECT 'Cliente inexistente' AS Mensaje;
		LEAVE SALIR;
    END IF;

	IF NOT EXISTS (SELECT IdPlan FROM Planes WHERE IdPlan = pIdPlan) THEN
		SELECT 'Plan inexistente' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
	START TRANSACTION;
		SET pIdTransaccion = 1 + (SELECT COALESCE(MAX(IdTransaccion),0) FROM Transacciones);
		SET pIdAsistencia = 1 + (SELECT COALESCE(MAX(IdAsistencia),0) FROM Asistencias);
		SET pMonto = (SELECT Precio FROM planes WHERE IdPlan = pIdPlan);
        SET pClasesDisponibles = (SELECT CantClases FROM planes WHERE IdPlan = pIdPlan);

		INSERT INTO Transacciones(IdTransaccion,IdPersona,Descripcion,Monto,Fecha,Tipo) VALUES(pIdTransaccion,pIdPersona,pDescripcion,pMonto,CURDATE(),'Ingreso');
		INSERT INTO Asistencias(IdAsistencia,IdPersona,IdPlan,Fecha,ClasesDisponibles) VALUES(pIdAsistencia,pIdPersona,pIdPlan,CURDATE(),pClasesDisponibles);

		SELECT 'Ok' AS Mensaje;

    COMMIT;
END$$

DROP PROCEDURE IF EXISTS `bsp_buscar_cliente_plan_estado`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_buscar_cliente_plan_estado` (`pApellidos` VARCHAR(50), `pNombres` VARCHAR(50), `pIdPlan` INT)  SALIR:BEGIN
	/*
	Procedimiento que sirve para buscar un cliente por su nombres y/o apellidos segun coincidencia
    Filtra por plan y por estado
    pIncluyeBajas: 'S' Todos los clientes o 'N' solo los dados de alta
    Solo muestra las PERSONAS dadas de alta
    Todos: -1
    Inscriptos en algun plan : 0
    Plan 1 : Plan por defecto, indica que no esta inscripto en ningun plan
    */
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		--  SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		ROLLBACK;
	END;
    
-- Muestra los inscriptos en algun plan en especifico
	IF (pIdPlan != 0 AND pIdPlan != -1 AND pIdPlan != 1) THEN
		SELECT		p.IdPersona,p.Apellidos,p.Nombres,c.ClasesDisponibles,'' AS Plan
		FROM		(personas p JOIN clientes c ON p.IdPersona = c.IdPersona)
		WHERE		EstadoPer = 'A' AND c.IdPlan = pIdPlan AND (Nombres LIKE CONCAT('%',pNombres,'%') and Apellidos LIKE CONCAT('%',pApellidos,'%'))
		ORDER BY	Apellidos asc;
        
        SELECT 		COUNT(p.IdPersona) AS cantCli
		FROM		(personas p JOIN clientes c ON p.IdPersona = c.IdPersona)
		WHERE		EstadoPer = 'A' AND c.IdPlan = pIdPlan AND (Nombres LIKE CONCAT('%',pNombres,'%') and Apellidos LIKE CONCAT('%',pApellidos,'%'));
	END IF;
    
-- Sin filtro de planes , muestra todos los clientes activos de todos los planes
	IF (pIdPlan = 0 AND pIdPlan != 1) THEN
		SELECT		p.IdPersona,p.Apellidos,p.Nombres,pl.Plan,c.ClasesDisponibles
		FROM		((personas p JOIN clientes c ON p.IdPersona = c.IdPersona) JOIN planes pl ON pl.IdPlan = c.IdPlan)
		WHERE		EstadoPer = 'A' AND (Nombres LIKE CONCAT('%',pNombres,'%') and Apellidos LIKE CONCAT('%',pApellidos,'%'))
		ORDER BY	Apellidos asc;
 --   	LIMIT 		pDesde,5;

        SELECT 		COUNT(p.IdPersona) AS cantCli
		FROM		(personas p JOIN clientes c ON p.IdPersona = c.IdPersona)
		WHERE		EstadoPer = 'A' AND (Nombres LIKE CONCAT('%',pNombres,'%') and Apellidos LIKE CONCAT('%',pApellidos,'%')); 
	END IF;

-- Busca entre todos los clientes
	IF (pIdPlan = -1 ) THEN
		SELECT		p.IdPersona,p.Apellidos,p.Nombres,c.ClasesDisponibles,'' AS Plan
		FROM		(personas p JOIN clientes c ON p.IdPersona = c.IdPersona)
		WHERE		EstadoPer = 'A' AND (Nombres LIKE CONCAT('%',pNombres,'%') and Apellidos LIKE CONCAT('%',pApellidos,'%') )
		ORDER BY	apellidos asc;
--     	LIMIT 		pDesde,5;
		
        -- Entrega la cantidad de clientes
        SELECT 		COUNT(p.IdPersona) AS cantCli
		FROM		(personas p JOIN clientes c ON p.IdPersona = c.IdPersona)
		WHERE		EstadoPer = 'A' AND (Nombres LIKE CONCAT('%',pNombres,'%') and Apellidos LIKE CONCAT('%',pApellidos,'%')); 
	END IF;
    
	-- SELECT valido; 
END$$

DROP PROCEDURE IF EXISTS `bsp_dame_medicion`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_dame_medicion` (`pIdMedicion` SMALLINT)  SALIR:BEGIN
	/*
	Procedimiento que sirve para obtener una medicion dada su ID
    Recordar que IdCliente en la tabla MEDICIONES es un alias de IdPersona
    */

-- Controla que la persona(cliente) posea alguna medicion
    IF NOT EXISTS(SELECT IdMedicion FROM mediciones WHERE IdMedicion = pIdMedicion ) THEN
		SELECT 'Medicion inexistente'AS mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla que la medicion este activa
	IF (SELECT EstadoMed FROM Mediciones WHERE IdMedicion = pIdMedicion ) = 'B' THEN
		SELECT 'Medicion dada de baja'AS mensaje;
		LEAVE SALIR;
    END IF;
    
    SELECT		m.IdMedicion,m.Fecha,m.Altura,m.Peso,m.IMC,m.Musc,m.Grasa,m.GV,p.Apellidos as ApellidosProf,p.Nombres as NombresProf,m.IdProfesional
	FROM		Mediciones m
				LEFT JOIN personas p ON m.IdProfesional = p.IdPersona
    WHERE		IdMedicion = pIdMedicion;
    
    SELECT 'Ok' as Mensaje;

END$$

DROP PROCEDURE IF EXISTS `bsp_dame_persona`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_dame_persona` (`pIdPersona` SMALLINT)  SALIR:BEGIN
	-- DECLARE pSalida smallint;
	/*
	Procedimiento que sirve para instanciar una persona desde la base de datos.
    */
    IF NOT EXISTS(SELECT * FROM	personas WHERE IdPersona = pIdPersona ) THEN
		SELECT 'La persona no existe!' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Consulto si es un cliente para devolver datos de tabla clientes
IF EXISTS (SELECT IdPersona FROM Clientes WHERE IdPersona = pIdPersona) THEN
		SELECT	p.IdPersona,p.IdTipoDocumento,p.IdRol,p.Apellidos,p.Nombres,p.Documento,p.Telefono,p.Sexo
				,p.Observaciones,p.EstadoPer,c.EstadoCli,DATE_FORMAT(p.FechaNac,'%d-%m-%Y') as FechaNac,p.Correo,p.Usuario
                ,p.Calle,p.Numero,p.Piso,p.Pais,p.Ciudad,p.Pais,p.Observaciones,c.Objetivo,c.Ocupacion,c.FechaInicio
                ,c.Horario,c.ClasesDisponibles,c.MesesCredito,p.Departamento,c.FechaInicio
		FROM	personas p JOIN clientes c ON p.IdPersona = c.IdPersona
		WHERE	p.IdPersona = pIdPersona;
ELSE
		SELECT	per.IdPersona,per.IdTipoDocumento,per.IdRol,per.Apellidos,per.Nombres,per.Documento,per.Telefono,per.Sexo
				,per.Observaciones,per.EstadoPer,DATE_FORMAT(per.FechaNac,'%d-%m-%Y') as FechaNac,per.Correo,per.Usuario
                ,per.Calle,per.Numero,per.Piso,per.Pais,per.Ciudad,per.Pais,per.Departamento,DATE_FORMAT(prof.FechaAlta,'%d-%m-%Y') AS FechaAlta,
                DATE_FORMAT(prof.FechaBaja,'%d-%m-%Y') as FechaBaja
		FROM	personas per
				LEFT JOIN profesionales prof on per.IdPersona = prof.IdPersona
		WHERE	per.IdPersona = pIdPersona;
END IF;

	
END$$

DROP PROCEDURE IF EXISTS `bsp_dame_persona_correo_pass`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_dame_persona_correo_pass` (`pCorreoUsuario` VARCHAR(50), `pPassword` CHAR(32))  SALIR:BEGIN
	/*
	Procedimiento que sirve para instanciar una persona desde la base de datos por su correo (debe estar en estado activo).
    */
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;
    
-- Controla que la persona no este dada de baja
	IF (SELECT EstadoPer FROM Personas WHERE (Correo = pCorreoUsuario) OR (Usuario = pCorreoUsuario)) = 'B' THEN
		SELECT 'Persona dada de baja' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Verifica la existencia del correo, la contraseña y el estado (El usuario no porque puede ser NULL)
	IF NOT EXISTS (SELECT correo FROM personas WHERE (Correo = pCorreoUsuario) OR (Usuario = pCorreoUsuario)) OR (SELECT password FROM personas WHERE (Correo = pCorreoUsuario) OR (Usuario = pCorreoUsuario)) != MD5(pPassword) OR (SELECT EstadoPer FROM personas WHERE (Correo = pCorreoUsuario) OR (Usuario = pCorreoUsuario)) = 'B' THEN
		SELECT 'Error de credenciales' AS Mensaje;
		LEAVE SALIR;
    END IF;

    
	SELECT	correo,IdPersona,IdRol,'Ok' AS Mensaje
    FROM	personas
    WHERE	Correo = pCorreoUsuario OR Usuario = pCorreoUsuario;
    
END$$

DROP PROCEDURE IF EXISTS `bsp_dame_plan`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_dame_plan` (`pIdPlan` SMALLINT)  SALIR:BEGIN
	/*
	Procedimiento que sirve para instanciar un plan desde la base de datos.
    */
    IF NOT EXISTS(SELECT IdPlan FROM planes WHERE IdPlan = pIdPlan ) THEN
		SELECT 'El plan no existe!' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
	SELECT	*
    FROM	planes
    WHERE	IdPlan = pIdPlan;
END$$

DROP PROCEDURE IF EXISTS `bsp_dame_plan_cliente`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_dame_plan_cliente` (`pIdPersona` SMALLINT)  SALIR:BEGIN
	/*
	Procedimiento que devuelve los el plan al cual esta inscripto el cliente.
    */
    DECLARE pFechaUltimaAsistencia date;
    IF NOT EXISTS(SELECT IdPersona FROM	clientes WHERE IdPersona = pIdPersona ) THEN
		SELECT 'El cliente no existe!' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
	IF (((SELECT IdPlan FROM clientes WHERE IdPersona = pIdPersona ) is null) OR ((SELECT IdPlan FROM clientes WHERE IdPersona = pIdPersona ) = 1)) THEN
		SELECT 'La persona no esta inscripta en ningun plan!' AS Mensaje;
		LEAVE SALIR;
    END IF;

-- Devuelvo los datos del plan al cual asiste
	SELECT	p.IdPlan,p.Plan,c.ClasesDisponibles,c.MesesCredito,'Ok' AS Mensaje
	FROM	clientes c
			LEFT JOIN planes p ON c.IdPlan = p.IdPlan
	WHERE	p.IdPlan != 1 AND c.IdPersona = pIdPersona;

-- Devuelvo la ultima asistencia
	SELECT	MAX(DATE_FORMAT(Fecha, "%d/%m/%Y")) as FechaUltimaAsistencia
	FROM	asistencias
	WHERE	IdPersona = pIdPersona;
--     HAVING  MAX(IdAsistencia);

END$$

DROP PROCEDURE IF EXISTS `bsp_darbaja_plan`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_darbaja_plan` (`pIdPlan` SMALLINT)  SALIR:BEGIN
	/*
    Permite cambiar el estado de un plan dado un pIdPlan a B: Baja 
    siempre y cuando no esté dada de baja ya. 
    Devuelve OK o el mensaje de error en Mensaje.
    */
    -- Controla que el pIdPlan sea obligatorio 
	IF pIdPlan = '' OR pIdPlan IS NULL THEN
		SELECT 'Debe proveer un plan' AS Mensaje;
		LEAVE SALIR;
    END IF;

-- Controlo que el IdPlan exista
	IF NOT EXISTS(SELECT IdPlan FROM Planes WHERE IdPlan = pIdPlan) THEN
		SELECT 'Plan inexistente' AS Mensaje;
        LEAVE SALIR;
	END IF;
    
-- Controlo que el plan no este actualmente dado de baja
	IF (SELECT EstadoPlan FROM Planes WHERE IdPlan = pIdPlan) = 'B' THEN
		SELECT 'El plan ya está dada de baja.' AS Mensaje;
        LEAVE SALIR;
	END IF;
-- Controlo si alguien tiene meses disponibles en el plan
	IF EXISTS ( SELECT MesesCredito FROM clientes WHERE IdPlan = pIdPlan) != 0  THEN
		SELECT 'El plan posee clientes inscriptos' AS Mensaje;
        LEAVE SALIR;
	END IF;
    
-- Controlo si alguien tiene clases disponibles en el plan
	IF EXISTS ( SELECT ClasesDisponibles FROM clientes WHERE IdPlan = pIdPlan) != 0  THEN
		SELECT 'El plan posee clientes inscriptos' AS Mensaje;
        LEAVE SALIR;
	END IF;
  
    -- Da de baja
	UPDATE	Planes
    SET		EstadoPlan = 'B'
    WHERE	IdPlan = pIdPlan;

    SELECT 'Ok' AS Mensaje;
END$$

DROP PROCEDURE IF EXISTS `bsp_darbaja_profesional`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_darbaja_profesional` (`pIdPersona` SMALLINT)  SALIR:BEGIN
	/*
    Permite cambiar el estado de un profesional a B: Baja siempre y cuando no 
    esté dada de baja ya y exista en la BD.
    Devuelve OK o el mensaje de error en Mensaje.
    */
   
DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;
    
-- Controla que la persona exista
    IF NOT EXISTS(SELECT IdPersona FROM Personas WHERE IdPersona = 1) THEN
		SELECT 'La persona con ese Id no existe.' AS Mensaje;
        LEAVE SALIR;
	END IF;

-- Controla que la persona no este ya dada de baja
	IF (SELECT EstadoPer FROM Personas WHERE IdPersona = pIdPersona) = 'B' THEN
		SELECT 'La persona ya está dada de baja.' AS Mensaje;
        LEAVE SALIR;
	END IF;

-- Da de baja en tabla personas
    UPDATE	Personas
    SET		EstadoPer = 'B'
    WHERE	IdPersona = pIdPersona;
    
-- Actualizo la fecha de baja
	UPDATE	profesionales
	SET		FechaBaja = curdate()
	WHERE	IdPersona = pIdPersona;
    
    SELECT 'Ok' AS Mensaje;
END$$

DROP PROCEDURE IF EXISTS `bsp_editar_cliente`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_editar_cliente` (`pIdPersona` INT(11), `pIdTipoDocumento` INT(11), `pApellidos` VARCHAR(60), `pNombres` VARCHAR(60), `pDocumento` VARCHAR(60), `pPassword` CHAR(32), `pTelefono` VARCHAR(30), `pSexo` CHAR(1), `pObservaciones` VARCHAR(250), `pFechaNac` DATE, `pCorreo` VARCHAR(50), `pUsuario` VARCHAR(60), `pCalle` VARCHAR(60), `pPiso` INT(11), `pDepartamento` VARCHAR(10), `pCiudad` VARCHAR(60), `pPais` VARCHAR(60), `pNumero` INT(11), `pObjetivo` VARCHAR(60), `pOcupacion` VARCHAR(60), `pHorario` VARCHAR(60))  SALIR:BEGIN
	/*
    Permite editar un cliente, dado su IdPersona, con todos sus datos.
    Si la contraseña es NULL entonces no se modifica    
    Devuelve OK o el mensaje de error en Mensaje.
    */
    DECLARE pFecha date;
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		ROLLBACK;
	END;
    
    -- Controla que el documento sea obligatoria 
	IF pDocumento = '' OR pDocumento IS NULL THEN
		SELECT 'Debe proveer un documento para la persona' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Si se ingreso un documento distinto al que ya se tenia, entonces , se controla que no 
-- haya uno existente igual
IF ((SELECT Documento FROM Personas WHERE IdPersona = pIdPersona ) != pDocumento) THEN
	IF EXISTS(SELECT Documento FROM Personas WHERE Documento = pDocumento) THEN
		SELECT 'Ya existe una persona con ese documento' AS Mensaje;
		LEAVE SALIR;
    END IF;
END IF;

-- Si se ingreso un correo distinto al que ya se tenia, entonces , se controla que no 
-- haya uno existente igual
IF (SELECT Correo FROM Personas WHERE IdPersona = pIdPersona ) != pCorreo THEN
	IF (SELECT Correo FROM Personas WHERE Correo = pCorreo) THEN
		SELECT 'Ya existe una persona con ese correo' AS Mensaje;
		LEAVE SALIR;
    END IF;
END IF;

-- Controla que no exista una persona con ese usuario
IF (SELECT Usuario FROM Personas WHERE IdPersona = pIdPersona ) != pUsuario THEN
	IF (SELECT Usuario FROM Personas WHERE Usuario = pUsuario) THEN
		SELECT 'Ya existe una persona con ese usuario' AS Mensaje;
		LEAVE SALIR;
    END IF;
END IF;



-- Si no se selecciono una CONTRASEÑA o viene vacia , entonces se deja como estaba
	IF pPassword != '' OR pPassword IS NOT NULL THEN
		UPDATE Personas SET Password = MD5(pPassword) WHERE IdPersona = pIdPersona;
    END IF;	

	IF (pFechaNac > CURDATE()) THEN
		SELECT 'Fecha Incorrecta' AS Mensaje;
		LEAVE SALIR;
    END IF;
-- Si no se selecciono una fecha de nacimiento  o viene vacia , entonces se deja como estaba (Decicion negada)
	IF (pFechaNac IS NOT NULL) THEN
		-- SELECT 'Actualizo' as actualizo;
		UPDATE Personas SET FechaNac = pFechaNac WHERE IdPersona = pIdPersona;
    END IF;	

-- Actualizo
   	UPDATE Personas SET IdTipoDocumento = pIdTipoDocumento WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Apellidos = pApellidos WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Nombres = pNombres WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Documento = pDocumento WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Correo = pCorreo WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Usuario = pUsuario WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Calle = pCalle WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Piso = pPiso WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Departamento = pDepartamento WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Ciudad = pCiudad WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Pais = pPais WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Numero = pNumero WHERE IdPersona = pIdPersona;
    UPDATE Personas SET Telefono = pTelefono WHERE IdPersona = pIdPersona;
    UPDATE Personas SET Observaciones = pObservaciones WHERE IdPersona = pIdPersona;
    UPDATE Personas SET Sexo = pSexo WHERE IdPersona = pIdPersona;
    
	UPDATE Clientes SET Objetivo = pObjetivo WHERE IdPersona = pIdPersona;
	UPDATE Clientes SET Ocupacion = pOcupacion WHERE IdPersona = pIdPersona;
	UPDATE Clientes SET Horario = pHorario WHERE IdPersona = pIdPersona;

    
	SELECT 'Ok' AS Mensaje;
END$$

DROP PROCEDURE IF EXISTS `bsp_eliminar_cliente`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_eliminar_cliente` (`pIdPersona` SMALLINT)  SALIR:BEGIN
	/*
    Cambia el estado de un cliente a 'B' dado un IdPersona
    esté dada de baja ya y exista en la BD.
    Devuelve OK o el mensaje de error en Mensaje.
    */

    
DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;
    
-- Controla que no exista un documento con el mismo numero que este activo
	IF NOT EXISTS (SELECT IdPersona FROM clientes WHERE IdPersona = pIdPersona) THEN
			SELECT 'Cliente inexistente' AS Mensaje;
			LEAVE SALIR;
    END IF;

-- Da de baja
	UPDATE personas set EstadoPer = 'B' WHERE IdPersona = pIdPersona;
    UPDATE clientes set EstadoCli = 'B' WHERE IdPersona = pIdPersona;
-- Desinscribir en el plan (Seteo en IdPlan = 1 que es el plan por defecto)
    UPDATE clientes set IdPlan = 1 WHERE IdPersona = pIdPersona;
-- Pongo en cero las clases y meses de credito
    UPDATE clientes set ClasesDisponibles = 0 WHERE IdPersona = pIdPersona;
    UPDATE clientes set MesesCredito = 0 WHERE IdPersona = pIdPersona;
    
    SELECT 'Ok' AS Mensaje;
END$$

DROP PROCEDURE IF EXISTS `bsp_eliminar_medicion`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_eliminar_medicion` (`pIdMedicion` SMALLINT)  SALIR:BEGIN
	/*
    Elimina una medicion de la base de datos dado un pIdMedicion
    */

    
DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;
    
-- Pregunta si la persona existe en la tabla personas
    IF NOT EXISTS(SELECT IdMedicion FROM Mediciones WHERE IdMedicion = pIdMedicion) THEN
		SELECT 'La Medicion no existe' AS Mensaje;
        LEAVE SALIR;
	END IF;

-- Elimina
	DELETE FROM Mediciones WHERE IdMedicion = pIdMedicion;
    
    SELECT 'Ok' AS Mensaje;
END$$

DROP PROCEDURE IF EXISTS `bsp_listar_asistencias_cliente`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_asistencias_cliente` (`pDesde` INT, `pIdPersona` INT)  SALIR:BEGIN
	/*
	Permite listar las asistencias desde un cierto valor y de un cierto cliente.
    Ademas indica la cantidad de asistencias del cliente
    */
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		--  SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		ROLLBACK;
	END;
    
    IF pDesde <=0 THEN
        SET pDesde = 0;
    END IF;

-- Controla que la persona exista
	IF NOT EXISTS(SELECT IdPersona FROM personas WHERE IdPersona = pIdPersona ) THEN
		SELECT 'Persona inexistente' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
		SELECT		a.Fecha,pla.Plan
		FROM		asistencias a
					LEFT JOIN clientes c ON a.IdPersona = c.IdPersona
                    LEFT JOIN planes pla ON a.IdPlan = pla.IdPlan
		where		a.IdPersona = pIdPersona
        -- group by	a.IdPersona
		ORDER BY	a.Fecha desc
		LIMIT 		pDesde,5;
        
		SELECT 		count(a.IdPersona) AS totalAsistencias
		FROM		asistencias a
		where		a.IdPersona = pIdPersona
        group by	a.IdPersona;

END$$

DROP PROCEDURE IF EXISTS `bsp_listar_clientes_estado`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_clientes_estado` (IN `pDesde` INT, `pEstado` CHAR)  BEGIN
	/*
	Permite listar los clientes dados de alta ordenadas por apellido.
    Permite seleccionar si incluye bajas/alta o todos
    A: Devuelve solo los activos
    B: Devuelve los activos junto con los dados de baja
    */
-- Control de el parametro 'pDesde' por si viene igualado a cero

    IF pDesde <=0 THEN
        SET pDesde = 0;
    END IF;
    
    SELECT		p.IdPersona,p.Apellidos,p.Nombres,p.Foto,c.ClasesDisponibles
    FROM		personas p JOIN clientes c ON p.IdPersona = c.IdPersona
    WHERE		pEstado = 'B' OR (pEstado = 'A' AND c.EstadoCli = 'A')
    ORDER BY	p.apellidos asc
    LIMIT 		pDesde,5;
    
	SELECT 	COUNT(p.IdPersona) AS cantCli
    FROM	personas p JOIN clientes c ON p.IdPersona = c.IdPersona
    WHERE 	pEstado = 'B' OR (pEstado = 'A' AND c.EstadoCli = 'A');
END$$

DROP PROCEDURE IF EXISTS `bsp_listar_clientes_plan`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_clientes_plan` (IN `pDesde` INT, `pIdPlan` INT)  SALIR:BEGIN
	/*
	Permite listar los clientes desde un cierto valor y de un cierto plan.

    Ademas indica la cantidad de clases disponibles de cada cliente
    */
-- Control de el parametro 'pDesde' por si viene igualado a cero

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		--  SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		ROLLBACK;
	END;
    
    IF pDesde <=0 THEN
        SET pDesde = 0;
    END IF;

-- Controla que el plan exista (y que no se este en el caso de listar todos los planes)
	IF NOT EXISTS(SELECT IdPlan FROM planes WHERE IdPlan = pIdPlan ) AND pIdPLan != 0 AND pIdPLan != -1 THEN
		SELECT 'Plan inexistente' AS Mensaje;
		LEAVE SALIR;
    END IF;

-- Con filtro por plan
	IF (pIdPlan != 0 AND pIdPlan != -1 )THEN
		SELECT		p.IdPersona,p.Apellidos,p.Nombres,c.ClasesDisponibles,c.IdPlan
		FROM		(personas p JOIN clientes c ON p.IdPersona = c.IdPersona)
		WHERE		c.IdPLan = pIdPlan AND EstadoPer = 'A'
	-- 	GROUP BY	p.IdPersona
		ORDER BY	p.Apellidos asc
		LIMIT 		pDesde,5;
        
		SELECT 	COUNT(c.IdPersona) AS cantCli
		FROM 	(personas p JOIN clientes c ON p.IdPersona = c.IdPersona)
		WHERE  	c.IdPLan = pIdPlan AND EstadoPer = 'A';
	END IF; 

-- Muestra todos los clientes incluidos los que NO esten inscripton en algun plan
  	IF (pIdPlan = -1 ) THEN
		SELECT		p.IdPersona,p.Apellidos,p.Nombres,c.IdPlan,c.ClasesDisponibles
		FROM		(personas p JOIN clientes c ON p.IdPersona = c.IdPersona)
		WHERE		EstadoPer = 'A'
	-- 	GROUP BY	p.IdPersona
		ORDER BY	p.Apellidos asc
		LIMIT 		pDesde,5;
        
		SELECT 	COUNT(c.IdPersona) AS cantCli
		FROM 	personas p JOIN clientes c ON p.IdPersona = c.IdPersona
		WHERE  	EstadoPer = 'A';
	END IF; 

-- Muestra los clientes que estan inscriptos en algun plan
	IF (pIdPlan = 0 )THEN
		SELECT		p.IdPersona,p.Apellidos,p.Nombres,pl.Plan,c.IdPlan,c.ClasesDisponibles
		FROM		personas p JOIN clientes c ON p.IdPersona = c.IdPersona JOIN planes pl ON pl.IdPlan = c.IdPlan
		WHERE		EstadoPer = 'A' AND c.IdPlan != 1
	-- 	GROUP BY	p.IdPersona
		ORDER BY	p.Apellidos asc
		LIMIT 		pDesde,5;
        
		SELECT 	COUNT(c.IdPersona) AS cantCli
		FROM	(personas p JOIN clientes c ON p.IdPersona = c.IdPersona) JOIN planes pl ON pl.IdPlan = c.IdPlan
		WHERE  	EstadoPer = 'A' AND c.IdPlan != 1;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `bsp_listar_egresos`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_egresos` (IN `pDesde` INT, `pFechaInicio` CHAR(10), `pFechaFin` CHAR(10))  BEGIN
	/*
	Permite listar los egresos.
    */

    IF pDesde <=0 THEN
        SET pDesde = 0;
    END IF;
    
    SELECT 	distinct Descripcion,Monto,Fecha,Cantidad,e.IdTransaccion
    FROM 	egresos e
			left join transacciones t on t.IdTransaccion = e.IdTransaccion
 	WHERE  ((Fecha >= DATE_ADD(pFechaInicio, INTERVAL 1 DAY)) AND (Fecha <= DATE_ADD(pFechaFin, INTERVAL 1 DAY)))
    group by e.IdTransaccion
	ORDER BY 	t.Fecha desc
    LIMIT 	pDesde,5;
    
	SELECT COUNT(e.IdTransaccion) AS maximo
	FROM 	egresos e
			left join transacciones t on t.IdTransaccion = e.IdTransaccion
    WHERE  ((Fecha >= DATE_ADD(pFechaInicio, INTERVAL 1 DAY)) AND (Fecha <= DATE_ADD(pFechaFin, INTERVAL 1 DAY)));
    
END$$

DROP PROCEDURE IF EXISTS `bsp_listar_ingresos`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_ingresos` (IN `pDesde` INT, `pFechaInicio` CHAR(10), `pFechaFin` CHAR(10))  BEGIN
	/*
	Permite listar los ingresos (transacciones).
    Devuelve ademas la persona que pago y el plan correspondiente
    */

    IF pDesde <=0 THEN
        SET pDesde = 0;
    END IF;
    
    SELECT 		t.IdTransaccion,t.Fecha,t.IdPersona,p.Apellidos,p.Nombres,t.Monto,t.Descripcion,t.Cantidad,pl.Plan
    FROM 		transacciones t
				LEFT JOIN personas p ON t.IdPersona = p.IdPersona 
                LEFT JOIN clientes c ON t.IdPersona = c.IdPersona
                LEFT JOIN planes pl ON pl.IdPlan = c.IdPlan
                LEFT join egresos e ON t.IdTransaccion = e.IdTransaccion
 	WHERE  		((Fecha >= DATE_ADD(pFechaInicio, INTERVAL 1 DAY)) AND (Fecha <= DATE_ADD(pFechaFin, INTERVAL 1 DAY))) and e.IdTransaccion is null
	GROUP BY 	t.IdTransaccion
    ORDER BY 	t.Fecha desc
    LIMIT 		pDesde,5;

	SELECT  COUNT(t.IdTransaccion) AS maximo
	FROM  	transacciones t
			LEFT join egresos e ON t.IdTransaccion = e.IdTransaccion
    WHERE  	((Fecha >= DATE_ADD(pFechaInicio, INTERVAL 1 DAY)) AND (Fecha <= DATE_ADD(pFechaFin, INTERVAL 1 DAY))) and e.IdTransaccion is null;
    
END$$

DROP PROCEDURE IF EXISTS `bsp_listar_mediciones`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_mediciones` (IN `pDesde` INT, IN `pIdPersona` INT)  SALIR:BEGIN
	/*
	Permite listar las mediciones desde un valor y dado un IdPersona .
    */
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje,
		ROLLBACK;
	END;
    
    IF pIdPersona IS NULL OR pIdPersona = '' THEN
		SELECT 'El Id persona es obligatorio.' AS Mensaje;
        LEAVE SALIR;
    END IF;
    

    
-- Controla que exista el empleado en la tabla empleados
	IF NOT EXISTS(SELECT IdPersona FROM Personas WHERE IdPersona = pIdPersona) THEN
		SELECT 'Persona inexistente' AS Mensaje;
		LEAVE SALIR;
    END IF;

-- Controla que exista el empleado en la tabla empleados
	IF (SELECT EstadoPer FROM Personas WHERE IdPersona = pIdPersona) = 'B' THEN
		SELECT 'La persona esta dada de baja' AS Mensaje;
		LEAVE SALIR;
    END IF;

  -- Control de el parametro 'pDesde' por si viene igualado a cero
    IF pDesde <=0 THEN
        SET pDesde = 0;
    END IF;
    -- DATE_FORMAT("2017-06-15", "%M %d %Y")
    SELECT		m.IdMedicion,DATE_FORMAT(m.Fecha, "%d %M %Y") as Fecha,m.Altura,m.Peso,m.IMC,m.Musc,m.Grasa,m.GV,p.Apellidos,p.Nombres  -- ,COUNT(IdMedicion) AS 'maximo'
    FROM		Mediciones m JOIN Personas p ON IdProfesional = IdPersona
    WHERE		IdCliente = pIdPersona
    ORDER BY	m.IdMedicion desc
    LIMIT 		pDesde,5;
    
    SELECT COUNT(IdMedicion) AS 'totalMediciones'
	FROM Mediciones
    WHERE IdCliente = pIdPersona AND EstadoMed = 'A'; 

END$$

DROP PROCEDURE IF EXISTS `bsp_listar_personal`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_personal` (IN `pDesde` INT, `pIncluyeBajas` INT)  BEGIN
	/*
	Permite listar el personal del gimnasio ordenadas por nombre.
    Permite ademas seleccionar si incluye bajas o no
    */
-- Control de el parametro 'pDesde' por si viene igualado a cero

    IF pDesde <=0 AND pDesde != -1 THEN
        SET pDesde = 0;
    END IF;

-- Lista el personal dado de alta
IF(pIncluyeBajas = 0) then
    SELECT		p.IdPersona,p.Apellidos,p.Nombres,p.Usuario,r.Rol,p.EstadoPer as Estado
    FROM		personas p
				left join roles r on p.IdRol = r.IdRol
    WHERE		(p.IdRol = '2' OR p.IdRol = '3') AND p.EstadoPer = 'A'
    ORDER BY	p.apellidos asc
    LIMIT 		pDesde,5;

	SELECT COUNT(IdPersona) AS cantProf
	FROM Personas 
    WHERE (IdRol = '2' OR IdRol = '3') AND EstadoPer = 'A';
-- Lista el personal dado de alta y dado de baja
else
    SELECT		p.IdPersona,p.Apellidos,p.Nombres,p.Usuario,r.Rol,p.EstadoPer as Estado
    FROM		personas p
				left join roles r on p.IdRol = r.IdRol
    WHERE		p.IdRol = '2' OR p.IdRol = '3'
    ORDER BY	p.apellidos asc
    LIMIT 		pDesde,5;

	SELECT 	COUNT(IdPersona) AS cantProf
	FROM 	Personas 
    WHERE 	IdRol = '2' OR IdRol = '3';
    
end if;

END$$

DROP PROCEDURE IF EXISTS `bsp_listar_planes`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_planes` (IN `pDesde` INT, `pIncluyeBajas` INT)  BEGIN
	/*
	Permite listar los planes del gimnasio ordenadas por nombre.
    IdPlan = 1 no se lo lista por ser el plan por defecto
    Permite ademas seleccionar si incluye bajas o no
    */
-- Control de el parametro 'pDesde' por si viene igualado a cero

    IF pDesde <=0 AND pDesde != -1 THEN
        SET pDesde = 0;
    END IF;

-- Lista solo los planes dados de alta
IF(pIncluyeBajas = 0) then
    SELECT		*
    FROM		planes
    WHERE		EstadoPlan = 'A' AND IdPlan != 1
    ORDER BY	Plan asc
    LIMIT 		pDesde,5;

	SELECT COUNT(IdPlan) AS cantPlanes
	FROM 	planes 
    WHERE 	EstadoPlan = 'A' AND IdPlan != 1;

-- Lista los planes dados de alta y dado de baja
else
    SELECT		*
    FROM		planes
    WHERE		IdPlan != 1
    ORDER BY	Plan asc
    LIMIT 		pDesde,5;

	SELECT COUNT(IdPlan) AS cantPlanes
	FROM 	planes
    WHERE	IdPlan != 1;
end if;

END$$

DROP PROCEDURE IF EXISTS `bsp_listar_profesionales`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_profesionales` ()  BEGIN
	/*
	Permite listar los profesionales ordenadas por nombre.
    */
-- Control de el parametro 'pDesde' por si viene igualado a cero
    
	SELECT		IdPersona,Apellidos,Nombres,Correo
    FROM		personas
    WHERE		IdRol = '2' AND EstadoPer = 'A'
    ORDER BY	apellidos asc;


	SELECT COUNT(IdPersona) AS cantProf
	FROM Personas 
    WHERE IdRol = '2' AND EstadoPer = 'A';
    
END$$

DROP PROCEDURE IF EXISTS `bsp_listar_todos_planes`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_todos_planes` ()  BEGIN
	/*
	Permite listar todas los planes ordenados por id siempre que esta este activa
    Devuelve el total de los planes activos.
    No devuelve el IdPlan 1 ya que es el plan por defecto "Sin Plan"
    */
-- Control de el parametro 'pDesde' por si viene igualado a cero
    
    SELECT		*
    FROM		Planes
    WHERE		IdPlan != 1 AND EstadoPlan = 'A'
    ORDER BY	IdPlan asc;
    
 	SELECT COUNT(IdPlan) AS cantPlanes
 	FROM planes
    WHERE		IdPlan != 1 AND EstadoPlan = 'A';
END$$

DROP PROCEDURE IF EXISTS `bsp_listar_transacciones`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_transacciones` (`pDesde` INT, `pFechaInicio` DATE, `pFechaFin` DATE)  BEGIN
	/*
	Permite listar todas las transacciones , ingresos y egresos
    */

    IF pDesde <=0 THEN
        SET pDesde = 0;
    END IF;

    SELECT 		t.IdTransaccion,t.Fecha,p.Apellidos,p.Nombres,t.Monto,t.Cantidad,t.Descripcion,t.IdTransaccion,e.IdTransaccion
    FROM 		transacciones t 
				LEFT JOIN Personas p ON p.IdPersona = t.IdPersona
                LEFT JOIN egresos e ON e.IdTransaccion = t.IdTransaccion
 	WHERE  		((Fecha >= DATE_ADD(pFechaInicio, INTERVAL 1 DAY)) AND (Fecha <= DATE_ADD(pFechaFin, INTERVAL 1 DAY)))	-- Sumo 1 a las fechas por que asi me lo envia el front end
    GROUP BY 	t.IdTransaccion
    ORDER BY	t.IdTransaccion desc
 	LIMIT 		pDesde,5;
    
	SELECT	COUNT(IdTransaccion) AS maximo
	FROM 	Transacciones
    WHERE  	((Fecha >= DATE_ADD(pFechaInicio, INTERVAL 1 DAY)) AND (Fecha <= DATE_ADD(pFechaFin, INTERVAL 1 DAY)));
    
	-- SELECT pFechaInicio as pFechaInicio ,pFechaFin as pFechaFin; 

END$$

DROP PROCEDURE IF EXISTS `bsp_marcar_asistencia`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_marcar_asistencia` (`pIdPersona` SMALLINT)  SALIR:BEGIN
	/*
	Procedimiento que marca la asistencia de un cierto cliente con un IdPersona
    inscripto en un cierto plan
    */
    DECLARE pIdAsistencia,pIdPlan,pClasesDisponibles smallint;
-- Controlo que pIdPersona tenga clases disponibles en el plan o meses de credito , si no la da de baja en el plan
    IF ((SELECT ClasesDisponibles FROM clientes WHERE IdPersona = pIdPersona)  < 1)  THEN
		SELECT 'Plan actual agotado' AS Mensaje;
        LEAVE SALIR;
    END IF;
    
-- Controlo que el cliente no este dado de baja
    IF (SELECT EstadoCli FROM Clientes WHERE IdPersona = pIdPersona ) = 'B' THEN
		SELECT 'El cliente esta dado de baja' AS Mensaje;
        UPDATE	clientes
		SET		ClasesDisponibles = 0,mesesCredito = 0,IdPlan = 1
		WHERE	IdPersona = pIdPersona;
		LEAVE SALIR;
    END IF;
-- Obtengo el plan al cual esta asistiendo
    SET pIdPlan = (SELECT IdPlan FROM clientes WHERE IdPersona = pIdPersona);

-- Controlo que pIdPersona tenga clases disponibles en el plan o meses de credito , si no la da de baja en el plan
    IF (((SELECT ClasesDisponibles FROM clientes WHERE IdPersona = pIdPersona)  < 1) AND ((SELECT MesesCredito FROM clientes WHERE IdPersona = pIdPersona)  <= 0)) THEN
		SELECT 'Plan actual agotado' AS Mensaje;
        UPDATE	clientes
		SET		EstadoCli = 'B' , ClasesDisponibles = 0,IdPlan = 1
		WHERE	IdPersona = pIdPersona ;
        LEAVE SALIR;
    END IF;
    
    set pClasesDisponibles = (SELECT ClasesDisponibles FROM clientes WHERE IdPersona = pIdPersona);
-- Actualizo (marco la asistencia)
    UPDATE clientes 
    SET 	ClasesDisponibles = (pClasesDisponibles) - 1
    WHERE IdPersona = pIdPersona;
    
-- Inserto en el historico de asistencias
	SET pIdAsistencia = 1 + (SELECT COALESCE(MAX(IdAsistencia),0) FROM Asistencias);

	INSERT INTO Asistencias(IdAsistencia,IdPersona,IdPlan,Fecha)
    VALUES(pIdAsistencia,pIdPersona,pIdPlan,curdate());

	SELECT 'Ok' AS Mensaje;

END$$

DROP PROCEDURE IF EXISTS `bsp_modifica_plan`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_modifica_plan` (`pIdPlan` INT, `pPlan` VARCHAR(60), `pPrecio` DECIMAL, `pCantClases` INT, `pDescripcion` VARCHAR(250), `pEstadoPlan` CHAR(1))  SALIR:BEGIN
	/*
    Permite actualizar un plan, dado su Id, con todos sus datos.
    Devuelve OK o el mensaje de error en Mensaje.
    */
	-- Manejo de error en la transacción
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		ROLLBACK;
	END;
    
    -- Controla que el pPlan sea obligatorio
	IF pPlan = '' OR pPlan IS NULL THEN
		SELECT 'Debe proveer un Nombre para el Plan' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla que el plan exista 
	IF NOT EXISTS(SELECT IdPlan FROM planes WHERE IdPlan = pIdPlan ) THEN
		SELECT 'Plan inexistente' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Actualizo
   	UPDATE planes SET Plan = pPlan WHERE IdPlan = pIdPlan;
	UPDATE planes SET Descripcion = pDescripcion WHERE IdPlan = pIdPlan;
	UPDATE planes SET Precio = pPrecio WHERE IdPlan = pIdPlan;
	UPDATE planes SET EstadoPlan = pEstadoPlan WHERE IdPlan = pIdPlan;
	UPDATE planes SET CantClases = pCantClases WHERE IdPlan = pIdPlan;
    
	SELECT 'Ok' AS Mensaje;
END$$

DROP PROCEDURE IF EXISTS `bsp_movimientos_cliente`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_movimientos_cliente` (`pIdPersona` SMALLINT, `pDesde` INT)  SALIR:BEGIN
	/*
	Devuelve los movimientos (ingresos al gimnasio) de un cierto cliente
    junto con el plan respectivo
    */
    IF NOT EXISTS(SELECT IdPersona FROM	personas WHERE IdPersona = pIdPersona ) THEN
		SELECT 'La persona no existe!' AS Mensaje;
		LEAVE SALIR;
    END IF;

    IF pDesde <=0 THEN
        SET pDesde = 0;
    END IF;
    
	SELECT		t.Fecha,t.Monto,t.Cantidad,t.Descripcion,p.Plan
    FROM		(Transacciones t JOIN clientes c ON t.IdPersona = c.IdPersona) JOIN Planes p ON t.IdPlanAbonado = p.IdPlan
    WHERE		t.IdPersona = pIdPersona
	GROUP BY	t.IdTransaccion
    ORDER BY	t.IdTransaccion desc
    LIMIT 		pDesde,5;
    
    SELECT COUNT(IdTransaccion) AS maximo
	FROM   Transacciones 
    WHERE  IdPersona = pIdPersona; 
    
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
CREATE TABLE `asistencias` (
  `IdAsistencia` int(11) NOT NULL,
  `IdPersona` int(11) NOT NULL,
  `IdPlan` int(11) NOT NULL,
  `Fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `asistencias`
--

INSERT INTO `asistencias` (`IdAsistencia`, `IdPersona`, `IdPlan`, `Fecha`) VALUES
(1, 2, 2, '2020-09-11'),
(2, 2, 3, '2020-09-11'),
(3, 3, 2, '2020-09-12'),
(4, 4, 3, '2020-09-11'),
(5, 4, 3, '2020-09-11'),
(6, 4, 3, '2020-09-11'),
(7, 4, 4, '2020-09-12'),
(8, 4, 4, '2020-09-12'),
(9, 7, 5, '2020-11-28'),
(10, 7, 4, '2020-11-27'),
(11, 7, 5, '2020-11-28'),
(12, 8, 2, '2020-11-28'),
(13, 8, 2, '2020-11-28'),
(14, 3, 4, '2020-11-28'),
(15, 3, 4, '2020-11-28'),
(16, 3, 4, '2020-11-28'),
(17, 3, 4, '2020-11-28'),
(18, 3, 4, '2020-11-28'),
(19, 3, 4, '2020-11-28'),
(20, 3, 4, '2020-11-28'),
(21, 3, 4, '2020-11-28'),
(22, 3, 4, '2020-11-28'),
(23, 3, 4, '2020-11-28'),
(24, 3, 4, '2020-11-28'),
(25, 3, 4, '2020-11-28'),
(26, 3, 2, '2020-11-30'),
(27, 7, 5, '2020-11-30'),
(28, 11, 4, '2020-11-30'),
(29, 11, 4, '2020-11-30'),
(30, 11, 4, '2020-11-30'),
(31, 11, 4, '2020-11-30'),
(32, 11, 4, '2020-11-30'),
(33, 11, 4, '2020-11-30'),
(34, 11, 4, '2020-11-30'),
(35, 11, 4, '2020-11-30'),
(36, 11, 4, '2020-11-30'),
(37, 11, 4, '2020-11-30'),
(38, 11, 4, '2020-11-30'),
(39, 11, 4, '2020-11-30'),
(40, 10, 3, '2020-11-30'),
(41, 4, 4, '2020-11-30'),
(42, 13, 4, '2020-11-30'),
(43, 13, 4, '2020-11-30'),
(44, 13, 4, '2020-11-30'),
(45, 13, 4, '2020-11-30'),
(46, 13, 4, '2020-11-30'),
(47, 13, 4, '2020-11-30'),
(48, 13, 4, '2020-11-30'),
(49, 13, 4, '2020-11-30'),
(50, 13, 4, '2020-11-30'),
(51, 13, 4, '2020-11-30'),
(52, 13, 4, '2020-11-30'),
(53, 14, 2, '2020-11-30'),
(54, 14, 2, '2020-11-30'),
(55, 14, 2, '2020-11-30'),
(56, 14, 2, '2020-11-30'),
(57, 14, 2, '2020-11-30'),
(58, 14, 2, '2020-11-30');

-- --------------------------------------------------------

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes` (
  `IdPersona` int(11) NOT NULL,
  `IdPlan` int(11) DEFAULT NULL,
  `Objetivo` varchar(60) DEFAULT NULL,
  `EstadoCli` char(1) NOT NULL DEFAULT 'A' COMMENT 'Estado del cliente en un plan dado',
  `Ocupacion` varchar(60) DEFAULT NULL,
  `FechaInicio` date NOT NULL,
  `Horario` varchar(60) DEFAULT NULL,
  `ClasesDisponibles` int(11) DEFAULT NULL,
  `MesesCredito` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `clientes`
--

INSERT INTO `clientes` (`IdPersona`, `IdPlan`, `Objetivo`, `EstadoCli`, `Ocupacion`, `FechaInicio`, `Horario`, `ClasesDisponibles`, `MesesCredito`) VALUES
(2, 1, 'Jugar al basquet', 'B', 'Deportista', '2020-09-11', 'Noche', 0, 0),
(3, 1, 'Jugar al futbol n 10', 'B', 'Futbolista', '2020-09-11', 'Mañana', 0, 0),
(4, 4, 'Jugar de 10 y competir con messi', 'A', 'Futbolista', '2020-09-11', 'Noche', 11, 1),
(7, 1, 'Trabajar piernas y pectorales', 'B', 'Futbolista', '2020-11-28', 'Tarde/Noche', 0, 0),
(8, 1, 'Hombros', 'B', 'Contador', '2020-11-28', 'Mañana', 0, 0),
(10, 3, 'Jugar basquet', 'A', 'Deportista', '2020-11-30', 'Tarde y mañana', 2, 2),
(11, 1, 'Jugar hockey', 'B', 'Deportista profesional', '2020-11-30', 'Noche', 0, 0),
(12, 1, 'Jugar Futbol', 'B', 'Futbolista', '2020-11-30', 'Mañana', 0, 0),
(13, 4, 'Boxear con ambos brazos', 'A', 'Boxeador', '2020-11-30', 'Nocturno', 1, 1),
(14, 2, 'Jugar Basquet', 'A', 'Basquetbolista', '2020-11-30', 'Mañana', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `egresos`
--

DROP TABLE IF EXISTS `egresos`;
CREATE TABLE `egresos` (
  `IdTransaccion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `egresos`
--

INSERT INTO `egresos` (`IdTransaccion`) VALUES
(7),
(8),
(14),
(15),
(19);

-- --------------------------------------------------------

--
-- Table structure for table `mediciones`
--

DROP TABLE IF EXISTS `mediciones`;
CREATE TABLE `mediciones` (
  `IdMedicion` int(11) NOT NULL,
  `IdCliente` int(11) NOT NULL COMMENT 'IdPersona del cliente',
  `IdProfesional` int(11) NOT NULL COMMENT 'Id de la persona profesional',
  `Fecha` date NOT NULL,
  `Altura` decimal(5,2) DEFAULT NULL,
  `Peso` decimal(5,2) DEFAULT NULL,
  `IMC` float DEFAULT NULL,
  `Musc` float DEFAULT NULL,
  `Grasa` float DEFAULT NULL,
  `GV` float DEFAULT NULL,
  `EstadoMed` char(1) NOT NULL DEFAULT 'A'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mediciones`
--

INSERT INTO `mediciones` (`IdMedicion`, `IdCliente`, `IdProfesional`, `Fecha`, `Altura`, `Peso`, `IMC`, `Musc`, `Grasa`, `GV`, `EstadoMed`) VALUES
(1, 7, 5, '2020-11-28', '1.90', '91.00', 3, 6, 2, 3, 'A'),
(2, 7, 6, '2020-11-28', '1.90', '62.00', 3.5, 2, 2.1, 2.2, 'A'),
(3, 3, 6, '2020-11-28', '1.10', '60.00', 1.3, 2, 3, 4, 'A'),
(4, 7, 6, '2020-11-30', '1.65', '99.00', 2.3, 2.1, 5, 6.31, 'A');

-- --------------------------------------------------------

--
-- Table structure for table `personas`
--

DROP TABLE IF EXISTS `personas`;
CREATE TABLE `personas` (
  `IdPersona` int(11) NOT NULL,
  `IdTipoDocumento` int(11) NOT NULL,
  `IdRol` int(11) NOT NULL,
  `Apellidos` varchar(60) NOT NULL,
  `Nombres` varchar(60) NOT NULL,
  `Documento` char(10) NOT NULL,
  `Password` char(60) NOT NULL,
  `Telefono` varchar(30) DEFAULT NULL,
  `Sexo` char(1) NOT NULL,
  `FechaNac` date NOT NULL,
  `Correo` varchar(50) NOT NULL,
  `Usuario` varchar(60) DEFAULT NULL,
  `Calle` varchar(60) DEFAULT NULL,
  `Numero` int(11) DEFAULT NULL,
  `Piso` int(11) DEFAULT NULL,
  `Departamento` varchar(10) DEFAULT NULL,
  `Ciudad` varchar(60) DEFAULT NULL,
  `Pais` varchar(60) DEFAULT NULL,
  `EstadoPer` char(1) DEFAULT NULL,
  `Observaciones` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `personas`
--

INSERT INTO `personas` (`IdPersona`, `IdTipoDocumento`, `IdRol`, `Apellidos`, `Nombres`, `Documento`, `Password`, `Telefono`, `Sexo`, `FechaNac`, `Correo`, `Usuario`, `Calle`, `Numero`, `Piso`, `Departamento`, `Ciudad`, `Pais`, `EstadoPer`, `Observaciones`) VALUES
(1, 1, 3, 'AdminAp', 'AdminNom', '156875', '81dc9bdb52d04dc20036dbd8313ed055', '124565', '0', '2010-02-02', 'admin@gmail.com', 'admin', 'Santiago', 12, 8, '9', 'San miguel de tucuman', 'Argentina', 'A', 'Ninguna'),
(2, 1, 1, 'Ginobili', 'Fabricio', '1346798566', '81dc9bdb52d04dc20036dbd8313ed055', '45678792', '0', '2020-09-01', 'gino@gmail.com', 'ManuelGino', NULL, NULL, NULL, '', '', 'Argentina', 'B', 'Ninguna'),
(3, 1, 1, 'Messi', 'Lionel', '1232145664', '81dc9bdb52d04dc20036dbd8313ed055', '456645', '0', '2020-09-01', 'messi@gmail.com', 'messi', NULL, NULL, NULL, '', '', 'Argentina', 'A', 'Ninguna'),
(4, 1, 1, 'Maradona', 'Diego', '4567498787', '81dc9bdb52d04dc20036dbd8313ed055', '212365465', '0', '2020-09-07', 'marado@gmail.com', 'maradona', NULL, NULL, NULL, '', '', 'Chile', 'A', 'Ninguna'),
(5, 1, 2, 'Dybala', 'Paulo Marcelo', '1546654789', '81dc9bdb52d04dc20036dbd8313ed055', '45689662', '0', '2020-09-01', 'dybala@gmail.com', 'dybala', '', NULL, NULL, '', 'New York', 'EE UU', 'A', 'Ninguna'),
(6, 1, 2, 'Garcia', 'Jose Maria', '3465457846', '81dc9bdb52d04dc20036dbd8313ed055', '15435678', '0', '2009-12-10', 'garcia123@gmail.com', 'garciaJose', 'Virgen de la merced', 20, NULL, '', 'San miguel de tucuman', 'Argentina', 'A', 'Es un buen profesional'),
(7, 1, 1, 'Higuain', 'Marcelo Hugo', '12345687', '81dc9bdb52d04dc20036dbd8313ed055', '3819658742', '0', '2009-10-05', 'gonzaloHiguain@gmail.com', 'gonza', NULL, NULL, NULL, '', 'Buenos aires', 'Argentina', 'B', 'Ninguna'),
(8, 1, 1, 'Padilla', 'Mariano', '45656478', '81dc9bdb52d04dc20036dbd8313ed055', '456456', '0', '2020-11-03', 'mari@gmail.com', 'mariano', NULL, NULL, NULL, '', '', '', 'B', 'Ninguna'),
(9, 1, 2, 'Pizzini', 'Carlos', '456783126', '81dc9bdb52d04dc20036dbd8313ed055', '465897', '0', '2020-11-27', 'pizzini@gmail.com', 'pizzini', '', NULL, NULL, '', 'Ciudad 1', 'Colombia', 'A', 'Especialista en musculatura de cuello'),
(10, 1, 1, 'Ginobili', 'Manuel', '45678978', '81dc9bdb52d04dc20036dbd8313ed055', '45647896', '0', '2014-09-01', 'ginobili@gmail.com', 'ginoBili', NULL, NULL, NULL, '', '', '', 'A', 'Ninguna'),
(11, 1, 1, 'Aymar', 'Luciana', '459783213', '81dc9bdb52d04dc20036dbd8313ed055', '5645648', '1', '2020-11-19', 'aymar@gmail.com', 'aymar', NULL, NULL, NULL, '', '', '', 'A', 'Ninguna'),
(12, 1, 1, 'Cannigia', 'Daniel', '456897897', '81dc9bdb52d04dc20036dbd8313ed055', '45646512', '0', '2020-11-18', 'caniggia@gmail.com', 'cannigia', NULL, NULL, NULL, '', '', 'Argentina', 'A', 'Ninguna'),
(13, 1, 1, 'Monzon', 'Carlos', '123457897', '81dc9bdb52d04dc20036dbd8313ed055', '45646578', '0', '2020-11-02', 'monzon@gmail.com', 'monzon', NULL, NULL, NULL, '', '', '', 'A', 'Brazo izquierdo con dolencia'),
(14, 1, 1, 'Scola', 'Luis', '16574789', '81dc9bdb52d04dc20036dbd8313ed055', '5636875', '0', '2020-10-26', 'luis@gmail.com', 'ScolaLuis', NULL, NULL, NULL, '', '', '', 'A', 'Nignua');

-- --------------------------------------------------------

--
-- Table structure for table `planes`
--

DROP TABLE IF EXISTS `planes`;
CREATE TABLE `planes` (
  `IdPlan` int(11) NOT NULL,
  `Plan` varchar(60) NOT NULL,
  `Descripcion` varchar(250) DEFAULT NULL,
  `Precio` decimal(13,2) NOT NULL DEFAULT '0.00',
  `EstadoPlan` char(1) NOT NULL,
  `CantClases` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `planes`
--

INSERT INTO `planes` (`IdPlan`, `Plan`, `Descripcion`, `Precio`, `EstadoPlan`, `CantClases`) VALUES
(1, 'Sin Plan', 'Cualquier cliente que no este inscripto en algun plan', '1.00', 'B', 1),
(2, 'Zumba', 'Esta es una plan de zumba', '500.00', 'A', 6),
(3, 'Plan septiembre', 'Este es el plan de septiembre\n', '200.00', 'A', 3),
(4, 'Plan Uno', 'Este es el plan para vos!', '1600.00', 'A', 12),
(5, 'Plan invierno', 'Este es un buen plan para el invierno! No olvides inscribirte!', '1500.00', 'A', 13),
(6, 'Plan Movimiento ', 'Este es el plan para moverse', '900.00', 'B', 15);

-- --------------------------------------------------------

--
-- Table structure for table `profesionales`
--

DROP TABLE IF EXISTS `profesionales`;
CREATE TABLE `profesionales` (
  `IdPersona` int(11) NOT NULL,
  `FechaAlta` date DEFAULT NULL COMMENT 'Fecha en la que el profesional fue dado de alta en el centro',
  `FechaBaja` date DEFAULT NULL COMMENT 'Fecha en la que el profesional fue dado de baja aen el centro'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `profesionales`
--

INSERT INTO `profesionales` (`IdPersona`, `FechaAlta`, `FechaBaja`) VALUES
(1, '2020-09-11', NULL),
(5, '2020-09-12', '2020-11-30'),
(6, '2020-11-28', '2020-11-28'),
(9, '2020-11-30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `IdRol` int(11) NOT NULL,
  `Rol` varchar(50) NOT NULL,
  `Estado` char(1) NOT NULL DEFAULT 'A'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`IdRol`, `Rol`, `Estado`) VALUES
(1, 'Cliente', 'A'),
(2, 'Profesional', 'A'),
(3, 'Administrador', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `tiposdocumentos`
--

DROP TABLE IF EXISTS `tiposdocumentos`;
CREATE TABLE `tiposdocumentos` (
  `IdTipoDocumento` int(11) NOT NULL,
  `Documento` varchar(45) NOT NULL,
  `Descripcion` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tiposdocumentos`
--

INSERT INTO `tiposdocumentos` (`IdTipoDocumento`, `Documento`, `Descripcion`) VALUES
(1, 'DNI', 'Aqui va la descripcion de DNI'),
(2, 'CI', 'Aqui va la descripcion de CI'),
(3, 'CU', 'Aqui va la descripcion de CU');

-- --------------------------------------------------------

--
-- Table structure for table `transacciones`
--

DROP TABLE IF EXISTS `transacciones`;
CREATE TABLE `transacciones` (
  `IdTransaccion` int(11) NOT NULL,
  `IdPersona` int(11) DEFAULT NULL,
  `IdPlanAbonado` int(11) DEFAULT NULL COMMENT 'Id del plan abonado (null en caso de ser un egreso)',
  `Descripcion` varchar(60) DEFAULT NULL,
  `Monto` decimal(13,2) NOT NULL,
  `Fecha` date NOT NULL,
  `Cantidad` int(11) NOT NULL DEFAULT '0' COMMENT 'Cantidad de meses que pago un cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transacciones`
--

INSERT INTO `transacciones` (`IdTransaccion`, `IdPersona`, `IdPlanAbonado`, `Descripcion`, `Monto`, `Fecha`, `Cantidad`) VALUES
(1, 2, 2, 'Transferencia bancaria', '1000.00', '2020-09-11', 2),
(2, 2, 2, 'Transferencia bancaria', '1000.00', '2020-09-11', 2),
(3, 2, 3, '456', '200.00', '2020-09-11', 1),
(4, 4, 3, 'a', '200.00', '2020-09-11', 1),
(5, 3, 2, 'a', '2500.00', '2020-09-11', 5),
(6, 4, 3, 'Pago plan septiembre', '400.00', '2020-07-12', 2),
(7, NULL, NULL, 'Se compro guantes de boxeo', '600.00', '2020-09-12', 1),
(8, NULL, NULL, 'Se compro guantes de boxeo', '600.00', '2020-09-12', 1),
(9, 4, 4, 'Pago el plan Uno', '3200.00', '2020-09-12', 2),
(10, 4, 3, '3 septiembre', '600.00', '2020-09-12', 3),
(11, 4, 4, '3 de plan uno', '4800.00', '2020-09-11', 3),
(12, 7, 5, 'Pago con tarjeta de debito', '4500.00', '2020-11-28', 3),
(13, 8, 2, '-', '1500.00', '2020-11-28', 3),
(14, NULL, NULL, 'Se compro mancuernas', '600.00', '2020-11-28', 1),
(15, NULL, NULL, 'Se adquirio liquido para maquinaria vieja', '1235.00', '2020-11-28', 12),
(16, 3, 4, 'ninguno', '3200.00', '2020-11-28', 2),
(17, 3, 2, 'Solo asistira los miercoles', '1000.00', '2020-11-30', 2),
(18, 10, 5, 'Ninguno', '4500.00', '2020-11-30', 3),
(19, NULL, NULL, 'Se pago internet', '500.00', '2020-11-30', 3),
(20, 11, 4, 'Dejo una transferencia bancaria', '4800.00', '2020-11-30', 3),
(21, 11, 3, 'Pago 3 meses de plan septiembre', '600.00', '2020-11-30', 3),
(22, 11, 5, 'Dejo señado', '6000.00', '2020-11-30', 4),
(23, 11, 4, '-', '3200.00', '2020-11-30', 2),
(24, 11, 3, '-', '200.00', '2020-11-30', 1),
(25, 11, 3, '--', '200.00', '2020-11-30', 1),
(26, 10, 3, 'Pago manuel', '600.00', '2020-11-30', 3),
(27, 4, 4, 'Pago efectivo', '3200.00', '2020-11-30', 2),
(28, 12, 5, 'Dejo pagado mitad con tarjeta y mitad efectivo', '3000.00', '2020-07-30', 2),
(29, 13, 4, 'Pago 2 meses de plan uno', '3200.00', '2020-11-30', 2),
(30, 14, 2, 'Pago 1 mes de zumba', '500.00', '2020-11-30', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asistencias`
--
ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`IdAsistencia`),
  ADD KEY `fk_Asistencias_Clientes1_idx` (`IdPersona`);

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`IdPersona`),
  ADD KEY `fk_Clientes_Planes1_idx` (`IdPlan`);

--
-- Indexes for table `egresos`
--
ALTER TABLE `egresos`
  ADD PRIMARY KEY (`IdTransaccion`);

--
-- Indexes for table `mediciones`
--
ALTER TABLE `mediciones`
  ADD PRIMARY KEY (`IdMedicion`,`IdCliente`),
  ADD KEY `fk_Mediciones_Profesionales1_idx` (`IdProfesional`),
  ADD KEY `fk_Mediciones_Clientes1_idx` (`IdCliente`);

--
-- Indexes for table `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`IdPersona`),
  ADD UNIQUE KEY `IdPersona_UNIQUE` (`IdPersona`),
  ADD UNIQUE KEY `Documento_UNIQUE` (`Documento`),
  ADD UNIQUE KEY `Correo_UNIQUE` (`Correo`),
  ADD UNIQUE KEY `Usuario_UNIQUE` (`Usuario`),
  ADD KEY `fk_Personas_TiposDocumentos1_idx` (`IdTipoDocumento`),
  ADD KEY `fk_Personas_Roles1_idx` (`IdRol`);

--
-- Indexes for table `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`IdPlan`);

--
-- Indexes for table `profesionales`
--
ALTER TABLE `profesionales`
  ADD PRIMARY KEY (`IdPersona`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`IdRol`);

--
-- Indexes for table `tiposdocumentos`
--
ALTER TABLE `tiposdocumentos`
  ADD PRIMARY KEY (`IdTipoDocumento`);

--
-- Indexes for table `transacciones`
--
ALTER TABLE `transacciones`
  ADD PRIMARY KEY (`IdTransaccion`),
  ADD KEY `fk_Transacciones_Clientes1_idx` (`IdPersona`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `personas`
--
ALTER TABLE `personas`
  MODIFY `IdPersona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `asistencias`
--
ALTER TABLE `asistencias`
  ADD CONSTRAINT `fk_Asistencias_Clientes1` FOREIGN KEY (`IdPersona`) REFERENCES `clientes` (`IdPersona`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `fk_Clientes_Personas1` FOREIGN KEY (`IdPersona`) REFERENCES `personas` (`IdPersona`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Clientes_Planes1` FOREIGN KEY (`IdPlan`) REFERENCES `planes` (`IdPlan`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `egresos`
--
ALTER TABLE `egresos`
  ADD CONSTRAINT `fk_Egresos_Transacciones1` FOREIGN KEY (`IdTransaccion`) REFERENCES `transacciones` (`IdTransaccion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `mediciones`
--
ALTER TABLE `mediciones`
  ADD CONSTRAINT `fk_Mediciones_Clientes1` FOREIGN KEY (`IdCliente`) REFERENCES `clientes` (`IdPersona`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Mediciones_Profesionales1` FOREIGN KEY (`IdProfesional`) REFERENCES `profesionales` (`IdPersona`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `personas`
--
ALTER TABLE `personas`
  ADD CONSTRAINT `fk_Personas_Roles1` FOREIGN KEY (`IdRol`) REFERENCES `roles` (`IdRol`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Personas_TiposDocumentos1` FOREIGN KEY (`IdTipoDocumento`) REFERENCES `tiposdocumentos` (`IdTipoDocumento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `profesionales`
--
ALTER TABLE `profesionales`
  ADD CONSTRAINT `fk_Profesionales_Personas1` FOREIGN KEY (`IdPersona`) REFERENCES `personas` (`IdPersona`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `transacciones`
--
ALTER TABLE `transacciones`
  ADD CONSTRAINT `fk_Transacciones_Clientes1` FOREIGN KEY (`IdPersona`) REFERENCES `clientes` (`IdPersona`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

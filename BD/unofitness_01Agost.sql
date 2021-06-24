-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 02, 2020 at 02:59 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `unofitness`
--
CREATE DATABASE IF NOT EXISTS `unofitness` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `unofitness`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `bsp_actualiza_estado_cliente`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_actualiza_estado_cliente` (`pIdPersona` SMALLINT)  SALIR:BEGIN
	/*
	Procedimiento que se ejecuta cada vez que accede un cliente 
    para verificar su estado
    */
    DECLARE pClasesDisponibles,pIdPlan smallint;
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
    

-- Controla que no se le haya pasado el mes
    /*IF DATE_ADD( (SELECT MAX(Fecha) FROM Transacciones WHERE IdPersona = pIdPersona), INTERVAL 1 MONTH) < CURDATE()  THEN
		SELECT 'Plan vencido' AS Mensaje;
        UPDATE	Clientes
		SET		EstadoCli = 'B' , ClasesDisponibles = 0, IdPLan = 1
		WHERE	IdPersona = pIdPersona;
		LEAVE SALIR;
    END IF;*/
    
-- Controlo que pIdPersona tenga clases disponibles, si no la da de baja
    /*IF ((SELECT ClasesDisponibles FROM Clientes WHERE IdPersona = pIdPersona)  <= 1) THEN
		SELECT 'Plan actual agotado' AS Mensaje;
        UPDATE	Clientes
		SET		EstadoCli = 'B' , ClasesDisponibles = 0, IdPLan = 1
		WHERE	IdPersona = pIdPersona;
    END IF;*/

-- Obtengo la ultima fecha en la cual pago (Empezo a asistir) a su plan
    SET pUltimoPago = (SELECT MAX(Fecha) 
						FROM transacciones t
						JOIN clientes c on t.IdPlanAbonado = c.IdPlan
                        WHERE c.IdPersona = pIdPersona AND c.IdPlan = pIdPlan);

-- Controlo si pIdPersona tiene meses de credito disponible y no le quedaron clases disponibles
-- , de ser asi, se setean las nuevas clases disponibles
    IF (((SELECT MesesCredito FROM Clientes WHERE IdPersona = pIdPersona)  != 0 ) AND ((SELECT ClasesDisponibles FROM Clientes WHERE IdPersona = pIdPersona) <= 0 )) THEN
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_actualiza_profesional` (`pIdPersona` INT(11), `pIdTipoDocumento` INT(11), `pIdRol` CHAR(1), `pApellidos` VARCHAR(60), `pNombres` VARCHAR(60), `pDocumento` INT(11), `pPassword` CHAR(32), `pTelefono` VARCHAR(30), `pSexo` CHAR(1), `pObservaciones` VARCHAR(250), `pFechaNac` DATE, `pCorreo` VARCHAR(50), `pUsuario` VARCHAR(60), `pCalle` VARCHAR(60), `pPiso` INT(11), `pDepartamento` VARCHAR(10), `pCiudad` VARCHAR(60), `pPais` VARCHAR(60), `pNumero` INT(11), `pEstado` CHAR(1))  SALIR:BEGIN
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
IF (SELECT Usuario FROM Personas WHERE IdPersona = pIdPersona ) != pUsuario THEN
	IF (SELECT Usuario FROM Personas WHERE Usuario = pUsuario) THEN
		SELECT 'Ya existe una persona con ese usuario' AS Mensaje;
		LEAVE SALIR;
    END IF;
END IF;

-- Actualizo
   	UPDATE Personas SET IdTipoDocumento = pIdTipoDocumento WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Apellidos = pApellidos WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Nombres = pNombres WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Documento = pDocumento WHERE IdPersona = pIdPersona;
	UPDATE Personas SET IdRol = pIdRol WHERE IdPersona = pIdPersona;
    
-- Si no se selecciono una CONTRASEÑA o viene vacia , entonces se deja como estaba
	IF pPassword != '' OR pPassword IS NOT NULL THEN
		UPDATE Personas SET Password = MD5(pPassword) WHERE IdPersona = pIdPersona;
    END IF;	
    
	UPDATE Personas SET Sexo = pSexo WHERE IdPersona = pIdPersona;

-- Si no se selecciono una fecha de nacimiento  o viene vacia , entonces se deja como estaba
	IF pFechaNac != '' OR pFechaNac = '0000-00-00' OR pFechaNac IS NOT NULL THEN
		UPDATE Personas SET FechaNac = pFechaNac WHERE IdPersona = pIdPersona;
    END IF;	
    
	UPDATE Personas SET Correo = pCorreo WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Usuario = pUsuario WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Calle = pCalle WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Piso = pPiso WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Departamento = pDepartamento WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Ciudad = pCiudad WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Pais = pPais WHERE IdPersona = pIdPersona;
	UPDATE Personas SET Numero = pNumero WHERE IdPersona = pIdPersona;
    UPDATE Personas SET EstadoPer = pEstado WHERE IdPersona = pIdPersona;
    
	SELECT 'Ok' AS Mensaje;
END$$

DROP PROCEDURE IF EXISTS `bsp_alta_cliente`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_alta_cliente` (`pIdTipoDocumento` INT(11), `pApellidos` VARCHAR(60), `pNombres` VARCHAR(60), `pDocumento` INT(11), `pPassword` CHAR(32), `pTelefono` VARCHAR(30), `pSexo` CHAR(1), `pObservaciones` VARCHAR(250), `pFechaNac` DATE, `pCorreo` VARCHAR(50), `pUsuario` VARCHAR(60), `pCalle` VARCHAR(60), `pPiso` INT(11), `pDepartamento` VARCHAR(10), `pCiudad` VARCHAR(60), `pPais` VARCHAR(60), `pNumero` INT(11), `pObjetivo` VARCHAR(60), `pOcupacion` VARCHAR(60), `pHorario` VARCHAR(60))  SALIR:BEGIN
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
	/*DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;*/
    -- Controla que el correo sea obligatorio 
	IF pCorreo = '' OR pCorreo IS NULL THEN
		SELECT 'Debe proveer un nombre para el correo' AS Mensaje, NULL AS Id;
		LEAVE SALIR;
    END IF;
    

-- Controla que exista el tipo de documento 
	IF NOT EXISTS (SELECT IdTipoDocumento FROM tiposdocumentos WHERE IdTipoDocumento = pIdTipoDocumento) OR pIdTipoDocumento = '' OR pIdTipoDocumento IS NULL THEN
		SELECT 'Tipo de documento inexistente' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
    -- Controla que el Documento sea obligatorio
	IF pDocumento = '' OR pDocumento IS NULL THEN
		SELECT 'Debe proveer un documento' AS Mensaje, NULL AS Id;
		LEAVE SALIR;
    END IF;

    -- Controla que el Documento sea obligatorio
	IF pApellidos = '' OR pApellidos IS NULL THEN
		SELECT 'Debe proveer un Apellido' AS Mensaje, NULL AS Id;
		LEAVE SALIR;
    END IF;
    
    -- Controla que el Documento sea obligatorio
	IF pNombres = '' OR pNombres IS NULL THEN
		SELECT 'Debe proveer un Nombre' AS Mensaje, NULL AS Id;
		LEAVE SALIR;
    END IF;
    
-- Controla que una persona no exista previamente con estado 'B'
	IF EXISTS (SELECT Correo FROM personas WHERE Correo = pCorreo) THEN
		-- Esta dada de baja ?
        IF (SELECT EstadoPer FROM Personas WHERE Correo = pCorreo) = 'B' THEN
			SELECT 'Correo existente el la BD, dado de baja' AS Mensaje;
			SELECT IdPersona FROM personas WHERE Correo = pCorreo;
			LEAVE SALIR;
		END IF;
    END IF;

-- Controla que una persona no exista previamente con estado 'B'
	IF EXISTS (SELECT Usuario FROM personas WHERE Usuario = pUsuario) THEN
		-- Esta dada de baja ?
        IF (SELECT EstadoPer FROM Personas WHERE Usuario = pUsuario) = 'B' THEN
			SELECT 'Existente el la BD' AS Mensaje;
			SELECT IdPersona FROM personas WHERE Usuario = pUsuario;
			LEAVE SALIR;
		END IF;
    END IF; 
     
-- Controla que una persona no exista previamente con estado 'B'
	IF EXISTS (SELECT Documento FROM personas WHERE Documento = pDocumento) THEN
		-- Esta dada de baja ?
        IF (SELECT EstadoPer FROM Personas WHERE Documento = pDocumento) = 'B' THEN
			SELECT 'Existente el la BD' AS Mensaje;
            SELECT IdPersona FROM personas WHERE Documento = pDocumento;
			LEAVE SALIR;
		END IF;
    END IF;

    -- Controla que no exista un documento con el mismo numero que este activo
	IF EXISTS (SELECT Documento FROM personas WHERE Documento = pDocumento) THEN
		-- Esta dada de 
        IF (SELECT EstadoPer FROM Personas WHERE Documento = pDocumento) = 'A' THEN
			SELECT 'Ya existe un documento con ese numero' AS Mensaje;
			LEAVE SALIR;
		END IF;
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
-- Controlo si el esta asistiendo a algun plan
	IF (SELECT IdPlan FROM Clientes WHERE IdPersona = pIdPersona) != 1 THEN
		-- Si esta asistiendo a algun plan, ¿Es pIdPlan?
		IF (SELECT IdPlan FROM Clientes WHERE IdPersona = pIdPersona) = pIdPlan THEN
			-- Si es asi, entonces sumo como meses de credito
			UPDATE Clientes SET mesesCredito = (SELECT mesesCredito FROM Clientes WHERE IdPersona = pIdPersona) + pCantidad;
		ELSE
			-- Select 'Debe esperar a que venza el plan actual para poder empezar con el siguiente' AS Mensaje;
            -- No esta asistiendo a pIdPlan, entonces actualizo el plan al cual asistira
            UPDATE	Clientes 
			SET		IdPlan = pIdPlan,ClasesDisponibles = pClasesDisponibles,MesesCredito = pCantidad,EstadoCli = 'A'
			WHERE	IdPersona = pIdPersona;
		END IF;
	ELSE
-- Si el cliente no esta asistiendo a algun plan, entonces cargo el nuevo plan
		UPDATE 	Clientes 
		SET 	IdPlan = pIdPlan,ClasesDisponibles = pClasesDisponibles,EstadoCli = 'A',MesesCredito = pCantidad
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
		SELECT 'OK' AS Mensaje;
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_alta_profesional` (`pIdTipoDocumento` INT(11), `pIdRol` INT, `pApellidos` VARCHAR(60), `pNombres` VARCHAR(60), `pDocumento` INT(11), `pPassword` CHAR(32), `pTelefono` VARCHAR(30), `pSexo` CHAR(1), `pObservaciones` VARCHAR(250), `pFechaNac` DATE, `pCorreo` VARCHAR(50), `pUsuario` VARCHAR(60), `pCalle` VARCHAR(60), `pPiso` INT(11), `pDepartamento` VARCHAR(10), `pCiudad` VARCHAR(60), `pPais` VARCHAR(60), `pNumero` INT(11))  SALIR:BEGIN
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
		SELECT 'Debe proveer un nombre para el correo' AS Mensaje, NULL AS Id;
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

DROP PROCEDURE IF EXISTS `bsp_dame_asistencias`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_dame_asistencias` (`pIdPersona` SMALLINT)  SALIR:BEGIN
	DECLARE pSalida smallint;
	/*
	Procedimiento que sirve para instanciar una persona desde la base de datos.
    */
    IF NOT EXISTS(SELECT * FROM	personas WHERE IdPersona = pIdPersona ) THEN
		SELECT 'La persona no existe!' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
	SELECT	*
    FROM	personas
    WHERE	IdPersona = pIdPersona;
END$$

DROP PROCEDURE IF EXISTS `bsp_dame_clasesDisponibles`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_dame_clasesDisponibles` (`pIdPersona` SMALLINT, `pIdPlan` INT)  SALIR:BEGIN
	/*
	Procedimiento que sirve para instanciar una asistencia desde la base de datos.
    */
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
		-- SELECT 'Error en la transacción. Contáctese con el administrador.' Mensaje;
		-- NULL AS Id;
		ROLLBACK;
	END;
    
-- Controla la existencia de la persona FUNCIONA
    IF NOT EXISTS(SELECT IdPersona FROM personas WHERE IdPersona = pIdPersona ) THEN
		SELECT 'La persona no existe' AS Mensaje;
		LEAVE SALIR;
    END IF;

-- Controla la persona no este dada de baja
    IF (SELECT EstadoPer FROM personas WHERE IdPersona = pIdPersona ) = 'B' THEN
		SELECT 'La persona esta dada de baja' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
-- Controla la existencia del plan
    IF NOT EXISTS(SELECT IdPlan FROM planes WHERE IdPlan = pIdPlan )THEN
		SELECT 'El plan no existe' AS Mensaje;
		LEAVE SALIR;
    END IF;

-- Controla el plan no este dado de baja
    IF (SELECT EstadoPlan FROM planes WHERE IdPlan = pIdPlan ) = 'B' THEN
		SELECT 'El plan esta dado de baja' AS Mensaje;
		LEAVE SALIR;
    END IF;

-- Controla que la persona tenga contratado ese plan
      IF NOT EXISTS(SELECT * FROM Asistencias WHERE (IdPersona = pIdPersona AND IdPlan != pIdPlan)) THEN
		SELECT 'La persona con ese plan no existe!' AS Mensaje;
		LEAVE SALIR;
    END IF;  

	SELECT	*
    FROM	asistencias a
    WHERE	(IdPersona = pIdPersona AND IdPlan = pIdPlan);
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
    
    SELECT		IdMedicion,Fecha,Altura,Peso,IMC,Musc,Grasa,GV
    FROM		Mediciones
    WHERE		IdMedicion = pIdMedicion;
    
    SELECT 'Ok' as Mensaje;

END$$

DROP PROCEDURE IF EXISTS `bsp_dame_persona`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_dame_persona` (`pIdPersona` SMALLINT)  SALIR:BEGIN
	DECLARE pSalida smallint;
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
		SELECT	IdPersona,IdTipoDocumento,IdRol,Apellidos,Nombres,Documento,Telefono,Sexo
				,Observaciones,EstadoPer,DATE_FORMAT(FechaNac,'%d-%m-%Y') as FechaNac,Correo,Usuario
                ,Calle,Numero,Piso,Pais,Ciudad,Pais
		FROM	personas
		WHERE	IdPersona = pIdPersona;
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_dame_plan` (IN `pIdPlan` SMALLINT)  SALIR:BEGIN
	DECLARE pSalida smallint;
	/*
	Procedimiento que sirve para instanciar un plan desde la base de datos.
    */
    IF NOT EXISTS(SELECT * FROM	planes WHERE IdPlan = pIdPlan ) THEN
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
    IF NOT EXISTS(SELECT IdPersona FROM	personas WHERE IdPersona = pIdPersona ) THEN
		SELECT 'La persona no existe!' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
	IF (((SELECT IdPlan FROM clientes WHERE IdPersona = pIdPersona ) is null) OR ((SELECT IdPlan FROM clientes WHERE IdPersona = pIdPersona ) = 1)) THEN
		SELECT 'La persona no esta inscripta en ningun plan!' AS Mensaje;
		LEAVE SALIR;
    END IF;
    
	SELECT	p.IdPlan,p.Plan,c.ClasesDisponibles,c.MesesCredito,MAX(DATE_FORMAT(c.FechaUltimaAsistencia, "%d/%m/%Y")) as FechaUltimaAsistencia,'Ok' AS Mensaje
	FROM	clientes c JOIN planes p 
    ON		c.IdPlan = p.IdPlan
	WHERE	p.IdPlan != 1 AND c.IdPersona = pIdPersona;
 
END$$

DROP PROCEDURE IF EXISTS `bsp_dame_total_mediciones`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_dame_total_mediciones` (`pIdCliente` SMALLINT)  SALIR:BEGIN
	/*
	Procedimiento que sirve para dar la cantidad de mediciones que tiene un cliente con un cierto Id
    */
    
-- Controla que la persona(cliente) exista
    IF NOT EXISTS(SELECT * FROM	mediciones WHERE IdCliente = pIdCliente ) THEN
		SELECT 0 AS Total;
		LEAVE SALIR;
    END IF;
    
    SELECT COUNT(IdMedicion) AS Total 
	FROM mediciones
	WHERE IdCliente = pIdCliente;

END$$

DROP PROCEDURE IF EXISTS `bsp_darbaja_persona`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_darbaja_persona` (`pIdPersona` SMALLINT)  SALIR:BEGIN
	/*
    Permite cambiar el estado de la persona a B: Baja siempre y cuando no 
    esté dada de baja ya y exista en la BD.
    Ademas si es un cliente o un entrenador lo da de baja en la respectiva tabla
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

-- Si es un PROFESIONAL lo da de baja en la tabla PROFESIONALES tambien
	IF EXISTS (SELECT IdPersona FROM Profesionales WHERE IdPersona = pIdPersona) THEN
		UPDATE	Profesionales
		SET		EstadoProf = 'B'
		WHERE	IdPersona = pIdPersona;
	END IF;

-- Si es un CLIENTE lo da de baja en la tabla CLIENTES tambien
	IF EXISTS (SELECT IdPersona FROM Clientes WHERE IdPersona = pIdPersona) THEN
		UPDATE	Clientes
		SET		EstadoCli = 'B'
		WHERE	IdPersona = pIdPersona;
        
        -- Seteo a '0' todas las clases o planes inscriptos
		UPDATE	Asistencias
		SET		ClasesDisponibles = 0 AND mesesCredito = 0
		WHERE	IdPersona = pIdPersona;
	END IF;
    
-- Da de baja en tabla personas
    UPDATE	Personas
    SET		EstadoPer = 'B'
    WHERE	IdPersona = pIdPersona;
    
    SELECT 'OK' AS Mensaje;
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

DROP PROCEDURE IF EXISTS `bsp_listar_clientes_plan_estado`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_listar_clientes_plan_estado` (IN `pDesde` INT, `pIdPlan` INT, `pIncluyeBajas` CHAR)  SALIR:BEGIN
	/*
	Permite listar los clientes desde un cierto valor y de un cierto plan.
    Permite seleccionar si incluye los dados de baja o no (EstadoCli) (S: si - N: no)
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
		WHERE		(pIncluyeBajas = 'S' OR (pIncluyeBajas = 'N' AND c.EstadoCli = 'A')) AND c.IdPLan = pIdPlan AND EstadoPer = 'A'
	-- 	GROUP BY	p.IdPersona
		ORDER BY	p.Apellidos asc
		LIMIT 		pDesde,5;
        
		SELECT 	COUNT(c.IdPersona) AS cantCli
		FROM 	(personas p JOIN clientes c ON p.IdPersona = c.IdPersona)
		WHERE  	c.IdPLan = pIdPlan AND (pIncluyeBajas = 'S' OR (pIncluyeBajas = 'N' AND c.EstadoCli = 'A')) AND EstadoPer = 'A';
	END IF; 

-- Muestra todos los clientes incluidos los que NO esten inscripton en algun plan
  	IF (pIdPlan = -1 ) THEN
		SELECT		p.IdPersona,p.Apellidos,p.Nombres,c.IdPlan,c.ClasesDisponibles
		FROM		(personas p JOIN clientes c ON p.IdPersona = c.IdPersona)
		WHERE		pIncluyeBajas = 'S' OR (pIncluyeBajas = 'N' AND c.EstadoCli = 'A') AND EstadoPer = 'A'
	-- 	GROUP BY	p.IdPersona
		ORDER BY	p.Apellidos asc
		LIMIT 		pDesde,5;
        
		SELECT 	COUNT(c.IdPersona) AS cantCli
		FROM 	personas p JOIN clientes c ON p.IdPersona = c.IdPersona
		WHERE  	pIncluyeBajas = 'S' OR (pIncluyeBajas = 'N' AND c.EstadoCli = 'A') AND EstadoPer = 'A';
	END IF; 

-- Muestra los clientes que estan inscriptos en algun plan
	IF (pIdPlan = 0 )THEN
		SELECT		p.IdPersona,p.Apellidos,p.Nombres,pl.Plan,c.IdPlan,c.ClasesDisponibles
		FROM		personas p JOIN clientes c ON p.IdPersona = c.IdPersona JOIN planes pl ON pl.IdPlan = c.IdPlan
		WHERE		(pIncluyeBajas = 'S' OR (pIncluyeBajas = 'N' AND c.EstadoCli = 'A') AND EstadoPer = 'A') AND c.IdPlan != 1
	-- 	GROUP BY	p.IdPersona
		ORDER BY	p.Apellidos asc
		LIMIT 		pDesde,5;
        
		SELECT 	COUNT(c.IdPersona) AS cantCli
		FROM	(personas p JOIN clientes c ON p.IdPersona = c.IdPersona) JOIN planes pl ON pl.IdPlan = c.IdPlan
		WHERE  	(pIncluyeBajas = 'S' OR (pIncluyeBajas = 'N' AND c.EstadoCli = 'A') AND EstadoPer = 'A') AND c.IdPlan != 1;
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
 	WHERE  (t.Fecha >= pFechaInicio AND t.Fecha <= pFechaFin)
    group by e.IdTransaccion
	ORDER BY 	t.Fecha desc
    LIMIT 	pDesde,5;
    
	SELECT COUNT(e.IdTransaccion) AS maximo
	FROM 	egresos e
			left join transacciones t on t.IdTransaccion = e.IdTransaccion
    WHERE  (Fecha >= pFechaInicio AND Fecha <= pFechaFin);
    
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
 	WHERE  		(t.Fecha >= pFechaInicio AND t.Fecha <= pFechaFin) and e.IdTransaccion is null
	GROUP BY 	t.IdTransaccion
    ORDER BY 	t.Fecha desc
    LIMIT 		pDesde,5;

	SELECT  COUNT(t.IdTransaccion) AS maximo
	FROM  	transacciones t
			LEFT join egresos e ON t.IdTransaccion = e.IdTransaccion
    WHERE  	(t.Fecha >= pFechaInicio AND t.Fecha <= pFechaFin) and e.IdTransaccion is null;
    
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
    -- ORDER BY	IdMedicion asc
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
    WHERE IdRol = '2' OR IdRol = '3' AND EstadoPer = 'A';
-- Lista el personal dado de alta y dado de baja
else
    SELECT		p.IdPersona,p.Apellidos,p.Nombres,p.Usuario,r.Rol,p.EstadoPer as Estado
    FROM		personas p
				left join roles r on p.IdRol = r.IdRol
    WHERE		p.IdRol = '2' OR p.IdRol = '3'
    ORDER BY	p.apellidos asc
    LIMIT 		pDesde,5;

	SELECT COUNT(IdPersona) AS cantProf
	FROM Personas 
    WHERE IdRol = '2' OR IdRol = '3';
    
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
    WHERE		IdPlan != 1
    ORDER BY	IdPlan asc;
    
 	SELECT COUNT(IdPlan) AS cantPlanes
 	FROM planes
    WHERE		IdPlan != 1;
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
 	WHERE  		Fecha >= pFechaInicio AND Fecha <= pFechaFin
    GROUP BY 	t.IdTransaccion
    ORDER BY	t.IdTransaccion desc
 	LIMIT 		pDesde,5;
    
	SELECT	COUNT(IdTransaccion) AS maximo
	FROM 	Transacciones
    WHERE  		Fecha >= pFechaInicio AND Fecha <= pFechaFin;
    
	-- SELECT pFechaInicio as pFechaInicio ,pFechaFin as pFechaFin; 

END$$

DROP PROCEDURE IF EXISTS `bsp_marcar_asistencia_cliente_plan`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `bsp_marcar_asistencia_cliente_plan` (`pIdPersona` SMALLINT, `pIdPlan` INT)  SALIR:BEGIN
	/*
	Procedimiento que marca la asistencia de un cierto cliente con un IdPersona
    inscripto en un cierto plan
    */

-- Controlo que el cliente no este dado de baja
    IF (SELECT EstadoCli FROM Clientes WHERE IdPersona = pIdPersona ) = 'B' THEN
		SELECT 'El cliente esta dado de baja' AS Mensaje;
        UPDATE	clientes
		SET		ClasesDisponibles = 0,mesesCredito = 0,FechaUltimaAsistencia = curdate()
		WHERE	IdPersona = pIdPersona AND IdPlan = pIdPlan;
		LEAVE SALIR;
    END IF;

-- Controla que no se le haya pasado el mes ; LO HACE OTRO SP
    /*IF DATE_ADD( (SELECT Fecha FROM clientes WHERE IdPersona = pIdPersona AND IdPlan = pIdPlan), INTERVAL 1 MONTH) < CURDATE()  THEN
		SELECT 'Plan vencido' AS Mensaje;
		LEAVE SALIR;
    END IF;*/
    
-- Controlo que pIdPersona tenga clases disponibles en el plan pIdPlan, si no la da de baja en el plan pIdPlan
    IF ((SELECT ClasesDisponibles FROM clientes WHERE IdPersona = pIdPersona AND IdPlan = pIdPlan)  <= 1) THEN
		SELECT 'Plan actual agotado' AS Mensaje;
        UPDATE	clientes
		SET		EstadoCli = 'B' , ClasesDisponibles = 0,FechaUltimaAsistencia = curdate()
		WHERE	IdPersona = pIdPersona AND IdPlan = pIdPlan;
        LEAVE SALIR;
    END IF;
    
    
-- Actualizo (marco la asistencia)
    UPDATE clientes 
    SET ClasesDisponibles = (SELECT ClasesDisponibles FROM clientes WHERE IdPersona = pIdPersona AND IdPlan = pIdPlan) - 1,FechaUltimaAsistencia = curdate()
    WHERE IdPersona = pIdPersona AND IdPlan = pIdPlan;
    
-- Controlo que pIdPersona tenga clases disponibles en algun plan   en el plan pIdPlan en el mes corriente y posea meses de credito, si no lo da de baja
   IF ((SELECT ClasesDisponibles FROM clientes WHERE IdPersona = pIdPersona AND IdPlan = pIdPlan)  = 0 AND (SELECT mesesCredito FROM clientes WHERE IdPersona = pIdPersona AND IdPlan = pIdPlan) = 0) THEN
		UPDATE	Clientes 
		SET		EstadoCli = 'B'
		WHERE	IdPersona = pIdPersona AND IdPlan = pIdPlan;
    END IF;

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
    FROM		(Transacciones t JOIN clientes c ON t.IdPersona = c.IdPersona) JOIN Planes p ON c.IdPlan = p.IdPlan
    WHERE		t.IdPersona = pIdPersona
	GROUP BY	t.IdTransaccion
    ORDER BY	t.IdTransaccion asc
    LIMIT 		pDesde,5;
    
    SELECT COUNT(IdTransaccion) AS maximo
	FROM   Transacciones 
    WHERE  IdPersona = pIdPersona; 
    
END$$

DELIMITER ;

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
  `MesesCredito` int(11) DEFAULT NULL,
  `FechaUltimaAsistencia` date DEFAULT NULL COMMENT 'Fecha la cual se marco la ultima asistencia'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `clientes`
--

INSERT INTO `clientes` (`IdPersona`, `IdPlan`, `Objetivo`, `EstadoCli`, `Ocupacion`, `FechaInicio`, `Horario`, `ClasesDisponibles`, `MesesCredito`, `FechaUltimaAsistencia`) VALUES
(2, 2, NULL, 'A', NULL, '2020-08-23', NULL, 6, 3, NULL),
(6, 1, 'Jugar al fubol', 'B', 'Futbolista', '2020-09-01', 'Mañana', 0, 0, NULL),
(7, 5, 'Jugar y mejorar cada dia', 'A', 'Futbolista', '2020-09-01', 'Noche', 3, 1, NULL);

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
(2);

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
(1, 2, 5, '2020-09-01', '2.00', '100.00', 3, 1.5, 3.2, 1.5, 'A');

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
  `Documento` varchar(60) NOT NULL,
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
(1, 1, 3, 'AdminAp', 'AdminNom', '4565465', '81dc9bdb52d04dc20036dbd8313ed055', '4566', '1', '1990-02-02', 'admin@admin.com', 'admin', 'admin', 2, 2, 'admin', 'admin', 'admin', 'A', 'Ninguna'),
(2, 1, 1, 'Messi', 'Lionel', '52313213', '81dc9bdb52d04dc20036dbd8313ed055', '456546', '0', '2020-08-04', 'messi@gmail.com', 'Messi', NULL, NULL, NULL, '', '', '', 'A', ''),
(3, 1, 2, 'Ronaldo', 'Cristiano', '164565446', '81dc9bdb52d04dc20036dbd8313ed055', '4646', '0', '2020-08-04', 'Ronaldo@gmail.com', 'Ronaldo', '', NULL, NULL, '', '', '', 'A', 'Empieza hoy'),
(4, 1, 2, 'Beckan', 'David', '546659', '81dc9bdb52d04dc20036dbd8313ed055', '456896', '0', '2020-08-05', 'david@gmail.com', 'DavidBeckan', '', NULL, NULL, '', '', '', 'A', 'Juega Futbol'),
(5, 1, 2, 'Molina', 'Andrea', '2147483647', '81dc9bdb52d04dc20036dbd8313ed055', '15489665', '1', '0000-00-00', 'molina@gmail.com', 'molina', 'Gral Paz', 500, 5, '', 'San miguel de tucuman', 'Argetina', 'A', 'Ninguna'),
(6, 1, 1, 'Maradona', 'Diego', '456789789', '81dc9bdb52d04dc20036dbd8313ed055', '456456', '0', '2010-08-04', 'diego@gmail.com', 'Diego', NULL, NULL, NULL, '', '', '', 'A', 'Ninguna'),
(7, 1, 1, 'Maradona', 'Miguel', '4565646', '81dc9bdb52d04dc20036dbd8313ed055', '456465', '0', '2020-06-02', 'maradoMigu@gmail.com', 'MaradoMig', NULL, NULL, NULL, '', '', '', 'A', '');

-- --------------------------------------------------------

--
-- Table structure for table `planes`
--

DROP TABLE IF EXISTS `planes`;
CREATE TABLE `planes` (
  `IdPlan` int(11) NOT NULL,
  `Plan` varchar(60) NOT NULL,
  `Descripcion` varchar(250) DEFAULT NULL,
  `Precio` decimal(13,2) NOT NULL DEFAULT 0.00,
  `EstadoPlan` char(1) NOT NULL,
  `CantClases` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `planes`
--

INSERT INTO `planes` (`IdPlan`, `Plan`, `Descripcion`, `Precio`, `EstadoPlan`, `CantClases`) VALUES
(1, 'Sin Plan', 'Cualquier cliente que no este inscripto en algun plan', '1.00', 'B', 1),
(2, 'Zumba con aerobic', 'Para lucir un cuerpo esplendido', '500.00', 'A', 7),
(3, 'Plan verano', 'Este es el plan que necesitas!', '1500.00', 'B', 3),
(4, 'Plan para la cuarentena', 'Este es un buen plan', '600.00', 'B', 3),
(5, 'Completo ', 'Este es un plan para que puedas disfrutar por completo\n', '1500.00', 'A', 3);

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
(1, '2020-08-23', NULL),
(3, '2020-08-24', NULL),
(4, '2020-08-24', NULL),
(5, '2020-09-01', NULL);

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
(3, 'Administrador', 'B');

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
  `Cantidad` int(11) NOT NULL DEFAULT 0 COMMENT 'Cantidad de meses que pago un cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transacciones`
--

INSERT INTO `transacciones` (`IdTransaccion`, `IdPersona`, `IdPlanAbonado`, `Descripcion`, `Monto`, `Fecha`, `Cantidad`) VALUES
(1, 2, 2, 'Pago 3 meses de zumba , lionewl', '1500.00', '2020-08-23', 3),
(2, NULL, NULL, 'Se compro remeras para sortear', '900.00', '2020-09-01', 1),
(3, 7, 4, 'Pago 2 de cuarentena', '1200.00', '2020-09-01', 2),
(4, 7, 5, 'Se cambio a completo', '1500.00', '2020-09-01', 1);

--
-- Indexes for dumped tables
--

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
  MODIFY `IdPersona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

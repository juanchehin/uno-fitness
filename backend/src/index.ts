import express, { Application } from 'express';
// import morgan from 'morgan';
import cors from 'cors';
  

import indexRoutes from './routes/indexRoutes';
import personasRoutes from './routes/personasRoutes';
import tiposdocumentosRoutes from './routes/tiposdocumentosRoutes';
import loginRoutes from './routes/loginRoutes';
import planesRoutes from './routes/planesRoutes';
import medicionesRoutes from './routes/medicionesRoutes';
import cajaRoutes from './routes/cajaRoutes';
import asistenciaRoutes from './routes/asistenciaRoutes';



class Server {

    public app: Application;
    
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);
        // CORS
        /*this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin: http://localhost", "*");
            // res.header("Access-Control-Allow-Origin", "localhost:4220");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "POST, GET, PUT , DELETE, OPTIONS");
            next();
          });*/
          
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        
    }

// ==================================================
//        RUTAS
// ==================================================
    routes(): void {

        // ******* Configuracion de CORS ********
        // Creo una lista blanca
        var listaBlanca = ['http://localhost:4200']
        // Creo la configuracion
          var configuracionCORS = {
            // Creo la funcion 'origin'
            origin: function (req:any, res:any) {
              // console.log('req es : ', req);
              // console.log('listaBlanca.indexOf(req) es : ', listaBlanca.indexOf(req));
              // Pregunro si se encontro el valor ; -1 si no se encuentra dicho valor
              if (listaBlanca.indexOf(req) !== -1) {
                res(null, true)
              } else {
                res(new Error('Bloqueado por CORS'))
                return;
              }
            }
          }


        this.app.use('/', cors(configuracionCORS),indexRoutes);
        this.app.use('/api/personas', personasRoutes);
        this.app.use('/api/tiposdocumentos', tiposdocumentosRoutes);
        this.app.use('/api/login', loginRoutes);
        this.app.use('/api/planes', planesRoutes);
        this.app.use('/api/mediciones', medicionesRoutes);
        this.app.use('/api/caja', cajaRoutes);
        this.app.use('/api/asistencias', asistenciaRoutes);

    }

// ==================================================
//   Inicio el servicio en el puerto 3000
// ==================================================
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server en puerto', this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();
[![Status][status-shield]][status-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<div align="center">
  <a href="https://github.com/hmfarias/notredame-backend-II">
    <img src="https://github.com/hmfarias/notredame-backend-II/blob/main/src/public/img/logo.png" alt="Logo" width="350" height="auto">
  </a>
  <h1 align="center">BACKEND</h1>

  <p align="center">
    Polirubro online
    <br />
    <a href="" target="_blank" ><strong>»</strong></a>
    <br />
    <br />
    <a href="https://github.com/hmfarias/notredame-backend-II">Ver repositorio</a>
    ·
    <a href="https://github.com/hmfarias/notredame-backend-II/issues">Reportar un error</a>
    ·
    <a href="https://github.com/hmfarias/notredame-backend-II/issues">Solicitar función</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

<a name="top"></a>

## 📚 Tabla de Contenidos

- [📌 Introducción](#introduccion)
- [🛠️ Construido con](#construido)
- [🧩 Consideraciones Importantes](#consideraciones)
  - 🎨 [Maquetación y CSS](#maquetacion)
  - 💾 [Persistencia](#persistencia)
  - 📡 [Acceso a los datos](#accesodatos)
  - 🧪 [Rutas y Simulación del Front con Handlebars](#handlebars)
  - 💬 [Comentarios en el código](#comentarios)
- [🔐 Credenciales - .env](#credenciales)
- [💻 Instalación en local](#instalacionlocal)
  - ⚙️ [Configuración del Puerto desde Línea de Comandos](#comander)
- [🚀 Funcionamiento de la Aplicación](#funcionamiento)
  - 🧱 [Arquitectura](#arquitectura)
  - 🗂️ [Estructura de archivos](#estructura)
  - 🔐 [Uso de Passport Strategies](#passport)
  - 🧑‍💼 A. [Gestión de Usuarios](#usuarios)
    - 📥 [Método GET en Current](#getcurrent)
  - 🛍️ B. [Gestión de Productos](#productos)
  - 🛒 C. [Gestión de Carritos](#carritos)
    - 🔄 [Estrategia de Gestión de Carrito - Usuarios Autenticados y Visitantes](#estrategiacarrito)
- [🤝 Contribuyendo](#contribuyendo)
- [📄 Licencia](#licencia)
- [📬 Contacto](#contacto)

<hr>

<!-- ABOUT THE PROJECT -->

<a name="introduccion"></a>

## 📌 INTRODUCCION

Bienvenidos al backend de Notre Dame, tu tienda polirubro online exclusiva. Este repositorio contiene la infraestructura y lógica de negocio que impulsa nuestra plataforma, garantizando una experiencia de compra eficiente, segura y confiable.

Nuestro backend ha sido diseñado para gestionar usuarios, productos y carritos de compra, asegurando un flujo de datos ágil y seguro. Implementamos las mejores prácticas en desarrollo, seguridad y escalabilidad para ofrecer un servicio robusto y optimizado.

Gracias por visitar nuestro repositorio. ¡Esperamos que disfrutes explorando y contribuyendo a este proyecto!

[Volver al menú](#top)

<hr>

<a name="construido"></a>

## 🛠️ CONSTRUIDO CON

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) como framework de código abierto para crear aplicaciones web y APIs. Está escrito en JavaScript y se ejecuta en el entorno de Node.js

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) (HyperText Markup Language) como lenguaje de marcación de hipertéxto estándar utilizado para crear y diseñar páginas web.

![Handlebars](https://img.shields.io/badge/Handlebars-%23000000?style=for-the-badge&logo=Handlebars.js&logoColor=white) para la vista en el frontend

![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) (Cascading Style Sheets, Level 3) como lenguaje de diseño gráfico utilizado para controlar el aspecto visual de las páginas web, separando el contenido (HTML) de la presentación visual (CSS).

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) como lenguaje de programación interpretado, de alto nivel y dinámico. Se ejecuta en el navegador del cliente, lo que permite la creación de páginas web interactivas y dinámicas.

![Static Badge](https://img.shields.io/badge/Sweer%20Alert-green?style=for-the-badge) como biblioteca de JavaScript que facilita la creación de alertas y diálogos personalizados y estéticamente agradables en la aplicacion web.

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) como sistema de gestión de bases de datos (SGBD) no relacional y de código abierto. Se lo ha utilizado para almacenar y procesar los datos de la app.

![Static Badge](https://img.shields.io/badge/Mongoose-white?style=for-the-badge) como biblioteca de JavaScript que permite modelar y gestionar datos en bases de datos MongoDB. Se lo ha utilizado para: definir esquemas, validar datos, administrar relaciones entre datos, interactuar con MongoDB, traducir entre objetos en código y su representación en MongoDB, simplificar las operaciones de MongoDB y trabajar de forma más ordenada y con menor margen de error

![Static Badge](https://img.shields.io/badge/Passport-violet?style=for-the-badge) como middleware de Node.js que permite implementar diversas estrategias de autenticación en la aplicación.

[Volver al menú](#top)

<hr>

<a name="consideraciones"></a>

## 🧩 CONSIDERACIONES IMPORTATES

<a name="maquetacion"></a>

### 🎨 MAQUETACIÓN Y CSS DE LA PAGINA

El enfoque principal de la aplicación ha sido el desarrollo del backend, no obstante lo cual, se ha implementado una maquetación básica para ofrecer un entorno visual limpio y funcional que facilite la prueba de sus funcionalidades.

El diseño de la interfaz sigue una estructura sencilla pero organizada, asegurando una navegación clara y una experiencia de usuario intuitiva. Se han aplicado estilos CSS básicos para mejorar la presentación de los datos sin descuidar el rendimiento ni la accesibilidad.

[Volver al menú](#top)

<hr>

<a name="persistencia"></a>

### 💾 PERSISTENCIA DE DATOS EN LA APLICACIÓN

La aplicación implementa la persistencia de datos utilizando MongoDB como sistema de base de datos NoSQL, en combinación con Mongoose como Object Data Modeling (ODM) para Node.js. Esta integración permite una gestión eficiente de las operaciones CRUD (Crear, Leer, Actualizar, Eliminar), proporcionando una interfaz flexible y estructurada para interactuar con la base de datos.

El uso de Mongoose no solo simplifica la manipulación de datos mediante esquemas bien definidos, sino que también mejora la integridad y coherencia de la información almacenada, facilitando la validación y el manejo de relaciones entre documentos.

[Volver al menú](#top)

<hr>

<a name="accesodatos"></a>

### 📡 ACCESO A LOS DATOS

El acceso a los datos se gestiona a través de DAOs (Data Access Objects). Esta arquitectura garantiza una clara separación entre la lógica de negocio y el acceso a la base de datos, promoviendo un diseño modular y escalable.

Gracias a esta abstracción, si en el futuro se decide cambiar el sistema de persistencia (por ejemplo, migrar de MongoDB a otro motor de base de datos), solo será necesario implementar nuevos Managers sin afectar la estructura ni la lógica de las rutas existentes. Esto facilita el mantenimiento y la evolución del sistema con mínima intervención en el código.

[Volver al menú](#top)

<hr>

<a name="handlebars"></a>

### 🧪 RUTAS Y SIMULACION DEL FRONT CON HANDLEBARS

En esta aplicación se implementan rutas para la interacción con el backend y también para simular el comportamiento del frontend mediante vistas construidas con Handlebars.
Las rutas del backend están diseñadas para devolver respuestas en formato JSON, siguiendo el enfoque típico de una API RESTful.
Cada vista cuenta con su propio archivo JavaScript, encargado de realizar las peticiones, actualizar dinámicamente los datos mostrados y gestionar la visualización de mensajes para el usuario.

[Volver al menú](#top)

<hr>

<a name="comentarios"></a>

### 💬 COMENTARIOS EN EL CÓDIGO

Dado que esta aplicación tiene un propósito didáctico, se han incluido comentarios en el código para facilitar su comprensión y estudio. Estos comentarios explican la lógica de implementación y el flujo de datos dentro de la aplicación.

Sin embargo, en un proyecto real, se recomienda minimizar el uso de comentarios innecesarios, priorizando un código limpio y autoexplicativo mediante buenas prácticas de nomenclatura y estructuración.

[Volver al menú](#top)

<hr>

<a name="credenciales"></a>

## 🔐 CREDENCIALES (archivo .env)

Antes de ejecutar la aplicación, es necesario crear un archivo .env en la carpeta raíz (donde se encuentra el package.json). Este archivo almacenará las variables de entorno necesarias para la configuración del servidor y la conexión a la base de datos. CON FINES DIDÁCTICOS SE DETALLA SU CONTENIDO PARA PODER PROBAR LA APLICACIÓN.

### 🟢 Contenido que debe tener el archivo .env:

```
/**
* Environment variables
*/
# Server Configuration
PORT=3000

SECRET_KEY="X9v$3jK@pLm7!zQwT2"

# Database Configuration
DB_USER=hmfarias
DB_PASSWORD=QQATDs4SdAAWYa23
DB_HOST=cluster0.fergg.mongodb.net
APP_NAME=Cluster0
DB_NAME=backendII

# Github Configuration
GITHUB_CLIENT_ID="Iv23lilcJZrO7UjGM8Y7"
GITHUB_CLIENT_SECRET="a17bf66aef1fdc6d9958f1b240cbc7df06f101d8"
GITHUB_CALLBACK_URL="http://localhost:3000/api/sessions/callbackGithub"
```

Este archivo a su vez es procesado por `/src/config/config.js`, que es quien finalmente se encarga de cargar las variables de entorno y configurar los valores necesarios para el funcionamiento de la aplicación, como el puerto del servidor y la conexión a la base de datos.

[Volver al menú](#top)

<hr>

<a name="instalaciónlocal"></a>

## 💻 INSTALACIÓN EN LOCAL

### **Prerequisitos:**

Antes de instalar la aplicación, asegúrate de contar con:

- Un editor de código como **Visual Studio Code** o similar.
- **Node.js** y **npm** instalados en tu sistema.

### **Pasos para la instalación:**

1. **Ubicar el directorio de instalación:**  
   En tu terminal o consola, navega hasta la carpeta donde deseas instalar la aplicación.

2. **Clonar el repositorio:**  
   Ejecuta el siguiente comando para clonar el proyecto:

   ```
     git clone https://github.com/hmfarias/notredame-backend-II.git
   ```

   Esto creará una carpeta llamada notredame-backend-II con todos los archivos de la aplicación.

3. **Abrir el proyecto en el editor de código:**
   Abre Visual Studio Code (o tu editor de preferencia) y selecciona la carpeta backend-ecommerce-mongoDB.

4. **Abrir una terminal en la carpeta del proyecto:**
   Asegúrate de estar ubicado dentro de la carpeta notredame-backend-II en la terminal.

5. **Instalar las dependencias:**

   Ejecuta el siguiente comando para instalar las dependencias del proyecto:

   ```
   npm install
   ```

6. **Configurar las variables de entorno:**
   Crea un archivo .env en la raíz del proyecto con la configuración de las credenciales (ver sección CREDENCIALES (.env)).
   Consulta la configuración de credenciales en la sección [CREDENCIALES (.env)](#environment).
7. **Iniciar la aplicación en modo desarrollador:**
   Ejecuta el siguiente comando:

   ```
   npm run dev
   o bien:
   node src/app.js
   ```

   Esto iniciará el servidor y mostrará un mensaje en la terminal indicando que la aplicación está corriendo en el puerto 3000 y conectada a la base de datos.

8. **Acceder a la aplicación desde el navegador:**
   Abre una nueva pestaña en tu navegador y accede a la siguiente dirección:
   http://localhost:3000

✅ ¡Listo! Ya puedes explorar y probar la aplicación en tu entorno local. 🚀

[Volver al menú](#top)

<hr>

<a name="comander"></a>

## ⚙️ Configuración del Puerto desde Línea de ComandosL

La aplicación permite establecer el puerto en el que se ejecuta el servidor de forma dinámica a través de la línea de comandos, gracias al uso de la librería **commander**.

🛠️ Prioridad de asignación del puerto:

1. Parámetro pasado por CLI → node src/app.js --port 4000
2. Variable de entorno .env → PORT= 3000
3. Valor por defecto → 8080

```
# Usando la opción larga
node src/app.js --port 4000
o bien:
npm run dev -- --port 4000

# Usando la opción corta
node src/app.js -p 4000
o bien:
npm run dev -- -p 4000
```

Esto brinda flexibilidad al momento de desplegar o testear la aplicación en distintos entornos o puertos, sin necesidad de modificar archivos de configuración.

[Volver al menú](#top)

<hr>

<a name="funcionamiento"></a>

## 🚀 FUNCIONAMIENTO DE LA APLICACION

<a name="arquitectura"></a>

### 🧱 Arquitectura

La aplicación está basada en una arquitectura **MVC (Modelo-Vista-Controlador)** y utiliza **MongoDB** como sistema de persistencia, gestionado a través de **Mongoose** como ODM. Esto permite realizar las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) de forma eficiente y simplificada.

Los datos se acceden mediante **DAO (Data Acces Object)** (clases), lo que permite una separación clara entre la lógica de negocio y el acceso a la base de datos. De esta forma, si se decidiera cambiar el sistema de persistencia, bastaría con modificar o crear nuevos managers sin necesidad de alterar las rutas de la aplicación. Esta estructura proporciona flexibilidad y escalabilidad al proyecto.

[Volver al menú](#top)

<hr>

<a name="estructura"></a>

### 🗂️ Estructura de archivos de la Aplicación

La aplicación tiene la siguiente estructura básica de archivos y carpetas:

```
|-src/
├── config/
│   └── config.js  // Lógica para manejar las variables de entorno provistas en .env
│   └── database.config.js  // Lógica para manejar la conexíon a la BD
│   └── passport.config.js  // Middleware de Passport que implementa las estrategias de registro y autorización
│
├── dao/
│   └── models
│   │   └── user.model.js  // Modelo de datos de usuarios en MongoDB
│   │   └── product.model.js  // Modelo de datos de productos en MongoDB
│   │   └── cart.model.js // Modelo de datos de carritos en MongoDB
│   └── CartsManagerMongo.js  // Lógica de interacción con la base de datos de carritos
│   └── ProductsManagerMongo.js  // Lógica de interacción con la base de datos de productos
│   └── UsersManagerMongo.js  // Lógica de interacción con la base de datos de usuarios
│
├── logs/ // Archivos de registro de errores inesperados en la aplicación - Inicialmente no existe y se crea automáticamente al ocurrir el primer error inesperado
│
├── middlewares/
│   └── auth.js  // Lógica de autenticación con JWT (queda sin uso al implementar passport estrategia jwt)
│   └── authorisation.js  // Lógica de autorización para las rutas de la aplicación
│
├── public/
│   └── css/
│       └── styles.css // Maneja la maquetación de la aplicacion
│   └── img/
│       └── defect-product.png // Imagen por defecto para un producto - incluida a los fines de prueba
│       └── logo.png // archivo png con el logo de la app
│   └── js/
│       └── cart.js  // Lógica de gestión del carrito
│       └── current.js  // Lógica de estrategia current que devuelve los datos del ususario autenticado en el sistema
│       └── home.js  // Lógica de la página de inicio
│       └── login.js  // Lógica de la página de login
│       └── navbar.js  // Lógica de la barra de navegación
│       └── newProduct.js  // Lógica de la página de nuevo producto
│       └── product.js  // Lógica de la página de producto
│       └── register.js  // Lógica de la página de registro de ususarios
│       └── update.js  // Lógica de la página de actualización de producto
│
├── routes/
│   └── carts.router.js  // Rutas relacionadas con el carrito
│   └── sessions.router.js  // Rutas relacionadas con las sessiones (registro - login - current)
│   └── products.router.js  // Rutas relacionadas con los productos
│   └── users.router.js  // Rutas relacionadas con los usuarios
│   └── viewsRouter.js  // Rutas relacionadas con las vistas handlebar
│
├── testData / // Carpeta que contiene datos de prueba para la aplicación
│   └── products.json // Archivo JSON con datos de prueba de productos
│
├── views/
│   └── layouts/
│   │   └── main.handlebars // layout base para el frontend
│   └── partials/
│   │   └── header.handlebars // layout para el header de la app
│   └── cart.handlebars  // Vista de carrito
│   └── current.handlebars  // Vista que muestra los datos del ususario autenticado en el sistema
│   └── home.handlebars  // Vista de la home page de la página
│   └── login.handlebars  // Vista de la página para hacer login al sistema
│   └── newProduct.handlebars  // Vista de la página para agregar un nuevo producto
│   └── product.handlebars  // Vista de la página para mostrar un producto
│   └── products.handlebars  // Vista de la página para mostrar todos los productos
│   └── register.handlebars  // Vista de registro de ususarios
│   └── update.handlebars  // Vista de la página para actualizar un producto
│
├── app.js  // Archivo principal que inicia el servidor
├── utils.js  // crea y exporta una variable __dirname que proporciona la ruta del archivo App.js y funciones para proteger las contraseñas mediante encriptación, y registrar errores inesperados en archivos de log
├── utilsMulter.js  // configura el manejo de archivos mediante la librería multer para la carga de imágenes en la aplicación.
├── .env  // Variables de entorno
└── package.json  // Dependencias y configuraciones del proyecto
└── readme.md  // Este archivo
```

[Volver al menú](#top)

<hr>

<a name="passport"></a>

### 🔐 Uso de Passport Strategies

Esta aplicación utiliza Passport como middleware de autenticación, implementando dos estrategias principales:

🧾 **Estrategia Local**

La estrategia local permite la autenticación tradicional mediante email y contraseña. Se utiliza en las rutas de login y register, y su función principal es verificar las credenciales ingresadas por el usuario con los datos almacenados en la base de datos.

- Se realiza hashing de contraseñas con bcrypt para asegurar la información del usuario.
- Al iniciar sesión correctamente, se genera un JWT y se guarda en el navegador del cliente como una cookie HTTP-only, lo cual evita accesos desde JavaScript y mejora la seguridad.

🔑 **Estrategia JWT**

La estrategia JWT se emplea para proteger rutas privadas. El token se extrae automáticamente desde la cookie enviada por el cliente en cada petición.

- Si el token es válido y no ha expirado, se permite el acceso a la ruta.
- En caso contrario, la solicitud se rechaza con un mensaje adecuado.

⚙️ **Función passportCall**

La autenticación en las rutas se maneja mediante una función personalizada llamada passportCall, que encapsula el uso de Passport y agrega una capa extra de control sobre:

- Qué estrategia se utiliza (local o jwt)
- Cómo manejar errores de autenticación
- Cómo continuar la ejecución si el usuario es válido

Esto permite centralizar la lógica y facilitar el mantenimiento del sistema de autenticación.

📦 **Cookie y Seguridad**

El token JWT se almacena en una cookie con las siguientes configuraciones de seguridad:

```
res.cookie('token', token, {
	httpOnly: true,
	sameSite: 'strict',
	maxAge: 1000 * 60 * 60 * 24 // 1 día
});
```

Esto garantiza que:
• El token no es accesible desde JavaScript (httpOnly)
• Se restringe el envío de cookies entre sitios (sameSite: 'strict')
• Tiene una duración maxima de 24 horas por defecto (salvo que el token expire antes)

[Volver al menú](#top)

<hr>

<a name="flujoseguridad"></a>

### 🛡️ Flujo de Seguridad en las Rutas

Las rutas en la aplicación siguen un proceso estructurado de control de acceso antes de ejecutar su funcionalidad principal:

1. 🧩 Middleware de Autenticación (passportCall)

   - Verifica si el usuario posee un token válido (JWT).
   - Si no es válido o no existe, la petición se rechaza con un error 401 Unauthorized.
   - Si es válido, la petición avanza.

2. 🔒 Middleware de Autorización (authorisation)

   - Verifica si el usuario autenticado posee los permisos necesarios (por ejemplo, rol admin).
   - Si no cumple con los permisos, la petición se rechaza con un error 403 Forbidden.
   - Si cumple, la petición continúa.

3. ⚙️ Controlador (Controller)

   - Ejecuta la lógica principal de la ruta (por ejemplo, obtener usuarios, crear productos, actualizar carritos, etc.).
   - Devuelve la respuesta en formato JSON (application/json).

4. 🗄️ Acceso a Datos (DAO - Data Access Object)

   - Interactúa directamente con la base de datos (MongoDB en este caso).
   - Realiza operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sin que el controlador se preocupe de los detalles de la persistencia.

5. 📦 Respuesta JSON
   - Finalmente, se envía al cliente una respuesta estandarizada en formato application/json, indicando éxito o error de la operación.

**Esquema:**

```
Request (usuario)
   ↓
Router
   ↓
passportCall('current') ✅
   ↓
authorisation(['admin']) ✅
   ↓
Controller (lógica de negocio)
   ↓
DAO (acceso a la base de datos)
   ↓
Response (JSON)
```

✍️ Nota

El **router** solo **organiza el flujo de middlewares** y delega en los controladores las operaciones de negocio.
Los **controladores aplican lógica de negocio** y gestionan el acceso a los DAOs,
Los **DAOs manejan directamente la comunicación con la base de datos**.
Esto garantiza un diseño en capas, ordenado y fácil de escalar.

[Volver al menú](#top)

<hr>

<a name="usuarios"></a>

### 🧑‍💼 Gestión de Usuarios

🔙 **Backend**

La gestión de usuarios en esta aplicación se maneja a través del modelo `user.model.js`, que define la estructura de cada registro de usuario en la base de datos. Este modelo incluye campos como

- first_name:String,
- last_name:String,
- email:String (único)
- age:Number,
- password:String(Hash)
- cart:Id con referencia a Carts
- role:String(default:’user’)

**Estrategia de Gestión de Sesión**

- Registro y login con passport-local.
- Validación de sesión y token con passport-jwt.
- El token JWT se almacena en una cookie segura.

**Rutas REST (API):**

- POST /api/sessions/register → Registro de usuario.
- POST /api/sessions/login → Inicio de sesión.
- GET /api/sessions/current → Obtener usuario autenticado (con JWT).
- POST /api/sessions/logout → Cerrar sesión.

**Autorización por rol:**

- Se diferencia el comportamiento de usuarios admin y user.
- Restricciones para ciertas acciones solo disponibles para admin.

💻 **Frontend**

**Vistas:**

- register.handlebars y login.handlebars para autenticación.
- current.handlebars para visualizar y editar datos del usuario logueado.

**Manejo de Sesión:**

- localStorage se utiliza para almacenar temporalmente los datos del usuario (currentUser).
- Los accesos al menú (navbar) se habilitan o deshabilitan según el estado de sesión y rol del usuario.

**Feedback al Usuario:**

- Se muestran alertas personalizadas con SweetAlert2 para errores, éxito o advertencias.
- Se verifica en tiempo real si el usuario tiene sesión activa (JWT válido) antes de mostrar ciertas vistas o permitir acciones.

**Creación de Usuario**: Los usuarios se pueden agregar a la base de datos mediante el formulario de registro en el frontend. Se validan los datos, se encripta la contraseña y se cargan en la base de datos, donde se guardan con un identificador único (`_id`).

**Visualización de Usuarios**: Los datos de un usuario logueado al sistema se pueden obtener en la ruta api/sessions/current. (debe estar logueado en el sistema)

#### 🔶 Relación con el Carrito

Cada usuario tiene un campo cart que referencia a un carrito solo por su `_id`, lo que optimiza el almacenamiento. Para obtener los detalles completos de un carrito dentro del usuario, se utiliza el método `populate` de Mongoose. Este permite cargar toda la información del carrito, sin necesidad de almacenarla duplicada, lo que mejora la eficiencia de la base de datos.

Esta estructura hace que la gestión de usuarios sea flexible y eficiente.

<hr>
<a name="get"></a>

### 📥 El método GET en CURRENT:

El método GET de usuario en la aplicación está diseñado para recuperar los datos de un usuario autenticado en el sistema (con token generado al momento del login); y devuelve los datos en el siguiente formato:

```
{
    "error": false,
    "message": "Authenticated user",
    "payload": {
        "_id": "67f199a5ad908916c9c2bc9e",
        "first_name": "Marce",
        "last_name": "Farias",
        "email": "marce@test.com",
        "age": 54,
        "cart": null,
        "role": "user",
        "__v": 0,
        "iat": 1743894822,
        "exp": 1743895422
    }
}
```

[Volver al menú](#top)

<hr>

<a name="productos"></a>

### 🛍️ Gestión de Productos

La gestión de productos en esta aplicación está diseñada para ser robusta y eficiente, combinando una API RESTful en el backend con una interfaz dinámica del lado del cliente en el frontend.

🔙 **Backend**

La lógica del backend está construida con Node.js, Express y MongoDB, siguiendo principios REST.

📦 Funcionalidades del Backend

- Endpoints RESTful disponibles en /api/products
- GET /api/products: Listado con filtros, ordenamiento y paginación.
- GET /api/products/:id: Obtener un producto por ID.
- POST /api/products: Crear un nuevo producto (requiere rol admin).
- PUT /api/products/:id: Actualizar un producto existente (requiere rol admin).
- DELETE /api/products/:id: Eliminar un producto (requiere rol admin).
- Validación de campos en la creación y edición de productos.
- Verificación de duplicados por título antes de insertar o actualizar.
- Carga opcional de imágenes mediante multer.
- Control de acceso mediante autenticación con JWT y roles.
- Paginación dinámica implementada con mongoose-paginate-v2.

💻 **Frontend**

El frontend está basado en Handlebars como motor de plantillas y JavaScript modular para la lógica dinámica del lado del cliente.

🎨 Funcionalidades del Frontend
**Vista principal (products.handlebars)**

- Lista todos los productos.
- Permite aplicar filtros por categoría, estado de stock y orden por precio.
- Incluye paginación dinámica generada desde products.js.
- Los datos se obtienen desde la API y se renderizan dinámicamente sin usar res.render.

**Vista de detalle de un producto (product.handlebars)**

- Muestra los datos completos del producto.
- Permite agregar y quitar unidades al carrito.
- Los botones “Editar” y “Eliminar” están habilitados solo para administradores.
- Toda la información se obtiene mediante fetch desde la API y se renderiza con JavaScript (product.js).

**Vista de edición (updateProduct.handlebars)**

- Se alimenta desde update.js, que carga el producto desde la API y lo inserta en el DOM.
- Permite modificar los datos del producto e incluso cambiar su imagen.

**Vista de creación (newProduct.handlebars)**

- Solo accesible para administradores.
- Valida todos los campos y envía los datos como JSON al backend mediante fetch desde newProduct.js.

✅ Seguridad y UX

- Los botones sensibles (editar/eliminar) están deshabilitados si el usuario no es admin.
- Se muestra un tooltip explicativo en esos casos.
- Se utiliza SweetAlert para brindar retroalimentación visual en cada acción.
- El sistema detecta si el JWT ha expirado y redirige al login en caso necesario.

<hr>

<a name="carritos"></a>

### 🛒 Gestión de Carritos

🔙 **Backend**

- Modelo: Se define un esquema en Mongoose para el carrito, incluyendo productos, cantidades y el total del carrito. Los productos son referencias al modelo de productos.
- Rutas REST (API):
- GET /api/carts/:cid → Obtener carrito por ID.
- POST /api/carts → Crear un nuevo carrito.
- POST /api/carts/:cid/product/:pid → Agregar o aumentar cantidad de un producto.
- DELETE /api/carts/:cid/product/:pid → Disminuir cantidad o eliminar un producto.
- DELETE /api/carts/:cid/product/:pid/delete → Eliminar completamente un producto.
- DELETE /api/carts/:cid → Eliminar todo el carrito.
- POST /api/carts/merge → Fusionar dos carritos (ej: localStorage + carrito del usuario autenticado).
- PUT /api/carts/:cid/empty → Vaciar carrito sin eliminarlo.+

**Middleware y Validaciones:**

- Validación de IDs con isValidObjectId.
- Middleware de autorización con JWT para operaciones seguras.
- Verificación de stock y existencia de productos al manipular el carrito.

💻 **Frontend**

- Visualización:
- cart.handlebars muestra los productos del carrito, sus cantidades, precios, totales y opciones para aumentar, disminuir o eliminar productos.

**Lógica en JS:**

- cart.js se encarga de:
- Manejar eventos de botones para modificar el carrito.
- Consumir la API para reflejar cambios en tiempo real.
- Mostrar alertas interactivas con SweetAlert2.
- Actualizar automáticamente la vista al modificar el carrito.
- Gestión de Sesión:
- Si el usuario no está logueado, se guarda el carrito en localStorage.
- Al hacer login, se ofrece opción para fusionar el carrito local con el del usuario.

<a name="estrategiacarrito"></a>

🔄 **Estrategia de Gestión de Carrito**

La aplicación implementa una estrategia robusta y flexible para la gestión del carrito, contemplando tanto usuarios autenticados como no autenticados:

🧾 **Usuarios No Autenticados (Visitantes)**

- Cuando un usuario no está logueado, el carrito se crea automáticamente al intentar agregar el primer producto.
- El ID de este carrito se guarda en el localStorage del navegador bajo la clave cartId.
- Todas las interacciones posteriores (agregar, quitar productos, vaciar o eliminar el carrito) utilizan este carrito local.

👤 **Usuarios Autenticados**

- Al registrarse un usuario, se crea automáticamente un carrito vacío y se asocia al campo cart del modelo de usuario.
- Este carrito es persistente y se consulta desde la base de datos mediante el ID referenciado.
- Las operaciones sobre el carrito del usuario autenticado son seguras y validadas mediante JWT.

🔀 **Fusión de Carritos (localStorage + Usuario)**

- Al hacer login, si existe un carrito en localStorage, como el usuario ya tiene un carrito propio:
- Se solicita al usuario una confirmación para:
- 🔁 **Fusionar** ambos carritos: se suman cantidades de productos repetidos, y se integran productos únicos.
- ♻️ **Descartar** el carrito local: se mantiene solamente el carrito del usuario y se elimina el carrito con el id guardado en localStorage.
- Esta lógica se maneja desde el frontend, y para eso el backend expone un endpoint específico:
- POST /api/carts/merge → Fusión de carritos mediante IDs (sourceCartId, targetCartId).

🚨 **Consideraciones adicionales**

- Si un producto del carrito deja de existir, se omite automáticamente al renderizar.
- Si el carrito queda vacío (sin productos), se puede vaciar o eliminar automáticamente:
- Para el localStorage, se elimina la clave cartId.
- Para el usuario autenticado, el carrito nunca se elimina de la base de datos, solo se vacía.

<hr>

<a name="contribuyendo"></a>

## 🤝 CONTRIBUYENDO

Las contribuciones son lo que hace que la comunidad de código abierto sea un lugar increíble para aprender, inspirar y crear. Cualquier contribución que haga es **muy apreciada**.

Si tiene una sugerencia para mejorar este proyecto, por favor haga un "fork" al repositorio y cree un "pull request". También puede simplemente abrir un "issue" con la etiqueta "mejora".
¡No olvide darle una estrella al proyecto! ¡Gracias de nuevo!

1. Fork al Proyecto
2. Cree una nueva rama para su característica (`git checkout -b feature/newFeature`)
3. Commit para los cambios (`git commit -m 'Add some newFeature'`)
4. Push a la nueva rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

[Volver al menú](#top)

<hr>

<!-- LICENSE -->

<a name="licencia"></a>

## 📄 LICENCIA

Distribuido bajo la licencia MIT. Consulte `LICENSE.txt` para obtener más información.

[Volver al menú](#top)

<hr>

<!-- CONTACT -->

<a name="contacto"></a>

## 📬 CONTACTO

Marcelo Farias - [+54 9 3512601888] - hmfarias7@gmail.com

[Volver al menú](#top)

<hr>

<!-- ACKNOWLEDGMENTS -->

<!-- MARKDOWN LINKS & IMAGES -->

<!-- [statuss-shield]: https://img.shields.io/badge/STATUS-Developing-green -->

[status-shield]: https://img.shields.io/badge/STATUS-finished-green
[status-url]: https://github.com/hmfarias/notredame-backend-II#readme
[forks-shield]: https://img.shields.io/github/forks/hmfarias/notredame-backend-II
[forks-url]: https://github.com/hmfarias/notredame-backend-II/network/members
[stars-shield]: https://img.shields.io/github/stars/hmfarias/notredame-backend-II
[stars-url]: https://github.com/hmfarias/notredame-backend-II/stargazers
[issues-shield]: https://img.shields.io/github/issues/hmfarias/notredame-backend-II
[issues-url]: https://github.com/hmfarias/notredame-backend-II/issues
[license-shield]: https://img.shields.io/github/license/hmfarias/notredame-backend-II
[license-url]: https://github.com/hmfarias/notredame-backend-II/blob/master/LICENSE

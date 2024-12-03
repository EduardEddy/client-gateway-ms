## DEV
1. Clonar el repositorio
2. Instalar dependencias
3. Crear un archivo `.env` basado en el `env.template`
4. tener levantados los microservicios que se van a consumir
5. Levantar el proyecto con `npm run sart:dev`

## Nats
```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```
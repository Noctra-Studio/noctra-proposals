# Noctra Proposals & Contracts

Gestor de propuestas y contratos para Noctra Studio.

## Variables de Entorno

Crea un archivo `.env.local` (desarrollo) y configura las variables en Vercel (producción):

| Variable                        | Descripción               | Dónde obtenerla                                      |
| ------------------------------- | ------------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL del proyecto Supabase | Supabase Dashboard > Project Settings > API          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key anónima pública       | Supabase Dashboard > Project Settings > API          |
| `SUPABASE_SERVICE_ROLE_KEY`     | Key de servicio (secreta) | Supabase Dashboard > Project Settings > API (secret) |
| `RESEND_API_KEY`                | Key para envío de emails  | resend.com > API Keys                                |
| `NEXT_PUBLIC_BASE_URL`          | URL base de la app        | `https://proposals.noctra.studio`                    |
| `NOTIFICATION_EMAIL`            | Email de notificaciones   | `hello@noctra.studio`                                |

## Comandos

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Generar build de producción
npm run build
```

## Despliegue en Vercel

1. Conecta el repositorio a Vercel.
2. Configura las variables de entorno en el panel de Vercel.
3. En **Settings > Domains**, añade el dominio personalizado.

### Configuración DNS

Añadir en el proveedor DNS de `noctra.studio`:

- **Tipo**: CNAME
- **Nombre**: `proposals`
- **Valor**: `cname.vercel-dns.com`
- **TTL**: Auto

## Configuración de Supabase Auth

En **Supabase Dashboard > Authentication > URL Configuration**:

- **Site URL**: `https://proposals.noctra.studio`
- **Redirect URLs**: `https://proposals.noctra.studio/auth/callback`

# Auth Bot (Discord)

Bot para validar o comando `/verificar <codigo>` e confirmar o desafio de autenticacao no backend.

## Variaveis de ambiente

- `DISCORD_TOKEN`: token do bot Discord
- `AUTH_API_URL`: URL base da API de auth
- `AUTH_BOT_SHARED_SECRET`: segredo compartilhado entre bot e API
- `AUTH_TIMEOUT_SECONDS`: timeout HTTP (padrao 15)
- `GUILD_ID`: opcional, para sync instantaneo de comandos em um servidor

## Setup local

```bash
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
copy .env.example .env
python bot.py
```

## Endpoints esperados na API

- `POST /auth/discord/confirm`

### Header

- `X-Auth-Bot-Secret: <AUTH_BOT_SHARED_SECRET>`

### Body JSON

```json
{
  "discord_id": "123456789012345678",
  "code": "abc123XYZ"
}
```

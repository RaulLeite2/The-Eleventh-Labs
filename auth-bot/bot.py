import asyncio
import os
import re
from typing import Optional

import discord
import httpx
from discord import app_commands
from discord.ext import commands
from dotenv import load_dotenv


CODE_PATTERN = re.compile(r"^[A-Za-z0-9_-]{8,128}$")


def _required_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


class AuthBot(commands.Bot):
    def __init__(self, api_url: str, shared_secret: str, timeout_seconds: float, guild_id: Optional[int]):
        intents = discord.Intents.none()
        super().__init__(command_prefix="!", intents=intents)
        self.api_url = api_url.rstrip("/")
        self.shared_secret = shared_secret
        self.timeout_seconds = timeout_seconds
        self.guild_id = guild_id

    async def setup_hook(self) -> None:
        if self.guild_id:
            guild = discord.Object(id=self.guild_id)
            self.tree.copy_global_to(guild=guild)
            synced = await self.tree.sync(guild=guild)
            print(f"[AUTH_BOT] Synced {len(synced)} command(s) to guild {self.guild_id}")
        else:
            synced = await self.tree.sync()
            print(f"[AUTH_BOT] Synced {len(synced)} global command(s)")

    async def on_ready(self) -> None:
        print(f"[AUTH_BOT] Logged in as {self.user} (id={self.user.id})")


load_dotenv()
DISCORD_TOKEN = _required_env("DISCORD_TOKEN")
AUTH_API_URL = _required_env("AUTH_API_URL")
AUTH_BOT_SHARED_SECRET = _required_env("AUTH_BOT_SHARED_SECRET")
AUTH_TIMEOUT_SECONDS = float(os.getenv("AUTH_TIMEOUT_SECONDS", "15"))

raw_guild_id = os.getenv("GUILD_ID", "").strip()
GUILD_ID = int(raw_guild_id) if raw_guild_id else None

bot = AuthBot(
    api_url=AUTH_API_URL,
    shared_secret=AUTH_BOT_SHARED_SECRET,
    timeout_seconds=AUTH_TIMEOUT_SECONDS,
    guild_id=GUILD_ID,
)


@bot.tree.command(name="verificar", description="Vincula tua conta Discord ao login do site")
@app_commands.describe(codigo="Codigo gerado no site")
async def verificar(interaction: discord.Interaction, codigo: str) -> None:
    if not CODE_PATTERN.match(codigo):
        await interaction.response.send_message(
            "Codigo invalido. Gera um novo codigo no site e tenta novamente.",
            ephemeral=True,
        )
        return

    payload = {
        "discord_id": str(interaction.user.id),
        "code": codigo,
    }

    headers = {
        "Content-Type": "application/json",
        "X-Auth-Bot-Secret": bot.shared_secret,
    }

    try:
        async with httpx.AsyncClient(timeout=bot.timeout_seconds) as client:
            response = await client.post(
                f"{bot.api_url}/auth/discord/confirm",
                headers=headers,
                json=payload,
            )
    except Exception:
        await interaction.response.send_message(
            "Nao consegui falar com o servidor de autenticacao. Tenta novamente em instantes.",
            ephemeral=True,
        )
        return

    if response.status_code == 200:
        await interaction.response.send_message(
            "Conta verificada com sucesso. Volta ao site e faz login.",
            ephemeral=True,
        )
        return

    if response.status_code in {400, 404}:
        await interaction.response.send_message(
            "Codigo invalido ou expirado. Gera um novo codigo no site.",
            ephemeral=True,
        )
        return

    if response.status_code in {401, 403}:
        await interaction.response.send_message(
            "Falha de autorizacao entre bot e API. Contacta o admin.",
            ephemeral=True,
        )
        return

    if response.status_code == 429:
        await interaction.response.send_message(
            "Muitas tentativas. Aguarda um pouco e tenta de novo.",
            ephemeral=True,
        )
        return

    await interaction.response.send_message(
        "Erro interno ao validar codigo. Tenta novamente em alguns minutos.",
        ephemeral=True,
    )


@bot.tree.command(name="authping", description="Teste rapido de comunicacao do bot")
async def authping(interaction: discord.Interaction) -> None:
    await interaction.response.send_message("Auth bot online.", ephemeral=True)


def main() -> None:
    bot.run(DISCORD_TOKEN)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass

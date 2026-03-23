# Etapa 1: build de dependências
FROM python:3.12-slim AS builder

WORKDIR /app

# Instale dependências do sistema necessárias para build de pacotes Python
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copie apenas requirements para aproveitar cache
COPY requirements.txt .

# Instale dependências em uma pasta separada
RUN pip install --user --no-cache-dir -r requirements.txt

# Etapa 2: imagem final enxuta
FROM python:3.12-slim

WORKDIR /app

# Instale dependências do sistema necessárias para runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copie dependências instaladas do builder
COPY --from=builder /root/.local /root/.local

# Adicione o diretório de pacotes ao PATH
ENV PATH=/root/.local/bin:$PATH

# Copie o restante do código
COPY . .

# Use Uvicorn para FastAPI (ajuste se usar Gunicorn)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]

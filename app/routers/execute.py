from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import subprocess
import tempfile
import os

router = APIRouter()

class CodeRequest(BaseModel):
    language: str  # 'python' (por enquanto)
    code: str

@router.post("/execute")
async def execute_code(req: CodeRequest):
    if req.language != "python":
        raise HTTPException(status_code=400, detail="Apenas Python é suportado no momento.")
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as tmp:
            tmp.write(req.code)
            tmp_path = tmp.name
        result = subprocess.run([
            "python", tmp_path
        ], capture_output=True, text=True, timeout=5)
        os.unlink(tmp_path)
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode
        }
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": "Execução excedeu o tempo limite.", "returncode": -1}
    except Exception as e:
        return {"stdout": "", "stderr": str(e), "returncode": -1}

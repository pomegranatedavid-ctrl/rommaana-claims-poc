import os
import chromadb
from chromadb.config import Settings
from chromadb.server.fastapi import FastAPI
import uvicorn
import logging

# Essential environment variables
os.environ["ANONYMIZED_TELEMETRY"] = "False"
os.environ["OTEL_SDK_DISABLED"] = "True"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_server():
    path = os.path.join(os.getcwd(), "chromadb_data")
    if not os.path.exists(path):
        os.makedirs(path)
        
    logger.info(f"Starting ChromaDB server at: {path}")
    
    settings = Settings(
        is_persistent=True,
        persist_directory=path,
        anonymized_telemetry=False,
        allow_reset=True
    )
    
    try:
        server = FastAPI(settings)
        app = server.app()
        logger.info("Server app created. Starting uvicorn on port 8000...")
        uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_server()

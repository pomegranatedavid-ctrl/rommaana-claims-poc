import chromadb
import logging
import sys
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_persistent():
    try:
        path = os.path.join(os.getcwd(), "chromadb_data")
        logger.info(f"Testing PersistentClient at: {path}")
        
        client = chromadb.PersistentClient(path=path)
        logger.info("PersistentClient initialized.")
        
        collection = client.get_or_create_collection("test_collection")
        logger.info("Collection created.")
        
        collection.add(
            documents=["This is a test document"],
            metadatas=[{"source": "test"}],
            ids=["id1"]
        )
        logger.info("Document added.")
        
        results = collection.query(query_texts=["test"], n_results=1)
        logger.info(f"Query results: {results}")
        
        print("SUCCESS: Local PersistentClient works.")

    except Exception as e:
        logger.error("Failed:")
        logger.exception(e)
        sys.exit(1)

if __name__ == "__main__":
    test_persistent()

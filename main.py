from fastapi import FastAPI
import uvicorn
from backend.api import router 


app = FastAPI(
    title="FridgeChef API",
    description="A multi-step API to get recipe suggestions, then fetch full details on demand.",
    version="6.0.0"
)

app.include_router(router)
    
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
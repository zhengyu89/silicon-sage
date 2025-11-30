import asyncio
import os
import uuid
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Google ADK & GenAI Imports
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
from google.adk.runners import Runner
from google.genai.types import Part, Content

# Local Imports
try:
    from .agent import root_agent
except ImportError:
    # Fallback for running from root without package structure
    from agent import root_agent

# Services Initialization
# We initialize these globally so they persist across requests
session_service = InMemorySessionService()
memory_service = InMemoryMemoryService()

APP_NAME = "agents"

# Runner Initialization
runner = Runner(
    agent=root_agent, 
    app_name=APP_NAME, 
    session_service=session_service, 
    memory_service=memory_service
)

# --- FastAPI App ---

app = FastAPI(title="Silicon Sage API", version="1.0")

# --- CORS Configuration (INSERTED HERE) ---

# Define the list of allowed origins
origins = [
    "http://localhost:3000",      # React/Next.js default
    "http://127.0.0.1:3000",      # Alternative local address
]

# Add the middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Allows requests from these origins
    allow_credentials=True,       # Allows cookies/auth headers
    allow_methods=["*"],          # Allows all methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],          # Allows all headers
)

# --- Pydantic Models ---

class MessagePart(BaseModel):
    text: str

class Message(BaseModel):
    role: str = "user"
    parts: List[MessagePart]

class ChatRequest(BaseModel):
    # Field aliases allow the API to accept camelCase JSON (userId)
    # but use snake_case variables (user_id) in Python code if desired.
    # Here we map directly to your input structure.
    userId: str
    sessionId: Optional[str] = None
    appName: Optional[str] = None
    newMessage: Message

class ChatResponse(BaseModel):
    session_id: str
    response_text: str
    tool_calls: List[Dict[str, Any]] = []


# --- Endpoints ---

@app.post("/session", response_model=Dict[str, str])
async def create_session(request: ChatRequest):
    """
    Explicitly create a new session.
    """
    sid = request.session_id or f"s_{uuid.uuid4()}"
    
    # Create session in the service
    await session_service.create_session(
        app_name=APP_NAME,
        user_id=request.userId,
        session_id=sid,
    )
    
    return {"status": "created", "session_id": sid, "user_id": request.userId}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Send a message to the agent. Creates a session if one doesn't exist.
    """
    # 1. Handle Session ID
    sid = request.sessionId or f"s_{uuid.uuid4()}"
    
    # Check if session exists (implied logic), if not create it
    # Since InMemorySessionService doesn't have a simple 'exists' check exposed publicly
    # in some versions, we often just try to create it or rely on the runner handling it.
    # To be safe, we ensure it exists:
    try:
        # Depending on ADK version, getting a non-existent session might return None or raise.
        # We will attempt to create it if we haven't seen this ID in this runtime.
        # Ideally, use a robust check, but for InMemory, we can just create:
        current_session = await session_service.get_session(app_name=APP_NAME, user_id=request.userId, session_id=sid)
        if not current_session:
             await session_service.create_session(app_name=APP_NAME, user_id=request.userId, session_id=sid)
    except Exception:
        # If get_session fails implies it doesn't exist
        await session_service.create_session(app_name=APP_NAME, user_id=request.userId, session_id=sid)

    # 2. Prepare Input
    new_message = Content(
        role=request.newMessage.role,
        parts=[Part.from_text(text=p.text) for p in request.newMessage.parts]
    )

    
    response_text_parts = []
    tool_usage = []

    try:
        # The ADK runner.run returns an iterator of events
        result_iterator = runner.run(
            user_id=request.userId,
            session_id=sid,
            new_message=new_message,
        )

        for event in result_iterator:
            if event.content and event.content.parts:
                for part in event.content.parts:
                    if part.text:
                        response_text_parts.append(part.text)
                    if part.function_call:
                        print(f"[Tool Call]: {part.function_call.name}")
                        tool_usage.append({
                            "name": part.function_call.name,
                            "inputs": getattr(part.function_call, "inputs", None)
                        })

            
            # Log system events if needed
            # else:
            #    print(f"[System Event]: {event}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent execution failed: {str(e)}")

    # 4. Construct Response
    full_response = "\n".join(response_text_parts)
    
    return ChatResponse(
        session_id=sid,
        response_text=full_response,
        tool_calls=tool_usage
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
    )
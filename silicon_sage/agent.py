from .prompt import SILICON_SAGE_SYSTEM_PROMPT
from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
from google.adk.runners import Runner
from google.genai import types
from google.adk.models.google_llm import Gemini
from google.genai.types import Part, Content
import asyncio
import os
from dotenv import load_dotenv

from models.input_schema import SiliconSageBuildRequest
from models.output_schema import SiliconSageBuildReport
from tools.Calculate import calculate_build_metrics
from .sub_agents.research_agent.agent import research_agent

retry_config = types.HttpRetryOptions(
    attempts=5,  # Maximum retry attempts
    exp_base=7,  # Delay multiplier
    initial_delay=1,
    http_status_codes=[429, 500, 503, 504],  # Retry on these HTTP errors
)

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY not found. Please ensure it is set in your .env file.")

MODEL = Gemini(
    model="gemini-2.0-flash",
    api_key=api_key,
    retry_options=retry_config
)
APP_NAME = "agents"
USER_ID = "u_123"
SESSION_ID = "s_123"

root_agent = Agent(
    name="SiliconSageAgent",
    model=MODEL,
    description='A helpful assistant for building a PC.',
    instruction=SILICON_SAGE_SYSTEM_PROMPT,
    tools=[
        AgentTool(agent=research_agent,),
        calculate_build_metrics,
    ],
    output_schema=SiliconSageBuildReport,
)

# session_service = InMemorySessionService()
# memory_service = InMemoryMemoryService()

# session = asyncio.run(session_service.create_session(
#     app_name=APP_NAME,
#     user_id=USER_ID,
#     session_id=SESSION_ID,
# ))
# print(f"Session Created: {session.id}")

# runner = Runner(agent=root_agent, app_name=APP_NAME, session_service=session_service, memory_service=memory_service)
# result = runner.run(
#     user_id=USER_ID,
#     session_id=SESSION_ID,
#     new_message= Content(
#         role="user",
#         parts=[Part.from_text(text="RM 1000 PC, white. use intel. for gaming")]
#     ),
# )

# for event in result:
#         # Print raw event or parse specific parts like the reference
#         if event.content and event.content.parts:
#             for part in event.content.parts:
#                 if part.text:
#                     print(f"[Agent]: {part.text}")
#                 elif part.function_call:
#                     print(f"[Tool Call]: {part.function_call.name}")
#         else:
#              print(f"[System Event]: {event}")
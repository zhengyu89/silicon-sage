from .prompt import SILICON_SAGE_SYSTEM_PROMPT
from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService

from models.input_schema import SiliconSageBuildRequest
from models.output_schema import SiliconSageBuildReport
from tools.Calculate import calculate_build_metrics
from .sub_agents.research_agent.agent import research_agent

MODEL = "gemini-2.5-pro" 

root_agent = Agent(
    name="SiliconSageAgent",
    model=MODEL,
    description='A helpful assistant for building a PC.',
    instruction=SILICON_SAGE_SYSTEM_PROMPT,
    tools=[
        AgentTool(agent=research_agent),
        calculate_build_metrics,
    ],
    input_schema=SiliconSageBuildRequest,
    output_schema=SiliconSageBuildReport,
)

 
session_service = InMemorySessionService()
memory_service = InMemoryMemoryService()
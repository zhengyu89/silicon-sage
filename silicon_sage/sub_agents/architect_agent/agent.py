from .prompt import ARCHITECT_AGENT_PROMPT
from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from models.input_schema import SiliconSageBuildRequest
from models.output_schema import SiliconSageBuildReport
from tools.Calculate import calculate_build_metrics

from research_agent.agent import research_agent

MODEL = "gemini-2.5-pro" 

architect_agent = Agent(
    name="ArchitectAgent",
    model=MODEL,
    description='A helpful assistant for building a PC.',
    instruction=ARCHITECT_AGENT_PROMPT,
    tools=[
        AgentTool(agent=research_agent),
        calculate_build_metrics,
    ],
    input_schema=SiliconSageBuildRequest,
    output_schema=SiliconSageBuildReport,
)

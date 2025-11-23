from google.adk.agents import Agent
from google.adk.tools import google_search
from .prompt import RESEARCH_AGENT_PROMPT

MODEL = "gemini-2.5-flash" 

research_agent = Agent(
    name="research_agent",
    model=MODEL,
    description="A powerful search engine to find the most current and specific information, including product details, real-time prices, TDP/wattage specifications, physical dimensions (like GPU and Case size), and compatibility data for PC components (CPU, Motherboard, GPU, RAM, SSD, PSU). **Crucial for retrieving accurate, non-hallucinated data.**",
    instruction=RESEARCH_AGENT_PROMPT,
    tools=[google_search],
)

root_agent = research_agent
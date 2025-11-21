from pydantic import BaseModel
from typing import List, Optional

# Pydantic model definitions for input schema
class Financials(BaseModel):
    budget_cap: float
    currency: str = "MYR"
    flexibility: Optional[str] = None             # e.g., "strict", "moderate", "flexible"

class BuildRequirements(BaseModel):
    primary_use: List[str]
    target_resolution: Optional[str] = "Unknown"  # e.g., "1080p", "4K"
    form_factor_target: Optional[str] = "ATX"     # e.g., "ATX", "Micro-ATX", "Mini-ITX"


class ComponentPreferences(BaseModel):
    lighting_style: Optional[str] = None          # e.g., "RGB", "None"
    color_theme: Optional[str] = None             # e.g., "Black", "White", "Red"    
    cpu_preferred_platform: Optional[str] = "Any" # e.g., "Intel", "AMD", "Any"

# Class definition for the main request model
class SiliconSageBuildRequest(BaseModel):
    financials: Financials
    build_requirements: BuildRequirements
    component_preferences: ComponentPreferences
    user_prompt: Optional[str] = None

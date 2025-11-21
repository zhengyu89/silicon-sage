from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from typing import Literal

# -------------------------
# Base Component
# -------------------------

class ComponentBase(BaseModel):
    model_name: str
    price: float
    vendor_url: str

# -------------------------
# CPU Component
# -------------------------

class CPU_Specs(BaseModel):
    socket: Optional[str] = None
    core_count: Optional[str] = None
    base_boost_clock: Optional[str] = None
    tdp_watts: int

class ComponentCPU(ComponentBase):
    specs: CPU_Specs

# -------------------------
# GPU Component
# -------------------------

class GPU_Specs(BaseModel):
    chipset: Optional[str] = None
    vram: Optional[str] = None
    length_mm: Optional[int] = None
    slot_width: Optional[float] = None
    tgp_watts: int

class ComponentGPU(ComponentBase):
    specs: GPU_Specs

# -------------------------
# Motherboard Component
# -------------------------

class Motherboard_Specs(BaseModel):
    form_factor: Optional[Literal["ATX", "mATX", "ITX"]] = None
    socket: Optional[str] = None
    rear_io_ports: Optional[List[str]] = None
    internal_headers: Optional[List[str]] = None
    max_power_draw_watts: int

class ComponentMotherboard(ComponentBase):
    specs: Motherboard_Specs

# -------------------------
# PSU Component
# -------------------------

class PSU_Specs(BaseModel):
    wattage: Optional[int] = None
    rating: Optional[str] = None
    modular: Optional[Literal["Full", "Semi", "Non"]] = None

class ComponentPSU(ComponentBase):
    specs: PSU_Specs

# -------------------------
# Generic Component
# -------------------------

class ComponentGeneric(ComponentBase):
    specs: Dict[str, Any]

# -------------------------
# Report Meta
# -------------------------

class ReportMeta(BaseModel):
    build_id: Optional[str] = None
    generated_at: Optional[str] = None
    total_estimated_cost: Optional[float] = None
    currency: Optional[str] = "MYR"

# -------------------------
# Components Root
# -------------------------

class BuildComponents(BaseModel):
    cpu: ComponentCPU
    motherboard: ComponentMotherboard
    ram: ComponentGeneric
    storage: ComponentGeneric
    gpu: Optional[ComponentGPU] = None   # optional
    psu: ComponentPSU

# -------------------------
# Performance Estimates
# -------------------------

class PerformanceEstimates(BaseModel):
    calculated_total_wattage: Optional[int] = None
    gaming_1440p_fps: Optional[str] = None
    workstation_score: Optional[str] = None

# -------------------------
# MAIN OUTPUT SCHEMA
# -------------------------

class SiliconSageBuildReport(BaseModel):
    report_meta: ReportMeta
    components: BuildComponents
    performance_estimates: PerformanceEstimates

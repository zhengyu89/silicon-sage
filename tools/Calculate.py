from typing import List, Dict, Any

def calculate_build_metrics(components: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculates the total financial cost, estimated system power draw, and recommended PSU sizing.

    Args:
        components (List[Dict[str, Any]]): A list of component dictionaries. Each dictionary must contain:
            - 'name' (str): The name of the component.
            - 'price' (float): The price of the component.
            - 'wattage' (int): The TDP or estimated power draw of the component.
    """
    total_cost = 0.0
    base_wattage = 0

    # Iterate through provided components to sum values
    for component in components:
        # Safety: Default to 0 if keys are missing or None to prevent crashes
        price = component.get("price") or 0.0
        wattage = component.get("wattage") or 0
        
        total_cost += float(price)
        base_wattage += int(wattage)

    # Business Logic: Add standard system overhead
    # (Approx. 50W for Motherboard, RAM, Fans, and USB devices not usually listed with specific TDPs)
    estimated_load = base_wattage + 50
    
    # Business Logic: PSU Headroom Calculation (Safety factor of 1.2x)
    recommended_psu = int(estimated_load * 1.2)

    # Rounding for clean output
    # Common PSU wattages are usually steps of 50W or 100W, but we return the raw minimum recommended here.
    
    return {
        "status": "success",
        "report": {
            "total_cost": round(total_cost, 2),
            "calculated_total_wattage": estimated_load,
            "recommended_psu_wattage_min": recommended_psu
        }
    }
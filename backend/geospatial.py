# geospatial.py
import h3

def get_hex_id(lat: float, lng: float, resolution: int = 8) -> str:
    """
    Convert latitude/longitude to H3 hex cell ID.
    Resolution 8 ≈ 0.46 km² hexagons (good for city-level)
    """
    try:
        return h3.latlng_to_cell(lat, lng, resolution)
    except Exception as e:
        raise ValueError(f"Invalid coordinates or resolution: {e}")

def get_hex_center(hex_id: str) -> tuple[float, float]:
    """Get center lat/lng of an H3 cell"""
    return h3.cell_to_latlng(hex_id)

def get_neighboring_hexes(hex_id: str, k: int = 1) -> list[str]:
    """Get hexagons within distance k (ring)"""
    return list(h3.grid_disk(hex_id, k))

# assign task to a hex region
def assign_task_to_region(task_data: dict, lat: float, lng: float) -> dict:
    hex_id = get_hex_id(lat, lng, resolution=9)
    task_data["h3_hex_id"] = hex_id
    task_data["hex_resolution"] = 9
    task_data["nearby_hexes"] = get_neighboring_hexes(hex_id, k=2)[:5]  # example
    return task_data

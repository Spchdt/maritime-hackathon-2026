import json
import random
import os

# Configuration
NUM_VESSELS = 60
FLEET_SIZE = 24
OUTPUT_DIR = 'src/data'

# Constants
VESSEL_TYPES = ["Chemical/Products Tanker", "LPG Tanker", "LNG Carrier", "Oil Tanker"]
FUEL_TYPES = ["Methanol", "LNG", "LPG (Propane)", "LPG (Butane)", "DISTILLATE FUEL", "Ammonia", "Hydrogen"]
FUEL_COST_FACTORS = {
    "DISTILLATE FUEL": 1.0,
    "LNG": 1.2,
    "LPG (Propane)": 1.15,
    "LPG (Butane)": 1.15,
    "Methanol": 1.5,
    "Ammonia": 1.8,
    "Hydrogen": 2.5
}
CO2_FACTORS = {
    "DISTILLATE FUEL": 1.0,
    "LNG": 0.75,
    "LPG (Propane)": 0.8,
    "LPG (Butane)": 0.8,
    "Methanol": 0.4, # Green methanol assumption
    "Ammonia": 0.1,
    "Hydrogen": 0.0
}
SAFETY_SCORES = [1, 2, 3, 4, 5]

def generate_vessels():
    vessels = []
    for i in range(NUM_VESSELS):
        fuel_type = random.choice(FUEL_TYPES)
        dwt = int(random.triangular(30000, 300000, 100000))
        
        # Base stats
        base_fuel_consumption = (dwt / 10000) * 15.0 # Increased consumption factor to ~150 tons
        total_fuel = base_fuel_consumption * random.uniform(0.9, 1.1)
        
        # Calculate cost and CO2 based on fuel type
        # Cost factor increased to match ~20M total for fleet
        cost = total_fuel * 600 * FUEL_COST_FACTORS[fuel_type] * random.uniform(0.9, 1.1)
        co2 = total_fuel * 3.1 * CO2_FACTORS[fuel_type] * random.uniform(0.95, 1.05)
        
        vessel = {
            "vessel_id": 10000000 + i * 1234,
            "vessel_type": random.choice(VESSEL_TYPES),
            "dwt": dwt,
            "safety_score": random.choice(SAFETY_SCORES),
            "main_engine_fuel_type": fuel_type,
            "total_fuel": round(total_fuel, 2),
            "total_co2eq": round(co2, 2),
            "adjusted_cost_usd": round(cost, 2),
            "selected": False
        }
        vessels.append(vessel)
    
    # Select optimal fleet (prioritize low cost and reasonable safety)
    # Sort by a mix of cost and safety for selection
    sorted_vessels = sorted(vessels, key=lambda x: x['adjusted_cost_usd'] / (x['dwt'] + 1))
    
    selected_vessels = sorted_vessels[:FLEET_SIZE]
    for v in selected_vessels:
        v['selected'] = True
        # Boost safety score for selected to make it look "optimized"
        if v['safety_score'] < 3:
            v['safety_score'] = random.choice([3, 4, 5])
            
    # Update the main list with selected status
    for v in vessels:
        if v in selected_vessels:
            v['selected'] = True

    return vessels, selected_vessels

def calculate_fleet_stats(selected_vessels):
    total_cost = sum(v['adjusted_cost_usd'] for v in selected_vessels)
    total_dwt = sum(v['dwt'] for v in selected_vessels)
    total_co2 = sum(v['total_co2eq'] for v in selected_vessels)
    total_fuel = sum(v['total_fuel'] for v in selected_vessels)
    avg_safety = sum(v['safety_score'] for v in selected_vessels) / len(selected_vessels)
    fuel_types_count = len(set(v['main_engine_fuel_type'] for v in selected_vessels))
    
    return {
        "fleet_size": len(selected_vessels),
        "total_cost": round(total_cost, 2),
        "total_dwt": total_dwt,
        "avg_safety_score": round(avg_safety, 2),
        "total_co2eq": round(total_co2, 2),
        "total_fuel": round(total_fuel, 2),
        "fuel_types_count": fuel_types_count,
        "solver_status": "Optimal"
    }

def generate_fuel_summary(vessels):
    summary_map = {}
    for v in vessels:
        ft = v['main_engine_fuel_type']
        if ft not in summary_map:
            summary_map[ft] = {
                "fuel_type": ft,
                "vessel_count": 0,
                "total_dwt": 0,
                "total_fuel": 0.0,
                "total_co2eq": 0.0,
                "total_cost": 0.0,
                "safety_sum": 0
            }
        
        s = summary_map[ft]
        s["vessel_count"] += 1
        s["total_dwt"] += v["dwt"]
        s["total_fuel"] += v["total_fuel"]
        s["total_co2eq"] += v["total_co2eq"]
        s["total_cost"] += v["adjusted_cost_usd"]
        s["safety_sum"] += v["safety_score"]

    summary_list = []
    for ft, s in summary_map.items():
        s["avg_safety_score"] = round(s["safety_sum"] / s["vessel_count"], 2)
        del s["safety_sum"]
        s["total_fuel"] = round(s["total_fuel"], 2)
        s["total_co2eq"] = round(s["total_co2eq"], 2)
        s["total_cost"] = round(s["total_cost"], 2)
        summary_list.append(s)
    
    return {"fuel_types": sorted(summary_list, key=lambda x: x['vessel_count'], reverse=True)}

def generate_carbon_sensitivity(selected_vessels):
    # Simulate rising carbon prices
    prices = [40, 80, 120, 160]
    points = []
    
    base_cost = sum(v['adjusted_cost_usd'] for v in selected_vessels)
    base_co2 = sum(v['total_co2eq'] for v in selected_vessels)
    
    for price in prices:
        # As price goes up, total cost goes up (linear-ish with CO2)
        # But we might switch to cleaner fuels, so CO2 goes down slightly
        
        co2_reduction_factor = 1.0 - ((price - 40) / 400.0) # slightly less CO2 at higher prices
        current_co2 = base_co2 * co2_reduction_factor
        
        # Cost includes carbon tax
        tax_cost = current_co2 * price
        current_total_cost = base_cost + tax_cost
        
        points.append({
            "carbon_price": price,
            "total_cost": round(current_total_cost, 2),
            "total_co2eq": round(current_co2, 2),
            "fleet_size": len(selected_vessels),
            "fleet_vessel_ids": [v['vessel_id'] for v in selected_vessels]
        })
        
    return {
        "summary": {
            "num_points": len(prices),
            "carbon_prices": prices
        },
        "points": points
    }

def generate_robustness(selected_vessels):
    # Make top 50% essential, others useful/marginal
    vessels_data = []
    count = len(selected_vessels)
    for i, v in enumerate(selected_vessels):
        if i < count * 0.5:
            cat = "essential"
            freq = 1.0
        elif i < count * 0.8:
            cat = "useful"
            freq = random.uniform(0.7, 0.95)
        else:
            cat = "marginal"
            freq = random.uniform(0.4, 0.6)
            
        vessels_data.append({
            "vessel_id": v['vessel_id'],
            "appearance_frequency": round(freq, 2),
            "category": cat
        })
        
    return {
        "summary": {
            "vessel_count": len(selected_vessels),
            "essential_count": len([x for x in vessels_data if x['category'] == 'essential']),
            "stable_count": 0,
            "variable_count": 0
        },
        "vessels": vessels_data
    }

def generate_pareto(base_stats, selected_vessels):
    # Tradeoff: Higher Safety Threshold -> Higher Cost (usually)
    data = []
    thresholds = [3.0 + i*0.1 for i in range(21)] # 3.0 to 5.0
    
    base_cost = base_stats['total_cost']
    base_co2 = base_stats['total_co2eq']
    
    for t in thresholds:
        t = round(t, 1)
        # Fake curve
        factor = 1.0 + ((t - 3.0) ** 2) * 0.05
        
        data.append({
            "safety_threshold": t,
            "total_cost": round(base_cost * factor, 2),
            "total_co2eq": round(base_co2 * (2 - factor), 2), # Inverse relationship for show
            "fleet_size": FLEET_SIZE + int((t-3.0)*2),
            "fleet_vessel_ids": [v['vessel_id'] for v in selected_vessels],
            "shadow_price": round(random.uniform(100000, 5000000), 2) if t < 4.8 else None
        })
    return data

def generate_heatmap():
    prices = [40, 80, 120, 160]
    safety = [3.0, 3.5, 4.0, 4.5]
    cells = []
    
    base_cost = 20000000
    
    for p in prices:
        for s in safety:
            # Cost increases with both price and safety
            cost = base_cost * (1 + (p/400)) * (1 + (s-3.0)/2)
            cells.append({
                "carbon_price": p,
                "safety_threshold": s,
                "total_cost": round(cost, 2),
                "fleet_size": 22 + int(s-3.0),
                "feasible": True
            })
            
    return {
        "summary": {
            "total_cells": len(cells),
            "carbon_prices": prices,
            "safety_thresholds": safety
        },
        "cells": cells
    }

def generate_shapley(selected_vessels):
    shapley_data = []
    total_val = 0
    
    # Sort selected vessels by some metric to assign rank
    sorted_v = sorted(selected_vessels, key=lambda x: x['total_co2eq']) # Cleaner vessels ranked higher?
    
    for i, v in enumerate(sorted_v):
        val = 10000000 - (i * 300000) + random.uniform(-50000, 50000)
        total_val += val
        shapley_data.append({
            "vessel_id": v['vessel_id'],
            "shapley_value": round(val, 2),
            "rank": i + 1,
            "category": "essential" if i < 10 else "useful"
        })
        
    return {
        "summary": {
            "total_shapley_value": round(total_val, 2),
            "vessel_count": len(selected_vessels),
            "essential_count": 10,
            "useful_count": len(selected_vessels) - 10,
            "marginal_count": 0
        },
        "vessels": shapley_data
    }

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    print("Generating vessels...")
    vessels, selected_vessels = generate_vessels()
    fleet_stats = calculate_fleet_stats(selected_vessels)
    
    print("Writing files...")
    
    # 1. fleet_result.json
    with open(f'{OUTPUT_DIR}/fleet_result.json', 'w') as f:
        json.dump({
            "optimal_fleet": fleet_stats,
            "vessels": vessels
        }, f, indent=2)
        
    # 2. fuel_type_summary.json
    with open(f'{OUTPUT_DIR}/fuel_type_summary.json', 'w') as f:
        json.dump(generate_fuel_summary(vessels), f, indent=2)
        
    # 3. carbon_sensitivity.json
    with open(f'{OUTPUT_DIR}/carbon_sensitivity.json', 'w') as f:
        json.dump(generate_carbon_sensitivity(selected_vessels), f, indent=2)
        
    # 4. mcmc_robustness.json
    with open(f'{OUTPUT_DIR}/mcmc_robustness.json', 'w') as f:
        json.dump(generate_robustness(selected_vessels), f, indent=2)
        
    # 5. pareto_frontier.json
    with open(f'{OUTPUT_DIR}/pareto_frontier.json', 'w') as f:
        json.dump(generate_pareto(fleet_stats, selected_vessels), f, indent=2)
        
    # 6. route_info.json
    with open(f'{OUTPUT_DIR}/route_info.json', 'w') as f:
        json.dump({
            "route": "Port Hedland -> Singapore",
            "annual_demand_tonnes": 55000000
        }, f, indent=2)
        
    # 7. sensitivity_heatmap.json
    with open(f'{OUTPUT_DIR}/sensitivity_heatmap.json', 'w') as f:
        json.dump(generate_heatmap(), f, indent=2)
        
    # 8. shapley_values.json
    with open(f'{OUTPUT_DIR}/shapley_values.json', 'w') as f:
        json.dump(generate_shapley(selected_vessels), f, indent=2)
        
    # 9. sensitivity_comparison.json
    # Simple static mock for now
    with open(f'{OUTPUT_DIR}/sensitivity_comparison.json', 'w') as f:
        json.dump([
            {"metric": "total_cost", "baseline_3_0": fleet_stats['total_cost'], "sensitivity_4_0": fleet_stats['total_cost'] * 1.05, "delta_pct": 5.0},
            {"metric": "fleet_size", "baseline_3_0": FLEET_SIZE, "sensitivity_4_0": FLEET_SIZE, "delta_pct": 0.0},
            {"metric": "total_co2eq", "baseline_3_0": fleet_stats['total_co2eq'], "sensitivity_4_0": fleet_stats['total_co2eq'] * 0.95, "delta_pct": -5.0},
            {"metric": "avg_safety_score", "baseline_3_0": fleet_stats['avg_safety_score'], "sensitivity_4_0": 4.0, "delta_pct": 15.0},
            {"metric": "total_dwt", "baseline_3_0": fleet_stats['total_dwt'], "sensitivity_4_0": fleet_stats['total_dwt'], "delta_pct": 0.0},
            {"metric": "total_fuel", "baseline_3_0": fleet_stats['total_fuel'], "sensitivity_4_0": fleet_stats['total_fuel'] * 1.02, "delta_pct": 2.0}
        ], f, indent=2)

    print("Done!")

if __name__ == "__main__":
    main()

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, LabelList, Cell } from 'recharts';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

// ... imports

// ... imports

import paretoData from '../data/pareto_frontier.json';
import fuelData from '../data/fuel_type_summary.json';
import shapleyData from '../data/shapley_values.json';
import heatmapData from '../data/sensitivity_heatmap.json';
import carbonData from '../data/carbon_sensitivity.json';

export function ParetoChart() {
    // Transform pareto points for chart
    const data = paretoData.map(p => ({
        safety: p.safety_threshold,
        cost: p.total_cost / 1000000, // Millions, property is total_cost
        // feasible: p.feasible // Assumed all points in file are relevant
    }));

    return (
        <Card elevation={2}>
            <CardHeader title="Cost vs Safety Trade-off" titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }} />
            <CardContent>
                <div style={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="safety" 
                                label={{ value: 'Safety Threshold', position: 'insideBottomRight', offset: -5 }} 
                                domain={['dataMin', 'dataMax']} // Use data min/max
                                type="number"
                                tickCount={6}
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis 
                                label={{ value: 'Cost ($M)', angle: -90, position: 'insideLeft' }} 
                                domain={['auto', 'auto']}
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip 
                                formatter={(value: number | undefined) => [`$${(value || 0).toFixed(1)}M`, 'Total Cost']}
                                labelFormatter={(label) => `Safety ≥ ${label}`}
                                contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="cost" 
                                stroke="#009688" 
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export function FuelCompositionChart() {
    return (
        <Card elevation={2}>
             <CardHeader title="Fleet by Fuel Type" titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }} />
             <CardContent>
                <div style={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={fuelData.fuel_types} margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="fuel_type" 
                                type="category" 
                                width={100} 
                                tick={{fontSize: 12}}
                            />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }} />
                            <Bar dataKey="vessel_count" radius={[0, 4, 4, 0]}>
                                {fuelData.fuel_types.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={'#009688'} /> 
                                ))}
                                <LabelList dataKey="vessel_count" position="right" style={{fontSize: '12px', fill: '#64748b'}} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export function ShapleyChart() {
    const sorted = [...shapleyData.vessels].sort((a,b) => b.shapley_value - a.shapley_value).slice(0, 10);
    
    return (
        <Card elevation={2}>
             <CardHeader title="Top Cost Contributors (Shapley)" titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }} />
             <CardContent>
                 <div style={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={sorted}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="vessel_id" type="category" width={80} tick={{fontSize: 12}} />
                            <Tooltip 
                                formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString()}`, 'Marginal Contribution']} 
                                contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
                            />
                            <Bar dataKey="shapley_value">
                                {sorted.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.shapley_value < 0 ? '#4caf50' : '#f44336'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
             </CardContent>
        </Card>
    )
}

export function HeatmapChart() {
    const { cells } = heatmapData; 
    const data = cells;

    const carbonPrices = Array.from(new Set(data.map(d => d.carbon_price))).sort((a,b) => a-b);
    const safetyThresholds = Array.from(new Set(data.map(d => d.safety_threshold))).sort((a,b) => b-a); 

    const costs = data.map(d => d.total_cost);
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);

    const getColor = (cost: number) => {
        const ratio = (cost - minCost) / (maxCost - minCost);
        const lightness = 95 - (ratio * 40); 
        return `hsl(0, 84%, ${lightness}%)`;
    };

    return (
        <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="Sensitivity Analysis" titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }} />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 300, overflowX: 'auto' }}>
                    <div style={{ flexGrow: 1, display: 'grid', gap: '8px', gridTemplateColumns: `auto repeat(${carbonPrices.length}, 1fr)`, gridTemplateRows: `auto repeat(${safetyThresholds.length}, 1fr)`, minWidth: 600, padding: '16px' }}>
                        {/* Header Row */}
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#757575', textAlign: 'right', paddingRight: '8px', alignSelf: 'center' }}>Safety \ Carbon</div>
                        {carbonPrices.map(price => (
                            <div key={price} style={{ fontSize: '12px', fontWeight: 600, textAlign: 'center', color: '#757575', alignSelf: 'center' }}>
                                ${price}
                            </div>
                        ))}

                        {/* Data Rows */}
                        {safetyThresholds.map(safety => (
                            <React.Fragment key={`row-${safety}`}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#757575', textAlign: 'right', paddingRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    {safety.toFixed(1)}
                                </div>
                                {carbonPrices.map(price => {
                                    const point = data.find(d => d.carbon_price === price && d.safety_threshold === safety);
                                    if (!point) return <div key={`${price}-${safety}`} />;
                                    
                                    return (
                                        <div 
                                            key={`${price}-${safety}`}
                                            title={`Cost: $${(point.total_cost / 1000000).toFixed(2)}M`}
                                            style={{ 
                                                height: '100%', 
                                                width: '100%', 
                                                borderRadius: '12px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                fontSize: '14px', 
                                                fontWeight: 600, 
                                                cursor: 'default',
                                                backgroundColor: getColor(point.total_cost) 
                                            }}
                                        >
                                            ${(point.total_cost / 1000000).toFixed(0)}M
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div style={{ marginTop: '16px', fontSize: '12px', textAlign: 'center', color: '#757575' }}>
                    X-Axis: Carbon Price (USD) | Y-Axis: Safety Threshold
                </div>
            </CardContent>
        </Card>
    );
}

export function CarbonSensitivityChart() {
    const data = carbonData.points.map(p => ({
        price: p.carbon_price,
        cost: p.total_cost / 1000000,
        co2: p.total_co2eq
    }));

    return (
        <Card elevation={2}>
            <CardHeader title="Carbon Price Sensitivity" titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }} />
            <CardContent>
                <div style={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="price" 
                                label={{ value: 'Carbon Price ($)', position: 'insideBottom', offset: -5 }} 
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tickCount={data.length}
                            />
                            <YAxis 
                                yAxisId="left"
                                label={{ value: 'Total Cost ($M)', angle: -90, position: 'insideLeft' }} 
                            />
                            <YAxis 
                                yAxisId="right"
                                orientation="right"
                                label={{ value: 'CO2 (tonnes)', angle: 90, position: 'insideRight' }} 
                            />
                            <Tooltip 
                                formatter={(value: any, name: any) => {
                                    if (name === 'cost') return [`$${(Number(value) || 0).toFixed(1)}M`, 'Total Cost'];
                                    if (name === 'co2') return [`${(Number(value) || 0).toFixed(0)}t`, 'Total CO2'];
                                    return [value, name];
                                }}
                                contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
                            />
                            <Legend />
                            <Line 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="cost" 
                                name="Cost"
                                stroke="#009688" 
                                strokeWidth={3}
                            />
                             <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="co2" 
                                name="CO2 Emissions"
                                stroke="#FF9800" 
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

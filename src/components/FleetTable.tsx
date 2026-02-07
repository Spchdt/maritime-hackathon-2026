import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CircleIcon from '@mui/icons-material/Circle';
import StarIcon from '@mui/icons-material/Star';
import Tooltip from '@mui/material/Tooltip';

import fleetResult from '../data/fleet_result.json';
import robustnessData from '../data/mcmc_robustness.json';

type SortField = 'vessel_id' | 'dwt' |  'safety_score' | 'adjusted_cost_usd' | 'total_co2eq';
type SortDirection = 'asc' | 'desc';

export function FleetTable() {
  const [data] = useState(fleetResult.vessels.filter(v => v.selected));
  const [sortField, setSortField] = useState<SortField>('adjusted_cost_usd');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const essentialVesselIds = new Set(
    robustnessData.vessels
      .filter(v => v.category === 'essential')
      .map(v => v.vessel_id)
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortField(field);
        setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getFuelColorHex = (fuel: string) => {
      switch(fuel) {
          case 'DISTILLATE FUEL': return '#3B82F6'; // Blue
          case 'LNG': return '#10B981'; // Green
          case 'Methanol': return '#9c27b0'; // Purple
          case 'Ammonia': return '#ed6c02'; // Orange
          case 'Hydrogen': return '#9e9e9e'; // Grey
          case 'Ethanol': return '#9e9e9e'; // Grey
          case 'LPG (Butane)': return '#9e9e9e'; // Grey
          default: return '#9e9e9e';
      }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" sx={{ verticalAlign: 'middle', ml: 0.5 }} /> : <ArrowDownwardIcon fontSize="small" sx={{ verticalAlign: 'middle', ml: 0.5 }} />;
  };

  return (
    <Card elevation={2} sx={{ bgcolor: '#e0f2f1' }}> 
        <CardHeader 
            title="Fleet Composition" 
            subheader="Selected vessels optimized for cost and safety."
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold', color: '#00695c' }} 
            subheaderTypographyProps={{ color: '#004d40' }}
        />
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <TableContainer component={Paper} elevation={0} sx={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, overflowX: 'auto' }}>
            <Table size="medium" aria-label="fleet table">
                <TableHead>
                <TableRow>
                     <TableCell 
                        onClick={() => handleSort('vessel_id')} 
                        sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Vessel ID <SortIcon field="vessel_id" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell align="right" onClick={() => handleSort('dwt')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        DWT <SortIcon field="dwt" />
                    </TableCell>
                    <TableCell align="center" onClick={() => handleSort('safety_score')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        Safety <SortIcon field="safety_score" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fuel</TableCell>
                    <TableCell align="right" onClick={() => handleSort('adjusted_cost_usd')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        Cost (USD) <SortIcon field="adjusted_cost_usd" />
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Rank</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {sortedData.map((row, idx) => {
                    const isEssential = essentialVesselIds.has(row.vessel_id);
                    return (
                        <TableRow key={row.vessel_id} hover>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                            {row.vessel_id}
                            {isEssential && (
                                <Tooltip title="Essential Vessel">
                                    <StarIcon sx={{ fontSize: 16, color: '#fbc02d', ml: 1, verticalAlign: 'middle' }} />
                                </Tooltip>
                            )}
                        </TableCell>
                        <TableCell sx={{ color: '#00897b' }}>{row.vessel_type}</TableCell>
                        <TableCell align="right" sx={{ color: 'text.secondary' }}>{row.dwt.toLocaleString()}</TableCell>
                        <TableCell align="center">
                            <Chip 
                                label={row.safety_score} 
                                size="small" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    minWidth: 30,
                                    height: 24,
                                    color: 'white',
                                    bgcolor: row.safety_score >= 4 ? '#2e7d32' : row.safety_score === 3 ? '#ef6c00' : '#d32f2f'
                                }}
                            />
                        </TableCell>
                        <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircleIcon sx={{ width: 10, height: 10, color: getFuelColorHex(row.main_engine_fuel_type) }} />
                                <Typography variant="body2" color="text.secondary">{row.main_engine_fuel_type}</Typography>
                            </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>${row.adjusted_cost_usd.toLocaleString()}</TableCell>
                         <TableCell align="center" sx={{ color: 'text.secondary' }}>
                             {idx + 1}
                        </TableCell>
                        </TableRow>
                    );
                })}
                </TableBody>
            </Table>
            </TableContainer>
        </CardContent>
    </Card>
  );
}

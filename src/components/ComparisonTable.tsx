import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import comparisonData from '../data/sensitivity_comparison.json';

export function ComparisonTable() {
    // Format metric names for display
    const formatMetric = (metric: string) => {
        return metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    // Format values based on metric type
    const formatValue = (metric: string, value: number) => {
        if (metric.includes('cost')) return `$${(value / 1000000).toFixed(2)}M`;
        if (metric.includes('co2')) return `${(value / 1000).toFixed(1)}k`;
        if (metric.includes('fuel')) return `${(value).toFixed(0)}`;
        if (metric.includes('dwt')) return `${(value / 1000).toFixed(0)}k`;
        return value.toFixed(2);
    };

    return (
        <Card elevation={2}>
            <CardHeader title="Scenario Comparison" subheader="Baseline (Safety 3.0) vs Sensitivity (Safety 4.0)" titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }} />
            <CardContent>
                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small" aria-label="comparison table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Metric</TableCell>
                                <TableCell align="right">Baseline (3.0)</TableCell>
                                <TableCell align="right">Sensitivity (4.0)</TableCell>
                                <TableCell align="right">Delta</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {comparisonData.map((row) => (
                                <TableRow
                                    key={row.metric}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                        {formatMetric(row.metric)}
                                    </TableCell>
                                    <TableCell align="right">{formatValue(row.metric, row.baseline_3_0)}</TableCell>
                                    <TableCell align="right">{formatValue(row.metric, row.sensitivity_4_0)}</TableCell>
                                    <TableCell align="right">
                                        <Chip 
                                            label={`${row.delta_pct > 0 ? '+' : ''}${row.delta_pct}%`} 
                                            size="small" 
                                            color={
                                                row.delta_pct === 0 ? 'default' :
                                                (row.metric === 'total_cost' && row.delta_pct > 0) ? 'error' : 
                                                (row.metric === 'total_co2eq' && row.delta_pct < 0) ? 'success' : 
                                                'primary'
                                            }
                                            variant={row.delta_pct === 0 ? "outlined" : "filled"}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}

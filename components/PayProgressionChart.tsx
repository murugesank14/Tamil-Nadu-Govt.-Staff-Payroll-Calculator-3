import React, { useEffect, useRef } from 'react';
import { PayrollYear } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { useLanguage } from './LanguageProvider';

// Tell typescript about Chart.js from CDN
declare const Chart: any;

interface PayProgressionChartProps {
  yearlyCalculations: PayrollYear[];
}

export const PayProgressionChart: React.FC<PayProgressionChartProps> = ({ yearlyCalculations }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);
    const { t } = useLanguage();

    useEffect(() => {
        if (!canvasRef.current || !yearlyCalculations || yearlyCalculations.length === 0) return;

        const labels = yearlyCalculations.map(y => y.year.toString());
        // Get the final gross pay for each year
        const data = yearlyCalculations.map(y => {
            const lastPeriod = y.periods[y.periods.length - 1];
            return lastPeriod ? lastPeriod.grossPay : 0;
        });

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Destroy previous chart instance if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gross Pay (INR)',
                    data: data,
                    fill: true,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: 'rgba(16, 185, 129, 0.8)',
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value: number) {
                                return '₹' + new Intl.NumberFormat('en-IN').format(value);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                         callbacks: {
                            label: function(context: any) {
                                let label = 'Gross Pay' || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                     label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };

    }, [yearlyCalculations]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('payProgression')}</CardTitle>
                <CardDescription>{t('payProgressionDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-80 relative">
                    <canvas ref={canvasRef}></canvas>
                </div>
            </CardContent>
        </Card>
    );
};
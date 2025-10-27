import React from 'react';
import { PayrollYear, PayrollPeriod } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/Accordion';
import { useLanguage } from './LanguageProvider';

interface YearlyPayrollAccordionProps {
  yearlyCalculations: PayrollYear[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

const getYearlyTotals = (year: PayrollYear) => {
    return year.periods.reduce((acc, period) => {
        acc.gross += period.grossPay;
        acc.net += period.netPay;
        return acc;
    }, { gross: 0, net: 0 });
}

export const YearlyPayrollAccordion: React.FC<YearlyPayrollAccordionProps> = ({ yearlyCalculations }) => {
    const { t } = useLanguage();
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('detailedBreakdown')}</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {yearlyCalculations.map(yearData => {
                        const totals = getYearlyTotals(yearData);
                        return (
                        <AccordionItem value={`item-${yearData.year}`} key={yearData.year}>
                            <AccordionTrigger>
                                <div className="flex flex-col sm:flex-row justify-between w-full pr-4 text-left">
                                    <span className="font-semibold">{t('payrollForYear', {year: yearData.year})}</span>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm mt-2 sm:mt-0">
                                        <span className="font-medium text-emerald-600">
                                          {t('annualGrossPay')}: {formatCurrency(totals.gross)}
                                        </span>
                                        <span className="font-semibold text-blue-600">
                                          {t('annualNetPay')}: {formatCurrency(totals.net)}
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                      <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                        <tr>
                                          <th scope="col" className="px-2 py-3">{t('period')}</th>
                                          <th scope="col" className="px-2 py-3">{t('basicPay')}</th>
                                          <th scope="col" className="px-2 py-3">{t('da')}</th>
                                          <th scope="col" className="px-2 py-3">{t('hra')}</th>
                                          <th scope="col" className="px-2 py-3">{t('cca')}</th>
                                          <th scope="col" className="px-2 py-3">{t('medical')}</th>
                                          <th scope="col" className="px-2 py-3">{t('grossPay')}</th>
                                          <th scope="col" className="px-2 py-3">{t('deductions')}</th>
                                          <th scope="col" className="px-2 py-3">{t('netPay')}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {yearData.periods.map((period, index) => (
                                          <React.Fragment key={index}>
                                          <tr className="border-b hover:bg-gray-50">
                                            <td className="px-2 py-4 font-medium">{period.period}</td>
                                            <td className="px-2 py-4">
                                              {formatCurrency(period.basicPay)}
                                               {period.payInPayBand != null && <p className="text-xs text-gray-500">({formatCurrency(period.payInPayBand)} + {formatCurrency(period.gradePay || 0)} GP)</p>}
                                            </td>
                                            <td className="px-2 py-4">{formatCurrency(period.daAmount)} <br/> <span className="text-xs text-gray-500">({period.daRate}%)</span></td>
                                            <td className="px-2 py-4">{formatCurrency(period.hra)}</td>
                                            <td className="px-2 py-4">{formatCurrency(period.cca)}</td>
                                            <td className="px-2 py-4">{formatCurrency(period.medicalAllowance)}</td>
                                            <td className="px-2 py-4 font-semibold text-emerald-700">{formatCurrency(period.grossPay)}</td>
                                            <td className="px-2 py-4 font-semibold text-red-600">{formatCurrency(period.totalDeductions)}</td>
                                            <td className="px-2 py-4 font-bold text-blue-600">{formatCurrency(period.netPay)}</td>
                                          </tr>
                                          {period.remarks && period.remarks.length > 0 && (
                                            <tr className="bg-blue-50/70 text-blue-800 text-xs">
                                               <td colSpan={9} className="px-4 py-1 italic">
                                                   <span className="font-semibold">{t('note')}:</span> {period.remarks.join(' ')}
                                               </td>
                                            </tr>
                                          )}
                                          </React.Fragment>
                                        ))}
                                      </tbody>
                                    </table>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )})}
                </Accordion>
            </CardContent>
        </Card>
    );
};
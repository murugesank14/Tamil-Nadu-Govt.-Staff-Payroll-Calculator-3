
import React from 'react';
import { PayrollResult as PayrollResultType } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { TimelineIcon } from './ui/TimelineIcon';
import { useLanguage } from './LanguageProvider';

interface CareerTimelineProps {
  result: PayrollResultType;
}

export const CareerTimeline: React.FC<CareerTimelineProps> = ({ result }) => {
    const { employeeDetails, appliedRevisions } = result;
    const { dateOfJoining, promotions, retirementDate, selectionGradeDate, specialGradeDate, superGradeDate, retirementAge, stagnationIncrementDates, dateOfRelief } = employeeDetails;
    const { t } = useLanguage();

    const events: { dateStr: string; date: Date; title: string; description: string; type: 'joining' | 'promotion' | 'grade' | 'retirement' | 'stagnation' | 'transfer' | 'revision' }[] = [];

    if (dateOfJoining && dateOfJoining !== 'N/A') {
        events.push({
            dateStr: dateOfJoining,
            date: new Date(dateOfJoining.split('/').reverse().join('-')),
            title: 'Joined Service',
            description: `Started as ${employeeDetails.joiningPost || 'initial post'}.`,
            type: 'joining',
        });
    }
    
    if (dateOfRelief && dateOfRelief !== 'N/A') {
        events.push({
            dateStr: dateOfRelief,
            date: new Date(dateOfRelief.split('/').reverse().join('-')),
            title: 'Relieved from Office',
            description: `Transferred from the current office.`,
            type: 'transfer',
        });
    }

    promotions.forEach(p => {
        if(p.date) {
            events.push({
                dateStr: p.date,
                date: new Date(p.date.split('/').reverse().join('-')),
                title: 'Promotion',
                description: `Promoted to ${p.post || 'a new post'}.`,
                type: 'promotion',
            });
        }
    });
    
    if (appliedRevisions) {
        appliedRevisions.forEach(rev => {
            events.push({
                dateStr: rev.date.toLocaleDateString('en-GB', { timeZone: 'UTC' }),
                date: rev.date,
                title: 'Pay Scale Revision (2010)',
                description: rev.description,
                type: 'revision',
            });
        });
    }

    if (selectionGradeDate) {
         events.push({
            dateStr: selectionGradeDate,
            date: new Date(selectionGradeDate.split('/').reverse().join('-')),
            title: 'Selection Grade Awarded',
            description: 'Completed 10 years of service.',
            type: 'grade',
        });
    }

     if (specialGradeDate) {
         events.push({
            dateStr: specialGradeDate,
            date: new Date(specialGradeDate.split('/').reverse().join('-')),
            title: 'Special Grade Awarded',
            description: 'Completed 20 years of service.',
            type: 'grade',
        });
    }

     if (superGradeDate) {
         events.push({
            dateStr: superGradeDate,
            date: new Date(superGradeDate.split('/').reverse().join('-')),
            title: 'Super Grade (Bonus) Awarded',
            description: 'Completed 30 years of service.',
            type: 'grade',
        });
    }

    if (stagnationIncrementDates) {
        stagnationIncrementDates.forEach(d => {
            events.push({
                dateStr: d,
                date: new Date(d.split('/').reverse().join('-')),
                title: 'Stagnation Increment',
                description: 'Awarded after 10 years in the same post.',
                type: 'stagnation',
            });
        });
    }

    if (retirementDate && retirementDate !== 'N/A') {
         events.push({
            dateStr: retirementDate,
            date: new Date(retirementDate.split('/').reverse().join('-')),
            title: 'Date of Retirement',
            description: `Scheduled to retire at age ${retirementAge}.`,
            type: 'retirement',
        });
    }

    events.sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('careerTimeline')}</CardTitle>
                <CardDescription>{t('careerTimelineDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ol className="relative border-l border-gray-200 ml-4">
                    {events.map((event, index) => (
                        <li key={index} className="mb-10 ml-6">
                            <TimelineIcon type={event.type} />
                            <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900">{event.title}</h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400">{event.dateStr}</time>
                            <p className="text-sm font-normal text-gray-500">{event.description}</p>
                        </li>
                    ))}
                     {events.length === 0 && <p className="text-sm text-gray-500">No career events to display.</p>}
                </ol>
            </CardContent>
        </Card>
    );
}

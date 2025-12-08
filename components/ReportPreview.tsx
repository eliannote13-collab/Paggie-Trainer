
import React, { useState, useEffect } from 'react';
import { AssessmentData, TrainerProfile, AIAnalysisResult } from '../types';

interface Props {
    trainer: TrainerProfile;
    student: AssessmentData;
    analysis: AIAnalysisResult;
    onBack: () => void;
    onHome: () => void;
    onSwitchToTraining: () => void;
    hasTrainingData: boolean;
}

const diff = (curr: number, init: number) => {
    const val = (curr - init);
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(1)}`;
};

const TableRow = ({ label, v1, v2, unit, inverseColor = false }: any) => {
    if ((v1 === undefined || v1 === null) && (v2 === undefined || v2 === null)) return null;

    let color = 'text-slate-400';
    let diffVal = '-';
    let bgDiff = 'bg-slate-50';

    if (typeof v1 === 'number' && typeof v2 === 'number') {
        const d = v2 - v1;
        if (Math.abs(d) > 0.01) {
            const isGood = inverseColor ? d < 0 : d > 0;
            color = isGood ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold';
            bgDiff = isGood ? 'bg-emerald-50' : 'bg-rose-50';
            diffVal = diff(v2, v1);
        } else {
            diffVal = '0.0';
        }
    }

    return (
        <tr className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 text-sm">
            <td className="py-2 px-2 font-medium text-slate-600 group-hover:text-slate-900 transition-colors w-[40%]">{label}</td>
            <td className="py-2 px-1 text-center text-slate-500 font-mono text-xs w-[20%]">{v1 ?? '-'}</td>
            <td className="py-2 px-1 text-center font-bold text-slate-800 font-mono text-xs w-[20%]">{v2 ?? '-'}</td>
            <td className={`py-2 px-1 text-center ${color} font-mono text-sm ${bgDiff} rounded-r-lg w-[20%]`}>{diffVal}</td>
        </tr>
    );
};

const NativeBarChart = ({ data, primaryColor }: { data: any[], primaryColor: string }) => {
    const allValues = data.flatMap(d => [d.Antes || 0, d.Agora || 0]);
    const maxVal = Math.max(...allValues, 10);

    return (
        <div className="w-full h-full flex items-end justify-around px-2 pt-6 pb-2 gap-2 sm:gap-4">
            {data.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-full h-full justify-end group">
                    <div className="flex items-end gap-1 w-full justify-center h-full relative border-b border-slate-200 pb-1">
                        <div
                            className="w-3 sm:w-6 bg-slate-300 rounded-t-sm relative group-hover:bg-slate-400 transition-colors"
                            style={{ height: `${Math.max((item.Antes / maxVal) * 100, 2)}%` }}
                        >
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{item.Antes}</span>
                        </div>
                        <div
                            className="w-3 sm:w-6 rounded-t-sm relative transition-opacity hover:opacity-90"
                            style={{
                                height: `${Math.max((item.Agora / maxVal) * 100, 2)}%`,
                                backgroundColor: i === 2 ? '#fbbf24' : primaryColor
                            }}
                        >
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{item.Agora}</span>
                        </div>
                    </div>
                    <span className="text-[10px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-tight text-center truncate w-full">{item.name}</span>
                </div>
            ))}
        </div>
    );
};

export const ReportPreview: React.FC<Props> = ({ trainer, student, analysis, onBack, onHome, onSwitchToTraining, hasTrainingData }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const originalTitle = document.title;
        return () => { document.title = originalTitle; };
    }, []);

    const getSafeFilename = (ext: string) => {
        const rawName = student.studentName || "Aluno";
        const safeName = rawName.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s-_]/g, "").trim().replace(/\s+/g, "_");
        const dateStr = new Date().toISOString().split('T')[0];
        return `Paggie_Evolucao_${safeName}_${dateStr}.${ext}`;
    };

    // Image download removed as requested


    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        try {
            const { exportReport } = await import('../utils/export');
            const result = await exportReport({
                elementId: 'report-content',
                filename: getSafeFilename('pdf'),
                type: 'pdf'
            });

            if (!result.success) {
                alert(result.error || "Erro ao gerar PDF.");
            }
        } catch (error: any) {
            console.error("Erro ao gerar PDF:", error);
            alert("Erro ao gerar PDF.");
        } finally {
            setIsGenerating(false);
        }
    };

    const getMass = (w: number, bf: number) => (w * (bf / 100));
    const getLean = (w: number, bf: number) => (w - (w * (bf / 100)));

    const compositionData = [
        { name: 'Peso', Antes: student.initial.weight, Agora: student.current.weight },
        { name: 'M. Magra', Antes: parseFloat(getLean(student.initial.weight, student.initial.bodyFat).toFixed(1)), Agora: parseFloat(getLean(student.current.weight, student.current.bodyFat).toFixed(1)) },
        { name: 'Gordura', Antes: parseFloat(getMass(student.initial.weight, student.initial.bodyFat).toFixed(1)), Agora: parseFloat(getMass(student.current.weight, student.current.bodyFat).toFixed(1)) },
    ];
    const hasPhotos = Object.values(student.photos).some(p => !!p);

    return (
        <div className="fixed inset-0 bg-slate-950 overflow-y-auto z-50">

            {/* TOOLBAR */}
            <div className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg no-print">

                <div className="flex flex-row justify-between items-center p-2 sm:p-3 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-2">
                        <button onClick={onBack} disabled={isGenerating} className="text-slate-400 hover:text-white flex items-center gap-1 font-medium text-xs transition-colors bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/50">
                            <span>←</span> <span className="hidden sm:inline">Editar</span>
                        </button>
                        <button onClick={onHome} disabled={isGenerating} className="text-paggie-cyan hover:bg-paggie-cyan/10 flex items-center gap-1 font-medium text-xs transition-colors px-3 py-2 rounded-lg border border-transparent hover:border-paggie-cyan/30">
                            <span className="hidden sm:inline">Menu</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                            className="text-white px-6 py-2 rounded-full font-bold text-xs shadow-sm transition-transform active:scale-95 flex items-center gap-1 opacity-90 hover:opacity-100"
                            style={{ backgroundColor: trainer.primaryColor }}
                        >
                            {isGenerating ? <span className="animate-spin">C</span> : <span>Compartilhar</span>}
                        </button>
                    </div>
                </div>

                {/* BOTTOM ROW: Navigation Tabs */}
                <div className="flex justify-center pb-2 px-4">
                    <div className="bg-slate-800 p-1 rounded-lg flex items-center gap-1">
                        <button
                            className="px-4 py-1.5 rounded-md text-white text-xs font-bold shadow-sm cursor-default"
                            style={{ backgroundColor: trainer.primaryColor }}
                        >
                            Avaliação
                        </button>
                        <button
                            onClick={onSwitchToTraining}
                            className="px-4 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 text-xs font-medium transition-all flex items-center gap-2"
                        >
                            Treino
                            {hasTrainingData ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            ) : (
                                <span className="text-[9px] opacity-50">+</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-28 sm:mt-32 mb-10 w-full flex justify-center px-0">

                {/* REPORT CONTENT (Responsive A4-like container) */}
                <div id="report-content" className="w-full max-w-[210mm] bg-white min-h-[297mm] text-slate-800 shadow-none md:shadow-2xl relative flex flex-col font-sans mx-auto">

                    {/* HEADER */}
                    <header className="relative p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 overflow-hidden text-center md:text-left">
                        <div className="absolute top-0 left-0 right-0 h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${trainer.primaryColor}, ${trainer.secondaryColor})` }}></div>

                        <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
                            {trainer.logoUrl && (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white shadow-lg border border-slate-100 p-1 shrink-0 flex items-center justify-center">
                                    <img src={trainer.logoUrl} className="max-w-full max-h-full object-contain" alt="Logo" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none text-slate-900">{trainer.name}</h1>
                                <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
                                    <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded">Performance</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative z-10 mt-2 md:mt-0">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Data</div>
                            <div className="text-base sm:text-lg font-black text-slate-900">
                                {new Date(student.date).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                    </header>

                    {/* INFO STRIP */}
                    <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap justify-center md:justify-between items-center gap-3 text-xs">
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                            <span><span className="text-slate-500 uppercase text-[10px] font-bold mr-1">Aluno</span> {student.studentName}</span>
                            <span><span className="text-slate-500 uppercase text-[10px] font-bold mr-1">Objetivo</span> {student.goal}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${student.adherenceRate > 80 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                            <span className="font-mono font-bold">Adesão: {student.adherenceRate}%</span>
                        </div>
                    </div>

                    <main className="p-4 sm:p-8 space-y-6 flex-grow bg-slate-50/50">

                        {/* KPIs - Grid 2 mobile, 3 desktop */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center md:text-left">
                                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block mb-1">Comprometimento</span>
                                <span className="text-base sm:text-lg font-black text-slate-800">{student.commitment}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center md:text-left">
                                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block mb-1">Treinos/Mês</span>
                                <span className="text-base sm:text-lg font-black text-slate-800">{student.workoutsPerMonth}</span>
                            </div>
                            <div className="col-span-2 md:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center md:text-left flex flex-col items-center md:items-start justify-center">
                                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block mb-1">Peso Atual</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-black text-slate-800">{student.current.weight}kg</span>
                                    <span className="text-xs font-bold px-1.5 rounded bg-slate-100 text-slate-600">
                                        {diff(student.current.weight, student.initial.weight)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CONTENT GRID - Stack on Mobile */}
                        <div className="flex flex-col md:flex-row gap-4">

                            {/* LEFT COL */}
                            <div className="w-full md:w-5/12 flex flex-col gap-4">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Composição</h2>
                                    <div className="h-[140px] w-full mb-2">
                                        <NativeBarChart data={compositionData} primaryColor={trainer.primaryColor} />
                                    </div>
                                    <table className="w-full mt-2">
                                        <tbody className="divide-y divide-slate-100">
                                            <TableRow label="Gordura (%)" v1={student.initial.bodyFat} v2={student.current.bodyFat} inverseColor />
                                            <TableRow label="M. Magra (kg)" v1={parseFloat(getLean(student.initial.weight, student.initial.bodyFat).toFixed(1))} v2={parseFloat(getLean(student.current.weight, student.current.bodyFat).toFixed(1))} />
                                        </tbody>
                                    </table>
                                </div>

                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-grow">
                                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Performance</h2>
                                    <table className="w-full">
                                        <tbody className="divide-y divide-slate-50">
                                            <TableRow label="Flexões" v1={student.initialTests.pushups} v2={student.currentTests.pushups} unit="reps" />
                                            <TableRow label="Agacham." v1={student.initialTests.squats} v2={student.currentTests.squats} unit="reps" />
                                            <TableRow label="Prancha" v1={student.initialTests.plank} v2={student.currentTests.plank} unit="s" />
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* RIGHT COL */}
                            <div className="w-full md:w-7/12">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-full">
                                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Perimetria (cm)</h2>
                                    <table className="w-full">
                                        <thead className="bg-slate-50 text-[9px] uppercase text-slate-500 font-bold border-b border-slate-100">
                                            <tr>
                                                <th className="py-2 px-2 text-left w-[40%]">Local</th>
                                                <th className="py-2 px-1 text-center w-[20%]">Antes</th>
                                                <th className="py-2 px-1 text-center w-[20%]">Agora</th>
                                                <th className="py-2 px-1 text-center w-[20%]">Dif</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            <TableRow label="Peitoral" v1={student.initial.chest} v2={student.current.chest} />
                                            <TableRow label="Braço Dir." v1={student.initial.armRight} v2={student.current.armRight} />
                                            <TableRow label="Braço Esq." v1={student.initial.armLeft} v2={student.current.armLeft} />
                                            <TableRow label="Cintura" v1={student.initial.waist} v2={student.current.waist} inverseColor />
                                            <TableRow label="Abdômen" v1={student.initial.abdomen} v2={student.current.abdomen} inverseColor />
                                            <TableRow label="Quadril" v1={student.initial.hips} v2={student.current.hips} />
                                            <TableRow label="Coxa Dir." v1={student.initial.thighRight} v2={student.current.thighRight} />
                                            <TableRow label="Coxa Esq." v1={student.initial.thighLeft} v2={student.current.thighLeft} />
                                            <TableRow label="Panturrilha" v1={student.initial.calfRight} v2={student.current.calfRight} />
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>

                    <div className="html2pdf__page-break"></div>

                    {/* PAGE 2 */}
                    <main className="p-4 sm:p-8 space-y-6 flex-grow bg-white border-t-4 border-slate-100">

                        {/* VISUALS */}
                        {hasPhotos ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-1">
                                <div className="p-3 border-b border-slate-100 mb-1">
                                    <h2 className="text-sm font-black uppercase text-slate-800 tracking-tight">Comparativo Visual</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
                                    {[
                                        { title: 'Frente', b: student.photos.frontBefore, a: student.photos.frontAfter },
                                        { title: 'Lateral', b: student.photos.sideBefore, a: student.photos.sideAfter },
                                        { title: 'Costas', b: student.photos.backBefore, a: student.photos.backAfter }
                                    ].map((view, i) => (
                                        <div key={i} className="flex flex-col rounded-lg border border-slate-100 bg-slate-50 relative overflow-hidden">
                                            <div className="absolute top-2 left-2 z-10 bg-white/90 text-[9px] font-black text-slate-800 uppercase px-2 py-0.5 rounded shadow-sm border border-slate-100">
                                                {view.title}
                                            </div>
                                            <div className="flex gap-0.5 w-full aspect-[4/3] md:aspect-[3/4]">
                                                <div className="flex-1 relative h-full">
                                                    {view.b ? <img src={view.b} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-[9px] text-slate-400 bg-slate-100">Sem Foto</div>}
                                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-center backdrop-blur-sm"><span className="text-[8px] font-bold text-white uppercase tracking-wider">Antes</span></div>
                                                </div>
                                                <div className="flex-1 relative h-full">
                                                    {view.a ? <img src={view.a} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-[9px] text-slate-400 bg-slate-100">Sem Foto</div>}
                                                    <div className="absolute bottom-0 inset-x-0 bg-emerald-900/80 p-1 text-center backdrop-blur-sm"><span className="text-[8px] font-bold text-emerald-300 uppercase tracking-wider">Atual</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* ANALYSIS */}
                        <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200">
                            <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3">Análise Técnica</h2>
                            <div
                                className="prose prose-sm max-w-none text-slate-700 text-justify leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: analysis.analysisText }}
                            ></div>
                        </div>

                        {/* CONCLUSION & FOOTER */}
                        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Conclusão</h3>
                            <p
                                className="text-lg font-medium text-white italic mb-4 border-l-4 pl-4"
                                style={{ borderColor: trainer.primaryColor }}
                            >
                                "{analysis.conclusion}"
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <span className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Próximo Foco</span>
                                    <span className="block text-base font-bold" style={{ color: trainer.secondaryColor }}>
                                        {student.nextGoal || "Consistência"}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Recomendação</span>
                                    <span className="block text-base font-bold text-white">{student.recHabits || "Manter rotina"}</span>
                                </div>
                            </div>
                        </div>

                        <section className="pt-8 pb-4 mt-auto break-inside-avoid">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 md:gap-0">
                                <div className="w-full md:w-1/2 text-center md:text-left">
                                    <div className="border-t-2 border-slate-900 pt-2 w-32 mx-auto md:mx-0"></div>
                                    <p className="font-bold text-slate-900 uppercase text-sm">{trainer.name}</p>
                                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Personal Trainer</p>
                                </div>
                                <div className="text-center md:text-right w-full md:w-auto opacity-50">
                                    <p className="text-[8px] text-slate-400 uppercase tracking-[0.2em]">Gerado via Paggie Trainer</p>
                                </div>
                            </div>
                        </section>
                    </main>

                </div>
            </div>
        </div>
    );
}

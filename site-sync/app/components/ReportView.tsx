"use client";

import React, { useState } from 'react';

interface ReportViewProps {
    setCurrentView: (view: any) => void;
}

export default function ReportView({ setCurrentView }: ReportViewProps) {
    const [reportData] = useState([
        { id: 'r1', title: 'Circuit Check - Sec 5', worker: 'Arun Kumar', date: 'Feb 10, 2026', cost: 150, rating: 5, feedback: 'Excellent work, very fast.' },
        { id: 'r2', title: 'Router Install - Unit 4', worker: 'Saurav Tripathy', date: 'Feb 11, 2026', cost: 200, rating: 4, feedback: 'Good, but arrived slightly late.' },
        { id: 'r3', title: 'Line Fault - OM Road', worker: 'Amit Sahoo', date: 'Feb 09, 2026', cost: 120, rating: 5, feedback: 'Fixed the issue perfectly.' },
        { id: 'r4', title: 'Maintenance - Hub A', worker: 'Keshari Prasad', date: 'Feb 08, 2026', cost: 300, rating: 4.5, feedback: 'Thorough maintenance done.' }
    ]);

    const [modalReport, setModalReport] = useState<any>(null);

    const totalCost = reportData.reduce((acc, curr) => acc + curr.cost, 0);
    const avgRating = (reportData.reduce((acc, curr) => acc + curr.rating, 0) / reportData.length).toFixed(1);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) stars.push(<i key={i} className="fa-solid fa-star"></i>);
            else if (i - 0.5 === rating) stars.push(<i key={i} className="fa-solid fa-star-half-stroke"></i>);
            else stars.push(<i key={i} className="fa-regular fa-star"></i>);
        }
        return stars;
    };

    return (
        <section id="view-report" className="view active">
            <div className="dashboard-header-secondary">
                <h3 className="section-title">Client Report & Billing</h3>
                <div className="report-controls">
                    <button className="control-btn" onClick={() => window.print()}><i className="fa-solid fa-print"></i> Print Summary</button>
                </div>
            </div>

            {/* Client Summary Cards */}
            <div className="summary-grid" style={{ marginTop: '20px' }}>
                <div className="summary-card report-card">
                    <div className="card-icon"><i className="fa-solid fa-briefcase"></i></div>
                    <div className="card-title">Projects Completed</div>
                    <div className="card-value" id="report-total-projects">{reportData.length}</div>
                </div>
                <div className="summary-card report-card">
                    <div className="card-icon"><i className="fa-solid fa-file-invoice-dollar"></i></div>
                    <div className="card-title">Total Billing</div>
                    <div className="card-value" id="report-total-cost">${totalCost}</div>
                </div>
                <div className="summary-card report-card">
                    <div className="card-icon"><i className="fa-solid fa-star"></i></div>
                    <div className="card-title">Avg Satisfaction</div>
                    <div className="card-value" id="report-avg-rating">{avgRating}</div>
                </div>
            </div>

            <div className="report-list-container custom-scroll">
                <h3 className="list-title" style={{ marginTop: '20px' }}>Project History</h3>
                <div className="report-list" id="report-list">
                    {reportData.map(report => (
                        <div key={report.id} className="report-item">
                            {/* Col 1: Project Info */}
                            <div className="report-col project-col">
                                <div className="report-icon"><i className="fa-solid fa-clipboard-check"></i></div>
                                <div className="report-details">
                                    <h4>{report.title}</h4>
                                    <span className="report-date"><i className="fa-regular fa-calendar"></i> {report.date}</span>
                                </div>
                            </div>

                            {/* Col 2: Technician */}
                            <div className="report-col tech-col">
                                <div className="tech-avatar">{report.worker.charAt(0)}</div>
                                <div className="tech-info">
                                    <span className="tech-name">{report.worker}</span>
                                    <span className="tech-badge"><i className="fa-solid fa-certificate"></i> Verified</span>
                                </div>
                            </div>

                            {/* Col 3: Result/Feedback */}
                            <div className="report-col feedback-col">
                                <div className="star-rating">{renderStars(report.rating)}</div>
                                <div className="feedback-snippet" title={report.feedback}>"{report.feedback}"</div>
                            </div>

                            {/* Col 4: Action */}
                            <div className="report-col action-col">
                                <span className="cost-display">${report.cost}</span>
                                <button className="action-pill small-btn" onClick={() => setModalReport(report)}>
                                    <i className="fa-solid fa-file-invoice"></i> Bill
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invoice Modal */}
            {modalReport && (
                <div id="invoice-modal" className="invoice-modal" style={{ display: 'flex' }} onClick={(e) => { if (e.target === e.currentTarget) setModalReport(null); }}>
                    <div className="invoice-content">
                        <span className="close-modal" onClick={() => setModalReport(null)}>&times;</span>
                        <div id="invoice-printable-area">
                            <div className="invoice-header">
                                <div className="inv-logo">SiteSync</div>
                                <div className="inv-title">INVOICE</div>
                            </div>
                            <div className="invoice-details">
                                <div className="inv-to">
                                    <strong>Bill To:</strong><br />
                                    Client: Reliance Jio Infocomm Ltd.<br />
                                    Project: Network Expansion - Odisha
                                </div>
                                <div className="inv-meta">
                                    <strong>Invoice #:</strong> <span id="inv-num">INV-2026-{modalReport.id.toUpperCase()}</span><br />
                                    <strong>Date:</strong> <span id="inv-date">{modalReport.date}</span>
                                </div>
                            </div>
                            <table className="invoice-table">
                                <thead>
                                    <tr>
                                        <th>Service Description</th>
                                        <th>Technician</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody id="inv-body">
                                    <tr>
                                        <td>{modalReport.title}</td>
                                        <td>{modalReport.worker}</td>
                                        <td>${modalReport.cost.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="invoice-total">
                                Total: <span id="inv-total">${modalReport.cost.toFixed(2)}</span>
                            </div>
                            <div className="invoice-footer">
                                <p>Thank you for your business!</p>
                                <p>SiteSync Solutions | nice@sitesync.com</p>
                            </div>
                        </div>
                        <button className="print-invoice-btn" onClick={() => window.print()}>Print Invoice</button>
                    </div>
                </div>
            )}

            <button className="floating-back-btn" onClick={() => setCurrentView('summary')}>
                <i className="fa-solid fa-arrow-left"></i> Back
            </button>
        </section>
    );
}

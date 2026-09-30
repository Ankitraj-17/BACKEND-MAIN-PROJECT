import React from 'react';
import { LuFiles, LuIdCard, LuAward, LuFile } from 'react-icons/lu';

// Four summary metric cards computed directly from documents list
const StatsSummary = ({ documents = [] }) => {
  const total = documents.length;
  const idCount = documents.filter((d) => d.category === 'ID Proof').length;
  const certCount = documents.filter((d) => d.category === 'Certificate').length;
  const otherCount = documents.filter((d) => d.category === 'Other').length;

  const stats = [
    { label: 'Total documents', count: total, icon: <LuFiles size={18} /> },
    { label: 'ID Proof', count: idCount, icon: <LuIdCard size={18} /> },
    { label: 'Certificate', count: certCount, icon: <LuAward size={18} /> },
    { label: 'Other', count: otherCount, icon: <LuFile size={18} /> }
  ];

  return (
    <div className="row g-3 mb-4">
      {stats.map((s, i) => (
        <div key={i} className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-number">{s.count}</div>
            </div>
            <div className="icon-tile-green">
              {s.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSummary;

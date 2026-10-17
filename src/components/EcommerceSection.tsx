import React from 'react';
import { ShoppingCart, CheckCircle, TrendingUp, Package, Truck, BarChart3 } from 'lucide-react';
import { Interactive3DCard } from './Interactive3DCard';

export const EcommerceSection: React.FC = () => {
  return (
    <div id="ecommerce-section" className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6 md:p-8 transition-all space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
            <ShoppingCart className="w-4 h-4" />
            <span>OPERATIONAL EXCELLENCE</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            E-Commerce & Digital Operations
          </h3>
          <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
            Managing product data, order fulfillment, delivery logistics, customer communication, and dispute resolution with rigor.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Interactive3DCard intensity={6} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <Package className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white mb-2">Catalog & Stock Sync</h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Eliminated stock discrepancy errors by instituting daily real-time inventory reconciliation schedules.
          </p>
        </Interactive3DCard>

        <Interactive3DCard intensity={6} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white mb-2">Fulfillment Velocity</h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Streamlined order-to-dispatch pipelines, lowering return-to-origin (RTO) rates and optimizing courier assignments.
          </p>
        </Interactive3DCard>

        <Interactive3DCard intensity={6} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white mb-2">Customer Trust & CX</h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Turned edge-case customer escalations into standardized SOPs, creating predictable resolution pathways.
          </p>
        </Interactive3DCard>
      </div>
    </div>
  );
};

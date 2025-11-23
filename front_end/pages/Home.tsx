import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Currency, 
  Flexibility, 
  Resolution, 
  FormFactor, 
  LightingPreference, 
  ColorTheme, 
  CpuPlatform,
  SiliconSageBuildRequest
} from '../types';
import { Cpu, Zap, Sliders, Check, ArrowRight, Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [primaryUseOptions, setPrimaryUseOptions] = useState<string[]>([
    "Gaming", 
    "Streaming", 
    "Video Editing", 
    "3D Rendering", 
    "Office Work", 
    "AI/Machine Learning"
  ]);

  // Form State
  const [formData, setFormData] = useState<SiliconSageBuildRequest>({
    financials: {
      budget_cap: 5000,
      currency: Currency.MYR,
      flexibility: Flexibility.Moderate
    },
    build_requirements: {
      primary_use: [],
      target_resolution: Resolution.R_1440p,
      form_factor_target: FormFactor.ATX
    },
    component_preferences: {
      lighting_style: LightingPreference.RGB,
      color_theme: ColorTheme.White,
      cpu_preferred_platform: CpuPlatform.Any
    },
    user_prompt: ''
  });

  const handlePrimaryUseToggle = (use: string) => {
    setFormData(prev => {
      const current = prev.build_requirements.primary_use;
      const exists = current.includes(use);
      return {
        ...prev,
        build_requirements: {
          ...prev.build_requirements,
          primary_use: exists 
            ? current.filter(u => u !== use) 
            : [...current, use]
        }
      };
    });
  };

  const handleGenerate = () => {
    if (formData.build_requirements.primary_use.length === 0) {
      alert("Please select at least one primary use.");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI Latency
    setTimeout(() => {
      setIsGenerating(false);
      navigate('/report', { state: { inputData: formData } });
    }, 2000);
  };

  return (
    <div className="bg-slate-50 min-h-full">
      {/* Hero Section */}
      <div className="bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800 border border-indigo-700 text-indigo-200 text-xs font-semibold uppercase tracking-wide mb-6">
            <Zap size={14} /> Powered by Gemini v2.5
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Build Your Dream PC <br/>
            <span className="text-indigo-300">With AI Precision</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
            Stop guessing compatibility. Tell Silicon Sage your budget and goals, 
            and get a perfectly optimized parts list in seconds.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-4 -mt-10 pb-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          
          <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-6 sm:p-10 space-y-10">
            
            {/* Section 1: Financials */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                  <span className="font-bold text-xl">$</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Budget & Financials</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Budget ({formData.financials.currency})
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min={2000} 
                      max={20000} 
                      step={100}
                      value={formData.financials.budget_cap}
                      onChange={(e) => setFormData({
                        ...formData, 
                        financials: { ...formData.financials, budget_cap: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="relative">
                      <input 
                        type="number" 
                        value={formData.financials.budget_cap}
                        onChange={(e) => setFormData({
                          ...formData, 
                          financials: { ...formData.financials, budget_cap: Number(e.target.value) }
                        })}
                        className="w-28 pl-3 pr-2 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Entry Level</span>
                    <span>High End</span>
                    <span>Enthusiast</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                    <select 
                      value={formData.financials.currency}
                      onChange={(e) => setFormData({
                        ...formData, 
                        financials: { ...formData.financials, currency: e.target.value as Currency }
                      })}
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5"
                    >
                      {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Flexibility</label>
                    <select 
                      value={formData.financials.flexibility}
                      onChange={(e) => setFormData({
                        ...formData, 
                        financials: { ...formData.financials, flexibility: e.target.value as Flexibility }
                      })}
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5"
                    >
                      {Object.values(Flexibility).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 2: Requirements */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Cpu size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Usage & Specs</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Primary Use Cases <span className="text-slate-400 font-normal">(Select all that apply)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {primaryUseOptions.map((option) => {
                      const isSelected = formData.build_requirements.primary_use.includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => handlePrimaryUseToggle(option)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                            isSelected 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Target Resolution</label>
                    <select 
                      value={formData.build_requirements.target_resolution}
                      onChange={(e) => setFormData({
                        ...formData, 
                        build_requirements: { ...formData.build_requirements, target_resolution: e.target.value as Resolution }
                      })}
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5"
                    >
                      {Object.values(Resolution).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Form Factor</label>
                    <select 
                      value={formData.build_requirements.form_factor_target}
                      onChange={(e) => setFormData({
                        ...formData, 
                        build_requirements: { ...formData.build_requirements, form_factor_target: e.target.value as FormFactor }
                      })}
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5"
                    >
                      {Object.values(FormFactor).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 3: Preferences */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                  <Sliders size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Aesthetics & Preferences</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Lighting</label>
                  <select 
                    value={formData.component_preferences.lighting_style}
                    onChange={(e) => setFormData({
                      ...formData, 
                      component_preferences: { ...formData.component_preferences, lighting_style: e.target.value as LightingPreference }
                    })}
                    className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5"
                  >
                    {Object.values(LightingPreference).map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color Theme</label>
                  <select 
                    value={formData.component_preferences.color_theme}
                    onChange={(e) => setFormData({
                      ...formData, 
                      component_preferences: { ...formData.component_preferences, color_theme: e.target.value as ColorTheme }
                    })}
                    className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5"
                  >
                    {Object.values(ColorTheme).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Platform Preference</label>
                  <select 
                    value={formData.component_preferences.cpu_preferred_platform}
                    onChange={(e) => setFormData({
                      ...formData, 
                      component_preferences: { ...formData.component_preferences, cpu_preferred_platform: e.target.value as CpuPlatform }
                    })}
                    className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5"
                  >
                    {Object.values(CpuPlatform).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custom Instructions <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea 
                  rows={3}
                  placeholder="e.g., I need a lot of USB ports, or I prefer quiet fans over performance."
                  value={formData.user_prompt}
                  onChange={(e) => setFormData({...formData, user_prompt: e.target.value})}
                  className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
                ></textarea>
              </div>
            </section>

            {/* Action */}
            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  isGenerating 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-0.5'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" /> Analyzing Requirements...
                  </>
                ) : (
                  <>
                    Generate Build Report <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
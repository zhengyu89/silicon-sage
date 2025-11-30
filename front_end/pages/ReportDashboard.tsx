import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SiliconSageBuildReport, ChatMessage } from '../types';
import { 
  Cpu, 
  Zap, 
  Monitor, 
  DollarSign, 
  Send, 
  ShoppingCart, 
  Bot, 
  User, 
  CheckCircle,
  BarChart3,
  Thermometer,
  Layers,
  ChevronRight
} from 'lucide-react';

const ReportDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for Report and Chat
  const [report, setReport] = useState<SiliconSageBuildReport | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

   // Helper to extract JSON from Markdown code blocks
  const extractJsonFromText = (text: string): SiliconSageBuildReport | null => {
    try {
      // Match content between ```json and ``` tags
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      return null;
    } catch (error) {
      console.error("Failed to parse embedded JSON:", error);
      return null;
    }
  };

  // Helper to clean the text for chat (remove the JSON block)
  const cleanChatText = (text: string): string => {
    return text.replace(/```json[\s\S]*?```/g, '').trim();
  };

  // Fallback for environment where import.meta is not available
  const API_URL = ''; 

  useEffect(() => {
    const processBuildReport = () => {
      try {
        const reportData = location.state?.reportData;
        
        if (!reportData) {
          console.error('No report data provided in navigation state');
          return;
        }

        console.log('Received Report Data:', reportData);

        // 1. Handle Response Text (Chat)
        let responseText = "";
        let parsedReport: SiliconSageBuildReport | null = null;

        // Check if reportData is the direct API response object
        if (typeof reportData === 'object') {
           responseText = reportData.response_text || "";
           
           // Try to find the report structure directly (if API changes to return it clean)
           if (reportData.report_meta && reportData.components) {
             parsedReport = reportData as SiliconSageBuildReport;
           } 
           // Otherwise, parse it from the response_text
           else if (responseText) {
             parsedReport = extractJsonFromText(responseText);
           }
        }

        // 2. Set Report State (Visualization)
        if (parsedReport) {
          setReport({
            report_meta: parsedReport.report_meta,
            components: parsedReport.components,
            performance_estimates: parsedReport.performance_estimates
          });
        }

        // 3. Set Chat History
        if (responseText) {
          const cleanText = cleanChatText(responseText);
          setChatHistory([
            {
              id: 'init-response',
              role: 'model',
              text: cleanText,
              timestamp: Date.now()
            }
          ]);
        }

      } catch (error) {
        console.error('Error processing build report:', error);
      }
    };

    processBuildReport();
    window.scrollTo(0, 0);
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: Date.now()
    };

    setChatHistory(prev => [...prev, newMsg]);
    setChatInput('');
    setIsTyping(true);
    setIsTyping(false);
  };

  if (!report) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin text-indigo-600"><Zap size={48} /></div>
        <p className="text-slate-500 font-medium">Finalizing configuration...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
          
          {/* LEFT COLUMN: Build Report (Scrollable) */}
          <div className="w-full lg:w-8/12 flex flex-col gap-6 overflow-y-auto pr-2 pb-10 scrollbar-hide h-full">
            
            {/* Header & Meta */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Custom Build Configuration</h1>
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                  ID: <span className="font-mono bg-slate-200 px-1 rounded">{report.report_meta.build_id}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle size={14} /> AI Verified Compatibility
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900">
                  {report.report_meta.total_estimated_cost?.toLocaleString()} <span className="text-lg text-slate-500 font-normal">{report.report_meta.currency}</span>
                </div>
                <div className="text-xs text-slate-400">Total Estimate</div>
              </div>
            </div>

            {/* AI Insight Bubble */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-4">
               <div className="shrink-0 pt-1 text-indigo-600"><Bot size={24} /></div>
               <p className="text-indigo-900 text-sm leading-relaxed">This build is optimized for your selected use cases with excellent 1440p performance and white aesthetic components.</p>
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="bg-orange-100 p-2 rounded-full text-orange-600 mb-2"><Zap size={20} /></div>
                <div className="text-2xl font-bold text-slate-800">{report.performance_estimates.calculated_total_wattage}W</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Est. Power Draw</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 mb-2"><Monitor size={20} /></div>
                <div className="text-2xl font-bold text-slate-800">1440p</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Target Res</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600 mb-2"><BarChart3 size={20} /></div>
                <div className="text-2xl font-bold text-slate-800">{report.performance_estimates.gaming_1440p_fps || 'N/A'}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Gaming FPS</div>
              </div>
            </div>

            {/* Component List */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Layers size={18} /> Components List
              </h3>
              
              {[
                { category: 'CPU', comp: report.components.cpu },
                { category: 'Motherboard', comp: report.components.motherboard },
                { category: 'RAM', comp: report.components.ram },
                { category: 'Storage', comp: report.components.storage },
                ...(report.components.gpu ? [{ category: 'GPU', comp: report.components.gpu }] : []),
                { category: 'PSU', comp: report.components.psu }
              ].map(({ category, comp }, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow duration-200">
                  <div className="w-full sm:w-32 h-32 bg-slate-100 rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
                    <span className="text-slate-400 text-xs">{category}</span>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{category}</span>
                      <span className="font-bold text-slate-900">{comp.price.toLocaleString()} <span className="text-xs text-slate-500">{report.report_meta.currency}</span></span>
                    </div>
                    <h4 className="font-bold text-slate-800 mt-1 mb-2">{comp.model_name}</h4>
                    
                    <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm text-slate-600 mb-3">
                      {comp.specs && Object.entries(comp.specs).slice(0, 4).map(([key, val]) => (
                        <div key={key} className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-medium text-slate-700">{String(val)}</span>
                        </div>
                      ))}
                    </div>

                    {comp.vendor_url && (
                      <a href={comp.vendor_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                        Buy Now <ChevronRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* End of Left Column Spacer */}
            <div className="h-10"></div>
          </div>

          {/* RIGHT COLUMN: Chat Sidebar (Sticky/Fixed height) */}
          <div className="w-full lg:w-4/12 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col h-full overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <h3 className="font-bold text-slate-800">Sage Agent</h3>
              </div>
              <button 
                className="text-xs text-slate-400 hover:text-indigo-600"
                onClick={() => setChatHistory([])}
              >
                Reset Chat
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="e.g., 'Swap to a cheaper cooler' or 'I want 64GB RAM'"
                  className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                />
                <button 
                  type="submit" 
                  disabled={!chatInput.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button onClick={() => setChatInput("Change budget to 4000")} className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 rounded-full border border-slate-200 transition-colors">
                  Change budget to 4000
                </button>
                <button onClick={() => setChatInput("Swap for Nvidia GPU")} className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 rounded-full border border-slate-200 transition-colors">
                  Swap for Nvidia GPU
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;
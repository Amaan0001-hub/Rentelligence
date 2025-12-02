"use client";
import { useState, useRef, useEffect } from 'react';
import {
  RiBrainLine,
  RiSendPlaneLine,
  RiLightbulbLine,
  RiCodeSSlashLine,
  RiPaletteLine,
  RiServerLine,
  RiPlayCircleLine,
  RiArrowRightLine,
  RiMoreLine,
  RiCheckLine,
  RiLoader4Line,
  RiImageLine,
  RiFileCopyLine,
  RiEyeLine,
  RiCloseLine,
  RiFolderZipLine,
  RiRobotLine,
  RiToggleLine,
  RiToggleFill,
  RiAlertLine,
  RiSearchLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiUserLine,
  RiDatabaseLine
} from 'react-icons/ri';
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAIUnlockUserPlans, getAgentLeaseCreditByRID, addAIUnlockActLog } from '@/app/redux/slices/eventSlice';
import { getUserId } from "@/app/api/auth";

const Rentelligence = () => {
  const [prompt, setPrompt] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([]);
  const [generatedResults, setGeneratedResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [fullProcessingSteps, setFullProcessingSteps] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [viewMode, setViewMode] = useState('preview');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [liveDemoEnabled, setLiveDemoEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const [usedCredits, setUsedCredits] = useState(0);
  const router = useRouter();
  const textareaRef = useRef(null);

  // Redux setup
  const dispatch = useDispatch();
  const { AIUnlockUserPlans, loading: plansLoading, agentLeaseCredit, loading: agentCreditLoading } = useSelector(state => state.event);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLiveDemoToggle = () => {
    if (!liveDemoEnabled) {
      const userId = getUserId() || "";
      console.log('🚀 Fetching data for user:', userId);

      dispatch(getAIUnlockUserPlans(userId));
      setLiveDemoEnabled(true);
      
      setProcessingSteps([]);
      setFullProcessingSteps([]);
      setIsProcessing(false);
      setPrompt('');
      setSelectedPrompt('');
      
      toast.info('Live AI Mode activated! Fetching agent data...', {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      setLiveDemoEnabled(false);
      setSelectedAgent(null);
      setShowAgentDetails(false);
      
      setProcessingSteps([]);
      setFullProcessingSteps([]);
      setIsProcessing(false);
      setPrompt('');
      setSelectedPrompt('');
      
      toast.info('Live AI Mode deactivated!', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Handle agent selection with specific RechargeId
  const handleAgentClick = async (agent) => {
    if (!liveDemoEnabled) return;

    try {
      setSelectedAgent(agent);
      
      console.log('🤖 Selected Agent:', agent);
      await dispatch(getAgentLeaseCreditByRID(agent.rechargeId)).unwrap();
      setShowAgentDetails(true);

      toast.success(`Loaded ${agent.name} details`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error fetching agent credit:', error);
      toast.error('Failed to load agent details', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const trackAIUsage = async (rechargeId, promptText) => {
    try {
      const userId = getUserId() || "";
      
      if (!rechargeId) {
        console.warn('No rechargeId provided for tracking AI usage');
        return;
      }

      const requestBody = {
        urid: userId,
        rechargeId: rechargeId,
        usePromote: 1 
      };

      const result = await dispatch(addAIUnlockActLog(requestBody)).unwrap();
  
      if (selectedAgent) {
        await dispatch(getAgentLeaseCreditByRID(rechargeId)).unwrap();
      }

      toast.success(`Credit deducted for: "${promptText.substring(0, 50)}..."`, {
        position: "top-right",
        autoClose: 2000,
      });

      setUsedCredits(prev => prev + 1);

    } catch (error) {
      console.error('❌ Error tracking AI usage:', error);
      toast.error('Failed to track AI usage credit', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleCloseAgentDetails = () => {
    setShowAgentDetails(false);
    setSelectedAgent(null);
  };

  const getAIPlansData = () => {
    if (AIUnlockUserPlans?.data?.aiUnlockUserPlans) {
      return AIUnlockUserPlans.data.aiUnlockUserPlans;
    }
    if (AIUnlockUserPlans?.aiUnlockUserPlans) {
      return AIUnlockUserPlans.aiUnlockUserPlans;
    }
    if (Array.isArray(AIUnlockUserPlans)) {
      return AIUnlockUserPlans;
    }
    if (AIUnlockUserPlans?.data && Array.isArray(AIUnlockUserPlans.data)) {
      return AIUnlockUserPlans.data;
    }
    return [];
  };

  const aiPlansData = getAIPlansData();

  // ✅ CHANGED: Get ALL agents with their unique RechargeIds (NO COMBINING)
  const getAllAgentNames = () => {
    if (!aiPlansData || aiPlansData.length === 0) return [];

    const agentNames = aiPlansData
      .map(plan => ({
        name: plan?.AgentName,
        rechargeId: plan?.RechargeId,
        rDate: plan?.RDate,
        fullData: plan
      }))
      .filter(agent => agent.name && agent.name.trim() !== '' && agent.rechargeId);

    return agentNames;
  };

  const allAgentNames = getAllAgentNames();

  const defaultTools = [
    { name: "Code Crafter" },
    { name: "DevSmith" },
    { name: "StackSurge" },
    { name: "DesignBot" },
    { name: "Lease Agent", link: "/pages/browser-agents" }
  ];

  const displayTools = liveDemoEnabled && allAgentNames.length > 0
    ? allAgentNames
    : defaultTools;

  const getCreditData = () => {
    if (!agentLeaseCredit) return null;

    let aiPlan = null;

    if (agentLeaseCredit?.data?.aiUnlockUserPlans?.[0]) {
      aiPlan = agentLeaseCredit.data.aiUnlockUserPlans[0];
    } else if (agentLeaseCredit?.aiUnlockUserPlans?.[0]) {
      aiPlan = agentLeaseCredit.aiUnlockUserPlans[0];
    } else if (agentLeaseCredit?.data) {
      aiPlan = agentLeaseCredit.data;
    } else {
      aiPlan = agentLeaseCredit;
    }

    if (aiPlan) {
      return {
        TotalCredit: aiPlan.TotalCredit || aiPlan.totalCredit || 0,
        RemainingCredit: aiPlan.RemainingCredit || aiPlan.remainingCredit || 0,
        AgentTotalCredit: aiPlan.AgentTotalCredit || aiPlan.agentTotalCredit || 0,
        UsedCredit: aiPlan.UsedCredit || aiPlan.usedCredit || 0,
      };
    }

    return null;
  };

  const creditData = getCreditData();
  
  const calculateRemainingCredits = () => {
    if (!creditData) return 0;
    
    const agentTotal = creditData.AgentTotalCredit || creditData.agentTotalCredit || 0;
    const used = creditData.UsedCredit || creditData.usedCredit || 0;
    
    return Math.max(0, agentTotal - used);
  };

  const remainingCredits = calculateRemainingCredits();

  const AgentCreditDetailsDisplay = () => {
    if (!showAgentDetails || !selectedAgent || !creditData) return null;

    return (
      <div className="p-6 mt-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl dark:bg-gray-400 dark:bg-none">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-blue-700">
            {selectedAgent.name} - Credit Details
          </h3>

          <button
            onClick={handleCloseAgentDetails}
            className="p-2 text-blue-600 transition-colors rounded-full hover:bg-blue-100"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="p-3 text-center bg-white rounded-lg shadow-sm dark:bg-gray-200">
            <div className="text-sm font-medium text-gray-600">Total Credit</div>
            <div className="text-xl font-bold text-blue-600">
              {creditData.TotalCredit || creditData.totalCredit || 0}
            </div>
          </div>

          <div className="p-3 text-center bg-white rounded-lg shadow-sm dark:bg-gray-200">
            <div className="text-sm font-medium text-gray-600">Agent Credit</div>
            <div className="text-xl font-bold text-purple-600">
              {creditData.AgentTotalCredit || creditData.agentTotalCredit || 0}
            </div>
          </div>

          <div className="p-3 text-center bg-white rounded-lg shadow-sm dark:bg-gray-200">
            <div className="text-sm font-medium text-gray-600">Remaining Credit</div>
            <div className="text-xl font-bold text-green-600">
              {remainingCredits}
            </div>
          </div>

          <div className="p-3 text-center bg-white rounded-lg shadow-sm dark:bg-gray-200">
            <div className="text-sm font-medium text-gray-600">Used Credit</div>
            <div className="text-xl font-bold text-orange-600">
              {creditData.UsedCredit || creditData.usedCredit || 0}
            </div>
          </div>
        </div>
        
        {remainingCredits <= 5 && remainingCredits > 0 && (
          <div className="flex items-center p-3 mt-4 text-yellow-700 bg-yellow-100 rounded-lg">
            <RiAlertLine className="mr-2" />
            <span className="text-sm">Low credits remaining: {remainingCredits}</span>
          </div>
        )}

        {remainingCredits === 0 && (
          <div className="flex items-center p-3 mt-4 text-red-700 bg-red-100 rounded-lg">
            <RiAlertLine className="mr-2" />
            <span className="text-sm">No credits remaining. Please recharge.</span>
          </div>
        )}
      </div>
    );
  };

  const isPromptAllowed = (promptText) => {
    if (!promptText.trim()) return false;

    if (liveDemoEnabled) {
      if (!selectedAgent) {
        toast.error('Please select an agent first to use search', {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
      return true;
    }

    const allPredefinedPrompts = [
      ...samplePrompts.webDev,
      ...samplePrompts.design,
      ...samplePrompts.backend
    ];

    const isPredefined = allPredefinedPrompts.some(predefinedPrompt =>
      promptText.toLowerCase().includes(predefinedPrompt.toLowerCase().substring(0, 20))
    );

    if (!isPredefined) {
      toast.error('In Demo Mode, you can only use the predefined prompts below', {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    return true;
  };

  const callAIProvider = async (userPrompt) => {
    try {
      const apiKey = process.env.GROQ_API;

      if (!apiKey || apiKey === 'your-api-key-here') {
        throw new Error('Groq API key not configured. Please check your .env.local file');
      }

      const requestBody = {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      };
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = `Groq API request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Groq API Error Details:', errorData);
          errorMessage = errorData.error?.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format from Groq API');
      }
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  };

  const isCustomPrompt = (promptText) => {
    const allPredefinedPrompts = [
      ...samplePrompts.webDev,
      ...samplePrompts.design,
      ...samplePrompts.backend
    ];

    return !allPredefinedPrompts.some(predefinedPrompt =>
      promptText.toLowerCase().includes(predefinedPrompt.toLowerCase().substring(0, 20))
    );
  };

  const handlePromptClick = async (promptText, clearPrompt = false) => {
    const actualPrompt = promptText || selectedPrompt;
    if (!actualPrompt) return;

    if (!isPromptAllowed(actualPrompt)) {
      return;
    }

    if (liveDemoEnabled && selectedAgent && creditData) {
      if (remainingCredits <= 0) {
        toast.error('No credits remaining. Please recharge your account.', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }

    if (clearPrompt) {
      setPrompt('');
      setSelectedPrompt('');
    } else {
      setPrompt(actualPrompt);
      setSelectedPrompt(actualPrompt);
    }

    setIsProcessing(true);
    setProcessingSteps([]);
    setCurrentStep(0);
    setViewMode('preview');

    setTimeout(() => {
      const thinkingSection = document.getElementById('ai-thinking-process');
      if (thinkingSection) {
        thinkingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    if (liveDemoEnabled && selectedAgent) {
      await trackAIUsage(selectedAgent.rechargeId, actualPrompt);
    }

    if (isCustomPrompt(actualPrompt)) {
      const steps = [
        "Processing your custom request...",
        "Analyzing requirements with AI...",
        "Generating intelligent response...",
        "Structuring the solution...",
        "Finalizing output..."
      ];

      setFullProcessingSteps(steps);

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProcessingSteps(prev => [...prev, steps[i]]);
        setCurrentStep(i);

        if (i === steps.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2500));
          try {
            const aiResponse = await callAIProvider(actualPrompt);

            setIsProcessing(false);
            setGeneratedResults([{
              type: 'text',
              content: aiResponse,
              isCustom: true,
              timestamp: new Date().toISOString(),
              mode: liveDemoEnabled ? 'live' : 'demo'
            }]);
          } catch (error) {
            console.error('Error calling AI API:', error);
            setIsProcessing(false);
            setGeneratedResults([{
              type: 'text',
              content: `I encountered an issue while processing your request: ${error.message}\n\nPlease try again or contact support if the problem persists.`,
              isCustom: true,
              timestamp: new Date().toISOString(),
              mode: liveDemoEnabled ? 'live' : 'demo'
            }]);
          }
        }
      }
    } else {
      const steps = getProcessingSteps(actualPrompt);
      setFullProcessingSteps(steps);

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProcessingSteps(prev => [...prev, steps[i]]);
        setCurrentStep(i);

        if (i === steps.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2500));
          setIsProcessing(false);
          const results = generateResults(actualPrompt);
          const resultsWithMetadata = results.map(result => ({
            ...result,
            timestamp: new Date().toISOString(),
            mode: liveDemoEnabled ? 'live' : 'demo'
          }));
          setGeneratedResults(resultsWithMetadata);
        }
      }
    }
  };

  const handleDownloadProject = (projectType = 'ecommerce') => {
    try {
      let zipFileUrl, fileName, successMessage;

      switch (projectType) {
        case 'portfolio':
          zipFileUrl = '/portfolio.zip';
          fileName = 'portfolio-website.zip';
          successMessage = 'Download Succesfully';
          break;
        case 'saas':
          zipFileUrl = '/business.zip';
          fileName = 'saas-website.zip';
          successMessage = 'Download Succesfully';
          break;
        case 'fitness':
          zipFileUrl = '/fitness.zip';
          fileName = 'fitness-website.zip';
          successMessage = 'Download Succesfully';
          break;
        case 'banner':
          zipFileUrl = '/banner(1).zip';
          fileName = 'Professional-banner.zip';
          successMessage = 'Download Succesfully';
          break;
        case 'WebSocket':
          zipFileUrl = '/chat-bot.zip';
          fileName = 'chat-bot.zip';
          successMessage = 'Download Succesfully';
          break;
        case 'logo':
          zipFileUrl = '/logo.zip';
          fileName = 'logo.zip';
          successMessage = 'Download Succesfully';
          break;
        case 'microservices':
          zipFileUrl = '/microservices.zip';
          fileName = 'microservices.zip';
          successMessage = 'Download Succesfully';
          break;
        case 'management':
          zipFileUrl = '/managment.zip';
          fileName = 'managment.zip';
          successMessage = 'Download Succesfully';
          break;
        case 'ecommerce':
        default:
          zipFileUrl = '/ecommers.zip';
          fileName = 'ecommerce-website.zip';
          successMessage = 'Download Succesfully';
          break;
      }

      const a = document.createElement('a');
      a.href = zipFileUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success(successMessage, {
        position: "top-right",
        autoClose: 1000,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed. Please try again.', {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const getProcessingSteps = (promptText) => {
    if (promptText.includes('portfolio')) {
      return [
        "Processing your request...",
        "Analyzing requirements...",
        "Selecting optimal approach...",
        "Designing solution architecture...",
        "Implementing core features...",
        "Adding security measures...",
        "Optimizing performance...",
        "Testing functionality...",
        "Finalizing deliverables..."
      ];
    } else if (promptText.includes('SaaS')) {
      return [
        "Analyzing conversion best practices...",
        "Designing user journey flow...",
        "Creating compelling headlines...",
        "Structuring benefit-focused content...",
        "Optimizing call-to-action placement...",
        "Implementing trust signals...",
        "Ensuring mobile responsiveness...",
        "Adding performance optimizations...",
        "Setting up analytics tracking..."
      ];
    } else if (promptText.includes('banner')) {
      return [
        "Understanding brand requirements...",
        "Analyzing target audience...",
        "Selecting color palette...",
        "Designing layout composition...",
        "Creating typography hierarchy...",
        "Adding visual elements...",
        "Generating for different platforms...",
        "Generating multiple formats...",
        "Final quality check..."
      ]
    } else if (promptText.includes('mobile')) {
      return [
        "Researching mobile UX patterns...",
        "Creating user flow diagrams...",
        "Designing wireframe structure...",
        "Selecting color palette...",
        "Creating component library...",
        "Designing key app Screens...",
        "Ensuring accessibility compliance...",
        "Optimizing for different devices...",
        "Preparing developer handoff...",
        "Final quality check..."
      ]
    } else if (promptText.includes('logo')) {
      return [
        "Processing your request...",
        "Analyzing requirements...",
        "Selecting optimal approach...",
        "Designing solution architecture...",
        "Implementing core features...",
        "Adding security measures...",
        "Optimizing performance...",
        "Testing functionality...",
        "Finalizing deliverables..."
      ]
    } else if (promptText.includes('authentication')) {
      return [
        "Designing API architecture...",
        "Creating endpoint handlers...",
        "Implementing authentication flow...",
        "Setting up security measures...",
        "Planning database schema...",
        "Adding input validation...",
        "Writing comprehensive tests...",
        "Generating API documentation...",
        "Optimizing for performance...",
      ]
    } else if (promptText.includes('WebSocket')) {
      return [
        "Analyzing real-time communication requirements...",
        "Setting up WebSocket infrastructure...",
        "Designing message data structure...",
        "Implementing user authentication system...",
        "Creating chat room management...",
        "Adding file upload capabilities...",
        "Optimizing for real-time performance...",
        "Implementing security measures...",
        "Tuning scalability and reliability..."
      ]
    } else if (promptText.includes('microservices')) {
      return [
        "Analyzing e-commerce requirements...",
        "Selecting optimal tech stack...",
        "Designing database schema...",
        "Planning user authentication flow...",
        "Configuring payment integration...",
        "Optimizing for mobile responsiveness...",
        "Setting up SEO structure...",
        "Implementing security measures...",
        "Generating final code structure..."
      ]
    }
    else if (promptText.includes('fitness')) {
      return [
        "Analyzing fitness goals and requirements...",
        "Designing workout program structure...",
        "Creating nutrition plan framework...",
        "Setting up progress tracking system...",
        "Implementing exercise database...",
        "Adding recovery and rest protocols...",
        "Optimizing for different fitness levels...",
        "Creating motivational elements...",
        "Finalizing comprehensive fitness plan..."
      ]
    } else {
      return [
        "Analyzing requirements...",
        "Selecting optimal approach...",
        "Designing solution architecture...",
        "Implementing core features...",
        "Adding security measures...",
        "Optimizing performance...",
        "Testing functionality...",
        "Finalizing deliverables..."
      ];
    }
  };

  const samplePrompts = {
    webDev: [
      'Create a complete e-commerce website with product catalog and payment system',
      'Build a modern SaaS landing page with pricing and testimonials',
      'Design a portfolio website for a creative agency'
    ],
    design: [
      'Create a professional banner for Rentelligence AI tool platform',
      'Design a mobile app interface for fitness tracking',
      'Create a logo and brand identity for a tech startup'
    ],
    backend: [
      'Build a RESTful API for user management with authentication',
      'Create a real-time chat application with WebSocket',
      'Design a microservices architecture for e-commerce'
    ]
  };

  const generateResults = (promptText) => {
    let projectType = 'ecommerce';

    if (promptText.includes('portfolio')) {
      projectType = 'portfolio';
      return [
        {
          type: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Website - Creative Agency</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .preview-frame {
            width: 100%;
            height: 600px;
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            background: white;
        }
        .live-demo-btn {
            display: inline-block;
            margin: 20px 0;
            padding: 12px 24px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
        }
        .download-zip-btn {
            display: inline-flex;
            align-items: center;
            margin: 10px;
            padding: 12px 24px;
            background: #8b5cf6;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
        }
        .download-zip-btn:hover {
            background: #7c3aed;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <iframe 
            src="https://apis.rentelligence.online/RentelligencWebsite/portfolio" 
            class="preview-frame"
            title="Portfolio Website Demo"
        ></iframe>
    </div>
</body>
</html>`,
          imageUrl: "https://readdy.ai/api/search-image?query=modern%20web%20application%20interface%20clean%20design%20professional%20layout%20blue%20white%20color%20scheme%20responsive%20design%20user%20friendly%20dashboard&amp;width=800&amp;height=600&amp;seq=default1&amp;orientation=landscape",
          projectType: projectType
        }
      ];
    } else if (promptText.includes('SaaS')) {
      projectType = 'saas';
      return [
        {
          type: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS Landing Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .preview-frame {
            width: 100%;
            height: 600px;
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px6px rgba(0,0,0,0.1);
            background: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <iframe 
            src="https://apis.rentelligence.online/RentelligencWebsite/business" 
            class="preview-frame"
            title="SaaS Landing Page Demo"
        ></iframe>
    </div>
</body>
</html>`,
          imageUrl: "https://apis.rentelligence.online/RentelligencWebsite/business",
          projectType: projectType
        }
      ];
    } else if (promptText.includes('fitness') || promptText.includes('fitness')) {
      projectType = 'fitness';
      return [
        {
          type: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Commerce Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .preview-frame {
            width: 100%;
            height: 700px;
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            background: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <iframe 
            src="https://apis.rentelligence.online/rentelligencWebsite/fitnestracking" 
            class="preview-frame"
            title="Fitness Tracking Website"
        ></iframe>
    </div>
</body>
</html>`,
          imageUrl: "https://apis.rentelligence.online/rentelligencWebsite/fitnestracking",
          projectType: projectType
        }
      ];
    } else if (promptText.includes('banner') || promptText.includes('banner')) {
      projectType = 'banner';
      return [
        {
          type: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Commerce Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .preview-frame {
            width: 100%;
            height: 700px;
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            background: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <iframe 
            src="https://apis.rentelligence.online/rentelligencWebsite/banner" 
            class="preview-frame"
            title="Professional Banner Website"
        ></iframe>
    </div>
</body>
</html>`,
          imageUrl: "https://apis.rentelligence.online/rentelligencWebsite/banner",
          projectType: projectType
        }
      ];

    } else if (promptText.includes('WebSocket') || promptText.includes('WebSocket')) {
      projectType = 'WebSocket';
      return [
        {
          type: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Commerce Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .preview-frame {
            width: 100%;
            height: 700px;
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            background: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <iframe 
            src="https://apis.rentelligence.online/rentelligencWebsite/chatbot" 
            class="preview-frame"
            title="Professional Banner Website"
        ></iframe>
    </div>
</body>
</html>`,
          imageUrl: "https://apis.rentelligence.online/rentelligencWebsite/chatbot",
          projectType: projectType
        }
      ];
    } else if (promptText.includes('logo') || promptText.includes('logo')) {
      projectType = 'logo';
      return [
        {
          type: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logo Design Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .preview-frame {
            width: 100%;
            height: 700px;
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            background: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <iframe
            src="https://apis.rentelligence.online/rentelligencWebsite/logo"
            class="preview-frame"
            title="Logo Design Website"
        ></iframe>
    </div>
</body>
</html>`,
          imageUrl: "https://apis.rentelligence.online/rentelligencWebsite/logo",
          projectType: projectType
        }
      ];
    } else if (promptText.includes('management')) {
      projectType = 'management';
      return [
        {
          type: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Management Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .preview-frame {
            width: 100%;
            height: 700px;
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            background: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <iframe
            src="https://apis.rentelligence.online/rentelligencWebsite/APImanegment"
            class="preview-frame"
            title="Management Website"
        ></iframe>
    </div>
</body>
</html>`,
          imageUrl: "https://apis.rentelligence.online/rentelligencWebsite/APImanegment",
          projectType: projectType
        }
      ];

    } else if (promptText.includes('microservices')) {
      projectType = 'microservices';
      return [
        {
          type: 'html',
          content: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Microservices Architecture</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: #f5f5f5;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            .preview-frame {
                width: 100%;
                height: 700px;
                border: none;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                background: white;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <iframe
                src="https://apis.rentelligence.online/rentelligencWebsite/microservices"
                class="preview-frame"
                title="Microservices Architecture Demo"
            ></iframe>
        </div>
    </body>
    </html>`,
          imageUrl: "https://apis.rentelligence.online/rentelligencWebsite/microservices",
          projectType: projectType
        }
      ];
    } else if (promptText.includes('e-commerce') || promptText.includes('ecommerce')) {
      projectType = 'ecommerce';
      return [
        {
          type: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Commerce Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .preview-frame {
            width: 100%;
            height: 700px;
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            background: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <iframe 
            src="https://apis.rentelligence.online/RentelligencWebsite/ecommers" 
            class="preview-frame"
            title="E-Commerce Website Demo"
        ></iframe>
    </div>
</body>
</html>`,
          imageUrl: "https://apis.rentelligence.online/RentelligencWebsite/ecommers",
          projectType: projectType
        }
      ];
    }
  };

  // Live AI Demo Toggle Component
  const LiveDemoToggle = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center gap-3 px-6 py-3 border-2 shadow-lg bg-white/80 backdrop-blur-sm border-gray-200/60 rounded-2xl">
        <span className="text-sm font-semibold text-gray-700">LIVE AI MODE</span>

        <button
          onClick={handleLiveDemoToggle}
          className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${liveDemoEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${liveDemoEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
          />
        </button>

        <span className="text-sm font-medium text-gray-600">
          {liveDemoEnabled ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );

  // ✅ CHANGED: EnhancedToolCard - Now shows each agent separately with unique RechargeId
  const EnhancedToolCard = ({ tool, index }) => {
    const isLiveAgent = liveDemoEnabled && tool.rechargeId;
    const isLeaseAgent = tool.name === "Lease Agent";

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group"
      >
        <div
          className={`px-6 py-3 text-sm font-semibold transition-all duration-300 border-2 cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl ${isLiveAgent
              ? 'text-blue-700 border-blue-200/60 hover:border-blue-300/60 hover:shadow-lg hover:shadow-blue-500/10'
              : isLeaseAgent
                ? 'text-purple-700 border-purple-200/60 hover:border-purple-300/60 hover:shadow-lg hover:shadow-purple-500/10'
                : 'text-gray-700 border-gray-200/60 hover:border-blue-300/60 hover:shadow-lg hover:shadow-blue-500/10'
            }`}
          onClick={() => {
            if (isLeaseAgent) {
              router.push("/pages/browser-agents");
            } else if (liveDemoEnabled && isLiveAgent) {
              // Directly select the agent with its unique RechargeId
              handleAgentClick(tool);
            } else {
              // Demo mode functionality
              if (tool.name === "Code Crafter") {
                const eCommercePrompt = "Create a complete e-commerce website with product catalog and payment system";
                handlePromptClick(eCommercePrompt);
              } else if (tool.name === "DevSmith") {
                const apiPrompt = "Build a RESTful API for user management with authentication";
                handlePromptClick(apiPrompt);
              } else if (tool.name === "StackSurge") {
                const microservicesPrompt = "Design a microservices architecture for e-commerce";
                handlePromptClick(microservicesPrompt);
              } else if (tool.name === "DesignBot") {
                const bannerPrompt = "Design a mobile app interface for fitness tracking";
                handlePromptClick(bannerPrompt);
              }
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLiveAgent
                ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                : isLeaseAgent
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              } group-hover:animate-pulse`}></div>
            <span>{tool.name}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const EnhancedPromptCard = ({ text, category, cardId }) => {
    const gradientColors = {
      webDev: {
        bg: 'from-blue-500 to-cyan-500',
        border: 'border-blue-300/60 dark:border-white/60',
        text: 'text-blue-600',
        hoverText: 'from-blue-500 to-cyan-500'
      },
      design: {
        bg: 'from-purple-500 to-pink-500',
        border: 'border-purple-300/60 dark:border-white/60',
        text: 'text-purple-600',
        hoverText: 'from-purple-500 to-pink-500'
      },
      backend: {
        bg: 'from-green-500 to-emerald-500',
        border: 'border-green-300/60 dark:border-white/60',
        text: 'text-green-600',
        hoverText: 'from-green-500 to-emerald-500'
      }
    };

    const categoryIcons = {
      webDev: RiLightbulbLine,
      design: RiLightbulbLine,
      backend: RiLightbulbLine
    };

    const IconComponent = categoryIcons[category];
    const colors = gradientColors[category];

    return (
      <div
        className="relative group"
        onMouseEnter={() => setHoveredCard(cardId)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div
          className={`absolute -inset-4 bg-gradient-to-r ${colors.bg} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500 scale-95 group-hover:scale-100 z-0`}
        ></div>
        <div
          className={`absolute -inset-2 bg-gradient-to-r ${colors.bg} rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-300 scale-98 group-hover:scale-100 z-0`}
        ></div>

        <div
          className={`relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 ${colors.border} rounded-3xl p-6 hover:border-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden z-10 group-hover:scale-[1.02]`}
          onClick={() => {
            setPrompt(text);
            setSelectedPrompt(text);
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              if (textareaRef.current) {
                textareaRef.current.focus();
              }
            }, 100);
          }}
        >
          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br group-hover:opacity-10 rounded-3xl" style={{
            background: `linear-gradient(135deg, ${colors.bg.replace('from-', '').replace('to-', '').split(' ')[0]}, ${colors.bg.replace('from-', '').replace('to-', '').split(' ')[1]})`
          }}></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${colors.bg}`}>
                <IconComponent className="text-base text-white" />
              </div>
              <div className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <RiMoreLine className="text-xl text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            </div>

            <div className="min-h-[40px] mb-4">
              <p className="text-base leading-relaxed text-gray-700 transition-colors group-hover:text-gray-800 dark:text-gray-200 group-hover:dark:text-white">
                {text}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <span className={`${colors.text} text-sm font-semibold`}>
                  <RiPlayCircleLine className="inline mr-1" />
                  Try this prompt
                </span>
              </div>
              <RiArrowRightLine className="text-gray-400 transition-all group-hover:text-blue-500 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProcessingStep = ({ step, index, isCompleted, isProcessing }) => (
    <div className="flex items-center space-x-3 transition-all duration-700 transform translate-x-0 opacity-100 md:space-x-4">
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-700 shadow-lg ${isCompleted
        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/30'
        : isProcessing
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white animate-pulse shadow-blue-500/30'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300 shadow-gray-200/50 dark:shadow-gray-600/50'
        }`}>
        {isCompleted ? (
          <RiCheckLine className="text-base md:text-lg" />
        ) : isProcessing ? (
          <RiLoader4Line className="text-base animate-spin md:text-lg" />
        ) : (
          index + 1
        )}
      </div>
      <div className="flex-1">
        <span className={`text-xs md:text-sm font-medium transition-all duration-700 ${isCompleted || isProcessing
          ? 'text-gray-800 dark:text-white'
          : 'text-gray-400 dark:text-gray-400'
          }`}>
          {step}
        </span>
        {isProcessing && (
          <div className="w-full h-1 mt-2 bg-gray-200 rounded-full dark:bg-gray-700">
            <div className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" style={{ width: '60%' }}></div>
          </div>
        )}
      </div>
    </div>
  );

  const ResultMessage = ({ content, type, language, imageUrl, projectType, isCustom, mode }) => {
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const handleCopyCode = () => {
      navigator.clipboard.writeText(content);
      toast.success('Code copied to clipboard!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };

    if (isCustom) {
      return (
        <div className="flex justify-end mb-6">
          <div className="w-full">
            <div className="p-6 border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <RiRobotLine className="text-xl text-blue-600" />
                  <span className="font-semibold text-blue-700">AI Response</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${mode === 'live' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {mode === 'live' ? 'Live AI Mode' : 'Demo Mode'}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center px-3 py-1 text-blue-600 transition-all duration-200 bg-blue-100 rounded-lg hover:bg-blue-200"
                >
                  <RiFileCopyLine className="mr-1" />
                  Copy Text
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const handleDownloadHTML = () => {
      try {
        let downloadUrl, fileName, successMessage;

        switch (projectType) {
          case 'portfolio':
            downloadUrl = 'https://apis.rentelligence.online/RentelligencWebsite/portfolio';
            fileName = 'portfolio-website.html';
            successMessage = 'Preview Succesfully';
            break;
          case 'saas':
            downloadUrl = 'https://apis.rentelligence.online/RentelligencWebsite/business';
            fileName = 'saas-website.html';
            successMessage = 'Preview Succesfully';
            break;
          case 'fitness':
            downloadUrl = 'https://apis.rentelligence.online/rentelligencWebsite/fitnestracking';
            fileName = 'fitness-website.html';
            successMessage = 'Preview Succesfully';
            break;
          case 'banner':
            downloadUrl = 'https://apis.rentelligence.online/rentelligencWebsite/banner ';
            fileName = 'Professional Banner-website.html';
            successMessage = 'Preview Succesfully';
            break;
          case 'WebSocket':
            downloadUrl = 'https://apis.rentelligence.online/rentelligencWebsite/chatbot';
            fileName = 'chat-bot-website.html';
            successMessage = 'Preview Succesfully';
            break;
          case 'logo':
            downloadUrl = 'https://apis.rentelligence.online/rentelligencWebsite/logo';
            fileName = 'logo-website.html';
            successMessage = 'Preview Succesfully';
            break;
          case 'management':
            downloadUrl = 'https://apis.rentelligence.online/rentelligencWebsite/APImanegment';
            fileName = 'management.html';
            successMessage = 'Preview Succesfully';
            break;
          case 'microservices':
            downloadUrl = 'https://apis.rentelligence.online/rentelligencWebsite/microservices';
            fileName = 'microservices-architecture.html';
            successMessage = 'Preview Successfully';
            break;
          case 'ecommerce':
          default:
            downloadUrl = 'https://apis.rentelligence.online/RentelligencWebsite/ecommers';
            fileName = 'ecommerce-website.html';
            successMessage = 'Preview Succesfully';
            break;
        }

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        toast.success(successMessage, {
          position: "top-right",
          autoClose: 1000,
        });
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Download failed. Please try again.', {
          position: "top-right",
          autoClose: 1000,
        });
      }
    };

    const handleDownloadImage = () => {
      if (imageUrl) {
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = 'generated-design.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        toast.success('Image downloaded!', {
          position: "top-right",
          autoClose: 1000,
        });
      }
    };

    const getIsolatedHTML = (htmlContent) => {
      const cleanContent = htmlContent.replace(/class="jsx-[^"]*"/g, '');
      return `
        ${cleanContent}
      `;
    };

    return (
      <div className="flex justify-end mb-6">
        <div className="w-full">
          {type === 'code' ? (
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </pre>
          ) : type === 'html' ? (
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${mode === 'live' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {mode === 'live' ? 'Live AI Mode' : 'Demo Mode'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDownloadHTML}
                    className="flex items-center px-4 py-2 text-green-600 transition-all duration-200 bg-green-100 rounded-xl hover:bg-green-200 hover:text-green-700"
                  >
                    <RiEyeLine className="mr-2" />
                    Preview
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadProject(projectType)}
                      className="flex items-center px-4 py-2 text-white transition-all duration-200 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl hover:from-purple-600 hover:to-purple-700 hover:shadow-lg shadow-purple-500/25"
                    >
                      <RiFolderZipLine className="mr-2 text-lg" />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === 'preview' ? (
                <div className="overflow-hidden bg-white border-2 border-gray-200 rounded-2xl">
                  <div className="relative p-4 bg-gray-100 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-700">Live Preview</h4>
                  </div>

                  <div className="relative w-full overflow-hidden bg-gray-50">
                    <div className="flex justify-center w-full p-4">
                      <iframe
                        srcDoc={getIsolatedHTML(content)}
                        className="w-full bg-white border-0 rounded-lg shadow-sm"
                        style={{ height: '600px' }}
                        onLoad={() => setIframeLoaded(true)}
                        title="HTML Preview"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                      />
                    </div>

                    {!iframeLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100" style={{ height: '600px' }}>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <RiLoader4Line className="animate-spin" />
                          <span>Loading preview...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 overflow-x-auto bg-gray-900 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCopyCode}
                        className="flex items-center px-3 py-1 text-gray-300 transition-colors bg-gray-700 rounded-lg hover:bg-gray-600"
                      >
                        <RiFileCopyLine className="mr-1" />
                        Copy Code
                      </button>
                    </div>
                  </div>
                  <pre className="overflow-x-auto font-mono text-sm text-green-400 whitespace-pre-wrap">
                    {content}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${mode === 'live' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {mode === 'live' ? 'Live AI Mode' : 'Demo Mode'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center px-4 py-2 text-blue-600 transition-all duration-200 bg-blue-100 rounded-xl hover:bg-blue-200"
                  >
                    <RiFileCopyLine className="mr-2" />
                    Copy Content
                  </button>
                  {imageUrl && (
                    <button
                      onClick={handleDownloadImage}
                      className="flex items-center px-4 py-2 text-purple-600 transition-all duration-200 bg-purple-100 rounded-xl hover:bg-purple-200"
                    >
                      <RiImageLine className="mr-2" />
                      Download Image
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm leading-relaxed">{content}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SectionHeader = ({ icon: Icon, title, description, color }) => (
    <div className="flex items-center mb-6 md:mb-8">
      <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg mr-3 md:mr-4 ${color}`}>
        <Icon className="text-base text-white md:text-lg" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">{title}</h3>
        <p className="text-xs text-gray-500 md:text-sm">{description}</p>
      </div>
    </div>
  );

  // Filter results based on current mode
  const getFilteredResults = () => {
    return generatedResults.filter(result => result.mode === (liveDemoEnabled ? 'live' : 'demo'));
  };

  const filteredResults = getFilteredResults();

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {showPopup && (
        <div className="fixed inset-0 z-[9999] bg-opacity-50 flex items-start justify-center p-4 pt-20" onClick={() => setShowPopup(false)}>
          <div className="relative w-full max-w-md p-6 rounded-lg" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute z-10 text-white top-4 right-3"
              >
                <RiCloseLine className="text-2xl" />
              </button>
              <img
                src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/77480f32-8af6-4a8f-0a28-4fb8df0bbf00/public"
                alt="AI Popup"
                className="w-full h-auto"
              />
              <button
                onClick={() => setShowPopup(false)}
                className="absolute px-4 py-2 text-white bg-blue-500 rounded-lg bottom-3 right-4 hover:bg-blue-600"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute z-10 p-3 bg-red-600 rounded-full top-4 right-4 hover:bg-red-700"
          >
            <RiCloseLine className="text-2xl text-white" />
          </button>

          <img
            src={previewImage}
            alt="Preview"
            className="object-contain max-w-full max-h-full"
          />
        </div>
      )}

      {/* Hero Section */}
      <div className="relative px-4 pt-4 pb-2 mx-5 mt-6 text-center border-2 shadow-2xl bg-white/80 md:mt-10 backdrop-blur-sm rounded-3xl md:p-12 border-gray-200/60 shadow-blue-500/10 dark:bg-gray-900">
        <div className="flex justify-center mb-2">
          <div className="flex items-center space-x-2 md:space-x-4">
            {liveDemoEnabled ? (
              <div className="flex items-center justify-center w-10 h-10 shadow-lg md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl animate-pulse">
                <RiRobotLine className="text-lg text-white md:text-2xl" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center w-10 h-10 shadow-lg md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
                  <RiCodeSSlashLine className="text-lg text-white md:text-2xl" />
                </div>
                <div className="flex items-center justify-center w-10 h-10 shadow-lg md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                  <RiPaletteLine className="text-lg text-white md:text-2xl" />
                </div>
                <div className="flex items-center justify-center w-10 h-10 shadow-lg md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
                  <RiServerLine className="text-lg text-white md:text-2xl" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* HEADER TEXT DYNAMIC */}
        <h3 className="mb-2 text-2xl font-bold text-transparent md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
          {liveDemoEnabled ? 'Live AI Agents Mode Platform' : 'AI Tools Demo Platform'}
        </h3>
        <p className="max-w-2xl mx-auto mb-6 text-base text-gray-600 md:text-lg md:mb-8 dark:text-white">
          {liveDemoEnabled
            ? 'Access your Live AI agents with real-time capabilities. Experience powerful AI tools working directly with your data.'
            : 'Our AI tools can help you create websites, apps, designs, and more in minutes. Experience the future of development today.'
          }
        </p>

        {/* Live AI Demo Toggle */}
        <LiveDemoToggle />

        {/* Tools Section */}
        <div className="flex flex-wrap justify-center gap-4 ">
          {displayTools.map((tool, index) => (
            <EnhancedToolCard
              key={`${tool.rechargeId}-${index}`} 
              tool={tool}
              index={index}
            />
          ))}
        </div>

        <AgentCreditDetailsDisplay />
      </div>

      {/* Input Section */}
      <div className="sticky z-20 w-full top-20 bg-white/95 backdrop-blur-xl dark:bg-gray-900">
        <div className="w-full px-4 py-4 mx-auto max-w-7xl md:px-6 lg:px-8 md:py-6 lg:py-8">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 lg:gap-6">
            <div className="relative flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
              <textarea
                ref={textareaRef}
                placeholder={liveDemoEnabled
                  ? selectedAgent 
                    ? `Enter your command for ${selectedAgent.name}...` 
                    : "Please select an agent first to use search"
                  : "Enter your prompt here... (Only predefined prompts allowed in Demo Mode)"
                }
                rows="2"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setSelectedPrompt(e.target.value);
                }}
                className="relative w-full px-4 py-5 text-base transition-all duration-300 border-2 shadow-lg resize-none border-gray-200/60 dark:border-white/60 md:px-6 lg:px-8 md:py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 lg:text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                disabled={liveDemoEnabled && !selectedAgent}
              />
            </div>

            <button
              className="flex items-center justify-center w-full px-6 py-4 text-white transition-all duration-300 border-2 border-transparent shadow-lg cursor-pointer md:w-auto md:px-8 lg:px-10 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 hover:shadow-xl hover:scale-105 dark:border-white/60"
              disabled={!prompt || (liveDemoEnabled && !selectedAgent) || (liveDemoEnabled && selectedAgent && remainingCredits <= 0)}
              onClick={() => handlePromptClick(prompt, true)}
            >
              <RiSendPlaneLine className="text-lg lg:text-xl" />
            </button>
          </div>

          {/* Search Restrictions Info */}
          <div className="mt-3 text-center">
            {liveDemoEnabled && !selectedAgent ? (
              <p className="text-sm text-yellow-600">
                🔒 Please select an agent first to enable search functionality
              </p>
            ) : !liveDemoEnabled ? (
              <p className="text-sm text-blue-600">
               🔓 To unlock and use custom prompts, please lease an agent first
              </p>
            ) : null}
          </div>

          {/* Credit Warning Message */}
          {liveDemoEnabled && selectedAgent && remainingCredits <= 0 && (
            <div className="flex items-center justify-center p-3 mt-4 text-red-700 bg-red-100 rounded-lg">
              <RiAlertLine className="mr-2" />
              <span className="text-sm font-medium">No credits remaining. Please recharge to use this agent.</span>
            </div>
          )}

          {/* Low Credit Warning */}
          {liveDemoEnabled && selectedAgent && remainingCredits > 0 && remainingCredits <= 5 && (
            <div className="flex items-center justify-center p-3 mt-4 text-yellow-700 bg-yellow-100 rounded-lg">
              <RiAlertLine className="mr-2" />
              <span className="text-sm font-medium">Low credits: {remainingCredits} remaining</span>
            </div>
          )}
        </div>
      </div>

      {!liveDemoEnabled && (
        <div className="w-full px-4 mx-auto max-w-7xl md:px-6 lg:px-8">
          {/* Sample Prompts */}
          <div className="w-full mb-12 md:mb-16">
            {/* Web Development */}
            <div className="mt-2 mb-8 md:mb-12">
              <SectionHeader
                icon={RiCodeSSlashLine}
                title="Web Development"
                description="Professional solutions powered by AI"
                color="from-blue-500 to-cyan-500"
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {samplePrompts.webDev.map((text, index) => (
                  <EnhancedPromptCard
                    key={index}
                    text={text}
                    category="webDev"
                    cardId={`webdev-${index}`}
                  />
                ))}
              </div>
            </div>

            {/* Design & Graphics */}
            <div className="mb-8 md:mb-12">
              <SectionHeader
                icon={RiPaletteLine}
                title="Design & Graphics"
                description="Professional solutions powered by AI"
                color="from-purple-500 to-pink-500"
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {samplePrompts.design.map((text, index) => (
                  <EnhancedPromptCard
                    key={index}
                    text={text}
                    category="design"
                    cardId={`design-${index}`}
                  />
                ))}
              </div>
            </div>

            {/* Backend & APIs */}
            <div className="mb-8 md:mb-12">
              <SectionHeader
                icon={RiServerLine}
                title="Backend & APIs"
                description="Professional solutions powered by AI"
                color="from-green-500 to-emerald-500"
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {samplePrompts.backend.map((text, index) => (
                  <EnhancedPromptCard
                    key={index}
                    text={text}
                    category="backend"
                    cardId={`backend-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Panel */}
      <div id="ai-thinking-process" className="w-full">
        <div className="w-full px-4 pb-8 mx-auto max-w-7xl md:px-6 md:pb-12">
          <div className="grid gap-6 lg:grid-cols-2 md:gap-8">
            {/* AI Thinking Process */}
            <div className="overflow-hidden border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-blue-500/10 border-gray-200/60 dark:border-white/60 dark:bg-gray-800/80">
              <div className="p-4 border-b md:p-4 border-gray-200/60 dark:border-white/60 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
                <h2 className="flex items-center text-lg font-bold text-gray-900 md:text-xl dark:text-white">
                  <div className="flex items-center justify-center w-8 h-8 mr-3 shadow-lg md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl md:mr-4">
                    <RiBrainLine className="text-sm text-white md:text-base" />
                  </div>
                  AI Thinking Process
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </h2>
                <p className="text-xs text-gray-600 md:text-sm ml-11 md:ml-14 dark:text-gray-400">Watch how AI processes your request step by step</p>
              </div>
              <div className="p-4 md:p-8">
                <div className="space-y-4 md:space-y-6">
                  {(isProcessing || processingSteps?.length > 0) && !(!isProcessing && filteredResults?.length > 0) ? (
                    fullProcessingSteps.map((step, index) => (
                      <ProcessingStep
                        key={index}
                        step={step}
                        index={index}
                        isCompleted={index < processingSteps.length}
                        isProcessing={index === processingSteps.length && isProcessing}
                      />
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <RiLightbulbLine className="mx-auto mb-4 text-4xl text-blue-600" />
                      <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">Ready to Process</h3>
                      <p className="text-base text-gray-500 dark:text-gray-400">Select a prompt to see AI processing</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Generated Results */}
            <div className="overflow-hidden border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-green-500/10 border-gray-200/60 dark:border-white/60 dark:bg-gray-800/80">
              <div className="p-2 border-b md:p-4 border-gray-200/60 dark:border-white/60 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20">
                <h2 className="flex items-center text-lg font-bold text-gray-900 md:text-xl dark:text-white">
                  <div className="flex items-center justify-center w-8 h-8 mr-3 shadow-lg md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl md:mr-4">
                    <RiCodeSSlashLine className="text-sm text-white md:text-base" />
                  </div>
                  Generated Results
                  <div className="flex items-center ml-auto space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-green-600 md:text-sm dark:text-green-400">
                      {isProcessing ? 'Processing...' : filteredResults?.length > 0 ? 'Complete' : 'Ready'}
                    </span>
                  </div>
                </h2>
                <p className="mt-2 text-xs text-gray-600 md:text-sm ml-11 md:ml-14 dark:text-gray-400">
                  {liveDemoEnabled ? 'Live AI Mode Results' : 'Demo Mode Results'}
                </p>
              </div>
              <div className="p-4 md:p-8 max-h-[500px] md:max-h-[700px] overflow-y-auto">
                <div className="space-y-6 md:space-y-8">
                  {filteredResults?.length > 0 ? (
                    filteredResults.map((result, index) => (
                      <ResultMessage
                        key={index}
                        content={result.content}
                        type={result.type}
                        language={result.language}
                        imageUrl={result.imageUrl}
                        projectType={result.projectType}
                        isCustom={result.isCustom}
                        mode={result.mode}
                      />
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <RiCodeSSlashLine className="mx-auto mb-4 text-4xl text-green-600" />
                      <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                        {isProcessing ? 'Generating Results...' : 'Results Appear Here'}
                      </h3>
                      <p className="text-base text-gray-500 dark:text-gray-400">
                        {isProcessing 
                          ? 'AI is creating amazing solutions for you' 
                          : liveDemoEnabled 
                            ? 'Your Live AI Mode results will show here' 
                            : 'Your Demo Mode results will show here'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rentelligence;
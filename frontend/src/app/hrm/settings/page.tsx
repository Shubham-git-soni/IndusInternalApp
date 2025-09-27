'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Settings, Percent, IndianRupee, Calculator } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';

interface SalarySettings {
  basicSalaryPercentage: number;
  hraPercentage: number;
  pfDeductionPercentage: number;
  professionalTaxAmount: number;
  otherAllowancesPercentage: number;
  updatedAt: string;
  updatedBy: string;
}

export default function HRSettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState<SalarySettings>({
    basicSalaryPercentage: 40,
    hraPercentage: 50, // 50% of basic salary
    pfDeductionPercentage: 12,
    professionalTaxAmount: 2400,
    otherAllowancesPercentage: 0, // Will be calculated automatically
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin User'
  });

  const [previewCTC, setPreviewCTC] = useState<number>(1200000);

  useEffect(() => {
    // Load existing settings from localStorage or API
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('hrSalarySettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading HR settings:', error);
    }
  };

  const handleInputChange = (field: keyof SalarySettings, value: number | string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  const calculatePreview = (ctc: number) => {
    const basicSalary = Math.round(ctc * (settings.basicSalaryPercentage / 100));
    const hra = Math.round(basicSalary * (settings.hraPercentage / 100));
    const pfDeduction = Math.round(basicSalary * (settings.pfDeductionPercentage / 100));
    const professionalTax = settings.professionalTaxAmount;
    const otherAllowances = Math.max(0, ctc - basicSalary - hra - pfDeduction - professionalTax);

    return {
      basicSalary,
      hra,
      pfDeduction,
      professionalTax,
      otherAllowances,
      totalCalculated: basicSalary + hra + pfDeduction + professionalTax + otherAllowances
    };
  };

  const previewCalculation = calculatePreview(previewCTC);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (in real app, this would be API call)
      localStorage.setItem('hrSalarySettings', JSON.stringify(settings));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('HR Settings saved successfully!');
    } catch (error) {
      console.error('Error saving HR settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset to default settings?')) {
      setSettings({
        basicSalaryPercentage: 40,
        hraPercentage: 50,
        pfDeductionPercentage: 12,
        professionalTaxAmount: 2400,
        otherAllowancesPercentage: 0,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Admin User'
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="pt-16 pb-24 lg:pb-4 px-3 sm:px-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="pt-2 sm:pt-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => router.back()}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">HR Settings</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Configure salary calculation parameters</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Form */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Salary Calculation Settings</h2>
                  <p className="text-sm text-gray-600">Configure default percentages and amounts</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Basic Salary Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Salary (% of CTC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.basicSalaryPercentage}
                      onChange={(e) => handleInputChange('basicSalaryPercentage', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Typically 40-50% of total CTC</p>
                </div>

                {/* HRA Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HRA (% of Basic Salary)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.hraPercentage}
                      onChange={(e) => handleInputChange('hraPercentage', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Usually 40-50% of basic salary</p>
                </div>

                {/* PF Deduction Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PF Deduction (% of Basic Salary)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.pfDeductionPercentage}
                      onChange={(e) => handleInputChange('pfDeductionPercentage', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Standard rate is 12% as per PF rules</p>
                </div>

                {/* Professional Tax Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Tax (Annual Amount)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={settings.professionalTaxAmount}
                      onChange={(e) => handleInputChange('professionalTaxAmount', parseInt(e.target.value))}
                      className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Fixed annual amount (e.g., ₹2,400)</p>
                </div>

                {/* Last Updated Info */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <p>Last updated: {new Date(settings.updatedAt).toLocaleString()}</p>
                    <p>Updated by: {settings.updatedBy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Calculation */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Preview Calculation</h2>
                  <p className="text-sm text-gray-600">See how settings affect salary breakdown</p>
                </div>
              </div>

              {/* Preview CTC Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview with Annual CTC
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={previewCTC}
                    onChange={(e) => setPreviewCTC(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Basic Salary ({settings.basicSalaryPercentage}%)</span>
                  <span className="font-medium">₹{previewCalculation.basicSalary.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">HRA ({settings.hraPercentage}% of Basic)</span>
                  <span className="font-medium">₹{previewCalculation.hra.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-red-600">PF Deduction ({settings.pfDeductionPercentage}% of Basic)</span>
                  <span className="font-medium text-red-600">-₹{previewCalculation.pfDeduction.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-red-600">Professional Tax</span>
                  <span className="font-medium text-red-600">-₹{previewCalculation.professionalTax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Other Allowances</span>
                  <span className="font-medium">₹{previewCalculation.otherAllowances.toLocaleString()}</span>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-900">Total Annual CTC</span>
                    <span className="font-bold text-blue-900">₹{previewCTC.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-blue-700">Monthly Gross</span>
                    <span className="font-semibold text-blue-700">₹{Math.round(previewCTC / 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-green-700">Monthly Net (after deductions)</span>
                    <span className="font-semibold text-green-700">
                      ₹{Math.round((previewCTC - previewCalculation.pfDeduction - previewCalculation.professionalTax) / 12).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <button
            type="button"
            onClick={resetToDefaults}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset to Defaults
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
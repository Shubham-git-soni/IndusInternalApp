'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, MapPin, Building2, Camera, CreditCard, Users, IndianRupee, Upload, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { calculateSalaryComponents as calculateFromHRSettings, getHRSettings, SalarySettings } from '@/utils/hrSettings';
import { apiClient, type Department, type Designation, type Manager, type Role, type CreateEmployeeRequest, type CreateFamilyMemberRequest } from '@/services/api';

export default function AddTeamMemberPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [hrSettings, setHrSettings] = useState<SalarySettings | null>(null);

  // Backend data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Define types for form data
  interface FamilyMember {
    id: number;
    fullName: string;
    relationship: string;
    dateOfBirth: string;
    gender: string;
    isNominee: boolean;
    isDependent: boolean;
  }

  interface BankDocument {
    file: File;
    name: string;
    size: number;
    type: string;
  }

  // Form data based on your User schema
  const [formData, setFormData] = useState({
    // Basic Information (Users table)
    fullName: '',
    email: '',
    personalEmail: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    weddingDate: '',

    // Address Information
    currentAddress: '',
    permanentAddress: '',

    // Job Information (TeamMemberDetails table)
    departmentId: '',
    designationId: '',
    managerId: '',
    joiningDate: '',
    confirmationDate: '',
    employeeType: '',
    workLocation: '',

    // Government Documents
    uanNumber: '',
    panCardNumber: '',
    aadharCardNumber: '',

    // System Information
    roleId: '',
    isLoginEnabled: true,
    status: 'Active',

    // Bank Details
    bankName: '',
    accountNumber: '',
    ifscCode: '',

    // Document uploads (moved from Documents section)
    aadharCardUpload: [] as BankDocument[],
    panCardUpload: [] as BankDocument[],
    bankPassbookUpload: [] as BankDocument[],

    // Family Details (conditional - only for married)
    familyMembers: [] as FamilyMember[],

    // Salary Information
    annualCTC: '',
    basicSalary: '',
    hra: '',
    pfDeduction: '',
    professionalTax: '',
    otherAllowances: '',

    // Project Cost Information (for project management module)
    costType: 'hour', // 'hour' or 'day'
    costRate: ''
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [depts, desigs, mgrs, rolesList] = await Promise.all([
          apiClient.getDepartments(),
          apiClient.getDesignations(),
          apiClient.getManagers(),
          apiClient.getRoles()
        ]);

        setDepartments(depts);
        setDesignations(desigs);
        setManagers(mgrs);
        setRoles(rolesList);
        setHrSettings(getHRSettings());
      } catch (error) {
        console.error('Failed to load reference data:', error);
        // No fallback - show empty arrays
        setDepartments([]);
        setDesignations([]);
        setManagers([]);
        setRoles([]);
        setHrSettings(getHRSettings());
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

  // Use HR Settings for salary calculations
  const calculateSalaryComponents = (annualCTC: number) => {
    return calculateFromHRSettings(annualCTC);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    };

    // Auto-calculate salary components when annual CTC changes
    if (name === 'annualCTC' && value && !isNaN(Number(value))) {
      const calculatedComponents = calculateSalaryComponents(Number(value));
      newFormData = { ...newFormData, ...calculatedComponents };
    }

    setFormData(newFormData);
  };

  const handleFileUpload = (files: FileList | null, fieldName: 'aadharCardUpload' | 'panCardUpload' | 'bankPassbookUpload') => {
    if (files) {
      const fileArray: BankDocument[] = Array.from(files).map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type
      }));

      setFormData(prev => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...fileArray]
      }));
    }
  };

  const removeFile = (fieldName: 'aadharCardUpload' | 'panCardUpload' | 'bankPassbookUpload', index: number) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now(),
      fullName: '',
      relationship: '',
      dateOfBirth: '',
      gender: '',
      isNominee: false,
      isDependent: false
    };

    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember]
    }));
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const removeFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert form data to API format
      const employeeData: CreateEmployeeRequest = {
        // Basic Information
        fullName: formData.fullName,
        email: formData.email,
        password: formData.email, // Using email as default password
        phoneNumber: formData.phoneNumber || undefined,
        personalEmail: formData.personalEmail || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        bloodGroup: formData.bloodGroup || undefined,
        maritalStatus: formData.maritalStatus || undefined,
        weddingDate: formData.weddingDate || undefined,

        // Address Information
        currentAddress: formData.currentAddress || undefined,
        permanentAddress: formData.permanentAddress || undefined,

        // Job Information
        departmentId: parseInt(formData.departmentId),
        designationId: parseInt(formData.designationId),
        joiningDate: formData.joiningDate,
        confirmationDate: formData.confirmationDate || undefined,
        employeeType: formData.employeeType || undefined,
        workLocation: formData.workLocation || undefined,
        reportingManagerId: formData.managerId ? parseInt(formData.managerId) : undefined,

        // Government Documents
        uanNumber: formData.uanNumber || undefined,
        panCardNumber: formData.panCardNumber || undefined,
        aadharCardNumber: formData.aadharCardNumber || undefined,

        // System Information
        roleId: formData.roleId ? parseInt(formData.roleId) : undefined,
        isLoginEnabled: formData.isLoginEnabled,
        status: formData.status,

        // Bank Details
        bankName: formData.bankName || undefined,
        accountNumber: formData.accountNumber || undefined,
        ifscCode: formData.ifscCode || undefined,

        // Salary Information
        annualCTC: formData.annualCTC ? parseFloat(formData.annualCTC) : undefined,
        basicSalary: formData.basicSalary ? parseFloat(formData.basicSalary) : undefined,
        hra: formData.hra ? parseFloat(formData.hra) : undefined,
        pfDeduction: formData.pfDeduction ? parseFloat(formData.pfDeduction) : undefined,
        professionalTax: formData.professionalTax ? parseFloat(formData.professionalTax) : undefined,
        otherAllowances: formData.otherAllowances ? parseFloat(formData.otherAllowances) : undefined,
        costRate: formData.costRate ? parseFloat(formData.costRate) : undefined,
        costType: formData.costType,

        // Family Members
        familyMembers: formData.familyMembers.map(fm => ({
          fullName: fm.fullName,
          relationship: fm.relationship,
          dateOfBirth: fm.dateOfBirth,
          gender: fm.gender,
          isNominee: fm.isNominee,
          isDependent: fm.isDependent
        }))
      };

      console.log('Submitting employee data:', employeeData);

      // Call the backend API
      const createdEmployee = await apiClient.createEmployee(employeeData);

      console.log('Employee created successfully:', createdEmployee);

      // Redirect to employee list after successful creation
      router.push('/hrm/employees');
    } catch (error: any) {
      console.error('Error creating employee:', error);
      alert(`Failed to create employee: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', name: 'Basic Information', shortName: 'Basic Info', icon: User },
    { id: 'contact', name: 'Contact & Address', shortName: 'Contact', icon: MapPin },
    { id: 'job', name: 'Job Information', shortName: 'Job Info', icon: Building2 },
    { id: 'bank', name: 'Bank & Documents', shortName: 'Bank & Docs', icon: CreditCard },
    ...(formData.maritalStatus === 'Married' ? [{ id: 'family' as const, name: 'Family Details', shortName: 'Family', icon: Users }] : []),
    { id: 'salary', name: 'Salary Information', shortName: 'Salary', icon: IndianRupee }
  ];

  return (
    <DashboardLayout>
      {/* Custom CSS for scrollbar hiding */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="pt-16 pb-20 lg:pb-4 px-3 sm:px-4 space-y-4 sm:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="pt-2 sm:pt-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => router.back()}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Add New Team Member</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Create a new employee profile</p>
            </div>
          </div>
        </div>

        {dataLoading ? (
          // Loading state
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : departments.length === 0 ? (
          // No reference data available
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <Building2 className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Setup Required</h3>
              <p className="mt-2 text-sm text-gray-500">
                Please set up departments, designations, and roles before adding employees.
              </p>
              <div className="mt-6">
                <Link
                  href="/hrm/settings"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Go to Settings
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Tab Navigation - Mobile Optimized with Horizontal Scroll */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 relative">
              {/* Left fade indicator for mobile */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none sm:hidden"></div>
              {/* Right fade indicator for mobile */}
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none sm:hidden"></div>

              <nav
                className="flex px-4 sm:px-6 overflow-x-auto hide-scrollbar"
                aria-label="Tabs"
                style={{
                  WebkitOverflowScrolling: 'touch', /* iOS smooth scrolling */
                }}
              >
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 mr-2 sm:mr-6 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0`}
                    >
                      <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        <span className="sm:hidden">{tab.shortName}</span>
                        <span className="hidden sm:inline">{tab.name}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 sm:p-6">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Smith"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="john.smith@company.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Personal Email
                      </label>
                      <input
                        type="email"
                        name="personalEmail"
                        value={formData.personalEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="john.smith@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1-234-567-8901"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marital Status *
                      </label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    {formData.maritalStatus === 'Married' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Wedding Date
                        </label>
                        <input
                          type="date"
                          name="weddingDate"
                          value={formData.weddingDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact & Address Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Address *
                    </label>
                    <textarea
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter current address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permanent Address
                    </label>
                    <textarea
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter permanent address (if different)"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sameAsCurrentAddress"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, permanentAddress: prev.currentAddress }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="sameAsCurrentAddress" className="text-sm text-gray-700">
                      Same as current address
                    </label>
                  </div>
                </div>
              )}

              {/* Job Information Tab */}
              {activeTab === 'job' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>
                      <select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation *
                      </label>
                      <select
                        name="designationId"
                        value={formData.designationId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Designation</option>
                        {designations.map(des => (
                          <option key={des.id} value={des.id}>{des.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reporting Manager
                      </label>
                      <select
                        name="managerId"
                        value={formData.managerId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Manager</option>
                        {managers.map(manager => (
                          <option key={manager.id} value={manager.id}>{manager.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role *
                      </label>
                      <select
                        name="roleId"
                        value={formData.roleId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Joining Date *
                      </label>
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmation Date
                      </label>
                      <input
                        type="date"
                        name="confirmationDate"
                        value={formData.confirmationDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Member Type *
                      </label>
                      <select
                        name="employeeType"
                        value={formData.employeeType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                        <option value="Consultant">Consultant</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Location
                      </label>
                      <input
                        type="text"
                        name="workLocation"
                        value={formData.workLocation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., New York Office, Remote"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isLoginEnabled"
                      checked={formData.isLoginEnabled}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700">
                      Enable login access for this employee
                    </label>
                  </div>
                </div>
              )}

              {/* Bank & Documents Tab */}
              {activeTab === 'bank' && (
                <div className="space-y-8">
                  {/* Bank Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., State Bank of India"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number *
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter account number"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IFSC Code *
                        </label>
                        <input
                          type="text"
                          name="ifscCode"
                          value={formData.ifscCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., SBIN0001234"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Government Documents Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Government Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          UAN Number
                        </label>
                        <input
                          type="text"
                          name="uanNumber"
                          value={formData.uanNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Universal Account Number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PAN Card Number
                        </label>
                        <input
                          type="text"
                          name="panCardNumber"
                          value={formData.panCardNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="ABCDE1234F"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aadhar Card Number
                        </label>
                        <input
                          type="text"
                          name="aadharCardNumber"
                          value={formData.aadharCardNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="1234 5678 9012"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Uploads Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Uploads</h3>
                    <div className="space-y-6">
                      {/* Aadhar Card Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aadhar Card
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="mt-2">
                            <label htmlFor="aadharCardUpload" className="cursor-pointer">
                              <span className="text-sm font-medium text-gray-900">
                                Upload Aadhar Card
                              </span>
                              <span className="block text-xs text-gray-500 mt-1">
                                PNG, JPG, PDF up to 10MB
                              </span>
                            </label>
                            <input
                              id="aadharCardUpload"
                              name="aadharCardUpload"
                              type="file"
                              multiple
                              accept=".png,.jpg,.jpeg,.pdf"
                              className="sr-only"
                              onChange={(e) => handleFileUpload(e.target.files, 'aadharCardUpload')}
                            />
                          </div>
                        </div>

                        {formData.aadharCardUpload.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {formData.aadharCardUpload.map((doc, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Upload className="w-4 h-4 text-orange-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile('aadharCardUpload', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* PAN Card Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PAN Card
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="mt-2">
                            <label htmlFor="panCardUpload" className="cursor-pointer">
                              <span className="text-sm font-medium text-gray-900">
                                Upload PAN Card
                              </span>
                              <span className="block text-xs text-gray-500 mt-1">
                                PNG, JPG, PDF up to 10MB
                              </span>
                            </label>
                            <input
                              id="panCardUpload"
                              name="panCardUpload"
                              type="file"
                              multiple
                              accept=".png,.jpg,.jpeg,.pdf"
                              className="sr-only"
                              onChange={(e) => handleFileUpload(e.target.files, 'panCardUpload')}
                            />
                          </div>
                        </div>

                        {formData.panCardUpload.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {formData.panCardUpload.map((doc, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Upload className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile('panCardUpload', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bank Passbook Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Passbook/Statement
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="mt-2">
                            <label htmlFor="bankPassbookUpload" className="cursor-pointer">
                              <span className="text-sm font-medium text-gray-900">
                                Upload Bank Passbook/Statement
                              </span>
                              <span className="block text-xs text-gray-500 mt-1">
                                PNG, JPG, PDF up to 10MB
                              </span>
                            </label>
                            <input
                              id="bankPassbookUpload"
                              name="bankPassbookUpload"
                              type="file"
                              multiple
                              accept=".png,.jpg,.jpeg,.pdf"
                              className="sr-only"
                              onChange={(e) => handleFileUpload(e.target.files, 'bankPassbookUpload')}
                            />
                          </div>
                        </div>

                        {formData.bankPassbookUpload.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {formData.bankPassbookUpload.map((doc, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Upload className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile('bankPassbookUpload', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Family Details Tab - Only for Married */}
              {activeTab === 'family' && formData.maritalStatus === 'Married' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
                      <p className="text-sm text-gray-500">Add spouse and children details for dependency and nomination</p>
                    </div>
                    <button
                      type="button"
                      onClick={addFamilyMember}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Users className="w-4 h-4" />
                      <span>Add Family Member</span>
                    </button>
                  </div>

                  {formData.familyMembers.length > 0 ? (
                    <div className="space-y-4">
                      {formData.familyMembers.map((member, index: number) => (
                        <div key={member.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">Family Member {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeFamilyMember(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                value={member.fullName}
                                onChange={(e) => updateFamilyMember(index, 'fullName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter full name"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Relationship *
                              </label>
                              <select
                                value={member.relationship}
                                onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              >
                                <option value="">Select Relationship</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Child">Child</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth *
                              </label>
                              <input
                                type="date"
                                value={member.dateOfBirth}
                                onChange={(e) => updateFamilyMember(index, 'dateOfBirth', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender *
                              </label>
                              <select
                                value={member.gender}
                                onChange={(e) => updateFamilyMember(index, 'gender', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={member.isNominee}
                                onChange={(e) => updateFamilyMember(index, 'isNominee', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">Nominee</span>
                            </label>

                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={member.isDependent}
                                onChange={(e) => updateFamilyMember(index, 'isDependent', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">Dependent</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No family members added</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Click &quot;Add Family Member&quot; to add spouse and children details
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Salary Information Tab */}
              {activeTab === 'salary' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Structure</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Annual CTC *
                        </label>
                        <input
                          type="number"
                          name="annualCTC"
                          value={formData.annualCTC}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter annual CTC amount"
                          required
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            Components calculated using current HR Settings
                          </p>
                          <Link
                            href="/hrm/settings"
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Modify HR Settings
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.annualCTC && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Salary Breakdown (Auto-calculated)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Basic Salary ({hrSettings?.basicSalaryPercentage || 40}% of CTC)
                          </label>
                          <input
                            type="number"
                            name="basicSalary"
                            value={formData.basicSalary}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            HRA ({hrSettings?.hraPercentage || 50}% of Basic)
                          </label>
                          <input
                            type="number"
                            name="hra"
                            value={formData.hra}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            PF Deduction ({hrSettings?.pfDeductionPercentage || 12}% of Basic)
                          </label>
                          <input
                            type="number"
                            name="pfDeduction"
                            value={formData.pfDeduction}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Professional Tax (₹{hrSettings?.professionalTaxAmount?.toLocaleString() || '2,400'} Annual)
                          </label>
                          <input
                            type="number"
                            name="professionalTax"
                            value={formData.professionalTax}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Other Allowances (Remaining Amount)
                          </label>
                          <input
                            type="number"
                            name="otherAllowances"
                            value={formData.otherAllowances}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                          />
                        </div>
                      </div>

                      {/* Project Cost Information */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Project Cost Information</h4>

                        <div className="space-y-4">
                          {/* Cost Type Toggle */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Cost Calculation Type
                            </label>
                            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, costType: 'hour', costRate: ''})}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                  formData.costType === 'hour'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                              >
                                Per Hour
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, costType: 'day', costRate: ''})}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                  formData.costType === 'day'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                              >
                                Per Day
                              </button>
                            </div>
                          </div>

                          {/* Cost Rate Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Cost {formData.costType === 'hour' ? 'per Hour' : 'per Day'} (₹)
                            </label>
                            <input
                              type="number"
                              name="costRate"
                              value={formData.costRate}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Enter ${formData.costType === 'hour' ? 'hourly' : 'daily'} cost`}
                              min="0"
                              step="0.01"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {formData.costType === 'hour'
                                ? 'Hourly rate for project cost calculation'
                                : 'Daily rate for project cost calculation (8-hour workday)'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">
                            💡 <strong>Note:</strong> This rate will be used in the Project Management module for resource cost estimation and project budgeting.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-900">Total Annual CTC:</span>
                          <span className="text-lg font-bold text-blue-900">₹{Number(formData.annualCTC).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-blue-900">Monthly Gross Salary:</span>
                          <span className="text-md font-semibold text-blue-900">₹{Math.round(Number(formData.annualCTC) / 12).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions - Single Row Layout */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
              >
                Cancel
              </button>

              <button
                type="button"
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium text-center"
              >
                Save as Draft
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">{isLoading ? 'Creating...' : 'Create Team Member'}</span>
              </button>
            </div>
          </div>
        </form>
        )}
      </div>
    </DashboardLayout>
  );
}